import Cookies from "js-cookie";

export function isAuth() {
  return !!Cookies.get("token");
}
export function removeToken() {
  Cookies.remove("token");
}
