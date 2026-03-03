import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export function useAcceptOrders(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchAcceptOrder(id: string) {
    const { data } = await axios.patch(
      `/orders/accept/order/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return data;
  }

  return useMutation({
    mutationFn: fetchAcceptOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Orders", token],
      });
    },
  });
}
