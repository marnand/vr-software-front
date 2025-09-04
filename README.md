# Sistema de Notificações - Frontend

Este é o frontend de um sistema de notificações em tempo real desenvolvido com Angular 18. O projeto permite enviar notificações e acompanhar seu status de processamento através de WebSockets.

## 📋 Sobre o Projeto

O sistema consiste em uma aplicação Angular que:
- Permite enviar notificações através de uma interface web
- Conecta-se a um backend via HTTP para envio de mensagens
- Utiliza WebSockets (Socket.IO) para receber atualizações de status em tempo real
- Exibe o histórico de notificações enviadas com seus respectivos status

## 🛠️ Tecnologias Utilizadas

- **Angular 18.2** - Framework principal
- **TypeScript** - Linguagem de programação
- **Socket.IO Client** - Comunicação em tempo real
- **RxJS** - Programação reativa
- **UUID** - Geração de identificadores únicos
- **Angular CLI** - Ferramentas de desenvolvimento

## 📦 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Angular CLI** (opcional, mas recomendado)

```bash
# Instalar Angular CLI globalmente (opcional)
npm install -g @angular/cli
```

## 🚀 Como Executar o Projeto Localmente

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd front-end
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Backend
**IMPORTANTE**: Este frontend depende de um backend rodando na porta 3000. Certifique-se de que o backend esteja executando antes de iniciar o frontend.

O frontend espera que o backend esteja disponível em:
- **API REST**: `http://localhost:3000/api/notificar`
- **WebSocket**: `http://localhost:3000`

### 4. Inicie o servidor de desenvolvimento
```bash
npm start
# ou
ng serve
```

### 5. Acesse a aplicação
Abra seu navegador e navegue para `http://localhost:4200/`

A aplicação será recarregada automaticamente sempre que você modificar os arquivos fonte.

## 📁 Estrutura do Projeto
