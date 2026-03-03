import axios from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewProduto_URL = "/products/create";

export function useAddProducts(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchAddProduct(formdata: FormData) {
    const { data } = await axios.post(NewProduto_URL, formdata, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
  return useMutation({
    mutationFn: fetchAddProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products", token] });
    },
  });
}
