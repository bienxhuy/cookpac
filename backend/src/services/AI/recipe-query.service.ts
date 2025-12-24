import { ChatGroq } from "@langchain/groq";
import { EmbeddingService } from "./embedding.service";
import { RecipeService } from "../recipe.service";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recipeId?: number;
}

interface QueryResult {
  answer: string;
  recipeId?: number;
  isNewRecipe: boolean;
}

export class RecipeQueryService {
  private llm: ChatGroq;

  constructor(
    private embeddingService: EmbeddingService,
    private recipeService: RecipeService
  ) {
    this.llm = new ChatGroq({
      model: "llama-3.1-8b-instant", 
      apiKey: process.env.GROQ_API_KEY!,
      temperature: 0.7,
    });
  }

  async query(
    userPrompt: string, 
    chatHistory: ChatMessage[] = []
  ): Promise<QueryResult> {
    
    // Bước 1: Phân tích ý định với context từ lịch sử chat
    const historyContext = this.buildHistoryContext(chatHistory);
    
    // === PROMPT INTENT ĐÃ TỐI ƯU ===
    const intentPrompt = `Bạn là trợ lý phân tích ý định người dùng trong app công thức nấu ăn CookPac.

Lịch sử gần nhất:
${historyContext}

Yêu cầu mới: "${userPrompt}"

Trả về đúng JSON (không thêm giải thích):
{
  "intent": "search" | "create",
  "searchParams": {
    "keyword": "tên món hoặc từ khóa chính",
    "ingredients": ["nguyên liệu 1", "nguyên liệu 2"],
    "area": "vùng miền nếu có"
  },
  "contextNotes": "ghi chú ngắn nếu cần (ví dụ: người dùng muốn món khác với trước)"
}

Quy tắc:
- intent = "search" nếu người dùng hỏi cách nấu, tìm món, hướng dẫn, có công thức nào...
- intent = "create" nếu có từ: tạo, sáng tạo, mới, biến tấu, độc đáo, món khác, khác đi, fusion...`;

    const intentResponse = await this.llm.invoke(intentPrompt);
    let intentData = { 
      intent: "search" as "search" | "create", 
      searchParams: { keyword: "", ingredients: [], area: "" },
      contextNotes: ""
    };
    
    try {
      const cleanedJson = (intentResponse.content as string)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      intentData = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Intent parsing error, defaulting to search");
    }

    console.log("Intent Analysis:", intentData);

    // Bước 2: Tìm kiếm trong database
    let dbRecipes: any[] = [];
    
    if (intentData.intent === "search" || intentData.searchParams.keyword) {
      const result = await this.searchRecipesWithParams(intentData.searchParams);
      
      const suggestedRecipeIds = this.getRecentlySuggestedRecipeIds(chatHistory);
      dbRecipes = result.filter(r => !suggestedRecipeIds.includes(r.id));
      
      console.log(`Found ${result.length} recipes, filtered to ${dbRecipes.length} (removed recently suggested)`);
    }

    // Bước 3: RAG knowledge
    const ragDocs = await this.embeddingService.searchSimilar(userPrompt, 3);
    const ragContext = ragDocs.map(d => d.pageContent).join("\n\n");

    const hasDbRecipes = dbRecipes.length > 0;
    let isNewRecipe = false;

    // Bước 4: Tạo prompt dựa trên intent
    let finalPrompt = "";

    if (intentData.intent === "search" && hasDbRecipes) {
      // === PROMPT CHO CÔNG THỨC CÓ SẴN (TỐI ƯU) ===
      isNewRecipe = false;
      
      const dbContext = dbRecipes
        .slice(0, 3) // chỉ lấy top 3 để prompt ngắn
        .map(r => `- ID: ${r.id} | Tên: ${r.name} | Nguyên liệu chính: ${r.ingredients.slice(0, 6).join(", ")}`)
        .join("\n");

      finalPrompt = `Bạn là trợ lý nấu ăn thân thiện của CookPac.

Yêu cầu: ${userPrompt}
${intentData.contextNotes ? `Ngữ cảnh: ${intentData.contextNotes}` : ''}

Công thức phù hợp từ cộng đồng (ưu tiên dùng chính xác tên món):
${dbContext}

Kiến thức bổ sung:
${ragContext}

Hướng dẫn trả lời:
- Giới thiệu món phù hợp nhất từ CookPac (nhắc đúng tên món để hiển thị card)
- Giải thích ngắn tại sao món này hợp
- Liệt kê 4-5 nguyên liệu chính
- Tóm tắt 3 bước quan trọng
- Đưa 1-2 mẹo hay
Trả lời tiếng Việt, nhiệt tình, ngắn gọn hấp dẫn.`;

    } else {
      // === PROMPT CHO CÔNG THỨC MỚI (TỐI ƯU) ===
      isNewRecipe = true;
      
      const recentRecipes = this.getRecentlySuggestedRecipes(chatHistory);
      const avoidText = recentRecipes.length > 0 
        ? `TRÁNH HOÀN TOÀN các món đã gợi ý: ${recentRecipes.join(", ")}` 
        : "";

      finalPrompt = `Bạn là đầu bếp sáng tạo của CookPac.

Yêu cầu: ${userPrompt}
${intentData.contextNotes ? `Ngữ cảnh: ${intentData.contextNotes}` : ''}
${avoidText}

Tham khảo (không copy trực tiếp):
${ragContext}
${hasDbRecipes ? `Có món tương tự trong cộng đồng: ${dbRecipes.map(r => r.name).join(", ")}` : ""}

Tạo công thức MỚI và ĐỘC ĐÁO:
1. Tên món thật hấp dẫn, mới lạ
2. Nguyên liệu đầy đủ + số lượng cụ thể (VD: 300g gà, 2 quả trứng...)
3. Các bước thực hiện chi tiết, đánh số rõ ràng
4. Nêu điểm đặc biệt của món
5. 1-2 mẹo để món ngon hơn

Trả lời tiếng Việt, chi tiết, cuốn hút và dễ làm theo.`;
    }

    console.log("\n=== QUERY STRATEGY ===");
    console.log("Intent:", intentData.intent);
    console.log("Has DB Recipes:", hasDbRecipes);
    console.log("Is New Recipe:", isNewRecipe);
    
    // Bước 5: Gọi LLM với chat history
    const messages: BaseMessage[] = [
      ...this.convertHistoryToMessages(chatHistory),
      new HumanMessage(finalPrompt)
    ];

    const answer = await this.llm.invoke(messages);
    const answerText = answer.content as string;

    // Bước 6: Match recipe nếu không phải công thức mới
    let recipeId: number | undefined;
    
    if (!isNewRecipe && hasDbRecipes) {
      const matchedRecipe = dbRecipes.find(r =>
        answerText.toLowerCase().includes(r.name.toLowerCase())
      );
      recipeId = matchedRecipe?.id;
      console.log("Matched Recipe ID:", recipeId);
    }

    return {
      answer: answerText,
      recipeId,
      isNewRecipe, 
    };
  }

