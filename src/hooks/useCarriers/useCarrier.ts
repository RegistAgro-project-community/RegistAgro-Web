import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

const CARRIERS_URL = "";

export function useCarrier(token: string | undefined) {
  async function fetchCarrierData() {
    try {
      const { data } = await axios.get(CARRIERS_URL, {
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
    queryKey: ["Corriers", token],
    queryFn: fetchCarrierData,
    enabled: !!token,
    retry: 1,
  });
}
