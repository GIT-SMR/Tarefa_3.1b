# Animalec — Tarefa 3.1 b)

Repositório da tarefa: [GIT-SMR/Tarefa_3.1b](https://github.com/GIT-SMR/Tarefa_3.1b).

Extensão da área de administração do Animalec para gerir patrocinadores e especialistas científicos. A versão de demonstração usa dados fictícios para testar os percursos.

## Abrir os protótipos

Abre [o menu de administração da demonstração](public/prototipos/index.html) a partir da pasta local, num navegador. Podes abrir o menu e as duas páginas HTML diretamente, sem instalar dependências.

- [Patrocinadores](public/prototipos/patrocinadores.html) — nome e email obrigatórios, país opcional e pelo menos um animal.
- [Especialistas científicos](public/prototipos/especialistas.html) — nome e email obrigatórios, instituição opcional e pelo menos uma espécie ou família.

Cada lista permite adicionar, consultar, editar e remover registos. O email é único dentro de cada lista. A mesma associação pode ser escolhida em vários registos. A remoção de um registo conserva os animais, espécies e famílias disponíveis. Os dados de teste são guardados no navegador quando o armazenamento local está disponível. Para testar a conservação das alterações entre recarregamentos de forma consistente, abre a demonstração através de um servidor local:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

No navegador, abre [http://127.0.0.1:8000/prototipos/](http://127.0.0.1:8000/prototipos/). As quatro opções da base são representadas no menu da demonstração e têm as rotas originais na aplicação Vue.

## Integração na aplicação

O menu Vue em `/admin` inclui as duas novas opções. As páginas `/admin/patrocinadores` e `/admin/especialistas` usam o mesmo código dos protótipos HTML5 e voltam ao menu original. As rotas integradas usam a sessão de administração do Animalec. O protótipo guarda os dados de demonstração no navegador e não precisa do servidor de dados original.

Para compilar o front-end com a cadeia de ferramentas original:

```sh
npm ci --ignore-scripts --no-audit --no-fund --legacy-peer-deps
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

A segunda linha usa a opção necessária nesta compilação com Node.js 24 e Webpack 4. A compilação gera `dist/`. O [README da base](README.Animalec.md) documenta a estrutura original.

## Desenhos e origem

A pasta [desenhos](desenhos/) contém os seis ficheiros draw.io editáveis. Os wireframes e os mockups cobrem o menu, as listas, os formulários, os detalhes e a confirmação de remoção em computador e telemóvel.

Base de front-end: [Animalec partilhado por José Ramos](https://github.com/josthelvish/Animalec/tree/25a0544fb2564fddf73d7d4a2a5ba42f764b4c36/Front-end_Animalec-master). Enunciado: [Tarefa 3.1 — Prototipagem](https://elearning.uab.pt/mod/page/view.php?id=1433910).

## Validação local

Compilação Vue concluída. Os avisos remanescentes referem-se a módulos Vuex e ao tamanho dos ficheiros da base. Verificados em Chromium o acesso às duas entidades pelo menu, a criação, consulta, edição, remoção e cancelamento, as associações múltiplas, a conservação de alterações após recarregar e as mensagens de validação.

| Verificação | Ecrãs |
|---|---|
| HTML5 autónomo | 1440 × 900, 390 × 844 e 320 × 740 |
| Menu e rotas Vue com sessão de teste | 1440 × 900 e 390 × 844 |

Os ecrãs de telemóvel foram emulados. A sessão de teste e os dados utilizados eram fictícios.
