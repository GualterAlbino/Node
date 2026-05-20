## 🧩 Padronização de commits (Husky + Commitlint)

Para garantir um histórico de commits limpo, padronizado e rastreável, o projeto utiliza Husky e Commitlint, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).

- A. Instalação das dependências

  ```bash
  npm install --save-dev husky @commitlint/config-conventional @commitlint/cli
  ```

**Dependências:**

- **husky** -> Gerencia os Git hooks (gatilhos de execução).
- **commitlint** -> Valida as mensagens de commit.
- **@commitlint/config-conventional** -> Define o padrão Conventional Commits (feat:, fix:, chore:, etc).

- B. Configuração do Commitlint
Crie um arquivo commitlint.config.js na raiz do projeto com o seguinte conteúdo:

  ```javascript
    module.exports = {
      extends: ['@commitlint/config-conventional'],
    };
  ```
Padrão esperado:
- ✅ feat: adiciona endpoint de autenticação
- ✅ fix: corrige bug no repositório de usuários
- ❌ update coisas (inválido)

- C. Configuração do Husky
O Husky é uma ferramenta (um pacote npm) muito popular no ecossistema JavaScript/Node.js que facilita o uso e o gerenciamento dos Git Hooks.Git Hooks (ou "ganchos" do Git) são scripts que o Git executa automaticamente em determinados momentos do seu fluxo de trabalho. Pense neles como "gatilhos".

**Exemplos comuns:**
- **pre-commit:** Executa um script antes que um commit seja finalizado.
- **pre-push:**  Executa um script antes que seu código seja enviado (push) para o repositório remoto.
- **post-commit:**  Executa um script depois que um commit é finalizado.

Inicialização do Husky no projeto:
  ```bash
  npx husky init
  ```
Esse comando criará a pasta ```.husky/```

Em seguida, adicione o script abaixo no package.json para garantir a reinstalação automática do Husky após npm install:

```json
  "scripts": {
    "prepare": "husky install"
  }
```

- D. Definir o ```lint-staged```

Instalar as dependências:
```bash
  npm install lint-staged --save-dev
```

Configurar o seguinte script no **package.json**:
```json
  "lint-staged": {
    "src/**/*.{ts,tsx,js,jsx}": [
      "npx @biomejs/biome format --write",
      "npx @biomejs/biome lint --write"
    ]
  }
```

- D. Criando os hooks: ```commit-msg``` e ```pre-commit```
Crie os arquivos dentro da pasta ```.husky/``` com os respetivos nomes e conteúdo:

- **commit-msg**:
```
  #!/bin/sh

  # --- Etapa 4: Validação da Mensagem de Commit ---
  echo ""
  echo "------------------------------------------------------"
  echo "| ✍️  Validando a mensagem de commit (commitlint)..."
  echo "------------------------------------------------------"

  # O $1 é o arquivo temporário que armazena a mensagem de commit
  npx --no -- commitlint --edit "$1"

  # Se o commitlint falhar, ele abortará o script com (exit 1)
  # Se chegar aqui, é porque passou.
  echo "------------------------------------------------------"
  echo "✅ SUCESSO: A mensagem de commit está no padrão."
  echo "------------------------------------------------------"
```

- **pre-commit**:
```
  #!/bin/sh

  # --- Etapa 1: Formatação e Lint (lint-staged) ---
  echo ""
  echo "------------------------------------------------------"
  echo "🧹 Executando lint-staged (Format + Lint)..."
  echo "------------------------------------------------------"
  npm run lint-staged

  # lint-staged vai 'exit 1' (falhar) se houver erros de lint que não puderam ser corrigidos
  if [ $? -ne 0 ]; then
    echo ""
    echo "❌ FALHA: Erros de lint ou formatação encontrados."
    echo "Commit abortado."
    exit 1
  else
    echo "✅ SUCESSO: Arquivos formatados e 'lintados'."
  fi

  # --- Etapa 2: Verificação de Tipos (TypeScript) ---
  echo ""
  echo "------------------------------------------------------"
  echo "|🚀 Executando verificação de tipos (types:check)..."
  echo "------------------------------------------------------"
  npm run types:check

  if [ $? -ne 0 ]; then
    echo "" # Adiciona espaço
    echo "❌ FALHA: Erros encontrados pelo TypeScript (tsc)."
    echo "Commit abortado."
    exit 1
  else
    echo "✅ SUCESSO: Verificação de tipos concluída."
  fi


  # --- Etapa 3: Verificação de Padrão (Biome) ---
  echo ""
  echo "------------------------------------------------------"
  echo "| 🏔️ Executando verificação do Biome (lint + format)..."
  echo "------------------------------------------------------"
  npm run biome:check

  if [ $? -ne 0 ]; then
    echo "" # Adiciona espaço
    echo "❌ FALHA: Erros de lint ou formatação encontrados."
    echo "Dica: Tente rodar 'npm run biome:format && npm run biome:lint' para corrigir."
    echo "Commit abortado."
    exit 1
  else
    echo "✅ SUCESSO: Verificação do Biome concluída."
  fi


  # --- Conclusão ---
  echo ""
  echo "------------------------------------------------------"
  echo "| ✅ Todas as verificações de pre-commit passaram."
  echo "------------------------------------------------------"
  exit 0
```

- 🚀 Ao fazer um commit o fluxo esperado é:
  - 1 - Executa o biome format + lint
    (Aplica a formatação da biblioteca como identação, quebra de linha e etc... apenas nos arquivos commitados)

  - 2 - Faz uma verificação de tipos que podem quebrar o build.
    (Executa o comando **npm run types:check** que faz a validação nos arquivos commitados)

  - 3 - Faz uma verificação com o biome validando se todas as regras definidas foram respeitadas
    (Valida tudo que foi condigurado como regra de lint, como por exemplo: Importações não utilizadas nos arquivos commitados)

  - 4 - Faz uma verificação na mensagem de commit validando se está no padrão/convenção
</details>



---

