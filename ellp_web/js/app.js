// Inicialização do sistema quando o Document Object Model (DOM) estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema ELLP MNG inicializado com sucesso.");
    
    // Instanciação do controlador principal de autenticação
    const authController = new AuthController();
});