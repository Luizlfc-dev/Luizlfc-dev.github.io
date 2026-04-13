# 🚀 Live Engine — Portfólio Pessoal

<div align="center">

**Portfólio profissional com atualização automática de projetos via GitHub Actions + IA.**

[🔗 Ver o Site](https://luizlfc-dev.github.io/) · [📂 Repositório](https://github.com/Luizlfc-dev/Luizlfc-dev.github.io)

</div>

---

## 📌 Sobre o Projeto

O **Live Engine** é um portfólio pessoal desenvolvido para ser uma vitrine profissional dinâmica e automatizada. Diferente de portfólios estáticos tradicionais, este projeto se **auto-atualiza**: a cada push no repositório, um workflow do GitHub Actions sincroniza automaticamente os projetos do meu perfil GitHub, categoriza-os com inteligência artificial e atualiza o site publicado.

### Por que "Live Engine"?

O nome reflete a filosofia do projeto — um **motor vivo** que mantém o portfólio sempre atualizado sem intervenção manual. Novos repositórios criados no GitHub aparecem automaticamente no site, categorizados e organizados.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em **3 camadas** para manter organização e escalabilidade:

```
┌─────────────────────────────────────────────────┐
│                  DIRETIVAS                      │
│  (SOPs em Markdown — deploy, SEO, otimização)   │
├─────────────────────────────────────────────────┤
│               ORQUESTRAÇÃO                      │
│  (GitHub Actions — sincroniza, categoriza, faz  │
│   deploy automaticamente)                       │
├─────────────────────────────────────────────────┤
│                 EXECUÇÃO                        │
│  (HTML/CSS/JS — renderiza o site no navegador)  │
└─────────────────────────────────────────────────┘
```

### Estrutura de Arquivos

```
📁 site-portifolio/
├── 📄 index.html           # Página principal (6 seções)
├── 🎨 style.css            # Design system completo
├── ⚡ script.js            # Interatividade e dados dinâmicos
├── 📊 data.json            # Dados dos projetos (auto-gerado)
├── 📁 assets/
│   └── 🖼️ foto-perfil.jpg  # Foto pessoal
├── 📁 certificates/        # Certificados (pdf/png/jpg) para sync automático
├── 📁 .github/workflows/
│   ├── 🔄 sync-projects.yml  # Sincronização automática
│   └── 🚀 deploy.yml         # Deploy no GitHub Pages
└── 📄 README.md
```

---

## ⚙️ Como Funciona

### 1. Sincronização Automática (sync-projects.yml)

A cada **push na branch main** (ou semanalmente), o workflow:

1. **Busca** todos os repositórios públicos via API do GitHub
2. **Lê** o README de cada repositório para extrair detalhes
3. **Categoriza** cada projeto usando **GPT-4o mini** (com fallback heurístico caso não tenha API key)
4. **Atualiza** o arquivo `data.json` com os dados mais recentes
5. **Faz commit** automático das mudanças, que disparam o deploy

### 2. Deploy Automático (deploy.yml)

Quando `index.html`, `style.css`, `script.js` ou `data.json` são alterados:

1. O workflow **constrói** o site
2. **Faz upload** dos arquivos para o GitHub Pages
3. O site é **publicado** automaticamente

### 3. Frontend Dinâmico (script.js)

O JavaScript no cliente:

- **Carrega** `data.json` e renderiza os cards de projetos
- **Carrega** certificações automaticamente da chave `certificates`
- **Conta** automaticamente a quantidade de projetos (com animação)
- Permite **filtrar** por categoria (Backend, Automação, Web)
- Permite **ordenar** por data (Recentes) ou estrelas (Stars)
- **Anima** os elementos ao scroll (Intersection Observer)

---

## 🎨 Design

O design foi criado com base em referências visuais de portfólios modernos, priorizando:

| Aspecto | Implementação |
|---------|--------------|
| **Tema** | Dark mode profundo (`#0a0a0f`) |
| **Cores** | Gradientes roxo → rosa → vermelho |
| **Efeitos** | Glassmorphism (blur + transparência) |
| **Tipografia** | Space Grotesk (títulos) + Inter (corpo) |
| **Animações** | Scroll reveal, formas flutuantes, hover effects |
| **Responsividade** | Mobile-first com breakpoints para tablet e desktop |
| **Background** | Grid sutil + glows animados |

### Decisões de Design

- **Sem frameworks CSS** — Vanilla CSS puro para máximo controle e zero dependências
- **Sem bibliotecas JS** — JavaScript vanilla para performance e tamanho mínimo
- **Google Fonts via import** — Tipografia profissional sem instalação
- **SVGs inline** — Ícones sem dependência externa, carregamento instantâneo

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** — Semântico, com SEO completo (meta tags, Open Graph, JSON-LD)
- **CSS3** — Custom Properties, Grid, Flexbox, animações, media queries
- **JavaScript ES6+** — Fetch API, Intersection Observer, async/await

### Automação
- **GitHub Actions** — CI/CD para sincronização e deploy
- **GitHub Pages** — Hospedagem gratuita
- **GitHub API** — Fetch de repositórios e READMEs
- **OpenAI GPT-4o mini** — Categorização inteligente de projetos (opcional)

### SEO
- **Meta tags** — Title, description, keywords, author
- **Open Graph** — Preview em redes sociais (LinkedIn, Twitter)
- **JSON-LD** — Dados estruturados para Google
- **Sitemap** — Geração automática via script Python

---

## 📊 Seções do Site

| Seção | Descrição |
|-------|-----------|
| **Hero** | Apresentação com título animado e CTAs |
| **Sobre** | Foto, biografia e estatísticas com contador dinâmico |
| **Skills** | Cards com tecnologias organizadas por área |
| **Projetos** | Galeria dinâmica com filtros e ordenação |
| **Experiência** | Timeline profissional |
| **Formação** | Cards acadêmicos + certificações dinâmicas |
| **Contato** | Links diretos (email com mailto, LinkedIn, GitHub) |

---

## 🚀 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/Luizlfc-dev/Luizlfc-dev.github.io.git

# Entre na pasta
cd Luizlfc-dev.github.io

# Abra com um servidor local
python -m http.server 8080
# ou
npx serve .
```

Acesse **http://localhost:8080** no navegador.

---

## 📝 Configuração

### Certificados automáticos

Adicione novos arquivos em `certificates/` com extensões `.pdf`, `.png`, `.jpg`, `.jpeg` ou `.webp`.

No próximo run do workflow `Sync GitHub Projects`, esses arquivos serão convertidos automaticamente para a seção de certificações do site (sem edição manual de `index.html`).

### Variáveis de Ambiente (Secrets do GitHub)

| Secret | Obrigatório | Descrição |
|--------|-------------|-----------|
| `GEMINI_API_KEY` | ❌ Não | API key do Google Gemini para categorização com IA. Sem ela, usa heurística. |

### Ativar GitHub Pages

1. Vá em **Settings → Pages**
2. Selecione **Branch: main**
3. Clique em **Save**
4. O site estará disponível em `https://seu-username.github.io`

---

## 👤 Autor

**Luiz Felipe Carvalho**

- 🎓 Ciência da Computação — UEPB
- 💼 Desenvolvedor de Software — NUTES/UEPB (LUFH)
- 🔧 Técnico de TI — Autônomo

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luiz-felipe-carvalho-245058344/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Luizlfc-dev)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lf.codes2002@gmail.com)
