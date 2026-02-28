import { useState, useRef } from "react";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
interface ZodIssue {
  key: string;
  message: string;
  minimum?: number;
}

interface BackendResponse {
  valid?: boolean;
  message?: string;
  error?: ZodIssue[] | string;
}
const FARMLOGIN_URL = "/auth/farm/login";
export default function Login() {
  const navigate = useNavigate();
  const [nif, setNif] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  async function Logar(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (!nif || !password) {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Preencha NIF e Senha",
          life: 2000,
        });
        return;
      }
      setLoading(true);
      const res = await axios.post<BackendResponse>(
        FARMLOGIN_URL,
        { nif, password },
        { headers: { "Content-Type": "application/json" } },
      );

      console.log(res);
      setToken(res.headers.authorization);
      const token1 = res.headers.authorization
      console.log(token)
      const auth_token = token1?.split(" ")[1];

      const valido = res.data.message;
      toast.current?.show({
        severity: "success",
        summary: "Tudo certo",
        detail: valido,
        life: 2000,
      });

      if (res.status === 200) {
        setLoading(false);
        Cookies.set("token", auth_token!, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        navigate("/dashboard");
        
      }
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<BackendResponse>;
      if (error.response) {
        const data = error.response.data;
        let mensagem = "";
        if (Array.isArray(data?.error)) {
          mensagem = data.error.map((e: ZodIssue) => e.message).join(", ");
        } else if (typeof data?.error === "string") {
          mensagem = data.error;
        } else if (data?.message) {
          mensagem = data.message;
        } else {
          mensagem = "erro inesperado.";
        }
        console.log(data);

        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: mensagem,
          life: 2000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Erro de conexão com o Servidor",
          life: 2000,
        });
      }
      console.error("Erro no axios", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Toast ref={toast} position="top-right" />
      <div className="w-full max-w-120 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-3 text-text-main">
            <div className="w-10 h-10rounded-xl flex items-center justify-center text-primary">
              <img src="/public/assets/logo-registagro.png" alt="" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">RegistAgro</h1>
          </div>
        </header>
        <div className="bg-surface border border-border shadow-sm rounded-xl p-8 w-full">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-text-main text-2xl font-bold mb-2">
              Aceder à conta
            </h2>
            <p className="text-text-secondary text-sm">
              Bem-vindo de volta! Insira os seus dados para entrar.
            </p>
          </div>
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
            </div>
          )}
          <form className="flex flex-col gap-6" onSubmit={Logar}>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-text-main text-sm font-medium"
                htmlFor="nif"
              >
                NIF da Fazenda
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-lg   text-text-main h-12 px-4 transition-all  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-white focus:border-primary"
                  id="nif"
                  placeholder="123456789"
                  type="text"
                  value={nif}
                  onChange={(event) => setNif(event.target.value)}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  id_card
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-text-main text-sm font-medium"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-lg  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border bg-white focus:border-primary text-text-main h-12 pl-4 pr-12 transition-all"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined  text-text-secondary">
                  visibility
                </span> */}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all  cursor-pointer"
            >
              <span>Entrar</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>

        <div className="text-center text-sm text-text-secondary">
          Ainda não tem conta?{" "}
          <a
            className="font-semibold text-text-main hover:text-[#82d749]"
            href="/register"
          >
            Cadastrar
          </a>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-125 h-125 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[50%] -left-[5%] w-100 h-100 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
