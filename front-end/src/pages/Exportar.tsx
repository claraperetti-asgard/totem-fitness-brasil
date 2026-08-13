import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import logo from "../assets/logo-cimerian-branco.png";
import { isAdmin, sairAdmin } from "../auth";

const API_URL = "http://localhost:3000";

type Resposta = {
    id: number;
    name: string;
    gym_name: string;
    email: string;
    phone: string;
    is_client: number;
};

export default function Exportar() {
    const navigate = useNavigate();

    const [respostas, setRespostas] = useState<Resposta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function carregarRespostas() {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/respostas`);

            if (!response.ok) {
                throw new Error("Erro ao buscar respostas.");
            }

            const data = await response.json();

            setRespostas(data);
        } catch (error) {
            console.error("Erro ao carregar respostas:", error);

            setError("Não foi possível carregar os dados. Verifique se o servidor está rodando.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // Página restrita: sem login válido, volta para a home.
        if (!isAdmin()) {
            navigate("/", { replace: true });
            return;
        }

        carregarRespostas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function exportarPlanilha() {
        window.open(`${API_URL}/respostas/exportar`, "_blank");
    }

    function voltarParaHome() {
        sairAdmin();
        navigate("/");
    }

    return (
        <div className="relative min-h-screen w-full bg-black px-6 py-12">
            <button
                type="button"
                onClick={voltarParaHome}
                aria-label="Voltar para a home"
                className="absolute top-4 left-4 rounded-full p-2 text-neutral-500 transition-colors active:text-[#c9a367]"
            >
                <ArrowLeft size={26} strokeWidth={1.8} />
            </button>

            <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-col gap-6">
                <div className="flex justify-center">
                    <img
                        src={logo}
                        alt="Cimerian"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between mt-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase">
                            Participantes
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            {respostas.length} registro(s) cadastrado(s)
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={carregarRespostas}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-md border border-neutral-800 bg-[#161616] px-4 py-3 text-sm tracking-[0.1em] text-[#c9a367] uppercase transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            <RefreshCw size={18} strokeWidth={1.8} />
                            Atualizar
                        </button>

                        <button
                            type="button"
                            onClick={exportarPlanilha}
                            disabled={respostas.length === 0}
                            className="flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium tracking-[0.1em] text-white uppercase shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(90deg, #8a6a34 0%, #b99457 35%, #a9834a 100%)",
                            }}
                        >
                            <Download size={18} strokeWidth={1.8} />
                            Exportar planilha
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md border border-red-900 bg-[#1a0d0d] px-4 py-3 text-red-400">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto rounded-md border border-neutral-800 bg-[#0f0f0f]">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800 text-[#c9a367] uppercase">
                                <th className="px-4 py-3 font-medium">ID</th>
                                <th className="px-4 py-3 font-medium">Nome</th>
                                <th className="px-4 py-3 font-medium">Academia</th>
                                <th className="px-4 py-3 font-medium">E-mail</th>
                                <th className="px-4 py-3 font-medium">Telefone</th>
                                <th className="px-4 py-3 font-medium">Cliente?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                                        Carregando...
                                    </td>
                                </tr>
                            )}

                            {!isLoading && respostas.length === 0 && !error && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                                        Nenhuma resposta cadastrada.
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                respostas.map((resposta) => (
                                    <tr
                                        key={resposta.id}
                                        className="border-b border-neutral-900 text-neutral-200 last:border-b-0"
                                    >
                                        <td className="px-4 py-3">{resposta.id}</td>
                                        <td className="px-4 py-3">{resposta.name}</td>
                                        <td className="px-4 py-3">{resposta.gym_name}</td>
                                        <td className="px-4 py-3">{resposta.email}</td>
                                        <td className="px-4 py-3">{resposta.phone}</td>
                                        <td className="px-4 py-3">
                                            {resposta.is_client === 1 ? "SIM" : "NÃO"}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
