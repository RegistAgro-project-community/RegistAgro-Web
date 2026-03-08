import axios from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRejectOrders(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchRejectOrder(id: string) {
    const { data } = await axios.post(`${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  return useMutation({
    mutationFn: fetchRejectOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Orders", token],
      });
    },
  });
}
