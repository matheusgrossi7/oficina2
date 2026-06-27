import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

        // Verificação de segurança: Só inicializa os eventos se estiver na página do index.html
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

        if (this.btnGoogleLogin) {
            this.btnGoogleLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.processarLoginGoogle();
            });
        }
        
        if (this.btnGoogleReg) {
            this.btnGoogleReg.addEventListener('click', (e) => {
                e.preventDefault();
                this.processarLoginGoogle();
            });
        }
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
            await createUserWithEmailAndPassword(this.auth, email, senha);
            const novoUsuario = new Usuario(nome, ra, email, senha);
            
            alert("Conta criada com sucesso no sistema, senhor!");
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro detalhado no Firebase (Registro):", error);
            if (error.code === 'auth/email-already-in-use') alert("Falha no Registro, senhor: Este e-mail já está em uso.");
            else if (error.code === 'auth/weak-password') alert("Falha no Registro, senhor: A senha deve possuir ao menos 6 caracteres.");
            else alert(`Falha ao registrar, senhor: ${error.message}`);
        }
    }

    async processarLogin() {
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        try {
            await signInWithEmailAndPassword(this.auth, email, senha);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro detalhado no Firebase (Login):", error);
            if (error.code === 'auth/invalid-credential') alert("Falha ao autenticar, senhor. E-mail não cadastrado ou senha incorreta.");
            else alert(`Falha ao autenticar, senhor: ${error.message}`);
        }
    }

    async processarLoginGoogle() {
        try {
            await signInWithPopup(this.auth, this.googleProvider);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Erro detalhado no Firebase (Google):", error);
            alert(`Falha na autenticação com Google, senhor: ${error.message}`);
        }
    }
}