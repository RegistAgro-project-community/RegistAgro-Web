import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

export function useSearchTransport(
  token: string | undefined,
  transportType: string,
) {
  async function fetchSearchTransport() {
    try {
      const { data } = await axios.get(
        `/transports/farms/get/vehicle/${transportType}`,
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
    queryKey: ["Transports", token],
    queryFn: fetchSearchTransport,
    enabled: !!token,
    retry: 1,
    staleTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
  });
}
