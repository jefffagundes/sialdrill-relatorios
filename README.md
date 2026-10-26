# Sialdrill — Relatório Fotográfico de Ramais

Protótipo local em React + Vite.

## Como executar no VS Code
1. Extraia o ZIP e abra a pasta no VS Code.
2. Instale Node.js (recomendado versão 20 ou superior).
3. Abra **Terminal > Novo Terminal**.
4. Execute `npm install`.
5. Execute `npm run dev`.
6. Abra o endereço indicado no terminal, normalmente `http://localhost:5173`.

## Recursos
- Dados gerais do relatório.
- Importação de várias fotografias.
- Tabela de imóveis com endereço, número, cruzamento da rede de gás, distância/paralelismo e lado.
- Paridade automática (par/ímpar) pelo número, com possibilidade de correção manual.
- Uma fotografia grande por página no PDF, após a tabela geral, com legenda vinculada ao imóvel.

## Limitação desta primeira versão
Os dados e imagens ficam somente na memória da página. Não há login, banco de dados ou armazenamento compartilhado. Fechar/atualizar a página pode apagar as informações. Antes de publicar para toda a equipe, será preciso adicionar autenticação e armazenamento persistente.

As imagens são associadas, em ordem, aos imóveis sem foto. Confira a associação e os dados antes de gerar o PDF.
