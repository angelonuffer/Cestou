# Cestou 🧺 - Organizador de Arquivos Local

**Cestou** é uma aplicação web focada em UX que ajuda você a organizar pastas bagunçadas automaticamente. Utilizando a **File System Access API**, o app lê, categoriza e move arquivos para subpastas organizadas (Imagens, Documentos, Vídeos, etc.) diretamente no seu computador, sem fazer upload dos dados para a nuvem.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Funcionalidades

- **Leitura de Diretório:** Selecione qualquer pasta do seu computador.
- **Categorização Automática:**
  - 📂 **Imagens:** .jpg, .png, .gif, .webp, .svg, etc.
  - 📂 **Documentos:** .pdf, .docx, .txt, .xlsx, .md, etc.
  - 📂 **Vídeos:** .mp4, .mov, .mkv, .avi, etc.
  - 📂 **Outros:** Arquivos não mapeados.
- **Preview Interativo:** Veja exatamente o que vai acontecer antes de executar.
- **Privacidade Total:** Todo o processamento é feito localmente no navegador (Client-side). Seus arquivos nunca saem do seu PC.

## ⚠️ Requisitos do Sistema

Devido ao uso de APIs modernas de acesso ao sistema de arquivos, este projeto possui requisitos estritos:

1.  **Navegador:** É necessário um navegador baseado em **Chromium** atualizado (Google Chrome, Microsoft Edge, Opera, Brave).
    *   *Nota: Firefox e Safari atualmente não suportam a escrita direta em pastas via Web API.*
2.  **Dispositivo:** Funciona apenas em **Desktop** (Windows, Mac, Linux, ChromeOS). Dispositivos móveis não possuem o sistema de arquivos necessário.
3.  **Contexto de Execução:**
    *   A aplicação deve rodar em **HTTPS** ou **localhost**.
    *   A aplicação **NÃO** funciona dentro de iframes (como previews do CodeSandbox, StackBlitz ou AI Studio) por razões de segurança do navegador (`SecurityError: Cross origin sub frames`).

## 🚀 Como Rodar Localmente

Para testar a funcionalidade completa, você deve rodar o projeto em seu ambiente local.

### Opção 1: Usando Node.js (Recomendado)

Se você tiver o código fonte em um projeto React (Vite/CRA):

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Abra o link exibido (geralmente `http://localhost:5173`) no Chrome ou Edge.

### Opção 2: Servidor Estático Simples

Se você estiver usando apenas os arquivos compilados ou HTML/JS puros:

1.  Use uma extensão como "Live Server" no VS Code.
2.  Ou rode um servidor Python simples na pasta do projeto:
    ```bash
    python -m http.server 8000
    ```
3.  Acesse `http://localhost:8000`.

## 🛠️ Tecnologias Utilizadas

- **React 19:** Biblioteca UI moderna.
- **Tailwind CSS:** Estilização utilitária rápida e responsiva.
- **Lucide React:** Ícones vetoriais leves e consistentes.
- **File System Access API:** O coração do projeto, permitindo leitura e escrita no disco local.

## 🔒 Segurança e Permissões

Ao clicar em "Abrir Pasta", o navegador solicitará permissão de leitura. Ao clicar em "Cestou!" (para mover os arquivos), o navegador solicitará permissão de **escrita/modificação**. Isso é um comportamento padrão de segurança da Web para garantir que nenhum site modifique seus arquivos sem seu consentimento explícito.

---

Desenvolvido com 🧺 por um Especialista em Frontend UX.