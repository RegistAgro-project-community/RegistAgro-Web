import { useEffect, useState } from "react";
import { removeToken } from "../../app/auth";
import { useNavigate } from "react-router-dom";

type SignOutProps = {
  openSignOut: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

function SignOut({ openSignOut, onClose, children }: SignOutProps) {
  const [modalOpen, setModalOpen] = useState(openSignOut);
  const navegate = useNavigate();
  useEffect(() => {
    setModalOpen(openSignOut);
  }, [openSignOut]);
  if (!openSignOut) return null;
  return (
    <>
      <div
        onClick={onClose}
        className={`
      fixed inset-0  overflow-y-auto flex  items-center justify-center p-4 ${modalOpen ? "scale-100 opacity-100 visible bg-black/20  backdrop-blur-sm transition-opacity z-60" : "scale-125 opacity-0 invisible"}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-120 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col "
        >
          <div className="flex justify-center pt-7 ">
            {" "}
            <div className="p-4 w-13 h-13  bg-red-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-red-400 text-4xl">
                logout
              </span>
            </div>
          </div>
          <div className="px-8 pt-6">
            <h3 className="text-text-main tracking-tight text-2xl font-bold leading-tight text-center">
              Terminar Sessão
            </h3>
            <div className="px-8 pt-2">
              <p className="text-text-main text-base font-normal leading-normal text-center">
                Tem certeza que deseja terminar a sessão?
              </p>
            </div>
            <div className="px-8 pt-2">
              <p className="text-text-secondary2 text-sm font-normal leading-normal text-center">
                Ao sair, será necessário iniciar sessão novamente para aceder à
                sua conta.
              </p>
              <div className="flex justify-center p-8">
                <div className="flex flex-col  sm:flex-row flex-1 gap-3 max-w-full">
                  {children}
                  <button
                    onClick={() => {
                      removeToken();
                      navegate("/login");
                    }}
                    className="flex-1 min-w-43 h-12 bg-primary hover:bg-primary-hover  items-center justify-center active:scale-93 transition-all text-white md:px-4 px-3 md:py-0 py-3  rounded-lg shadow-lg  font-bold  text-sm leading-normal tracking-[0.015em] cursor-pointer"
                  >
                    <span className="truncate">Terminar Sessão</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignOut;
