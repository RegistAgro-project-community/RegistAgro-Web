import axios from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDelectProducts(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchDelectProduct(id: string) {
    const { data } = await axios.delete(`/products/delete/product/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  return useMutation({
    mutationFn: fetchDelectProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products", token] });
    },
  });
}
