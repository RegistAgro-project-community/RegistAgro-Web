import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";
const PRODUTOS_URL = "/products/farms/get/products";

export function useProducts(token: string | undefined) {
  async function fetchPruductData() {
    try {
      const { data } = await axios.get(PRODUTOS_URL, {
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
    queryKey: ["Products", token],
    queryFn: fetchPruductData,
    enabled: !!token,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
