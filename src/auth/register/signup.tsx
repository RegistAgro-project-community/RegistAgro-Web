import { useState, useRef } from "react";
import axios from "../../api/axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

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
const FARMSignup_URL = "/auth/farm/signup";
export default function Register() {
  const toast = useRef<Toast>(null)
  const [etapa, setEtapa] = useState<"nif" | "otp" | "dados">("nif")
  const [nif, setNif] = useState("")
  const [loading, setLoading] = useState(false)
const [nifError, setNifError] = useState("")
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [province, setProvince] = useState("")
  const [adress, setAdress] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPasssword] = useState("")
  const [token, setToken] = useState<string | null>(null)

  const navigate = useNavigate();
  async function CheckNif(event: React.FormEvent) {
    event.preventDefault();
    try {
      let valid = true;

      if (!nif) {
        setNifError("O NIF é obrigatório.")
        valid = false
      } else if (nif.length !== 9 || !/^\d+$/.test(nif)) {
        setNifError("NIF inválido!")
        valid = false
      } else {
        setNifError("")
      }

      if (valid) {
        setLoading(true)
        setTimeout(() => {
          console.log("NIF enviado:", nif)
          setLoading(false)
        }, 2000)
        setLoading(true);
      }

      const res = await axios.get<BackendResponse>(`/auth/signup/nif/${nif}`);
      console.log(res);

      if (res.data.valid === true) {
        console.log(res.data.message);
        const valido = res.data.message;
        console.log("Tudo certo:", valido);
        setLoading(false);
        setTimeout(() => {
          setEtapa("otp");
        }, 2000);
      }
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
        setLoading(false);
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
        setLoading(false);
      }
    }
  }

  async function CheckOtp(event: React.FormEvent) {
    event.preventDefault();
    try {
      const vazio = code.some((v) => v === "");
      if (vazio) {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Preenca tods os campos",
          life: 2000,
        });
        return;
      }
      const OTPCODE = code.join("");
      setLoading(true);
      const res = await axios.get<BackendResponse>(
        `/auth/signup/verify/${OTPCODE}`,
      );
      console.log(res);
      if (res.status === 202) {
        const mensagem = res.data.message;
        const data = res.data.data;
        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: mensagem,
          life: 2000,
        });
        setLoading(false);
        setName(`${data?.name}`);
        setAdress(`${data?.adress}`);
        setEmail(`${data?.email}`);
        setPhone(`${data?.phone}`);
        setProvince(`${data?.province}`);
        setToken(res.headers.authorization);
        setEtapa("dados");       
      }
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
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: mensagem,
          life: 2000,
        });
      } else {
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Erro de Conexão com o Servidor",
          life: 2000,
        });
      }
    }
  }

  async function Sginup(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (!password || !confirmPassword) {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Preencha os Campos.",
          life: 2000,
        });
        return;
      } else if (password !== confirmPassword) {
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "As  senhas não coincidem.",
          life: 2000,
        });
        return;
      }
      setLoading(true);
      const res = await axios.post<BackendResponse>(
        FARMSignup_URL,
        {
          name,
          email,
          phone,
          adress,
          province,
          pass1: password,
          pass2: confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json", Authorization: token },
        },
      );
      toast.current?.show({
        severity: "success",
        summary: "Tudo certo",
        detail: res.data.message,
        life: 2000,
      });
      if (res.data.valid === true) {
        setLoading(false);
        const auth_token = token?.split(" ")[1];
        Cookies.set("token", auth_token!, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      const error = err as AxiosError<BackendResponse>;
      if (error.response) {
        const data = error.response.data;
        let mensagem = "";
        if (Array.isArray(data?.error)) {
          mensagem = data.error.map((e: ZodIssue) => e.message).join(", ");
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
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: mensagem,
          life: 2000,
        });
      } else {
        setLoading(false);
        toast.current?.show({
          severity: "error",
          summary: "Algo de errado",
          detail: "Erro de conexão com o Servidor",
          life: 2000,
        });
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
      <Toast ref={toast} position="top-right" />
      {etapa === "nif" && (
        <div className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full max-w-4xl">

            <div className="auth bg-white min-h-screen w-full md:w-1/2 flex justify-center items-center px-6 py-10">
              <div className="space-y-5 w-full max-w-sm">

                <div className="flex flex-col justify-center items-center gap-1.5 pb-10">
                  <img src="/assets/image/logo-registagro.png" alt="logo" className="h-17 object-contain"/>
                  <h1 className="font-bold text-[23px] text-[#5F963B]">RegistAgro</h1>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold">Cadastrar</h1>
                  <p className="text-black/60">Bem-vindo ao RegistAgro! Por favor, insira seus dados.</p>
                </div>

                <form onSubmit={CheckNif} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nif" className="font-medium">NIF</label>
                    <input
                      id="nif"
                      type="text"
                      placeholder="1234567890"
                      value={nif}
                      onChange={(e) => setNif(e.target.value)}
                      className={`border border-gray-200 py-2 px-3 w-full rounded-lg outline-green-600 ${
                        nifError
                          ? "border-red-500 outline-1 outline-red-400 transition"
                          : ""
                      }`}
                    />
                    {nifError && (<span className="text-red-500 text-sm">{nifError}</span>)}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1 pt-1">
                      <p className="text-sm text-gray-500 flex gap-1">
                        Já tenho uma conta! 
                        <Link to="/login" className="text-sm text-green-600 hover:underline transition">Entrar</Link>
                      </p>
                    </div>
                  </div>
                  <button disabled={loading} type="submit" className={`w-full h-10 flex items-center justify-center bg-green-500 text-white font-semibold rounded-lg mt-4 transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600 cursor-pointer"}`}>
                    {loading ? (
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : ("Validar NIF")}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}
      {etapa === "otp" && (
        <>
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                arrow_back
              </span>
              <a
                href="/login"
                className="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                Voltar para Login
              </a>
            </div>
          </div>
          <div className="w-full max-w-120 relative ">
            <form className="bg-surface-light rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10 flex flex-col items-center relative onverflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-3xl"></div>
              <div className="mb-6 flex flex-col items-center">
                <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  <img
                    className="h-12"
                    src="/public/assets/logo-registagro.png"
                    alt=""
                  />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900 ">
                  RegistAgro
                </h2>
              </div>

              {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
                </div>
              )}
              <div className="text-center mb-8 w-full">
                <h1 className="text-2xl text-gray-900 font-bold mb-2">
                  Verificar E-mail
                </h1>

                <p className="text-gray-500 text-sm leading-relaxed px-4">
                  Enviamos um código de 6 dígitos para o seu email{" "}
                </p>
              </div>
              <div className="w-full mb-8">
                <fieldset className="flex justify-center gap-2 sm:gap-3">
                  {code.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      value={value}
                      maxLength={1}
                      onChange={(e) => {
                        const newCode = [...code];
                        newCode[index] = e.target.value;
                        setCode(newCode);
                      }}
                      className="w-10 h-10 sm:w-12 sm:h-14  text-center text-xl font-bold 
                       border-2 border-border rounded-xl bg-white 
                       focus:border-primary focus:ring-1 focus:ring-primary 
                       outline-none transition-all"
                    />
                  ))}
                </fieldset>
              </div>
              <div className="w-full mb-6">
                <button
                  onClick={CheckOtp}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-base py-3.5 px-4 rounded-lg shadow-sm hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Confirmar Código
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {etapa === "dados" && (
        <div className="w-full max-w-240 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-text-main  text-[32px] font-bold leading-tight">
              Finaliza o seu cadastro
            </h1>
            <p className="text-text-secondary  text-sm sm:text-base font-normal leading-normal max-w-2xl">
              Confirma os dados da sua Fazenda e crie uma senha para acessar o
              painel Adminstrativo.
            </p>
          </div>
          <div className="bg-surface-light  rounded-xl shadow-sm border border-[#e5e7eb]  p-6 sm:p-8">
            <form className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-text-main  mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    agriculture
                  </span>
                  Dados da Fazenda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Nome
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                        value={name}
                        type="text"
                        disabled
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                  {/* Email */}
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Email
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary "
                        type="email"
                        disabled
                        value={email}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                  {/* Phone Number */}
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Número de Telefone
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed h-12 px-3 text-base font-normaly"
                        type="tel"
                        disabled
                        value={phone}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="h-px w-full bg-gray-100"></div>
              {/* Localização */}
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2 ">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  Localização da fazenda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Província
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                        value={province}
                        type="text"
                        disabled
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Endereço
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                        value={adress}
                        type="text"
                        disabled
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              {/* Segurança */}
              <div className="h-px w-full bg-gray-100"></div>
              <div>
                <h3 className="text-lg font-semibold text-text-main  mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    security
                  </span>
                  Segurança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Senha
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-white border-border border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Crie uma senha forte"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      ></input>
                      {/* <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        visibility
                      </span> */}
                    </div>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Confirmar Senha
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-white border-border border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Crie uma senha forte"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPasssword(event.target.value)
                        }
                      ></input>
                      {/* <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        visibility_off
                      </span> */}
                    </div>
                  </label>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  info
                </span>
                <p className="text-xs text-gray-500 ">
                  A senha deve ter pelo menos 8 caracteres, incluindo letras e
                  números.
                </p>
              </div>
              <div className="pt-1">
                <button
                  onClick={Sginup}
                  className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] transition-all duration-200 text-white  font-bold text-lg rounded-lg h-14 flex items-center justify-center gap-3 shadow-md hover:shadow-lg cursor-pointer"
                  type="button"
                >
                  <span>Criar Conta</span>
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
                <p className="text-center mt-4 text-text-secondary text-sm">
                  Já tem uma conta?{" "}
                  <a
                    className="text-primary hover:text-primary-hover font-semibold hover:underline"
                    href="/login"
                  >
                    Entrar
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
