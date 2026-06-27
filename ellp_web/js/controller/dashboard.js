import { collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db } from '../app.js';

class DashboardController {
    constructor() {
        this.auth = getAuth();
        this.emailCoordenador = "coordenador@ellp.com";
        this.isCoordenador = false;

        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sections = document.querySelectorAll('.module-section');
        this.tabelaUsuarios = document.getElementById('tabela-usuarios');
        this.tabelaAlunos = document.getElementById('tabela-alunos');
        this.tabelaFrequencia = document.getElementById('tabela-frequencia');
        this.tabelaCertificados = document.getElementById('tabela-certificados');
        this.btnLogout = document.getElementById('btn-logout');
        
        this.formAluno = document.getElementById('form-aluno');
        this.btnSalvarAluno = document.getElementById('btn-salvar-aluno');
        this.btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
        this.searchInput = document.getElementById('search-aluno');
        this.filterStatus = document.getElementById('filter-status');
        
        this.formOficina = document.getElementById('form-oficina');
        this.listaOficinas = document.getElementById('lista-oficinas');
        this.selectAlunoOficina = document.getElementById('aluno-oficina');
        this.formFrequencia = document.getElementById('form-frequencia-filtro');
        this.selectOficinaFreq = document.getElementById('freq-oficina');
        this.btnSalvarFrequencia = document.getElementById('btn-salvar-frequencia');

        this.alunoEditandoId = null;
        this.alunosCache = []; 

        this.init();
    }

