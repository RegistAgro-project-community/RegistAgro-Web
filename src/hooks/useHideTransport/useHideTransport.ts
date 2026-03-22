import axios from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
type HideTransportProps = {
  orderId: string;
  vehicleId: string;
};
const TransportRequest_URL = "/transports/request";

export function useHideTransport(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchHideTransport({
    orderId,
    vehicleId,
  }: HideTransportProps) {
    const { data } = await axios.post(
      TransportRequest_URL,
      { orderId, vehicleId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  }
  return useMutation({
    mutationFn: fetchHideTransport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Corriers", token] });
    },
  });
}
