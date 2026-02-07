import { useState } from "react";
import { AxiosError } from "axios";
import axios from "../../api/axios";
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
  const [nif, setNif] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  async function Logar(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (!nif || !password) {
        setErro("Preencha NIF e Senha");
        return;
      }
      const res = await axios.post<BackendResponse>(
        FARMLOGIN_URL,
        { nif, password },
        { headers: { "Content-Type": "application/json" } },
      );
      setErro("");
      console.log(res.data, "OK");
    } catch (err) {
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
        setErro(mensagem);
      } else {
        setErro("Erro de conexão com o Servidor");
      }
      console.error("Erro no axios", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
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
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-lg mb-2">
              {erro}
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined  text-text-secondary">
                  visibility
                </span>
              </div>
            </div>

            <button className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all  cursor-pointer">
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
