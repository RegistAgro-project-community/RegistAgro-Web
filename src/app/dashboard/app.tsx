import axios from "../api/axios";
import Nav from "../components/nav";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}
interface FormData {
  id: string;
  name: string;
  adress: string;
  email: string;
  phone: string;
  province: string;
}
interface BackendResponse {
  valid?: boolean;
  message?: string;
  data?: FormData;
  error?: ZodIssue[] | string;
}
export default function Home() {
  const token = Cookies.get("token");
  const [fazendaName, setFazendaName] = useState("");
  const User_URL = "/users/profile";
  const called = useRef(false);
  const [siderAberto, setSiderAberto] = useState(false);
  useEffect(() => {
    if (!called.current) {
      if (token) {
        async function UserName() {
          console.log(token);
          try {
            const res = await axios.get<BackendResponse>(User_URL, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(res);
            const name = res.data.data?.name;
            setFazendaName(`${name}`);
          } catch (err) {
            const error = err as AxiosError<BackendResponse>;
            if (error.response) {
              const data = error.response.data;
              let mensagem = "";
              if (Array.isArray(data?.error)) {
                mensagem = data.error
                  .map((e: ZodIssue) => e.message)
                  .join(", ");
              }
              if (Array.isArray(data?.error)) {
                mensagem = data.error
                  .map((e) => (typeof e === "string" ? e : e.message))
                  .join(", ");
              } else if (data?.message) {
                mensagem = data.message;
              } else {
                mensagem = "erro inesperado.";
              }
              console.log(mensagem);
            } else {
              console.log("Erro Server");
            }
          }
        }
        UserName();
      }
      called.current = true;
    }
  }, [token]);

  return (
    <div className="bg-background text-text-main">
      <div className="relative flex h-screen w-full overflow-hidden bg-background">
        <div className="relative flex h-screen w-full overflow-hidden bg-background">
          <Nav sidebarAberto={siderAberto} setSidebarAberto={setSiderAberto} />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="h-16 w-full bg-white border-b border-border-color flex items-center justify-between px-8 shrink-0">
              <div className="flex items-center gap-2">
                {" "}
                <button
                  onClick={() => setSiderAberto(true)}
                  className="md:hidden p-1 mr-1 text-text-secondary hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl align-middle">
                    menu
                  </span>
                </button>
                <h2 className="text-sm font-medium text-text-secondary">
                  Visão Geral
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-text-main">
                    {" "}
                    {fazendaName || "Problema"}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Produtor Verificado
                  </span>
                </div>
                <div className="h-10 w-10 bg-amber-200 rounded-full hidden md:block "></div>
              </div>
            </div>
            {/* Conteudo */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-2xl font-bold text-text-main tracking-tight">
                  Dashbooard da Fazenda
                </h1>
                <p className="text-text-secondary text-[13px] ">
                  Bem-vindo de volta! Aqui está o resumo das sias atividades
                  hoje.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                  {[
                    {
                      icon: "inventory_2",
                      label: "Total de produtos cadastrados",
                      total: 45,
                    },
                    {
                      icon: "pending_actions",
                      label: "Pedidos pendentes",
                      total: 8,
                    },
                    {
                      icon: "local_shipping",
                      label: "Entregas em andamento",
                      total: 3,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-white p-4 rounded-lg border flex items-center justify-between  ${
                        item.icon === "inventory_2"
                          ? "group hover:border-green-300/50"
                          : item.icon === "pending_actions"
                            ? "hover:border-yellow-300/50"
                            : item.icon === "local_shipping"
                              ? "hover:border-blue-300/50"
                              : ""
                      } transition-colors border-gray-200 shadow`}
                    >
                      <div>
                        <p className="text-text-secondary text-sm font-medium mb-1">
                          {item.label}
                        </p>
                        <h3 className="text-3xl font-bold text-text-main">
                          {item.total}
                        </h3>
                      </div>
                      <div className="flex justify-between items-start">
                        <div
                          className={` flex items-center p-2 rounded-lg
                        ${
                          item.icon === "inventory_2"
                            ? "bg-green-50 text-green-600"
                            : item.icon === "pending_actions"
                              ? "bg-yellow-50 text-yellow-600"
                              : item.icon === "local_shipping"
                                ? "bg-blue-50 text-blue-600"
                                : ""
                        } 
                            `}
                        >
                          <span className="material-symbols-outlined text-[28px]">
                            {item.icon}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold  text-text-main">
                      Resumo dos Últimos Pedidos
                    </h3>
                    <a
                      className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                      href="/pedidos"
                    >
                      Ver todos os pedidos
                    </a>
                  </div>
                  <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-border-color">
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Pedido
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Consumidor
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Valor
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {[
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pedente",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pago",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "entregue",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "enviado",
                          },
                          {
                            pedido: "#4023",
                            nome: "Maria Silva",
                            valor: "550.000kz",
                            status: "pago",
                          },
                        ].map((item, i) => (
                          <tr
                            key={i}
                            className="hover:bg-background/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-text-main">
                              {" "}
                              <span className="font-mono">{item.pedido}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-text-secondary">
                              {item.nome}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-text-main">
                              {item.valor}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === "pedente"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : item.status === "pago"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : item.status === "enviado"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : item.status === "entregue"
                                          ? "bg-gray-200 text-gray-600"
                                          : ""
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
