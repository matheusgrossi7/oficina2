class AuthController {
    constructor() {
        // Seções inteiras para ocultar/mostrar a tela completa
        this.loginSection = document.getElementById('login-section');
        this.registerSection = document.getElementById('register-section');
        
        // Formulários para interceptar o botão de Entrar/Criar
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        
        // Links de alternância
        this.btnShowRegister = document.getElementById('show-register');
        this.btnShowLogin = document.getElementById('show-login');
        
        // Botões do Google
        this.btnGoogleLogin = document.getElementById('btn-google-login');
        this.btnGoogleReg = document.getElementById('btn-google-reg');

        // Verificação de segurança
        if (!this.loginForm || !this.registerForm) {
            console.error("Erro Crítico: Formulários não encontrados no DOM. Verifique os IDs do HTML.");
            return;
        }

        this.inicializarEventos();
    }

    inicializarEventos() {
        // Alternância de telas
        this.btnShowRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarTelas(this.registerSection, this.loginSection);
        });

        this.btnShowLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarTelas(this.loginSection, this.registerSection);
        });

        // Interceptação do form de cadastro
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarRegisto();
        });

        // Interceptação do form de login
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarLogin();
        });

        // Eventos dos botões do Google
        if (this.btnGoogleLogin) {
            this.btnGoogleLogin.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'dashboard.html';
            });
        }
        
        if (this.btnGoogleReg) {
            this.btnGoogleReg.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'dashboard.html';
            });
        }
    }

    alternarTelas(telaParaMostrar, telaParaOcultar) {
        telaParaOcultar.classList.remove('active');
        telaParaOcultar.classList.add('hidden');
        
        telaParaMostrar.classList.remove('hidden');
        telaParaMostrar.classList.add('active');
    }

    processarRegisto() {
        console.log("Simulação de registro: Redirecionando para o dashboard...");
        window.location.href = 'dashboard.html';
    }

    processarLogin() {
        console.log("Simulação de login: Redirecionando para o dashboard...");
        window.location.href = 'dashboard.html';
    }
}