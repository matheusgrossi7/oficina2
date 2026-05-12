class AuthController {
    constructor() {
        // Mapeamento dos elementos da interface
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.btnShowRegister = document.getElementById('show-register');
        this.btnShowLogin = document.getElementById('show-login');
        this.btnGoogle = document.getElementById('btn-google'); // Mapeamento do botão Google

        // Verificação de segurança: se os elementos não existirem, alerta o programador
        if (!this.loginForm || !this.registerForm) {
            console.error("Erro Crítico: Formulários não encontrados no DOM. Verifique o HTML.");
            return;
        }

        // Inicialização dos eventos
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Alternância de formulários
        this.btnShowRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarFormularios(this.registerForm, this.loginForm);
        });

        this.btnShowLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.alternarFormularios(this.loginForm, this.registerForm);
        });

        // Interceção da submissão de registo
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página
            this.processarRegisto();
        });

        // Interceção da submissão de login
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página
            this.processarLogin();
        });

        // Evento exclusivo para o botão do Google
        if (this.btnGoogle) {
            this.btnGoogle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Mock Sprint 1: Login com Google clicado.");
                window.location.href = 'dashboard.html';
            });
        }
    }

    alternarFormularios(formParaMostrar, formParaOcultar) {
        formParaOcultar.classList.remove('active');
        formParaOcultar.classList.add('hidden');
        
        formParaMostrar.classList.remove('hidden');
        formParaMostrar.classList.add('active');
    }

    processarRegisto() {
        console.log("Modo de visualização ativado. Redirecionando sem validação...");
        this.registerForm.reset();
        window.location.href = 'dashboard.html';
    }

    processarLogin() {
        console.log("Modo de visualização ativado. Redirecionando sem validação de credenciais...");
        // Redirecionamento direto e incondicional para a página do painel
        window.location.href = 'dashboard.html';
    }
}