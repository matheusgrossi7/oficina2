# Projeto: ELLP MNG

Este repositório contém a documentação e o código do sistema de gestão para o projeto de Ensino Lúdico de Lógica e Programação (ELLP), desenvolvido sob uma arquitetura Web. O projeto foi desenvolvido como parte dos requisitos da disciplina de Oficina de Integração 2 do curso de Engenharia de Software.

## 1. Introdução

### 1.1. Equipe
* Felipe Bezerra de Almeida - RA: 2102617
* Lucas Henrique da Simva Coller - RA: 2145295
* Luís Fernando
* Matheus Grossi
* Vinicius Henrique De Oliveira Silva - RA: 2525925

### 1.2. Problema
Atualmente, o Grupo ELLP enfrenta dificuldades devido ao uso de métodos manuais para o controle dos voluntários envolvidos e das oficinas ofertadas. Esse processo manual consome tempo significativo e pode resultar em filas para a conclusão das tarefas individuais, impactando negativamente a eficiência e a organização das atividades do projeto. Isso repercute diretamente na experiência dos voluntários e coordenador do projeto. Com a implementação do software web proposto, buscamos eliminar esses obstáculos, proporcionando uma solução eficiente e integrada para o gerenciamento dos voluntários, alunos e oficinas. Ao automatizar o processo de documentação e gestão, esperamos melhorar significativamente a eficiência e a organização do projeto. Isso resultará em uma experiência mais fluida e eficaz para todos os envolvidos, proporcionando um ambiente mais produtivo e colaborativo.

---

## 2. Perfil do usuário

### 2.1. Análise de Tarefas: ANTES
Devido à grande quantidade de papelada e à disponibilidade de ambos os participantes, tanto coordenador quanto voluntário, o processo de inscrição, controle de turmas e emissão de certificados acaba sendo pouco eficiente.

### 2.2. Análise de Tarefas: DEPOIS
Com a utilização do sistema web, ambos os participantes, tanto coordenador quanto voluntário, podem realizar as tarefas necessárias em seu próprio tempo disponível e de sua própria casa, agilizando assim o processo, centralizando os dados no banco de dados e diminuindo as tarefas manuais.

---

## 3. Design e Requisitos

### 3.1. Requisitos Funcionais
A documentação completa e detalhada referente aos requisitos funcionais do sistema encontra-se disponível: 

Para consultar a listagem de requisitos, acesse o documento através do link abaixo:
* [Documento de Requisitos Funcionais (requisitos-funcionais.md)](https://github.com/matheusgrossi7/oficina2/blob/main/doc/requisitos/requisitos-funcionais.md)

### 3.2. Descrição textual
* **Para o Administrador (Coordenador), as funcionalidades incluem:** Identificação e autenticação, consulta e alteração de papéis de usuários, gestão do cadastro de alunos, criação e vinculação de oficinas e turmas, e emissão de certificados.
* **Para os Professores/Voluntários:** Identificação e autenticação, visualização de turmas atribuídas, registro de aulas e controle de frequência dos alunos, e acesso aos próprios certificados.

---

## 4. Tecnologias Utilizadas

Para atender aos requisitos de Programação Orientada a Objetos e prover uma solução robusta e escalável, o projeto faz uso do seguinte conjunto de tecnologias:

* **Front-end (Interface e Lógica de Apresentação):** HTML5, CSS3 e JavaScript (ES6+). A linguagem JavaScript será aplicada utilizando o paradigma de Orientação a Objetos para a criação das classes de controle e modelos.
* **Back-end e Banco de Dados (BaaS):** Firebase.
  * *Firebase Authentication:* Para gerir de forma segura o registro e o acesso (login) dos voluntários e coordenadores.
  * *Firebase Firestore:* Banco de dados NoSQL orientado a documentos para o armazenamento das informações de perfis, oficinas, turmas e frequências.
* **Gerenciamento de Projeto e Versionamento:** Git para controle de versão, GitHub para hospedagem do repositório público e acompanhamento de tarefas (Issues) e quadro Kanban para a metodologia ágil.
* **Qualidade e Testes:** Utilização de frameworks de testes automatizados para JavaScript voltados à validação de componentes e regras de negócio.

---

## 5. Metodologia de Desenvolvimento (Scrum)

O projeto adota a metodologia ágil **Scrum**, estruturada para integrar os conhecimentos das disciplinas base do curso (Programação Orientada a Objetos, Banco de Dados, Programação Web, Teste de Software, Gerência de Configuração, Arquitetura e Gerenciamento de Projetos). 

A execução da implementação é dividida da seguinte forma:

* **Gestão de Tarefas (Kanban):** O gerenciamento e o acompanhamento do progresso são realizados através de um quadro Kanban. Todas as funcionalidades a serem desenvolvidas em cada *sprint* são documentadas como *Issues* no repositório público do GitHub e resolvidas mediante *commits* rastreáveis.
* **Sprints de Desenvolvimento:** O ciclo de implementação foi subdividido em duas *Sprints* principais, separando as camadas de apresentação e de persistência de dados.
* **Testes Automatizados:** Para todas as funcionalidades entregues, são elaborados scripts de testes automatizados, focando em uma alta métrica de cobertura de código.
* **Avaliação e Revisão (*Sprint Review*):** Ao término de cada *Sprint*, a equipe realiza a entrega das funcionalidades alinhadas à arquitetura definida, acompanhadas de um vídeo de apresentação (máximo de 5 minutos) demonstrando a execução do projeto e dos testes. Em seguida, há uma semana dedicada à revisão, correção de *bugs* e ajustes solicitados pelo professor supervisor.

---

## 6. Cronograma do Projeto

As atividades do projeto foram organizadas em duas fases principais, subdivididas por semanas de trabalho contínuo:

### Fase 1: Planejamento (Março - Abril)
* **Semana 4 (Março):** Realização de entrevista presencial (dia 30/03) para elicitação e levantamento inicial de requisitos.
* **Semana 1 (Abril):** Análise de requisitos e especificação formal das funcionalidades.
* **Semana 2 (Abril):** Elaboração da arquitetura de alto nível do sistema e modelagem de dados inicial.
* **Semana 3 (Abril):** Reunião de validação de escopo com o professor. Criação dos repositórios, configuração final do ambiente de desenvolvimento e submissão dos artefatos de planejamento.

### Fase 2: Implementação (Abril - Junho)

**Sprint 1: Desenvolvimento da Interface (Front-end)**
* **Semana 4 (Abril):** Início do desenvolvimento focado exclusivamente no *Front-end*. Estruturação base em HTML e CSS.
* **Semana 1 (Maio):** Criação das interfaces de usuário principais (telas de login, formulários de cadastro e dashboards).
* **Semana 2 (Maio):** Implementação das primeiras classes de controle em JavaScript sob o paradigma de Orientação a Objetos. 
* **Semana 3 e 4 (Maio):** Semanas de revisão técnica dedicadas a ajustes de usabilidade e correções de *bugs* visuais apontados na avaliação.

**Sprint 2: Lógica de Negócios e Integração (Back-end)**
* **Semana 1 (Junho):** Implementação das camadas de persistência e integração com o Firebase (Authentication e Firestore).
* **Semana 2 (Junho):** Desenvolvimento da lógica de negócios focada na gestão de turmas e no controle de frequência.
* **Semana 3 (Junho):** Desenvolvimento dos módulos para geração de PDF (termos de adesão e certificados) e implementação dos testes automatizados de integração.
* **Semana 4 (Junho):** *Sprint Review 2*. Entrega final do software completo e integrado.
