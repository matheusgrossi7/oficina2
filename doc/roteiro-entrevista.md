# Roteiro para Entrevista de Elicitação de Requisitos

## 1. Abertura
Nesta seção, devemos orientar o cliente quanto ao objetivo desta conversa e sua importância para o sucesso do projeto. É necessário confirmar:
- [ ] A pessoa entrevistada é adequada para este objetivo?  
- [ ] Ela entende a importância de descrever com clareza e detalhes as suas necessidades?

## 2. Investigação
Parte principal da entrevista para a criação dos requisitos. As perguntas podem ser abertas para os **Requisitos Funcionais (RF)** e mais fechadas para os **Requisitos Não Funcionais (RNF)**.

### 2.1 Requisitos Funcionais
 Este software vai substituir algum sistema já existente ou processos manuais (planilhas, papel, etc.)?
* Qual é o seu objetivo geral com este software e por que ele é necessário?
* Consegue descrever o processo atual, desde a decisão de ofertar uma oficina até o recebimento do certificado pelo aluno?
* É possível organizar esse processo em macro etapas? Quais são?
* No geral, quais pessoas são envolvidas em todo o processo?
* Quais destas pessoas devem utilizar o sistema que vamos desenvolver?
* Quais as informações mínimas que devemos manter sobre cada pessoa?
* Quem pode alterar essas informações no sistema?
* O que é preciso para criar uma nova oficina? Além do tema, quais outras decisões devem ser tomadas?
* Existem regras diferentes para participação em cada oficina (idade, pré-requisitos, escola específica)?
* Deve ser possível manter diferentes turmas de um mesmo tema de oficina?
* Quem decide as informações sobre as oficinas e quem as manterá no sistema?
* Existe um planejamento de aulas previstas ou elas são cadastradas ao final de cada dia?
* Há controle de presença para alunos e voluntários?
* Há alguma forma de avaliação que demande implementação no sistema?
* Em que momento e quem poderá emitir os certificados?
* Quais os critérios para obtenção e o que deve constar no certificado?
* Os certificados podem ser alterados após a emissão?
* É esperado que o sistema emita outros tipos de documentos ou relatórios?

### 2.2 Requisitos Não Funcionais
* Como o sistema deve ser utilizado (dispositivos móveis ou desktop)?
* O sistema precisará ser utilizado em locais sem acesso à internet?
* Quais são os diferentes níveis de acesso e como se diferenciam?
* Existe restrição ou tratamento especial para o armazenamento dos dados?
* Por quanto tempo os dados devem persistir e há necessidade de auditoria?
* Os dados armazenados podem ser deletados por alguém?
* Qual a tolerância para eventual indisponibilidade do sistema?
* Existe algum fluxo muito crítico que não pode falhar sob nenhuma hipótese?

## 3. Fechamento
- [ ] Retomar as anotações e fazer um resumo rápido para validar o entendimento.
- [ ] Questionar se há algo importante que não foi mencionado.
- [ ] Identificar a prioridade de cada funcionalidade:
    - **Objetivo da Sprint 1:**
    - **Objetivo da Sprint 2:**
- [ ] Verificar se algo citado é dispensável ou pouco importante.

## Pós-Entrevista
Momento para conversar com o professor sobre preferências de plataforma ou tecnologia para implementação (encerrando os papéis de cliente/analista).