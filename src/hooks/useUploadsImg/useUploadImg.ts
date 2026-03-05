import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export function useUploadImg(token: string | undefined) {
  const queryClient = useQueryClient();
  const UploadImg_URL = "/users/upload/profile";
  async function uploadImg({ formData }: { formData: FormData }) {
    const { data } = await axios.post(UploadImg_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
  return useMutation({
    mutationFn: uploadImg,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Profile", token],
      });
    },
  });
}
