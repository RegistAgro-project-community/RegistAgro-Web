import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export function useFlowProduct(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchFlowProduct(id: string) {
    const { data } = await axios.patch(
      `/flow/farm/start/order/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  }
  return useMutation({
    mutationFn: fetchFlowProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Orders", token],
      });
    },
  });
}
