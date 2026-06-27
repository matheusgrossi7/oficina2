import { collection, addDoc, getDocs, updateDoc, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db } from '../app.js';

class DashboardController {
    constructor() {
        this.auth = getAuth();
        this.isAdmin = false; 
        this.emailCoordenador = "coordenador@ellp.com";

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
        this.oficinaEditandoId = null;
        this.alunosCache = []; 
        this.oficinasCache = [];

        this.init();
    }

    async init() {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "usuarios", user.uid));
                if (userDoc.exists()) {
                    this.isAdmin = (userDoc.data().papel === 'Administrador' || user.email === this.emailCoordenador);
                } else if (user.email === this.emailCoordenador) {
                    this.isAdmin = true;
                }
                
                this.initEvents();
                this.carregarDadosIniciais();
                this.aplicarHierarquia();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    aplicarHierarquia() {
        if (!this.isAdmin && this.formAluno) this.formAluno.parentElement.style.display = 'none';
        if (!this.isAdmin && this.formOficina) this.formOficina.parentElement.style.display = 'none';
    }

    initEvents() {
        this.navButtons.forEach(btn => btn.addEventListener('click', (e) => this.navigate(e.currentTarget.getAttribute('data-target'))));
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-salvar-papel') && this.isAdmin) this.atualizarPapel(e.target.getAttribute('data-id'));
            if (e.target.classList.contains('btn-editar-aluno') && this.isAdmin) this.prepararEdicaoAluno(e.target.getAttribute('data-id'));
            if (e.target.classList.contains('btn-editar-oficina') && this.isAdmin) this.prepararEdicaoOficina(e.target.getAttribute('data-id'));
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
        await this.carregarOficinas();
        await this.carregarAlunosDoBanco();
    }

    // --- MÓDULO USUÁRIOS ---
    async carregarUsuarios() {
        if (!this.tabelaUsuarios) return;
        const snap = await getDocs(collection(db, "usuarios"));
        this.tabelaUsuarios.innerHTML = '';
        snap.forEach(d => {
            const u = d.data();
            const acao = this.isAdmin 
                ? `<td><select id="papel-${d.id}"><option value="Voluntário" ${u.papel === 'Voluntário' ? 'selected' : ''}>Voluntário</option><option value="Administrador" ${u.papel === 'Administrador' ? 'selected' : ''}>Administrador</option></select></td>
                   <td><button class="btn-primary btn-small btn-salvar-papel" data-id="${d.id}">Salvar</button></td>`
                : `<td>${u.papel}</td><td>-</td>`;
            this.tabelaUsuarios.innerHTML += `<tr><td>${u.nome}</td><td>${u.ra}</td><td>${u.email}</td>${acao}</tr>`;
        });
    }

    async atualizarPapel(id) {
        if (!this.isAdmin) return;
        await updateDoc(doc(db, "usuarios", id), { papel: document.getElementById(`papel-${id}`).value });
        alert("Permissão atualizada, senhor.");
    }

    // --- MÓDULO ALUNOS ---
    async salvarAluno() {
        if (!this.isAdmin) return;
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
            const acao = this.isAdmin ? `<td><button class="btn-primary btn-small btn-editar-aluno" data-id="${a.id}">Editar</button></td>` : '<td>-</td>';
            this.tabelaAlunos.innerHTML += `<tr><td>${a.nome}</td><td>${a.oficina}</td><td>${a.status}</td><td>${a.contato}</td>${acao}</tr>`;
        });
    }

    prepararEdicaoAluno(id) {
        if (!this.isAdmin) return;
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

    // --- OFICINAS ---
    async salvarOficina() {
        if (!this.isAdmin) return;
        
        const dados = { 
            nome: document.getElementById('oficina-nome').value, 
            cargaHoraria: parseInt(document.getElementById('oficina-carga').value)
        };

        if (this.oficinaEditandoId) {
            await updateDoc(doc(db, "oficinas", this.oficinaEditandoId), dados);
            this.oficinaEditandoId = null;
            const btn = this.formOficina.querySelector('button[type="submit"]');
            if (btn) btn.innerText = "Criar Oficina";
        } else {
            await addDoc(collection(db, "oficinas"), dados);
        }

        alert("Oficina processada, senhor.");
        this.formOficina.reset();
        await this.carregarOficinas();
    }

    async carregarOficinas() {
        const snap = await getDocs(collection(db, "oficinas"));
        this.oficinasCache = [];
        
        if (this.listaOficinas) this.listaOficinas.innerHTML = '';
        let htmlSelect = '<option value="">Selecione...</option>';

        snap.forEach(d => { 
            const o = d.data(); 
            o.id = d.id;
            this.oficinasCache.push(o);
            htmlSelect += `<option value="${o.nome}">${o.nome}</option>`;
            
            if (this.listaOficinas) {
                const acao = this.isAdmin ? `<button class="btn-primary btn-small btn-editar-oficina" data-id="${d.id}" style="margin-left: 10px;">Editar</button>` : '';
                this.listaOficinas.innerHTML += `<li>${o.nome} - Carga: ${o.cargaHoraria}h (${o.cargaHoraria} aulas) ${acao}</li>`;
            }
        });

        if (this.selectAlunoOficina) this.selectAlunoOficina.innerHTML = htmlSelect;
        if (this.selectOficinaFreq) this.selectOficinaFreq.innerHTML = htmlSelect;
    }

    prepararEdicaoOficina(id) {
        if (!this.isAdmin) return;
        const o = this.oficinasCache.find(x => x.id === id);
        if (!o) return;
        document.getElementById('oficina-nome').value = o.nome;
        document.getElementById('oficina-carga').value = o.cargaHoraria;
        
        this.oficinaEditandoId = id;
        const btn = this.formOficina.querySelector('button[type="submit"]');
        if (btn) btn.innerText = "Atualizar Oficina";
    }

    // --- FREQUÊNCIA ---
    carregarListaChamada() {
        this.tabelaFrequencia.innerHTML = '';
        this.alunosCache.filter(a => a.oficina === this.selectOficinaFreq.value && a.status === 'Ativo').forEach(a => {
            this.tabelaFrequencia.innerHTML += `<tr><td class="nome-aluno-freq">${a.nome}</td><td><select class="status-freq"><option>Presente</option><option>Ausente</option></select></td></tr>`;
        });
        this.btnSalvarFrequencia.classList.remove('hidden');
    }

    async salvarListaPresenca() {
        const dataEscolhida = document.getElementById('freq-data').value;
        const oficinaEscolhida = this.selectOficinaFreq.value;

        // Regra de Proteção 1: Evitar listas duplicadas no mesmo dia
        const qDia = query(collection(db, "frequencias"), where("data", "==", dataEscolhida), where("oficina", "==", oficinaEscolhida));
        const snapDia = await getDocs(qDia);
        if (!snapDia.empty) {
            alert("Erro: Já existe uma lista de presença salva para esta turma na data escolhida, senhor. Não é possível registrar presenças duplicadas.");
            return;
        }

        // Regra de Proteção 2: Limite máximo de aulas (Carga Horária)
        const oficinaRef = this.oficinasCache.find(x => x.nome === oficinaEscolhida);
        const limiteAulas = oficinaRef ? parseInt(oficinaRef.cargaHoraria) : 0;

        const qTotal = query(collection(db, "frequencias"), where("oficina", "==", oficinaEscolhida));
        const snapTotal = await getDocs(qTotal);

        if (snapTotal.size >= limiteAulas) {
            alert(`Aviso: A oficina "${oficinaEscolhida}" já alcançou o limite máximo de ${limiteAulas} aulas ministradas, senhor. Não é possível exceder a carga horária estabelecida.`);
            return;
        }

        await addDoc(collection(db, "frequencias"), {
            data: dataEscolhida,
            oficina: oficinaEscolhida,
            chamada: Array.from(this.tabelaFrequencia.querySelectorAll('tr')).map(tr => ({
                aluno: tr.querySelector('.nome-aluno-freq').innerText,
                status: tr.querySelector('.status-freq').value
            }))
        });
        
        alert("Lista salva com sucesso, senhor!");
        this.btnSalvarFrequencia.classList.add('hidden');
        this.tabelaFrequencia.innerHTML = '';
    }

    // --- CERTIFICADOS ---
    async carregarCertificados() {
        const snap = await getDocs(collection(db, "frequencias"));
        const mapa = {};
        
        const totalAulasPorOficina = {};
        this.oficinasCache.forEach(o => totalAulasPorOficina[o.nome] = o.cargaHoraria || 1);

        snap.forEach(d => {
            d.data().chamada.forEach(c => {
                const k = `${c.aluno}|${d.data().oficina}`;
                if (!mapa[k]) mapa[k] = { nome: c.aluno, oficina: d.data().oficina, pres: 0 };
                if (c.status === 'Presente') mapa[k].pres++;
            });
        });
        
        this.tabelaCertificados.innerHTML = '';
        for (const k in mapa) {
            const totalAulas = totalAulasPorOficina[mapa[k].oficina];
            const pct = (mapa[k].pres / totalAulas) * 100;
            
            if (pct >= 75) {
                this.tabelaCertificados.innerHTML += `<tr><td>${mapa[k].nome}</td><td>${mapa[k].oficina}</td><td>${pct.toFixed(0)}% (${mapa[k].pres}/${totalAulas})</td><td><button class="btn-primary btn-small btn-gerar-pdf" data-nome="${mapa[k].nome}" data-oficina="${mapa[k].oficina}">PDF</button></td></tr>`;
            }
        }
    }

    gerarPDF(n, o) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        // Design: Borda Exterior
        doc.setLineWidth(1.5);
        doc.setDrawColor(41, 128, 185); // Tom de azul profissional
        doc.rect(10, 10, 277, 190);
        
        // Design: Borda Interior Fina
        doc.setLineWidth(0.5);
        doc.rect(12, 12, 273, 186);

        // Título Principal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(36);
        doc.setTextColor(41, 128, 185);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 60, { align: "center" });

        // Subtítulo
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.setTextColor(50, 50, 50);
        doc.text("Certificamos que", 148.5, 95, { align: "center" });

        // Nome em Destaque
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text(n, 148.5, 115, { align: "center" });

        // Descrição do Curso
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        doc.text(`concluiu com êxito a oficina de ${o},`, 148.5, 135, { align: "center" });
        doc.text("cumprindo rigorosamente a carga horária e frequência exigidas pelo projeto ELLP.", 148.5, 145, { align: "center" });

        // Assinatura
        doc.setDrawColor(0, 0, 0);
        doc.line(100, 175, 197, 175);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Coordenação ELLP", 148.5, 182, { align: "center" });

        // Exportação
        doc.save(`Certificado_${n.replace(/\s+/g, '_')}.pdf`);
    }
}

document.addEventListener('DOMContentLoaded', () => { new DashboardController(); });