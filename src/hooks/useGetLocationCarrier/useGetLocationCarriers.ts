import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

export function useLocationCarrier(token: string | undefined, id: string) {
  async function fetchLocationCarrier() {
    try {
      const { data } = await axios.get(
        `/location/get/coordinates/order/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return data;
    } catch (err) {
      const error = err;
      console.log(error);
      return null;
    }
  }
  return useQuery({
    queryKey: ["Carrier", token, id],
    queryFn: fetchLocationCarrier,
    enabled: !!token,
    refetchInterval: 30000,
  });
}
