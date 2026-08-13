const USUARIO = "cimerian";
const SENHA = "fitnessbrasil";
const CHAVE = "totem-admin";

export function validarLogin(usuario: string, senha: string) {
    return usuario.trim().toLowerCase() === USUARIO && senha.trim() === SENHA;
}

export function entrarAdmin() {
    sessionStorage.setItem(CHAVE, "1");
}

export function isAdmin() {
    return sessionStorage.getItem(CHAVE) === "1";
}

export function sairAdmin() {
    sessionStorage.removeItem(CHAVE);
}
