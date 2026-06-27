import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../app.js';
import { Usuario } from '../models/usuarios.js';

export class AuthController {
    constructor(authInstance) {
        this.auth = authInstance;
        this.googleProvider = new GoogleAuthProvider();

        this.loginSection = document.getElementById('login-section');
        this.registerSection = document.getElementById('register-section');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.btnShowRegister = document.getElementById('show-register');
        this.btnShowLogin = document.getElementById('show-login');
        this.btnGoogleLogin = document.getElementById('btn-google-login');
        this.btnGoogleReg = document.getElementById('btn-google-reg');

        if (this.loginSection && this.registerSection) {
            this.inicializarEventos();
        }
    }

    inicializarEventos() {
        this.btnShowRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarTelas(this.registerSection, this.loginSection);
        });

        this.btnShowLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarTelas(this.loginSection, this.registerSection);
        });

        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarRegisto();
        });

        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarLogin();
        });

        if (this.btnGoogleLogin) this.btnGoogleLogin.addEventListener('click', (e) => { e.preventDefault(); this.processarLoginGoogle(); });
        if (this.btnGoogleReg) this.btnGoogleReg.addEventListener('click', (e) => { e.preventDefault(); this.processarLoginGoogle(); });
    }

    alternarTelas(telaParaMostrar, telaParaOcultar) {
        telaParaOcultar.classList.remove('active');
        telaParaOcultar.classList.add('hidden');
        telaParaMostrar.classList.remove('hidden');
        telaParaMostrar.classList.add('active');
    }

    async processarRegisto() {
        const nome = document.getElementById('reg-nome').value;
        const ra = document.getElementById('reg-ra').value;
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;

        try {
            const credencial = await createUserWithEmailAndPassword(this.auth, email, senha);
            
            // Gravação obrigatória no Firestore para aparecer na Gestão de Usuários
            await setDoc(doc(db, "usuarios", credencial.user.uid), {
                nome: nome,
                ra: ra,
                email: email,
                papel: "Voluntário"
            });
            
            alert("Conta criada com sucesso, senhor!");
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro no Registro:", error);
            alert(`Falha ao registrar, senhor: ${error.message}`);
        }
    }

    async processarLogin() {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        try {
            await signInWithEmailAndPassword(this.auth, email, senha);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro no Login:", error);
            alert("Falha ao autenticar, senhor.");
        }
    }

    async processarLoginGoogle() {
        try {
            const credencial = await signInWithPopup(this.auth, this.googleProvider);
            // Gravação automática para logins Google
            await setDoc(doc(db, "usuarios", credencial.user.uid), {
                nome: credencial.user.displayName || "Usuário Google",
                ra: "N/A",
                email: credencial.user.email,
                papel: "Voluntário"
            }, { merge: true });
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro no Google:", error);
            alert(`Falha na autenticação: ${error.message}`);
        }
    }
}