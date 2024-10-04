## Casos de Uso
> ![](/docs/digs/UmlCasosDeUso.drawio.png)

## Requisitos Funcionais

<details>

> **RF01**: Autenticação e Autorização de Acesso
> - O sistema deve implementar o controle de acesso as funcionalidades conforme as permissões dos usuários

> **RF02**: Gerenciamento de Permissões de Usuários (Roles)
> - O sistema deve permitir ao usuário Administrador gerenciar o cadastro de roles

> **RF03**: Geremnciamento de Usuários
> - O sistema deve permitir ao usuário Administrador gerenciar o cadastro de usuários

> **RF04**: Login de Usuários
> - O sistema deve permitir aos usuários realizar login utilizando suas credenciais (email e senha)

> **RF05**: Esqueceu a Senha
> - O sistema deve permitir aos usuários redefinir a senha

> **RF06**: Gerenciamento de Funcionários
> - O sistema deve permitir ao usuário Funcionário ou Administrador cadastrar novos funcionários

> **RF07**: Gerenciamento de Clientes
> - O sistema deve permitir ao usuário Funcionário ou Administrador gerenciar o cadastro de clientes

> **RF08**: Gerenciamento de Serviços
> - O sistema deve permitir ao usuário Funcionário ou Administrador gerenciar o cadastro de serviços

> **RF09**: Agendamento de Serviços
> - O sistema deve permitir ao usuário Funcionário ou Administrador agendar serviços para os clientes

> **RF10**: Visualização de Agendamentos
> - O sistema deve permitir ao usuário Funcionário ou Administrador consultar os agendamentos disponíveis

> **RF11**: Cancelamento de Agendamento
> - O sistema deve permitir ao usuário Funcionário ou Administrador cancelar agendamentos pendentes

> **RF12**: Edição de Agendamentos
> - O sistema deve permitir ao usuário Funcionário ou Administrador editar seus agendamentos

> **RF13**: Notificações de Agendamento
> - O sistema deve notificar os Clientes quando um agendamento for realizado, alterado ou cancelado

> **RF14**: Consulta de Disponibilidade de Funcionários
> - O sistema deve permitir aos usuários consultar a disponibilidade dos funcionários

> **RF15**: Solicitação de Agendamento de Serviços
> - O sistema deve permitir ao usuário Cliente solicitar agendamento de serviços

> **RF14**: Relatórios de Agendamentos
> - O Administrador deve ser capaz de gerar relatórios com os agendamentos realizados, podendo filtrar por período, cliente, funcionário e serviço

</details>

<br>

## Modelagem do Domínio

**Entidades:**
> - Funcionário
>    - Contato (Value Object)
> - Usuário
>   - Permissões de usuário
> - Cliente
> - Serviço
> - Agendamento

> MER _(In Progress)_
>> ![](/docs/digs/MER.png)

**Bounded Contexts:**
> - Agendamento
> - Gerenciamento de Usuários
>> ![](/docs/digs/BoundedContexts.drawio.png)

<br>
