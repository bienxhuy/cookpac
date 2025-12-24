import axiosInstance from "../lib/axios";
import { ApiResponse } from "../types/api.type";

// Chat message type
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recipeId?: number;
}

// Request type
interface NaturalQueryRequest {
  prompt: string;
  chatHistory?: ChatMessage[];
}

// Response data type
interface NaturalQueryData {
  answer: string;
  recipeId?: number | null;
  isNewRecipe: boolean;
}

// Response type
type NaturalQueryResponse = ApiResponse<NaturalQueryData>;

export const naturalQuery = async (
  data: NaturalQueryRequest
): Promise<NaturalQueryResponse> => {
  const response = await axiosInstance.post<NaturalQueryResponse>(
    "/api/query/natural",
    data
  );
  return response.data;
};