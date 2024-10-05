## Casos de Uso
> ![](/docs/digs/UmlCasosDeUso.drawio.png)

## Análise de Requisitos

<details>

### Requisitos Funcionais (RF)

Ator: Usuário
> **RF01**: Login
> - O sistema deve permitir aos usuários realizarem login utilizando suas credenciais (email e senha)

> **RF02**: Esqueceu a Senha
> - O sistema deve permitir aos usuários recuperarem o acesso redefinindo sua senha

Ator: Usuário Administrador

> **RF03**: Geremnciamento de Usuários e Permissões
> - O sistema deve permitir ao usuário Administrador gerenciar o cadastro de usuários e sias permissões

> **RF04**: Gerenciamento de Funcionários
> - O sistema deve permitir ao usuário Administrador cadastrar novos funcionários

> **RF05**: Gerenciamento de Clientes
> - O sistema deve permitir ao usuário Administrador gerenciar o cadastro de clientes

> **RF06**: Gerenciamento de Disponibilidade de Funcionários
> - O sistema deve permitir ao usuário Administrador gerenciar a disponibilidade dos funcionários

Aror: Usuário Funcionário
> **RF07**: Gerenciamento de Serviços
> - O sistema deve permitir ao usuário Funcionário ou Administrador gerenciar o cadastro de serviços

> **RF08**: Agendamento de Serviços
> - O sistema deve permitir ao usuário Funcionário ou Administrador agendar serviços para os clientes

> **RF09**: Visualização de Agendamentos
> - O sistema deve permitir ao usuário Funcionário ou Administrador consultar os agendamentos disponíveis

> **RF10**: Cancelamento de Agendamento
> - O sistema deve permitir ao usuário Funcionário ou Administrador cancelar agendamentos pendentes

> **RF11**: Edição de Agendamentos
> - O sistema deve permitir ao usuário Funcionário ou Administrador editar seus agendamentos

Ator: Usuário Cliente
> **RF12**: Solicição de Reserva de Agendamento
> - O sistema deve permitir ao usuário Cliente solicitar a reserva de agendamento

> **RF13**: Cancelamento de Reserva de Agendamento
> - O sistema deve permitir ao usuário Cliente cancelar a reserva de agendamento

> **RF14**: Solicitação de Cancelamento de Agendamento
> - O sistema deve permitir ao usuário Cliente solicitar o cancelamento de agendamento

> **RF15**: Visualização de Agendamentos
> - O sistema deve permitir ao usuário Cliente consultar os detalhes dos seus agendamentos

Ator: Sistema
> **RF16**: Autenticação e Autorização de Acesso
> - O sistema deve implementar o controle de acesso as funcionalidades conforme as permissões dos usuários

> **RF17**: Notificações de Agendamento
> - O sistema deve notificar os Clientes sobre o status do agendamento

<br>

### Requisitos Não Funcionais

> **RNF01**: Autenticação e Autorização
> - O sistema deve garantir o controle de acesso dos usuários as funcionalidades conforme suas permissões de acesso

> **RNF02**: Design Responsivo
> - A aplicação PWA deve ser responsiva para se adequar a diferentes resoluções e dispositivos móveis

> **RNF03**: Suporte Offline
> - A aplicação PWA deve ser capaz de funcionar offline disponibilizando funcionalidades básicas

</details>

<br>

## Modelagem do Domínio

**Entidades:**
> - Usuário
> - Permissões
> - Agendamento
> - Serviço
> - Cliente
>    - Contato (Value Object)
> - Funcionário
>    - Contato (Value Object)
> - Disponibilidade de Funcionário
> - Reserva

> MER _(In Progress)_
>> ![](/docs/digs/MER.png)

**Bounded Contexts:**
> - Agendamento
> - Gerenciamento de Usuários
>> ![](/docs/digs/BoundedContexts.drawio.png)

<br>

## Arquitetura dos componentes _(In Progress)_
> ![](/docs/digs/ArquiteturaDosComponentes.drawio.png)
