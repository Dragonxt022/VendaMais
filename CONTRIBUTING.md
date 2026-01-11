# Guia de Contribuição - VendaMais 🍔🚀

Obrigado por se interessar em contribuir com o **VendaMais**! Este projeto visa ser uma solução robusta e escalável para gestão comercial gastronômica. Para manter a qualidade e a organização, pedimos que siga as diretrizes abaixo.

---

## 🏗️ Arquitetura e Organização

O projeto segue o padrão **MVC (Model-View-Controller)** e está organizado por contextos de uso:

### 📁 Pastas Principais

- `controllers/`: Lógica de negócio, dividida em `admin`, `user` e `site`.
- `models/`: Definição de dados e interação com o banco (Sequelize).
- `routes/`: Definição de caminhos URL, espelhando a estrutura dos controllers.
- `views/`: Arquivos EJS, organizados por contexto (`admin`, `user`, `site`) e com pastas para `layouts` e `errors`.
- `public/`: Arquivos estáticos. **Nota:** O CSS final é gerado pelo Tailwind no arquivo `style.css`.
- `middleware/`: Filtros de autenticação e validações globais.
- `utils/`: Funções auxiliares reutilizáveis.

---

## 🎨 Padrões de Design (UI/UX)

Toda a interface deve seguir o tema **Food-Tech** estabelecido:

- **Tailwind CSS**: É obrigatório o uso de classes utilitárias do Tailwind. Não utilize CSS inline ou arquivos `.css` avulsos sem extrema necessidade.
- **Paleta de Cores**: Utilize as cores personalizadas do tema laranja:
  - `food-orange`: Cor principal para botões e destaques.
  - `food-light`: Fundo suave para áreas de conteúdo.
  - `food-dark`: Tons escuros para contrastes e textos fortes.
- **Responsividade**: Todas as telas devem ser funcionais em dispositivos móveis (Mobile First).

---

## 💻 Padrões de Código

1. **Separação de Responsabilidades**: 
    - Nunca coloque lógica de banco de dados diretamente nos roteadores. Use os **Controllers**.
    - Validações complexas devem residir em **Middlewares** ou **Services**.
2. **Nomenclatura**:
    - Controllers: `NomeController.js` (ex: `SiteController.js`).
    - Views: Minúsculas com hífens se necessário (ex: `dashboard.ejs`).
    - Variáveis e Funções: `camelCase`.
3. **Comentários**: Documente funções complexas e mantenha o código limpo (Clean Code).

---

## 🚀 Processo de Contribuição

1. **Clone**: Faça o fork e clone do projeto.
2. **Branch**: Crie uma branch para sua funcionalidade (`git checkout -b feature/minha-melhoria`).
3. **Tailwind**: Certifique-se de rodar `npm run tailwind:build` antes de testar mudanças visuais.
4. **Commit**: Use mensagens claras (`[contexto]: descrição curta`).
5. **Sync**: Garanta que sua branch está atualizada com a `main`.

---

## ⚖️ Licença

Ao contribuir, você aceita que seu código será distribuído sob a licença **GPL-3.0**.

---

Seguir estas regras garante que o **VendaMais** continue sendo um projeto profissional e fácil de manter por todos. **Mãos à obra!** 🍕🔥
