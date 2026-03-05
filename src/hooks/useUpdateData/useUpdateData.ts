import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";
interface FormData {
  name: string;
  adress: string;
  province: string;
}
export function useUpdateData(token: string | undefined) {
  const queryClient = useQueryClient();
  const UserUPDATE_URL = "/users/update";
  async function updateData({ formData }: { formData: FormData }) {
    const { data } = await axios.put(
      UserUPDATE_URL,
      {
        name: formData.name,
        adress: formData.adress,
        province: formData.province,
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
    mutationFn: updateData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profile", token] });
    },
  });
}
