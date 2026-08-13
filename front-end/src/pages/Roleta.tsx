import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import FundoRoleta from "../assets/tela-roleta-totem-fitness.jpeg";
import RoletaFoto from "../assets/roleta-totem-fitness.png";

// Diferença entre dois ângulos, sempre no intervalo (-180, 180].
function diferencaAngulo(atual: number, anterior: number) {
    let delta = atual - anterior;

    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    return delta;
}

export default function Roleta() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [jaGirou, setJaGirou] = useState(false);

    const navigate = useNavigate();

    const roletaRef = useRef<HTMLDivElement>(null);

    // Estado do arrasto (em ref para não re-renderizar a cada movimento).
    const arrasto = useRef({
        ativo: false,
        anguloAnterior: 0,
        rotacaoAtual: 0,
        percorrido: 0,
        velocidade: 0, // graus por milissegundo
        tempoAnterior: 0,
    });

    const girar = (graus: number) => {
        setIsSpinning(true);
        setJaGirou(true);

        setRotation((atual) => atual + graus);

        setTimeout(() => {
            setIsSpinning(false);
        }, 3000);
    };

    const handleSpin = () => {
        if (isSpinning) return;

        girar(Math.floor(Math.random() * 4000) + 2000);
    };

    // Ângulo do ponteiro em relação ao centro da roleta.
    const anguloDoPonteiro = (clientX: number, clientY: number) => {
        const rect = roletaRef.current?.getBoundingClientRect();

        if (!rect) return 0;

        const centroX = rect.left + rect.width / 2;
        const centroY = rect.top + rect.height / 2;

        return (
            (Math.atan2(clientY - centroY, clientX - centroX) * 180) / Math.PI
        );
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isSpinning) return;

        e.currentTarget.setPointerCapture(e.pointerId);

        arrasto.current = {
            ativo: true,
            anguloAnterior: anguloDoPonteiro(e.clientX, e.clientY),
            rotacaoAtual: rotation,
            percorrido: 0,
            velocidade: 0,
            tempoAnterior: e.timeStamp,
        };

        setIsDragging(true);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const estado = arrasto.current;

        if (!estado.ativo) return;

        const angulo = anguloDoPonteiro(e.clientX, e.clientY);
        const delta = diferencaAngulo(angulo, estado.anguloAnterior);
        const tempo = e.timeStamp - estado.tempoAnterior;

        estado.rotacaoAtual += delta;
        estado.percorrido += Math.abs(delta);
        estado.anguloAnterior = angulo;

        if (tempo > 0) {
            estado.velocidade = delta / tempo;
        }

        estado.tempoAnterior = e.timeStamp;

        setRotation(estado.rotacaoAtual);
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        const estado = arrasto.current;

        if (!estado.ativo) return;

        estado.ativo = false;

        e.currentTarget.releasePointerCapture?.(e.pointerId);

        setIsDragging(false);

        // Movimento muito pequeno: trata como toque simples.
        if (estado.percorrido < 6) {
            handleSpin();
            return;
        }

        // Impulso proporcional à velocidade do arrasto, com giro mínimo.
        const impulso = estado.velocidade * 1200;
        const minimo = 720;

        if (Math.abs(impulso) < 60) return;

        const graus =
            Math.sign(impulso) *
            Math.min(Math.max(Math.abs(impulso), minimo), 6000);

        girar(graus);
    };

    // Sem nenhuma interação, volta para a home.
    useEffect(() => {
        if (jaGirou) return;

        const timer = setTimeout(() => {
            navigate("/");
        }, 60000);

        return () => clearTimeout(timer);
    }, [navigate, jaGirou]);

    // Depois de girar, deixa o resultado na tela por 10s e volta para a home.
    useEffect(() => {
        if (!jaGirou || isSpinning) return;

        const timer = setTimeout(() => {
            navigate("/");
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate, jaGirou, isSpinning]);

    return (
        <div
            className="
                relative
                h-screen
                w-full
                overflow-hidden
                bg-cover
                bg-center
                bg-no-repeat
            "
            style={{
                backgroundImage: `url(${FundoRoleta})`,
            }}
        >
            {/* Seta voltar */}
            {/* Seta voltar */}
            <NavLink
                to="/"
                className="
        absolute
        right-6
        top-6
        z-[100]
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
        hover:scale-105
        hover:bg-black/20
        active:scale-95
        sm:right-8
        sm:top-8
        sm:h-20
        sm:w-20
    "
            >
                <ArrowLeft
                    size={42}
                    strokeWidth={2.5}
                    className="scale-x-[-1] text-neutral-300"
                />
            </NavLink>

            {/* Roleta — gira no toque ou arrastando o dedo */}
            <div
                ref={roletaRef}
                className="
                    absolute
                    left-1/2
                    top-[12%]
                    z-20
                    -translate-x-1/2
                    cursor-grab
                    touch-none
                    select-none
                    active:cursor-grabbing
                "
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <img
                    src={RoletaFoto}
                    alt="Roleta"
                    draggable={false}
                    className="
                        block
                        w-[125vw]
                        max-w-none
                        object-contain
                        drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                        sm:w-[150vw]
                        md:w-[92vw]
                        lg:w-[900px]
                    "
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition:
                            isSpinning && !isDragging
                                ? "transform 3s cubic-bezier(0.15, 0, 0.15, 1)"
                                : "none",
                    }}
                />
            </div>

            {/* =========================
                PONTEIRO FIXO
            ========================= */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-[49%]
                    z-[50]
                    -translate-x-1/2
                "
            >
                <div
                    className="
                        relative
                        h-[72px]
                        w-[86px]
                        bg-white
                        drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]
                    "
                    style={{
                        clipPath:
                            "polygon(0 0, 100% 0, 100% 48%, 50% 100%, 0 48%)",
                    }}
                >
                    <div
                        className="
                            absolute
                            left-[5px]
                            top-[5px]
                            h-[62px]
                            w-[76px]
                            bg-[#d1a55e]
                        "
                        style={{
                            clipPath:
                                "polygon(0 0, 100% 0, 100% 45%, 50% 92%, 0 45%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}