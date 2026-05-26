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

const FARM_SIGNUP_URL = "/auth/farm/signup";
function extractErrorMessage(data: BackendResponse | undefined): string {
  if (!data) return "Erro inesperado.";
  if (Array.isArray(data.error)) {
    return data.error.map((e: ZodIssue) => e.message).join(", ");
  }
  if (typeof data.error === "string") return data.error;
  if (data.message) return data.message;
  return "Erro inesperado.";
}

export default function Register() {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<"nif" | "otp" | "dados">("nif");
  const [nif, setNif] = useState("");
  const [nifError, setNifError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [adress, setAdress] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  function showError(detail: string) {
    toast.current?.show({
      severity: "error",
      summary: "Algo de errado",
      detail,
      life: 2000,
    });
  }
  function validateNif(): boolean {
    if (!nif) {
      setNifError("O NIF é obrigatório.");
      return false;
    }
    if (nif.length !== 9 || !/^\d+$/.test(nif)) {
      setNifError("NIF inválido!");
      return false;
    }
    setNifError("");
    return true;
  }

  async function checkNif(event: React.FormEvent) {
    event.preventDefault();
    if (!validateNif()) return;

    try {
      setLoading(true);
      const res = await axios.get<BackendResponse>(`/auth/signup/nif/${nif}`);

      if (res.data.valid === true) {
        setEtapa("otp");
      }
    } catch (err) {
      const error = err as AxiosError<BackendResponse>;
      const mensagem = error.response
        ? extractErrorMessage(error.response.data)
        : "Erro de conexão com o servidor.";
      showError(mensagem);
    } finally {
      setLoading(false);
    }
  }

  async function checkOtp(event: React.FormEvent) {
    event.preventDefault();

    if (code.some((v) => v === "")) {
      showError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const otpCode = code.join("");
      const res = await axios.get<BackendResponse>(
        `/auth/signup/verify/${otpCode}`,
      );

      if (res.status === 202) {
        const data = res.data.data;

        toast.current?.show({
          severity: "success",
          summary: "Tudo certo",
          detail: res.data.message,
          life: 2000,
        });

        setName(data?.name ?? "");
        setAdress(data?.adress ?? "");
        setEmail(data?.email ?? "");
        setPhone(data?.phone ?? "");
        setProvince(data?.province ?? "");
        const rawToken = res.headers.authorization;
        setAuthToken(rawToken?.split(" ")[1] ?? null);

        setEtapa("dados");
      }
    } catch (err) {
      const error = err as AxiosError<BackendResponse>;
      const mensagem = error.response
        ? extractErrorMessage(error.response.data)
        : "Erro de conexão com o servidor.";
      showError(mensagem);
    } finally {
      setLoading(false);
    }
  }
  function validatePasswords(): boolean {
    if (!password || !confirmPassword) {
      showError("Preencha os campos de senha.");
      return false;
    }
    if (password.length < 8) {
      showError("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      showError("As senhas não coincidem.");
      return false;
    }
    return true;
  }

  async function signup(event: React.FormEvent) {
    event.preventDefault();

    if (!validatePasswords()) return;

    try {
      setLoading(true);
      const res = await axios.post<BackendResponse>(
        FARM_SIGNUP_URL,
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      toast.current?.show({
        severity: "success",
        summary: "Tudo certo",
        detail: res.data.message,
        life: 2000,
      });

      if (res.data.valid === true) {
        Cookies.set("token", authToken!, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      const error = err as AxiosError<BackendResponse>;

      const mensagem = error.response
        ? extractErrorMessage(error.response.data)
        : "Erro de conexão com o servidor.";
      showError(mensagem);
    } finally {
      setLoading(false);
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
                  <img
                    src="/assets/image/logo-registagro.png"
                    alt="logo"
                    className="h-17 object-contain"
                  />
                  <h1 className="font-bold text-[23px] text-[#5F963B]">
                    RegistAgro
                  </h1>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl font-bold">Cadastrar</h1>
                  <p className="text-black/60">
                    Bem-vindo ao RegistAgro! Por favor, insira seus dados.
                  </p>
                </div>

                <form onSubmit={checkNif} className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nif" className="font-medium">
                      NIF
                    </label>
                    <input
                      id="nif"
                      type="text"
                      placeholder="123456789"
                      value={nif}
                      onChange={(e) => setNif(e.target.value)}
                      className={`border py-2 px-3 w-full rounded-lg outline-green-600 transition ${
                        nifError
                          ? "border-red-500 outline-1 outline-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    {nifError && (
                      <span className="text-red-500 text-sm">{nifError}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <p className="text-sm text-gray-500 flex gap-1">
                      Já tenho uma conta!{" "}
                      <Link
                        to="/login"
                        className="text-sm text-green-600 hover:underline transition"
                      >
                        Entrar
                      </Link>
                    </p>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className={`w-full h-10 flex items-center justify-center bg-green-500 text-white font-semibold rounded-lg mt-4 transition ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-green-600 cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Validar NIF"
                    )}
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
              <span className="material-symbols-outlined text-gray-500">
                arrow_back
              </span>
              <Link to="/login" className="text-sm font-medium text-gray-500">
                Voltar para Login
              </Link>
            </div>
          </div>

          <div className="w-full max-w-120 relative">
            <form
              onSubmit={checkOtp}
              className="bg-surface-light rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10 flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-3xl" />

              <div className="mb-6 flex flex-col items-center">
                <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <img
                    className="h-12"
                    src="/assets/image/logo-registagro.png"
                    alt="logo"
                  />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  RegistAgro
                </h2>
              </div>
              {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
                </div>
              )}

              <div className="text-center mb-8 w-full">
                <h1 className="text-2xl text-gray-900 font-bold mb-2">
                  Verificar E-mail
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed px-4">
                  Enviamos um código de 6 dígitos para o seu email.
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
                      className="w-10 h-10 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-border rounded-xl bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  ))}
                </fieldset>
              </div>

              <div className="w-full mb-6">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-base py-3.5 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
            <h1 className="text-text-main text-[32px] font-bold leading-tight">
              Finaliza o seu cadastro
            </h1>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal max-w-2xl">
              Confirma os dados da sua Fazenda e crie uma senha para acessar o
              painel Administrativo.
            </p>
          </div>

          <div className="bg-surface-light rounded-xl shadow-sm border border-[#e5e7eb] p-6 sm:p-8">
            <form onSubmit={signup} className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    agriculture
                  </span>
                  Dados da Fazenda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Nome
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal"
                        value={name}
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
                      Email
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal"
                        type="email"
                        disabled
                        value={email}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        lock
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Número de Telefone
                    </span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal"
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

              <div className="h-px w-full bg-gray-100" />
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
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
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal"
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
                        className="w-full rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed border-2 h-12 px-3 text-base font-normal"
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

              <div className="h-px w-full bg-gray-100" />
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
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
                    <input
                      className="w-full rounded-xl bg-white border-border border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Mínimo 8 caracteres"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-text-main text-sm font-medium">
                      Confirmar Senha
                    </span>
                    <input
                      className="w-full rounded-xl bg-white border-border border-2 h-12 px-3 text-base font-normal focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Repita a senha"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  info
                </span>
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 8 caracteres, incluindo letras e
                  números.
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary active:scale-[0.99] transition-all duration-200 text-white font-bold text-lg rounded-lg h-14 flex items-center justify-center gap-3 shadow-md cursor-pointer ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-primary-hover hover:shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Criar Conta</span>
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center mt-4 text-text-secondary text-sm">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary-hover font-semibold hover:underline"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
