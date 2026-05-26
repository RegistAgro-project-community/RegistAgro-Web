import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

const Order_URL = "/orders/farms/order/get";
export function useOrders(token: string | undefined) {
  async function fetchOrdersData() {
    try {
      const { data } = await axios.get(Order_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      const error = err;
      console.log(error);
      return null;
    }
  }
  return useQuery({
    queryKey: ["Orders", token],
    queryFn: fetchOrdersData,
    enabled: !!token,
    retry: 1,
    refetchInterval: 100 * 30,
    refetchOnWindowFocus: false,
    
  });
}
