// User service functions to call API
import { BaseUser } from "@/types/user.type";

// Dummy function to fetch users
export async function fetchUsers(): Promise<BaseUser[]> {
  return [
    { id: "1", name: "John Doe", email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
    { id: "3", name: "Alice Johnson", email: "alice.johnson@example.com" }
  ];
}