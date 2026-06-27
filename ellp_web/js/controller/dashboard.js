import { collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db } from '../app.js';

class DashboardController {
    constructor() {
        this.auth = getAuth();
        this.emailCoordenador = "coordenador@ellp.com"; // Definição da conta master

        this.navButtons = document.querySelectorAll('.nav-btn');
        this.actionButtons = document.querySelectorAll('.action-btn');
        this.sections = document.querySelectorAll('.module-section');
        this.btnLogout = document.getElementById('btn-logout');
        
        this.tabelaUsuarios = document.getElementById('tabela-usuarios');
        
        this.formAluno = document.getElementById('form-aluno');
        this.tabelaAlunos = document.getElementById('tabela-alunos');
        this.selectAlunoOficina = document.getElementById('aluno-oficina');
        this.searchInput = document.getElementById('search-aluno');
        this.filterStatus = document.getElementById('filter-status');
        this.btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
        this.tituloFormAluno = document.getElementById('titulo-form-aluno');
        this.btnSalvarAluno = document.getElementById('btn-salvar-aluno');
        
        this.alunoEditandoId = null;
        this.alunosCache = []; 
        
        this.formOficina = document.getElementById('form-oficina');
        this.listaOficinas = document.getElementById('lista-oficinas');
        
        this.formFrequencia = document.getElementById('form-frequencia-filtro');
        this.selectOficinaFreq = document.getElementById('freq-oficina');
        this.tabelaFrequencia = document.getElementById('tabela-frequencia');
        this.btnSalvarFrequencia = document.getElementById('btn-salvar-frequencia');
        this.tabelaCertificados = document.getElementById('tabela-certificados');

        this.verificarAcesso();
    }

