class DashboardController {
    constructor() {
        // Mapeia os botões do menu lateral
        this.navButtons = document.querySelectorAll('.nav-btn');
        // Mapeia os botões centrais (Acessar Módulo)
        this.actionButtons = document.querySelectorAll('.action-btn');
        // Mapeia todas as seções (telas)
        this.sections = document.querySelectorAll('.module-section');
        
        // Verificação de segurança
        if(this.navButtons.length === 0) {
            console.error("Aviso: Botões do menu não encontrados no HTML.");
        }
        
        this.initEvents();
    }

    initEvents() {
        // Evento para o menu lateral
        this.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.currentTarget.getAttribute('data-target');
                console.log("Menu clicado! A mudar para a tela:", targetId);
                this.navigate(targetId);
            });
        });

        // Evento para os botões centrais dos cards
        this.actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.currentTarget.getAttribute('data-target');
                console.log("Botão de atalho clicado! A mudar para a tela:", targetId);
                this.navigate(targetId);
            });
        });
    }

    navigate(targetId) {
        // 1. Atualiza o estado visual do menu lateral
        this.navButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Oculta todas as seções
        this.sections.forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('hidden');
        });

        // 3. Exibe apenas a seção alvo
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        } else {
            console.error("Erro: A tela com o ID", targetId, "não foi encontrada.");
        }
    }
}

// Inicializa a classe controladora quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de navegação da Sprint 1 carregado com sucesso!");
    new DashboardController();
});