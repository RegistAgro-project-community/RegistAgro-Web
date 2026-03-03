import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";
const User_URL = "/users/profile";

export function useProfile(token: string | undefined) {
  async function fetchProfileData() {
    try {
      const { data } = await axios.get(User_URL, {
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
    queryKey: ["Profile", token],
    queryFn: fetchProfileData,
    enabled: !!token,
    retry: 1,
    staleTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
  });
}
