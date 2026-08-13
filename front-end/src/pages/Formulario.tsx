import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Dumbbell, Mail, Phone, Settings, ArrowLeft } from "lucide-react";
import TecladoVirtual, { type LayoutTeclado } from "../components/TecladoVirtual";
import LoginAdmin from "../components/LoginAdmin";

const GOLD = "#c9a367";

const DOMINIOS_EMAIL = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "uol.com.br",
];

type CampoAtivo = "name" | "academia" | "email" | "phone" | null;

function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers.replace(/^(\d{0,2})/, "($1");
    if (numbers.length <= 6) return numbers.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    if (numbers.length <= 10) return numbers.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function validateEmail(email: string) {
    return /^(?!\.)(?!.*?\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

type CampoProps = {
    icone: React.ReactNode;
    placeholder: string;
    value: string;
    ativo: boolean;
    onFocus: () => void;
};

function Campo({ icone, placeholder, value, ativo, onFocus }: CampoProps) {
    return (
        <div
            onClick={onFocus}
            className={`flex w-full cursor-pointer items-center gap-4 rounded-md bg-white px-6 py-4 shadow-lg transition-all ${
                ativo ? "ring-2 ring-[#c9a367]" : ""
            }`}
        >
            <span className="shrink-0" style={{ color: GOLD }}>
                {icone}
            </span>
            <input
                readOnly
                value={value}
                onFocus={onFocus}
                placeholder={placeholder}
                className="w-full cursor-pointer bg-transparent text-lg tracking-[0.12em] text-neutral-800 uppercase outline-none placeholder:text-neutral-400"
            />
        </div>
    );
}

export default function Formulario() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [academia, setAcademia] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isClient, setIsClient] = useState<boolean | null>(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [mostrarLogin, setMostrarLogin] = useState(false);

    const [campoAtivo, setCampoAtivo] = useState<CampoAtivo>(null);
    const [layoutName, setLayoutName] = useState<LayoutTeclado>("default");
    const keyboardRef = useRef<any>(null);

    const isFormValid =
        name.trim() !== "" &&
        academia.trim() !== "" &&
        validateEmail(email) &&
        phone.replace(/\D/g, "").length >= 10 &&
        isClient !== null;

    const valores = { name, academia, email, phone };

    // Sincroniza o buffer do teclado com o campo selecionado (roda após o
    // teclado montar, então funciona também na primeira abertura).
    useEffect(() => {
        if (!campoAtivo) return;
        keyboardRef.current?.setInput(valores[campoAtivo]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campoAtivo]);

    function abrirTeclado(campo: Exclude<CampoAtivo, null>) {
        setCampoAtivo(campo);
        setLayoutName(campo === "phone" ? "numeros" : "default");
    }

    function fecharTeclado() {
        setCampoAtivo(null);
        setLayoutName("default");
    }

    function onKeyboardChange(input: string) {
        if (campoAtivo === "name") {
            setName(input);
        } else if (campoAtivo === "academia") {
            setAcademia(input);
        } else if (campoAtivo === "email") {
            const limpo = input.toLowerCase().replace(/\s/g, "");
            setEmail(limpo);
            if (limpo !== input) keyboardRef.current?.setInput(limpo);
        } else if (campoAtivo === "phone") {
            const formatado = formatPhone(input);
            setPhone(formatado);
            if (formatado !== input) keyboardRef.current?.setInput(formatado);
        }
    }

    function onKeyPress(button: string) {
        if (button === "{shift}") {
            setLayoutName((atual) => (atual === "default" ? "shift" : "default"));
            return;
        }

        // Após digitar uma letra maiúscula, volta ao layout normal.
        if (layoutName === "shift") {
            setLayoutName("default");
        }
    }

    function selecionarDominio(dominio: string) {
        const prefixo = email.split("@")[0];
        const novoEmail = `${prefixo}@${dominio}`;

        setEmail(novoEmail);
        keyboardRef.current?.setInput(novoEmail);
    }

    async function handleSubmit() {
        if (isSubmitting) return;

        if (!isFormValid) {
            setError("Preencha todos os campos corretamente.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:3000/respostas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    gym_name: academia.trim(),
                    email: email.trim(),
                    phone: phone,
                    is_client: isClient ? 1 : 0,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar resposta.");
            }

            const data = await response.json();

            console.log("Resposta salva:", data);

            navigate("/roleta");
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);

            setError("Não foi possível salvar seus dados. Tente novamente.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 py-12">
            <button
                type="button"
                onClick={() => navigate("/")}
                aria-label="Voltar para a home"
                className="absolute top-4 left-4 rounded-full p-2 text-neutral-700 transition-colors active:text-[#c9a367]"
            >
                <ArrowLeft size={22} strokeWidth={1.8} />
            </button>

            <button
                type="button"
                onClick={() => setMostrarLogin(true)}
                aria-label="Acesso restrito"
                className="absolute top-4 right-4 rounded-full p-2 text-neutral-700 transition-colors active:text-[#c9a367]"
            >
                <Settings size={22} strokeWidth={1.8} />
            </button>

            {mostrarLogin && <LoginAdmin onFechar={() => setMostrarLogin(false)} />}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="flex w-full max-w-[520px] flex-col items-center gap-4"
            >
                <Campo
                    icone={<User size={22} strokeWidth={1.8} />}
                    placeholder="NOME"
                    value={name}
                    ativo={campoAtivo === "name"}
                    onFocus={() => abrirTeclado("name")}
                />
                <Campo
                    icone={<Dumbbell size={22} strokeWidth={1.8} />}
                    placeholder="NOME DA SUA ACADEMIA"
                    value={academia}
                    ativo={campoAtivo === "academia"}
                    onFocus={() => abrirTeclado("academia")}
                />
                <Campo
                    icone={<Mail size={22} strokeWidth={1.8} />}
                    placeholder="E-MAIL"
                    value={email}
                    ativo={campoAtivo === "email"}
                    onFocus={() => abrirTeclado("email")}
                />
                <Campo
                    icone={<Phone size={22} strokeWidth={1.8} />}
                    placeholder="TELEFONE"
                    value={phone}
                    ativo={campoAtivo === "phone"}
                    onFocus={() => abrirTeclado("phone")}
                />

                {campoAtivo === "email" && (
                    <div className="grid w-full grid-cols-3 gap-2">
                        {DOMINIOS_EMAIL.map((dominio) => (
                            <button
                                key={dominio}
                                type="button"
                                onClick={() => selecionarDominio(dominio)}
                                className="rounded border border-neutral-800 bg-[#161616] px-2 py-2 text-xs text-[#c9a367]"
                            >
                                @{dominio}
                            </button>
                        ))}
                    </div>
                )}

                {campoAtivo && (
                    <div className="mt-6 flex w-full justify-center">
                        <TecladoVirtual
                            onInit={(instancia) => (keyboardRef.current = instancia)}
                            layoutName={layoutName}
                            onChange={onKeyboardChange}
                            onKeyPress={onKeyPress}
                            onFechar={fecharTeclado}
                        />
                    </div>
                )}

                <p className="mt-8 text-center text-2xl font-light text-white">
                    Já possui <span className="font-bold">Equipamentos Cimerian</span>?
                </p>

                <div className="mt-3 flex overflow-hidden rounded-md shadow-lg">
                    <button
                        type="button"
                        onClick={() => setIsClient(true)}
                        className={`w-24 py-2 text-lg transition-colors ${
                            isClient === true ? "text-white" : "bg-white text-neutral-500"
                        }`}
                        style={
                            isClient === true
                                ? { background: "linear-gradient(180deg, #d3b077, #a37c3f)" }
                                : undefined
                        }
                    >
                        sim
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsClient(false)}
                        className={`w-24 py-2 text-lg transition-colors ${
                            isClient === false ? "text-white" : "bg-white text-neutral-500"
                        }`}
                        style={
                            isClient === false
                                ? { background: "linear-gradient(180deg, #d3b077, #a37c3f)" }
                                : undefined
                        }
                    >
                        não
                    </button>
                </div>

                {error && <span className="mt-4 text-center text-red-400">{error}</span>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-[70%] rounded-md py-3 text-xl tracking-[0.1em] font-medium text-white uppercase shadow-lg transition-all active:scale-[0.98] ${
                        campoAtivo ? "mt-6" : "mt-10"
                    } ${isSubmitting ? "opacity-70" : ""}`}
                    style={{
                        background:
                            "linear-gradient(90deg, #8a6a34 0%, #b99457 35%, #a9834a 100%)",
                    }}
                >
                    {isSubmitting ? "Enviando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}
