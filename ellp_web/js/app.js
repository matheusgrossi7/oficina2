// js/app.js

// Importações diretas do SDK modular do Firebase via CDN (Rede de Distribuição de Conteúdo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Importação do controlador de autenticação do sistema
import { AuthController } from './controller/AuthController.js';

// Configurações do Firebase do projeto ELLP (Módulo de Produção/Nuvem)
const firebaseConfig = {
  apiKey: "AIzaSyA6_ArtnzBYHe3M8iPSbMHGeK-dVVkmJCk",
  authDomain: "projetoellp.firebaseapp.com",
  projectId: "projetoellp",
  storageBucket: "projetoellp.firebasestorage.app",
  messagingSenderId: "130079492652",
  appId: "1:130079492652:web:50840e58f5b28ab1d19f89",
  measurementId: "G-B4Q34NTZYP"
};

// Inicialização dos serviços fundamentais do Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Exportação do banco de dados (Firestore) para que possa ser importado e utilizado pela classe DashboardController
export const db = getFirestore(app);

// Inicialização do sistema quando o Document Object Model (DOM) estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema ELLP MNG inicializado com sucesso e conectado à nuvem do Firebase, senhor.");
    
    // Instanciação do controlador principal de autenticação, injetando o serviço de autorização
    const authController = new AuthController(auth);
});