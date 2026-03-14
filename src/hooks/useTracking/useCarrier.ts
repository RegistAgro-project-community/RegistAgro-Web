import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

const TRACKINGS_URL = "http://localhost:8000/tracking";

export function useTracking(token: string | undefined) {
  async function fetchTrackingData() {
    try {
      const { data } = await axios.get(TRACKINGS_URL, {
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
    queryFn: fetchTrackingData,
    enabled: !!token,
    retry: 1,
  });
}
