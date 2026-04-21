# Especificação de Requisitos Funcionais - Projeto ELLP

**Projeto:** Ensino Lúdico de Lógica e Programação (ELLP)  
**Versão:** 1.0
**Status:** Revisão Pendente

Este documento detalha os Requisitos Funcionais (RF) do sistema de gestão do projeto ELLP.

---

## 1. Módulo de Acesso

### RF01: Registro de Usuário
**Descrição:** Permitir a criação de novas contas de usuário no sistema.
**Dados obrigatórios:**
- Nome completo  
- Registro Acadêmico (RA)  
- E-mail
- Senha *(exceto quando usar Google OAuth)*  

**Critérios de aceite:**
- O usuário deve conseguir se registrar utilizando:
  - E-mail e senha, ou  
  - Conta Google (OAuth)
- O **RA deve ser único** (não pode existir duplicidade no sistema).
- O **e-mail deve ser único**.
- O sistema deve **validar o formato do RA** conforme padrão institucional antes de permitir o cadastro.
- No cadastro via Google (OAuth):
  - O e-mail retornado pelo Google deve ser utilizado como identificador único.
- O sistema deve impedir cadastro com dados inválidos ou já existentes, exibindo mensagens claras.
- Ao realizar o cadastro, uma solicitação de atribuição de papel deve ser enviada para aprovação de um Administrador.
    - Enquanto a solicitação estiver pendente, o usuário deve ter acesso restrito a apenas uma tela de "Aguardando Atribuição de Papel".

### RF02: Autenticação de Usuário
**Descrição:** Permitir que usuários acessem o sistema por meio de credenciais válidas.
**Critérios de aceite:**
- O login deve ser possível via:
  - E-mail e senha, ou  
  - Conta Google (OAuth)
- Apenas usuários **ativos** podem autenticar.
- Em caso de erro (e-mail inexistente ou senha incorreta), o sistema deve retornar:
  - **Mensagem genérica:** “Credenciais inválidas”
- O sistema deve permitir **recuperação de senha via e-mail**, com envio de link seguro para redefinição.
- Se um usuário já tiver cadastro com determinado e-mail:
  - Deve ser possível vincular/login via Google (OAuth) usando esse mesmo e-mail.
- O sistema deve garantir que sessões autenticadas sejam iniciadas apenas após validação completa das credenciais.

---

## 2. Gestão de Usuários

### RF03: Consulta de Usuários
- **Descrição:** O sistema deve permitir a listagem filtrada de usuários e voluntários por nome, e-mail, RA ou papel (Administrador, Professor, Tutor, Sem Papel (usuários recém-cadastrados)).
- **Critérios de Aceite:**
    - A listagem deve exibir informações básicas: Nome, RA, E-mail e Papel.
    - O sistema deve permitir a busca por nome completo ou parcial, e por papel específico.
    - Apenas usuários com papel de Administrador podem acessar a listagem de usuários.

### RF04: Atribuição de Papéis e Gestão de Voluntários
- **Descrição:** O sistema deve permitir a atribuição de papéis (Administrador, Professor, Tutor, Sem Papel) aos usuários com conta na aplicação.
- **Critérios de Aceite:**
    - Apenas usuários com papel de Administrador podem atribuir ou alterar papéis.
    - O sistema deve permitir a atribuição de apenas um papel por usuário, e deve ser possível alterar o papel posteriormente.

---

## 3. Gestão de Alunos

### RF05: Gestão de Perfis de Alunos
- **Descrição:** O sistema deve permitir o CRUD de alunos participantes das oficinas.
- **Campos Obrigatórios:** Nome, Idade, Sexo, Documento (CPF ou RG), Escola de Origem, Endereço (Logradouro, Número, Complemento, Bairro, Cidade, Estado, CEP), E-mail do Responsável, Telefone do Responsável.
- **Critérios de Aceite:**
    - Apenas usuários com papel de Professor ou Administrador podem acessar a funcionalidade de gestão de alunos.

---

## 4. Planejamento Acadêmico (Oficinas e Turmas)

### RF06: Gestão de Oficinas
- **Descrição:** O sistema deve permitir o CRUD de Oficinas.
- **Campos Obrigatórios:** Código Identificador (único), Status (Ativa/Arquivada), Nome da Oficina, Descrição, Carga Horária Total.
    - Não deve ser possível excluir uma Oficina que possua turmas ativas vinculadas.
    - Apenas usuários com papel de Administrador podem realizar operações de Criação, Atualização, Exclusão de oficinas e visualização de oficinas ativas e arquivadas.
    - A visualização de oficinas ativas deve ser permitida para todos os usuários.

### RF07: Gestão de Turmas
- **Descrição:** O sistema deve permitir o CRUD de Turmas.
- **Campos Obrigatórios:** Ano, Semestre Letivo, e Horário (Dia da Semana/Hora).
- **Critérios de Aceite:**
    - Cada Turma deve estar vinculada a uma Oficina ativa específica.
    - Apenas usuários com papel de Administrador podem realizar operações de Criação, Atualização, Exclusão de turmas e visualização de turmas ativas e arquivadas.
    - A visualização de turmas ativas deve ser permitida para todos os usuários.

### RF08: Matrícula e Atribuição de Professor a Turma
- **Descrição:** O sistema deve permitir a associação de múltiplos alunos a uma turma específica (Matrícula) e a atribuição de um professor responsável pela turma.
- **Critérios de Aceite:**
    - O sistema deve impedir a matrícula duplicada do mesmo aluno na mesma turma/período.
    - O sistema deve validar a existência do aluno e da turma antes de permitir a matrícula.
    - O sistema deve permitir a atribuição de apenas um professor por turma.
    - O sistema deve impedir a atribuição de um professor a turmas com horários conflitantes.
    - Apenas usuários com papel de Administrador podem gerenciar matrículas e atribuições de professores.

---

## 5. Operação de Aula e Frequência


### RF09: Criação de Aulas e Controle de Frequência
- **Descrição:** O sistema deve permitir a criação de aulas para cada turma e gerar automaticamente a lista de presença baseada nos alunos matriculados na Turma para a data selecionada.
- **Campos Obrigatórios:** Data da Aula.
- **Critérios de Aceite:**
    - O registro de presença deve permitir dois estados: Presente ou Ausente.
    - A aula deve estar vinculada a uma turma específica, e a lista de presença deve ser gerada automaticamente com base nos alunos matriculados nessa turma.
    - O sistema deve permitir a edição da lista de presença para corrigir eventuais erros.
    - Apenas usuários com papel de Professor ou Administrador podem criar aulas e registrar frequência.

---

## 6. Certificação e Relatórios

### RF10: Geração de Certificados para Alunos
- **Descrição:** O sistema deve emitir certificados de participação em formato PDF para os alunos.
- **Regra de Negócio:**
    - A emissão só é permitida para alunos com frequência igual ou superior a 75%.
        - O sistema deve calcular a frequência com base no número total de aulas criadas para a turma e no número de presenças registradas para o aluno.
    - O certificado deve conter: Nome do Aluno, Nome da Oficina, Carga Horária, Período (Ano/Semestre), Data de Emissão e Professor Responsável.
    - A funcionalidade é restrita a perfis de Administrador e Professor.

### RF11: Processamento em Lote de Certificados de Voluntários
- **Descrição:** O sistema deve permitir a emissão de certificados para voluntários.
- **Critérios de Aceite:**
    - O certificado deve conter: Nome do Voluntário, Descrição da Atividade, Carga Horária, Período (Ano/Semestre), Data de Emissão e Responsável pela Atividade.
