import { useState, useRef } from "react";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

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

  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const toast = useRef<Toast>(null)
  const [nif, setNif] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nifError, setNifError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  async function HandleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      let valid = true;

      if (!nif) {
        setNifError("O NIF é obrigatório.");
        valid = false;
      } else if (nif.length !== 9 || !/^\d+$/.test(nif)) {
        setNifError("NIF inválido!");
        valid = false;
      } else {
        setNifError("");
      }

      if (!password) {
        setPasswordError("A senha é obrigatória.");
        valid = false;
      } else if (password.length < 6) {
        setPasswordError("A senha deve conter pelo menos 6 caracteres.");
        valid = false;
      } else {
        setPasswordError("");
      }

      if (!valid) {
        setTimeout(() => {
          console.log("NIF enviado:", nif)
          console.log("Senha enviada:", password)
          setLoading(false)
        }, 3000)
        setNif("")
        setPassword("")
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
      console.log(valido)

      if (res.status === 200) {
        setLoading(false)
        Cookies.set("token", auth_token!, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        })
        setNif("")
        setPassword("")
        navigate("/dashboard")
        
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
    <div className="min-h-screen w-full flex items-center justify-center">
      <Toast ref={toast} position="top-right" />
        <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full max-w-4xl">

          <div className="auth bg-white min-h-screen w-full md:w-1/2 flex justify-center items-center px-6 py-10">
            <div className="w-full max-w-sm">

                <div className="flex flex-col justify-center items-center gap-1.5 pb-10">
                    <img src="/src/assets/image/logo.png" alt="logo" className="h-17 object-contain"/>
                    <h1 className="font-bold text-[23px] text-[#5F963B]">RegistAgro</h1>
                </div>

                <div className="pb-8">
                    <h1 className="text-2xl font-bold">Entrar</h1>
                    <p className="text-black/60">Bem-vindo de volta! Por favor, insira seus dados.</p>
                </div>

                <form onSubmit={HandleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="nif" className="font-medium">NIF</label>
                      <input id="nif" placeholder="1234567890" value={nif} onChange={(e) => setNif(e.target.value)}
                        className={`w-full py-2 px-3 rounded-lg transition border ${nifError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-green-600 focus:ring-green-200'} focus:outline-none focus:ring-2`}
                      />
                      {nifError && (<span className="text-red-500 text-sm">{nifError}</span>)}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-medium">Senha</label>
                        <div className={`relative flex items-center rounded-lg transition border ${passwordError ? 'border-red-500 focus-within:ring-red-400' : 'border-gray-300 focus-within:border-green-600 focus-within:ring-green-200'} focus-within:ring-2`}>
                           <input id="password" placeholder="••••••••••" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                              className={`w-full py-2 px-3 rounded-lg transition border ${passwordError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:border-green-600 focus:ring-green-200'} focus:outline-none focus:ring-2`}
                            />

                          <button type="button" className="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setShowPass(!showPass)}>
                            <EyeIcon open={showPass} />
                          </button>
                        </div>

                        {passwordError && (<span className="text-red-500 text-sm">{passwordError}</span>)}

                        <div className="flex justify-between items-center px-1 pt-1">
                            <a href="#" className="text-sm text-green-600 hover:underline transition">Esqueci senha</a>
                            <div>
                                <p className="text-sm text-gray-500">Não tem uma conta? <Link to="/register" className="text-sm text-green-600 hover:underline transition">Criar conta</Link></p>
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className={`w-full h-10 bg-green-500 text-white font-semibold rounded-lg mt-4 hover:bg-green-600 cursor-pointer transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"}`}>
                      {loading ? (
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : ("Entrar")}
                    </button>
                </form>
              
            </div>
          </div>
        </div>
      </div>
  );
}