  // === Các helper giữ nguyên hoàn toàn ===
  private buildHistoryContext(chatHistory: ChatMessage[]): string {
    if (chatHistory.length === 0) return "Đây là đầu cuộc hội thoại.";
    
    const recent = chatHistory.slice(-4);
    return recent
      .map(msg => {
        const prefix = msg.role === 'user' ? 'NGƯỜI DÙNG' : 'BẠN ĐÃ TRẢ LỜI';
        const recipeNote = msg.recipeId ? ` [Đã gợi ý món ID: ${msg.recipeId}]` : '';
        return `${prefix}: ${msg.content}${recipeNote}`;
      })
      .join("\n");
  }

  private getRecentlySuggestedRecipeIds(chatHistory: ChatMessage[]): number[] {
    return chatHistory
      .filter(msg => msg.role === 'assistant' && msg.recipeId)
      .map(msg => msg.recipeId!)
      .slice(-3);
  }

  private getRecentlySuggestedRecipes(chatHistory: ChatMessage[]): string[] {
    const recipeNames: string[] = [];
    
    chatHistory
      .filter(msg => msg.role === 'assistant')
      .slice(-2)
      .forEach(msg => {
        const match = msg.content.match(/\*\*([^*]+)\*\*/);
        if (match) recipeNames.push(match[1]);
      });
    
    return recipeNames;
  }

  private convertHistoryToMessages(chatHistory: ChatMessage[]): BaseMessage[] {
    return chatHistory.slice(-6).map(msg =>
      msg.role === 'user' 
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );
  }

  private async searchRecipesWithParams(params: {
    keyword?: string;
    ingredients?: string[];
    area?: string;
  }) {
    const result = await this.recipeService.searchRecipesByText({
      keyword: params.keyword,
      ingredientNames: params.ingredients,
      areaName: params.area,
      page: 1,
      pageSize: 5
    });
    
    console.log(`Found ${result.total} recipes from DB`);
    
    return result.recipes.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || "",
      ingredients: r.recipeIngredients
        ?.sort((a, b) => a.order - b.order)
        .map(ri => `${ri.ingredient.name} ${ri.quantity || ""}${ri.unit || ""}`.trim()) || []
    }));
  }
}