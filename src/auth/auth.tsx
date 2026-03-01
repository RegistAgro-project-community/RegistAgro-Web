import { Outlet } from "react-router";
import AgroCarousel from "./carrosel/crrosel";

export default function Auth() {
  return (
    <div className="auth w-screen h-screen flex items-center justify-center">
        <div className="h-full w-full flex items-center justify-center bg-white">
            <Outlet />
        </div>
        <div className="h-full w-full items-center justify-center bg-green-100">
            <AgroCarousel />
        </div>
    </div>
  )
}   