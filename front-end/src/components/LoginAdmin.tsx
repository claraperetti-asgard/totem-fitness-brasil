import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import TecladoSimples from "./TecladoSimples";
import { entrarAdmin, validarLogin } from "../auth";

const GOLD = "#c9a367";

type CampoAtivo = "usuario" | "senha";

type Props = {
    onFechar: () => void;
};

export default function LoginAdmin({ onFechar }: Props) {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [campoAtivo, setCampoAtivo] = useState<CampoAtivo>("usuario");
    const [error, setError] = useState("");

    const keyboardRef = useRef<any>(null);

    const valores = { usuario, senha };

    // Sincroniza o buffer do teclado com o campo selecionado.
    useEffect(() => {
        keyboardRef.current?.setInput(valores[campoAtivo]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campoAtivo]);

    function onKeyboardChange(input: string) {
        setError("");

        if (campoAtivo === "usuario") {
            setUsuario(input);
        } else {
            setSenha(input);
        }
    }

    function handleEntrar() {
        if (!validarLogin(usuario, senha)) {
            setError("Usuário ou senha inválidos.");
            return;
        }

        entrarAdmin();
        navigate("/exportar");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
            <div className="flex w-full max-w-[440px] flex-col items-center gap-3 rounded-lg border border-neutral-800 bg-[#0f0f0f] p-6 shadow-2xl">
                <h2 className="text-xl font-light tracking-[0.12em] text-white uppercase">
                    Acesso restrito
                </h2>

                <div
                    onClick={() => setCampoAtivo("usuario")}
                    className={`mt-2 flex w-full cursor-pointer items-center gap-3 rounded-md bg-white px-4 py-3 ${
                        campoAtivo === "usuario" ? "ring-2 ring-[#c9a367]" : ""
                    }`}
                >
                    <span className="shrink-0" style={{ color: GOLD }}>
                        <User size={20} strokeWidth={1.8} />
                    </span>
                    <input
                        readOnly
                        value={usuario}
                        placeholder="USUÁRIO"
                        className="w-full cursor-pointer bg-transparent tracking-[0.12em] text-neutral-800 uppercase outline-none placeholder:text-neutral-400"
                    />
                </div>

                <div
                    onClick={() => setCampoAtivo("senha")}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-md bg-white px-4 py-3 ${
                        campoAtivo === "senha" ? "ring-2 ring-[#c9a367]" : ""
                    }`}
                >
                    <span className="shrink-0" style={{ color: GOLD }}>
                        <Lock size={20} strokeWidth={1.8} />
                    </span>
                    <input
                        readOnly
                        value={"•".repeat(senha.length)}
                        placeholder="SENHA"
                        className="w-full cursor-pointer bg-transparent tracking-[0.12em] text-neutral-800 outline-none placeholder:text-neutral-400"
                    />
                </div>

                {error && <span className="text-sm text-red-400">{error}</span>}

                <div className="mt-2 flex w-full justify-center">
                    <TecladoSimples
                        onInit={(instancia) => (keyboardRef.current = instancia)}
                        onChange={onKeyboardChange}
                    />
                </div>

                <div className="mt-3 flex w-full gap-3">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="w-1/2 rounded-md border border-neutral-800 bg-[#161616] py-3 text-sm tracking-[0.1em] text-[#c9a367] uppercase transition-all active:scale-[0.98]"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleEntrar}
                        className="w-1/2 rounded-md py-3 text-sm font-medium tracking-[0.1em] text-white uppercase shadow-lg transition-all active:scale-[0.98]"
                        style={{
                            background:
                                "linear-gradient(90deg, #8a6a34 0%, #b99457 35%, #a9834a 100%)",
                        }}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
}
