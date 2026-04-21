# Rescisão TRCT v7

Sistema de cálculo rescisório com auditoria de TRCT e geração de relatório PDF inspirado no layout oficial.

## Novidades da v7
- persistência local do formulário, cálculo, TRCT importado e última auditoria
- botão para gerar relatório PDF de conferência
- PDF gerado no backend com visual inspirado no TRCT

## Instalação
```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

## Fluxo
1. Preencha o cálculo e clique em **Calcular**.
2. Vá para **Auditoria TRCT**.
3. Importe o documento e revise os campos.
4. Clique em **Comparar agora**.
5. Clique em **Gerar relatório PDF**.

## Observação
O relatório é para conferência interna. Sempre valide os valores finais com a documentação oficial e as regras jurídicas aplicáveis.