    init() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.isCoordenador = (user.email === this.emailCoordenador);
                this.initEvents();
                this.carregarDadosIniciais();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    initEvents() {
        this.navButtons.forEach(btn => btn.addEventListener('click', (e) => this.navigate(e.currentTarget.getAttribute('data-target'))));
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-salvar-papel') && this.isCoordenador) this.atualizarPapel(e.target.getAttribute('data-id'));
            if (e.target.classList.contains('btn-editar-aluno') && this.isCoordenador) this.prepararEdicaoAluno(e.target.getAttribute('data-id'));
            if (e.target.classList.contains('btn-gerar-pdf')) this.gerarPDF(e.target.getAttribute('data-nome'), e.target.getAttribute('data-oficina'));
        });
        
        this.btnLogout?.addEventListener('click', async () => { await signOut(this.auth); window.location.href = 'index.html'; });
        this.formAluno?.addEventListener('submit', (e) => { e.preventDefault(); this.salvarAluno(); });
        this.btnCancelarEdicao?.addEventListener('click', (e) => { e.preventDefault(); this.cancelarEdicaoAluno(); });
        this.searchInput?.addEventListener('input', () => this.renderizarTabelaAlunos());
        this.filterStatus?.addEventListener('change', () => this.renderizarTabelaAlunos());
        this.formOficina?.addEventListener('submit', (e) => { e.preventDefault(); this.salvarOficina(); });
        this.formFrequencia?.addEventListener('submit', (e) => { e.preventDefault(); this.carregarListaChamada(); });
        this.btnSalvarFrequencia?.addEventListener('click', (e) => { e.preventDefault(); this.salvarListaPresenca(); });
    }

    navigate(targetId) {
        this.navButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-target') === targetId));
        this.sections.forEach(sec => {
            sec.classList.toggle('hidden', sec.id !== targetId);
            sec.classList.toggle('active', sec.id === targetId);
        });
        if (targetId === 'view-usuarios') this.carregarUsuarios();
        if (targetId === 'view-certificados') this.carregarCertificados();
    }

    async carregarDadosIniciais() {
        await this.carregarOpcoesOficina(); 
        await this.carregarAlunosDoBanco();
        await this.carregarOficinas();
    }

    // --- MÓDULO USUÁRIOS ---
    async carregarUsuarios() {
        if (!this.tabelaUsuarios) return;
        const snap = await getDocs(collection(db, "usuarios"));
        this.tabelaUsuarios.innerHTML = '';
        snap.forEach(d => {
            const u = d.data();
            // Apenas coordenador vê a opção de alterar papel
            const acao = this.isCoordenador 
                ? `<td><select id="papel-${d.id}"><option value="Voluntário" ${u.papel === 'Voluntário' ? 'selected' : ''}>Voluntário</option><option value="Administrador" ${u.papel === 'Administrador' ? 'selected' : ''}>Administrador</option></select></td>
                   <td><button class="btn-primary btn-small btn-salvar-papel" data-id="${d.id}">Salvar</button></td>`
                : `<td>${u.papel}</td><td>-</td>`;
            this.tabelaUsuarios.innerHTML += `<tr><td>${u.nome}</td><td>${u.ra}</td><td>${u.email}</td>${acao}</tr>`;
        });
    }

    async atualizarPapel(id) {
        await updateDoc(doc(db, "usuarios", id), { papel: document.getElementById(`papel-${id}`).value });
        alert("Permissão atualizada, senhor.");
    }

    // --- MÓDULO ALUNOS ---
    async salvarAluno() {
        if (!this.isCoordenador) { alert("Apenas coordenadores podem editar alunos, senhor."); return; }
        const dados = {
            nome: document.getElementById('aluno-nome').value,
            idade: parseInt(document.getElementById('aluno-idade').value),
            escola: document.getElementById('aluno-escola').value,
            contato: document.getElementById('aluno-contato').value,
            oficina: document.getElementById('aluno-oficina').value,
            status: document.getElementById('aluno-status').value
        };
        if (this.alunoEditandoId) {
            await updateDoc(doc(db, "alunos", this.alunoEditandoId), dados);
            this.cancelarEdicaoAluno();
        } else {
            dados.dataCadastro = new Date();
            await addDoc(collection(db, "alunos"), dados);
        }
        await this.carregarAlunosDoBanco();
        alert("Aluno processado, senhor.");
    }

    async carregarAlunosDoBanco() {
        if (!this.tabelaAlunos) return;
        const snap = await getDocs(collection(db, "alunos"));
        this.alunosCache = [];
        snap.forEach(d => { const a = d.data(); a.id = d.id; this.alunosCache.push(a); });
        this.renderizarTabelaAlunos();
    }

    renderizarTabelaAlunos() {
        if (!this.tabelaAlunos) return;
        this.tabelaAlunos.innerHTML = '';
        const termo = this.searchInput.value.toLowerCase();
        const status = this.filterStatus.value;
        this.alunosCache.filter(a => (a.nome.toLowerCase().includes(termo)) && (status === 'Todos' || a.status === status))
        .forEach(a => {
            // Todos veem a lista, apenas coordenador vê botão editar
            const acao = this.isCoordenador ? `<td><button class="btn-primary btn-small btn-editar-aluno" data-id="${a.id}">Editar</button></td>` : '<td>-</td>';
            this.tabelaAlunos.innerHTML += `<tr><td>${a.nome}</td><td>${a.oficina}</td><td>${a.status}</td><td>${a.contato}</td>${acao}</tr>`;
        });
    }

    prepararEdicaoAluno(id) {
        if (!this.isCoordenador) return;
        const a = this.alunosCache.find(x => x.id === id);
        if (!a) return;
        document.getElementById('aluno-nome').value = a.nome;
        document.getElementById('aluno-idade').value = a.idade;
        document.getElementById('aluno-escola').value = a.escola;
        document.getElementById('aluno-contato').value = a.contato;
        document.getElementById('aluno-oficina').value = a.oficina;
        document.getElementById('aluno-status').value = a.status;
        this.alunoEditandoId = id;
        this.btnSalvarAluno.innerText = "Atualizar";
        this.btnCancelarEdicao.classList.remove('hidden');
    }

    cancelarEdicaoAluno() {
        this.alunoEditandoId = null;
        this.formAluno.reset();
        this.btnSalvarAluno.innerText = "Salvar Aluno";
        this.btnCancelarEdicao.classList.add('hidden');
    }

    // --- OFICINAS E FREQUÊNCIA ---
    async salvarOficina() {
        if (!this.isCoordenador) return;
        await addDoc(collection(db, "oficinas"), { 
            nome: document.getElementById('oficina-nome').value, 
            cargaHoraria: parseInt(document.getElementById('oficina-carga').value) 
        });
        alert("Oficina criada, senhor.");
        await this.carregarOficinas();
        await this.carregarOpcoesOficina();
    }

    async carregarOficinas() {
        if (!this.listaOficinas) return;
        const snap = await getDocs(collection(db, "oficinas"));
        this.listaOficinas.innerHTML = '';
        snap.forEach(d => { const o = d.data(); this.listaOficinas.innerHTML += `<li>${o.nome} - ${o.cargaHoraria}h</li>`; });
    }

    async carregarOpcoesOficina() {
        const snap = await getDocs(collection(db, "oficinas"));
        let html = '<option value="">Selecione...</option>';
        snap.forEach(d => { html += `<option value="${d.data().nome}">${d.data().nome}</option>`; });
        if (this.selectAlunoOficina) this.selectAlunoOficina.innerHTML = html;
        if (this.selectOficinaFreq) this.selectOficinaFreq.innerHTML = html;
    }

    carregarListaChamada() {
        this.tabelaFrequencia.innerHTML = '';
        this.alunosCache.filter(a => a.oficina === this.selectOficinaFreq.value && a.status === 'Ativo').forEach(a => {
            this.tabelaFrequencia.innerHTML += `<tr><td class="nome-aluno-freq">${a.nome}</td><td><select class="status-freq"><option>Presente</option><option>Ausente</option></select></td></tr>`;
        });
        this.btnSalvarFrequencia.classList.remove('hidden');
    }

    async salvarListaPresenca() {
        await addDoc(collection(db, "frequencias"), {
            data: document.getElementById('freq-data').value,
            oficina: this.selectOficinaFreq.value,
            chamada: Array.from(this.tabelaFrequencia.querySelectorAll('tr')).map(tr => ({
                aluno: tr.querySelector('.nome-aluno-freq').innerText,
                status: tr.querySelector('.status-freq').value
            }))
        });
        alert("Lista salva, senhor!");
        this.btnSalvarFrequencia.classList.add('hidden');
    }

    // --- CERTIFICADOS ---
    async carregarCertificados() {
        const snap = await getDocs(collection(db, "frequencias"));
        const mapa = {};
        snap.forEach(d => {
            d.data().chamada.forEach(c => {
                const k = `${c.aluno}|${d.data().oficina}`;
                if (!mapa[k]) mapa[k] = { nome: c.aluno, oficina: d.data().oficina, total: 0, pres: 0 };
                mapa[k].total++;
                if (c.status === 'Presente') mapa[k].pres++;
            });
        });
        this.tabelaCertificados.innerHTML = '';
        for (const k in mapa) {
            const pct = (mapa[k].pres / mapa[k].total) * 100;
            if (pct >= 75) this.tabelaCertificados.innerHTML += `<tr><td>${mapa[k].nome}</td><td>${mapa[k].oficina}</td><td>${pct.toFixed(0)}%</td><td><button class="btn-primary btn-small btn-gerar-pdf" data-nome="${mapa[k].nome}" data-oficina="${mapa[k].oficina}">PDF</button></td></tr>`;
        }
    }

    gerarPDF(n, o) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        doc.text("CERTIFICADO: " + n + " - " + o, 20, 20);
        doc.save(`Certificado_${n}.pdf`);
    }
}

document.addEventListener('DOMContentLoaded', () => { new DashboardController(); });