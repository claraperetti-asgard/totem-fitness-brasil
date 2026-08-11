import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./teclado.css";

export type LayoutTeclado = "default" | "shift" | "numeros";

const LAYOUTS = {
    default: [
        "1 2 3 4 5 6 7 8 9 0",
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "{shift} z x c v b n m {backspace}",
        "@ . _ - .com {space}",
    ],
    shift: [
        "! @ # $ % ¨ & * ( )",
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "{shift} Z X C V B N M {backspace}",
        "@ . _ - .com {space}",
    ],
    numeros: ["1 2 3", "4 5 6", "7 8 9", "0 {backspace}"],
};

type Props = {
    /** Recebe a instância do teclado (para usar setInput/clearInput). */
    onInit: (instancia: any) => void;
    layoutName: LayoutTeclado;
    onChange: (input: string) => void;
    onKeyPress: (button: string) => void;
    onFechar: () => void;
};

export default function TecladoVirtual({
    onInit,
    layoutName,
    onChange,
    onKeyPress,
    onFechar,
}: Props) {
    const numerico = layoutName === "numeros";

    return (
        <div
            className={`w-full rounded-lg border border-neutral-800 bg-[#111111] p-2.5 shadow-xl ${
                numerico ? "max-w-[240px]" : "max-w-[520px]"
            }`}
        >
            <div className="mb-2 flex justify-end">
                <button
                    type="button"
                    onClick={onFechar}
                    className="rounded px-3 py-1 text-[11px] tracking-[0.1em] font-medium text-white uppercase"
                    style={{ background: "linear-gradient(90deg, #8a6a34, #b99457)" }}
                >
                    Fechar
                </button>
            </div>

            <Keyboard
                keyboardRef={onInit}
                baseClass={numerico ? "teclado-totem teclado-numerico" : "teclado-totem"}
                layoutName={layoutName}
                layout={LAYOUTS}
                onChange={onChange}
                onKeyPress={onKeyPress}
                display={{
                    "{backspace}": "⌫",
                    "{shift}": "⇧",
                    "{space}": "Espaço",
                }}
                buttonTheme={
                    layoutName === "shift"
                        ? [{ class: "hg-button-shift-ativo", buttons: "{shift}" }]
                        : []
                }
                preventMouseDownDefault
            />
        </div>
    );
}
