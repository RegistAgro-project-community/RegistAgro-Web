import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
}
export function useEditProducts(token: string | undefined) {
  const queryClient = useQueryClient();
  async function fetchEditProduct({
    id,
    formData,
  }: {
    id: string;
    formData: ProductFormData;
  }) {
    const { data } = await axios.put(
      `/products/update/product/${id}`,
      {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        unit: formData.unit,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  }
  return useMutation({
    mutationFn: fetchEditProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products", token] });
    },
  });
}
