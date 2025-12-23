import axiosInstance from "../lib/axios";
import { ApiResponse } from "../types/api.type";

// Request type
interface NaturalQueryRequest {
  prompt: string;
}

// Response data type
interface NaturalQueryData {
  answer: string;
  recipeId?: number | null;
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