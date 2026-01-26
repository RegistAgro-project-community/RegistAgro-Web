import Nav from "../components/nav";
import { useState } from "react";
export default function Produtos() {
  const [siderAberto, setSiderAberto] = useState(false);
  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
         <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
      </div>
    </div>
  );
}
