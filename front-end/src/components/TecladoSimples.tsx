import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./teclado.css";

const LAYOUT = {
    default: [
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "z x c v b n m {backspace}",
        "{space}",
    ],
};

type Props = {
    /** Recebe a instância do teclado (para usar setInput/clearInput). */
    onInit: (instancia: any) => void;
    onChange: (input: string) => void;
};

export default function TecladoSimples({ onInit, onChange }: Props) {
    return (
        <div className="w-full max-w-[420px] rounded-lg border border-neutral-800 bg-[#111111] p-2.5 shadow-xl">
            <Keyboard
                keyboardRef={onInit}
                baseClass="teclado-totem"
                layout={LAYOUT}
                onChange={onChange}
                display={{
                    "{backspace}": "⌫",
                    "{space}": "Espaço",
                }}
                preventMouseDownDefault
            />
        </div>
    );
}