    // Valida o acesso e aplica a hierarquia
    verificarAcesso() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.aplicarHierarquia(user.email);
                this.initEvents();
                this.carregarDadosIniciais();
            } else {
                // Bloqueia acesso direto sem login
                window.location.href = 'index.html';
            }
        });
    }

    aplicarHierarquia(emailAtual) {
        const navAdmin = document.querySelector('.btn-admin-only');
        const cardAdmin = document.querySelector('.card-admin-only');

        if (emailAtual !== this.emailCoordenador) {
            // Oculta módulos administrativos para Voluntários
            if (navAdmin) navAdmin.style.display = 'none';
            if (cardAdmin) cardAdmin.style.display = 'none';
        } else {
            // Carrega lista de utilizadores caso seja o Coordenador
            this.carregarUsuarios();
        }
    }

    initEvents() {
        this.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(e.currentTarget.getAttribute('data-target'));
            });
        });

        this.actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(e.currentTarget.getAttribute('data-target'));
            });
        });

        if (this.btnLogout) {
            this.btnLogout.addEventListener('click', async () => {
                await signOut(this.auth);
                window.location.href = 'index.html';
            });
        }

        if (this.formAluno) {
            this.formAluno.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarAluno();
            });
        }

        if (this.btnCancelarEdicao) {
            this.btnCancelarEdicao.addEventListener('click', (e) => {
                e.preventDefault();
                this.cancelarEdicaoAluno();
            });
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.renderizarTabelaAlunos());
        }
        if (this.filterStatus) {
            this.filterStatus.addEventListener('change', () => this.renderizarTabelaAlunos());
        }

        if (this.formOficina) {
            this.formOficina.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarOficina();
            });
        }

        if (this.formFrequencia) {
            this.formFrequencia.addEventListener('submit', (e) => {
                e.preventDefault();
                this.carregarListaChamada();
            });
        }

        if (this.btnSalvarFrequencia) {
            this.btnSalvarFrequencia.addEventListener('click', (e) => {
                e.preventDefault();
                this.salvarListaPresenca();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('btn-editar-aluno')) {
                const id = e.target.getAttribute('data-id');
                this.prepararEdicaoAluno(id);
            }
            if (e.target && e.target.classList.contains('btn-gerar-pdf')) {
                const nome = e.target.getAttribute('data-nome');
                const oficina = e.target.getAttribute('data-oficina');
                this.gerarCertificadoPDF(nome, oficina);
            }
            if (e.target && e.target.classList.contains('btn-salvar-papel')) {
                const id = e.target.getAttribute('data-id');
                this.atualizarPapelUsuario(id);
            }
        });
    }

    navigate(targetId) {
        this.navButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        this.sections.forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('hidden');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            if (targetId === 'view-certificados') this.carregarCertificados();
        }
    }

    async carregarDadosIniciais() {
        await this.carregarOpcoesOficina(); 
        await this.carregarAlunosDoBanco();
        await this.carregarOficinas();
    }

    // --- MÓDULO DE USUÁRIOS (ADMIN) ---
    async carregarUsuarios() {
        if (!this.tabelaUsuarios) return;
        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            this.tabelaUsuarios.innerHTML = '';
            
            querySnapshot.forEach((docSnap) => {
                const usr = docSnap.data();
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${usr.nome}</td>
                    <td>${usr.ra}</td>
                    <td>${usr.email}</td>
                    <td>
                        <select id="papel-${docSnap.id}">
                            <option value="Voluntário" ${usr.papel === 'Voluntário' ? 'selected' : ''}>Voluntário</option>
                            <option value="Administrador" ${usr.papel === 'Administrador' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </td>
                    <td><button class="btn-primary btn-small btn-salvar-papel" data-id="${docSnap.id}">Salvar</button></td>
                `;
                this.tabelaUsuarios.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async atualizarPapelUsuario(id) {
        const novoPapel = document.getElementById(`papel-${id}`).value;
        try {
            await updateDoc(doc(db, "usuarios", id), { papel: novoPapel });
            alert("Permissão atualizada com sucesso, senhor.");
        } catch (error) {
            console.error(error);
            alert("Falha ao atualizar o papel do utilizador.");
        }
    }

    // --- MÓDULO DE GESTÃO DE ALUNOS ---
    async salvarAluno() {
        const nome = document.getElementById('aluno-nome').value;
        const idade = document.getElementById('aluno-idade').value;
        const escola = document.getElementById('aluno-escola').value;
        const contato = document.getElementById('aluno-contato').value;
        const oficina = document.getElementById('aluno-oficina').value;
        const status = document.getElementById('aluno-status').value;

        const dadosAluno = {
            nome: nome, idade: parseInt(idade), escola: escola, 
            contato: contato, oficina: oficina, status: status
        };

        try {
            if (this.alunoEditandoId) {
                await updateDoc(doc(db, "alunos", this.alunoEditandoId), dadosAluno);
                alert("Dados do aluno atualizados, senhor.");
                this.cancelarEdicaoAluno();
            } else {
                dadosAluno.dataCadastro = new Date();
                await addDoc(collection(db, "alunos"), dadosAluno);
                alert("Aluno registado com sucesso, senhor.");
                this.formAluno.reset();
            }
            await this.carregarAlunosDoBanco();
        } catch (error) {
            console.error(error);
            alert("Falha ao guardar os dados do aluno.");
        }
    }

    async carregarAlunosDoBanco() {
        if (!this.tabelaAlunos) return;
        try {
            const querySnapshot = await getDocs(collection(db, "alunos"));
            this.alunosCache = []; 
            querySnapshot.forEach((docSnap) => {
                const aluno = docSnap.data();
                aluno.id = docSnap.id; 
                aluno.status = aluno.status || 'Ativo';
                aluno.oficina = aluno.oficina || 'Sem Oficina Vinculada';
                this.alunosCache.push(aluno);
            });
            this.renderizarTabelaAlunos();
        } catch (error) { console.error(error); }
    }

    renderizarTabelaAlunos() {
        this.tabelaAlunos.innerHTML = ''; 
        const termoBusca = this.searchInput.value.toLowerCase();
        const filtroStatus = this.filterStatus.value;

        const alunosFiltrados = this.alunosCache.filter(aluno => {
            const bateNome = aluno.nome.toLowerCase().includes(termoBusca);
            const bateStatus = (filtroStatus === 'Todos') || (aluno.status === filtroStatus);
            return bateNome && bateStatus;
        });

        alunosFiltrados.forEach((aluno) => {
            const tr = document.createElement('tr');
            const badgeStatus = aluno.status === 'Ativo' ? '<span class="badge badge-tutor">Ativo</span>' : '<span class="badge badge-none">Inativo</span>';
            
            tr.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.oficina}</td>
                <td>${badgeStatus}</td>
                <td>${aluno.contato}</td>
                <td>
                    <button class="btn-primary btn-small btn-editar-aluno" data-id="${aluno.id}">Editar</button>
                </td>
            `;
            this.tabelaAlunos.appendChild(tr);
        });
    }

    prepararEdicaoAluno(id) {
        const aluno = this.alunosCache.find(a => a.id === id);
        if (!aluno) return;

        document.getElementById('aluno-nome').value = aluno.nome;
        document.getElementById('aluno-idade').value = aluno.idade;
        document.getElementById('aluno-escola').value = aluno.escola;
        document.getElementById('aluno-contato').value = aluno.contato;
        document.getElementById('aluno-oficina').value = aluno.oficina;
        document.getElementById('aluno-status').value = aluno.status;

        this.alunoEditandoId = id;
        this.tituloFormAluno.innerText = "A Editar Aluno: " + aluno.nome;
        this.btnSalvarAluno.innerText = "Atualizar Cadastro";
        this.btnCancelarEdicao.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelarEdicaoAluno() {
        this.alunoEditandoId = null;
        this.formAluno.reset();
        this.tituloFormAluno.innerText = "Cadastrar Novo Aluno";
        this.btnSalvarAluno.innerText = "Salvar Aluno";
        this.btnCancelarEdicao.classList.add('hidden');
    }

    // --- MÓDULO DE OFICINAS E FREQUÊNCIA ---
    async salvarOficina() {
        const nome = document.getElementById('oficina-nome').value;
        const cargaHoraria = document.getElementById('oficina-carga').value;
        try {
            await addDoc(collection(db, "oficinas"), { nome: nome, cargaHoraria: parseInt(cargaHoraria), dataCriacao: new Date() });
            alert("Oficina criada, senhor.");
            this.formOficina.reset();
            await this.carregarOficinas();
            await this.carregarOpcoesOficina(); 
        } catch (error) { console.error(error); }
    }

    async carregarOficinas() {
        if (!this.listaOficinas) return;
        try {
            const querySnapshot = await getDocs(collection(db, "oficinas"));
            this.listaOficinas.innerHTML = '';
            querySnapshot.forEach((docSnap) => {
                const oficina = docSnap.data();
                const li = document.createElement('li');
                li.innerHTML = `<strong>Oficina:</strong> ${oficina.nome} | <strong>Carga:</strong> ${oficina.cargaHoraria}h`;
                this.listaOficinas.appendChild(li);
            });
        } catch (error) { console.error(error); }
    }

    async carregarOpcoesOficina() {
        try {
            const querySnapshot = await getDocs(collection(db, "oficinas"));
            let opcoesHTML = '<option value="">Selecione a Oficina...</option>';
            querySnapshot.forEach((docSnap) => {
                const oficina = docSnap.data();
                opcoesHTML += `<option value="${oficina.nome}">${oficina.nome}</option>`;
            });
            if (this.selectAlunoOficina) this.selectAlunoOficina.innerHTML = opcoesHTML;
            if (this.selectOficinaFreq) this.selectOficinaFreq.innerHTML = opcoesHTML;
        } catch (error) { console.error(error); }
    }

    carregarListaChamada() {
        if (!this.tabelaFrequencia) return;
        
        const dataAula = document.getElementById('freq-data').value;
        const nomeOficinaSelecionada = this.selectOficinaFreq.value;

        if(!dataAula || !nomeOficinaSelecionada) {
            alert("Preencha a data e selecione uma oficina, senhor.");
            return;
        }

        this.tabelaFrequencia.innerHTML = '';
        const alunosDaTurma = this.alunosCache.filter(
            aluno => aluno.oficina === nomeOficinaSelecionada && aluno.status === 'Ativo'
        );

        if (alunosDaTurma.length === 0) {
            alert("Nenhum aluno ativo encontrado nesta oficina, senhor.");
            this.btnSalvarFrequencia.classList.add('hidden');
            return;
        }

        alunosDaTurma.forEach((aluno) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="nome-aluno-freq">${aluno.nome}</td>
                <td>
                    <select class="status-freq">
                        <option value="Presente">Presente</option>
                        <option value="Ausente">Ausente</option>
                    </select>
                </td>
            `;
            this.tabelaFrequencia.appendChild(tr);
        });

        this.btnSalvarFrequencia.classList.remove('hidden');
    }

    async salvarListaPresenca() {
        const dataAula = document.getElementById('freq-data').value;
        const nomeOficina = this.selectOficinaFreq.value;
        const linhas = this.tabelaFrequencia.querySelectorAll('tr');
        
        let registros = [];
        linhas.forEach(linha => {
            const nomeAluno = linha.querySelector('.nome-aluno-freq').innerText;
            const status = linha.querySelector('.status-freq').value;
            registros.push({ aluno: nomeAluno, status: status });
        });

        try {
            await addDoc(collection(db, "frequencias"), { data: dataAula, oficina: nomeOficina, chamada: registros, dataRegistro: new Date() });
            alert("Presença guardada, senhor.");
            this.tabelaFrequencia.innerHTML = '';
            this.formFrequencia.reset();
            this.btnSalvarFrequencia.classList.add('hidden');
        } catch (error) { console.error(error); }
    }

    // --- MÓDULO DE CERTIFICADOS ---
    async carregarCertificados() {
        if (!this.tabelaCertificados) return;
        try {
            const querySnapshot = await getDocs(collection(db, "frequencias"));
            const mapaFrequencia = {};

            querySnapshot.forEach((docSnap) => {
                const registroAula = docSnap.data();
                const oficina = registroAula.oficina;

                registroAula.chamada.forEach(alunoChamada => {
                    const chave = `${alunoChamada.aluno}|${oficina}`;
                    if (!mapaFrequencia[chave]) mapaFrequencia[chave] = { nome: alunoChamada.aluno, oficina: oficina, aulasDadas: 0, presencas: 0 };
                    
                    mapaFrequencia[chave].aulasDadas += 1;
                    if (alunoChamada.status === 'Presente') mapaFrequencia[chave].presencas += 1;
                });
            });

            this.tabelaCertificados.innerHTML = '';
            let encontrouAprovados = false;

            for (const chave in mapaFrequencia) {
                const dados = mapaFrequencia[chave];
                const porcentagem = (dados.presencas / dados.aulasDadas) * 100;

                if (porcentagem >= 75) {
                    encontrouAprovados = true;
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${dados.nome}</td>
                        <td>${dados.oficina}</td>
                        <td>${porcentagem.toFixed(0)}%</td>
                        <td><button class="btn-primary btn-small btn-gerar-pdf" data-nome="${dados.nome}" data-oficina="${dados.oficina}">Gerar PDF</button></td>
                    `;
                    this.tabelaCertificados.appendChild(tr);
                }
            }

            if (!encontrouAprovados) {
                this.tabelaCertificados.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum aluno registou 75% de frequência.</td></tr>';
            }
        } catch (error) { console.error(error); }
    }

    gerarCertificadoPDF(nomeAluno, nomeOficina) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        doc.setFillColor(240, 248, 255); doc.rect(0, 0, 297, 210, "F");
        doc.setDrawColor(0, 86, 179); doc.setLineWidth(2); doc.rect(10, 10, 277, 190, "S");
        doc.setTextColor(0, 86, 179); doc.setFontSize(36); doc.setFont("helvetica", "bold");
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 50, { align: "center" });
        doc.setTextColor(51, 51, 51); doc.setFontSize(18); doc.setFont("helvetica", "normal");
        const texto = `Certificamos que o(a) aluno(a) ${nomeAluno} concluiu com êxito \na oficina de ${nomeOficina}, oferecida pelo projeto \nEnsino Lúdico de Lógica e Programação (ELLP).`;
        doc.text(texto, 148.5, 90, { align: "center" });
        doc.setFontSize(14); doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 148.5, 140, { align: "center" });
        doc.setLineWidth(0.5); doc.setDrawColor(51, 51, 51); doc.line(98.5, 170, 198.5, 170);
        doc.setFontSize(12); doc.text("Coordenador do Projeto ELLP", 148.5, 178, { align: "center" });
        doc.save(`Certificado_${nomeAluno.replace(/\s+/g, '_')}.pdf`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});