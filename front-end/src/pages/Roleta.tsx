import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import FundoRoleta from "../assets/tela-roleta-totem-fitness.jpeg";
import RoletaFoto from "../assets/roleta-totem-fitness.png";

export default function Roleta() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const navigate = useNavigate();

    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);

        const newRotation =
            rotation + Math.floor(Math.random() * 4000) + 2000;

        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
        }, 3000);
    };

    // Volta para a Home depois de 60 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 60000);

        return () => clearTimeout(timer);
    }, [navigate]);

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
        color="#ffffff"
        className="scale-x-[-1]"
    />
</NavLink>

            {/* Roleta */}
            <div
                className="
                    absolute
                    left-1/2
                    top-[12%]
                    z-20
                    -translate-x-1/2
                    cursor-pointer
                    select-none
                "
                onClick={handleSpin}
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
                        transition: isSpinning
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