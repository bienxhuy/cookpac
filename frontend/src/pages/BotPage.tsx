import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, ChefHat, PlusCircle } from 'lucide-react';
import FoodCard2 from '../components/FoodCard2';
import { naturalQuery } from '../services/query.service'; 
import { getRecipeById } from '../services/recipe.service';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content?: string;
  recipeCard?: {
    id: number;
    title: string;
    author: string;
    likes: number;
    description: string;
    imageUrl: string;
  };
  recipeId?: number;
  isNewRecipe?: boolean; // Flag từ backend
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatHistory = () => {
    return messages
      .filter(m => m.id !== 'greeting' && !m.id.startsWith('thinking-'))
      .map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content || '',
        recipeId: m.recipeId
      }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    const thinkingMessage: Message = {
      id: 'thinking-' + Date.now(),
      type: 'bot',
      content: 'Đang phân tích yêu cầu của bạn... 🤔',
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const chatHistory = getChatHistory();
      
      const response = await naturalQuery({ 
        prompt: userQuery,
        chatHistory
      });
      console.log('Natural Query Response:', response);
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));

      if (!response.success || !response.data) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Xin lỗi, mình gặp lỗi khi xử lý yêu cầu. Bạn thử lại nhé! 😅',
        }]);
        return;
      }

      const { answer, recipeId, isNewRecipe } = response.data;

      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: answer,
        recipeId,
        isNewRecipe,
      };

      if (recipeId && !isNewRecipe) {
        try {
          const recipeRes = await getRecipeById(recipeId);
          
          if (recipeRes.status === 'success' && recipeRes.data) {
            const recipe = recipeRes.data;

            botMessage.recipeCard = {
              id: recipe.id,
              title: recipe.name || 'Công thức không tên',
              author: recipe.user?.name || 'Cộng đồng',
              likes: (recipe.votes?.length || 0) + (recipe.votedUserIds?.length || 0),
              description: recipe.description || 'Công thức được cộng đồng chia sẻ và yêu thích',
              imageUrl: recipe.thumbnails?.[0]?.url || '/pwa-512x512.png',
            };
          }
        } catch (err) {
          console.error('Error fetching recipe details:', err);
          botMessage.content += '\n\n_Xin lỗi, không thể tải chi tiết công thức lúc này._';
        }
      }

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Lỗi tổng thể:', error);
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Có lỗi kết nối đến server. Bạn kiểm tra mạng và thử lại nhé! 🔌',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipeId: number) => {
    window.location.href = `/recipes/${recipeId}`;
  };

  const handleCreateNewRecipe = () => {
    window.location.href = 'http://localhost:5173/recipes/create';
  };

  const handleResetChat = () => {
    if (confirm('Bạn có chắc muốn bắt đầu cuộc hội thoại mới? Lịch sử chat sẽ bị xóa.')) {
      setMessages([
        {
          id: 'greeting',
          type: 'bot',
          content: 'Chào bạn! Mình là trợ lý nấu ăn AI của CookPac đây 🍳\n\nBạn có thể:\n• Tìm công thức có sẵn: "Tìm món phở bò"\n• Tạo công thức mới: "Sáng tạo món salad độc đáo"\n• Hỏi về nguyên liệu: "Làm gì với thịt bò và nấm?"\n\nMình sẽ giúp bạn nhé! ✨',
        },
      ]);
    }
  };

  useEffect(() => {
    setMessages([
      {
        id: 'greeting',
        type: 'bot',
        content: 'Chào bạn! Mình là trợ lý nấu ăn AI của CookPac đây 🍳\n\nBạn có thể:\n• Tìm công thức có sẵn: "Tìm món phở bò"\n• Tạo công thức mới: "Sáng tạo món salad độc đáo"\n• Hỏi về nguyên liệu: "Làm gì với thịt bò và nấm?"\n\nMình sẽ giúp bạn nhé! ✨',
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col h-screen w-auto bg-linear-to-b from-gray-50 to-gray-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className="flex gap-3 max-w-[85%]">
                {message.type === 'bot' && (
                  <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-600 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold mt-1 shadow-md">
                    C
                  </div>
                )}

                <div
                  className={`rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {/* Badge hiển thị loại công thức */}
                  {message.type === 'bot' && message.isNewRecipe !== undefined && (
                    <div className={`flex items-center gap-1 mb-2 text-xs font-medium ${
                      message.isNewRecipe 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`}>
                      {message.isNewRecipe ? (
                        <>
                          <ChefHat className="w-3 h-3" />
                          <span>Công thức sáng tạo mới</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Từ cộng đồng CookPac</span>
                        </>
                      )}
                    </div>
                  )}

                  {message.content && (
                    <p className="whitespace-pre-line text-base leading-relaxed">
                      {message.content}
                    </p>
                  )}

                  {/* Công thức có sẵn từ DB → hiển thị FoodCard2 */}
                  {message.type === 'bot' && message.recipeCard && !message.isNewRecipe && (
                    <div 
                      className="mt-4 cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() => handleRecipeClick(message.recipeCard!.id)}
                    >
                      <FoodCard2
                        title={message.recipeCard.title}
                        author={message.recipeCard.author}
                        likes={message.recipeCard.likes}
                        description={message.recipeCard.description}
                        imageUrl={message.recipeCard.imageUrl}
                      />
                    </div>
                  )}

                  {/* Công thức mới được AI tạo → hiển thị nút tạo chi tiết */}
                  {message.type === 'bot' && message.isNewRecipe && (
                    <div className="mt-4">
                      <button
                        onClick={handleCreateNewRecipe}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Tạo công thức chi tiết từ gợi ý này
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Bạn sẽ được chuyển đến trang tạo công thức để chỉnh sửa và lưu.
                      </p>
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-9 h-9 bg-linear-to-br from-gray-400 to-gray-500 rounded-full shrink-0 mt-1 shadow-md" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="VD: Tìm món phở bò hoặc tạo món salad mới..."
            className="flex-1 px-5 py-3 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-full transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:hover:shadow-md"
            aria-label="Gửi tin nhắn"
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
        
        {messages.length === 1 && (
          <div className="max-w-2xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-2">
            {[
              'Món ăn Huế',
              'Công thức với thịt gà',
              'Tạo món fusion mới'
            ].map((tip) => (
              <button
                key={tip}
                onClick={() => {
                  setInputValue(tip);
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full whitespace-nowrap transition-colors border border-blue-200"
              >
                {tip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}