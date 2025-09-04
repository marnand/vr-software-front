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
src/
├── app/
│   ├── notificacao/           # Componente principal de notificações
│   │   ├── notificacao.component.ts
│   │   ├── notificacao.component.html
│   │   └── notificacao.component.css
│   ├── services/              # Serviços da aplicação
│   │   └── notificacao.service.ts
│   ├── app.component.*        # Componente raiz
│   └── app.config.ts          # Configuração da aplicação
├── index.html                 # Página principal
├── main.ts                    # Ponto de entrada da aplicação
└── styles.css                 # Estilos globais

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run watch` - Compila o projeto em modo de observação
- `npm test` - Executa os testes unitários

## 🌐 Funcionalidades

### Envio de Notificações
- Interface para digitar o conteúdo da mensagem
- Geração automática de ID único para cada notificação
- Envio via API REST para o backend

### Acompanhamento em Tempo Real
- Conexão WebSocket para receber atualizações de status
- Exibição do histórico de notificações enviadas
- Atualização automática do status das mensagens

### Estados de Notificação
- **Enviando**: Notificação sendo processada
- **Enviado**: Notificação processada com sucesso
- **Erro**: Falha no processamento

## 🔗 Integração com Backend

O frontend se comunica com o backend através de:

1. **HTTP POST** para `/api/notificar` - Envio de novas notificações
2. **WebSocket** - Recebimento de atualizações de status via evento `statusAtualizado`

## 🐛 Solução de Problemas

### Erro de Conexão WebSocket
- Verifique se o backend está rodando na porta 3000
- Confirme se não há firewall bloqueando a conexão
- Verifique os logs do console do navegador

### Erro ao Enviar Notificação
- Confirme se a API do backend está acessível
- Verifique se o endpoint `/api/notificar` está funcionando
- Verifique os logs de rede no DevTools do navegador

## 📝 Desenvolvimento

### Gerando Novos Componentes
```bash
ng generate component nome-do-componente
```

### Gerando Novos Serviços
```bash
ng generate service nome-do-servico
```

### Build para Produção
```bash
ng build --configuration production
```

Os arquivos de build serão armazenados no diretório `dist/`.

## 📚 Recursos Adicionais

- [Documentação do Angular](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [RxJS](https://rxjs.dev/)
