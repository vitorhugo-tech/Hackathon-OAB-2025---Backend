
# OAB Backend — Análise Jurídica Automatizada

Projeto backend simples que processa o texto extraído de PDFs de intimação judicial, analisa o conteúdo usando um modelo de linguagem (Google GenAI) e envia o resultado por e-mail ao usuário.

**Propósito:** Automatizar a classificação rápida de decisões judiciais (decisão interlocutória, sentença, monocrática, acórdão ou não intimação) e, quando aplicável, indicar o(s) recurso(s) cabível(eis) com avaliação de risco.

**Tecnologias:**
- **Node.js** (JavaScript)
- **Express**: servidor HTTP
- **@google/genai**: cliente para gerar conteúdo com o modelo Gemini (GenAI)
- **nodemailer**: envio de e-mail

**Estrutura principal:**
- `index.js` — ponto de entrada; contém rota HTTP, integração com LLM e envio de e-mail.
- `.env.example` — exemplo de variáveis de ambiente necessárias.

**Funcionalidades**
- Recebe texto extraído de PDF via endpoint HTTP.
- Encaminha o texto ao modelo com prompt jurídico especializado.
- Envia o resultado por e-mail em HTML enriquecido.

**Requisitos**
- Node.js 18+ (ou versão compatível)
- Conta/credenciais do provedor LLM (Google GenAI / Gemini)
- Servidor SMTP ou serviço de testes (ex.: Mailtrap, SendGrid)

**Variáveis de ambiente**
Copie ` .env.example` para `.env` e preencha os valores.

- `PORT` : porta do servidor (padrão `3000`).
- `GEMINI_API_KEY` : chave da API do Google GenAI.
- `SMTP_HOST` : host do servidor SMTP.
- `SMTP_PORT` : porta do servidor SMTP (ex.: `587`).
- `SMTP_USER` : usuário SMTP.
- `SMTP_PASS` : senha SMTP.

**Instalação e execução (local)**

1. Clone o repositório:

```powershell
git clone https://github.com/vitorhugo-tech/Hackathon-OAB-2025---Backend.git .
```

2. Instale as dependências:

```powershell
npm install
```

3. Crie um arquivo `.env` baseado em ` .env.example` e preencha as credenciais.

4. Inicie o servidor:

```powershell
npm start
# ou
node index.js
```

O servidor ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

**Endpoint HTTP**

- `POST /upload-pdf`

Requisitos do corpo (JSON):

- `from` (string) — e-mail do destinatário (obrigatório).
- `subject` (string) — assunto do documento (opcional, usado no assunto do e-mail).
- `pdfText` (string) — texto extraído do PDF (corpo que será analisado pelo LLM).

Exemplo usando `curl`:

```powershell
curl -X POST "http://localhost:3000/upload-pdf" \
	-H "Content-Type: application/json" \
	-d '{"from":"usuario@exemplo.com","subject":"Intimação X","pdfText":"TEXTO_DA_INTIMACAO_AQUI"}'
```

Resposta de sucesso (exemplo):

```json
{
	"status": "Sucesso",
	"message": "Análise enviada por e-mail.",
	"email": "usuario@exemplo.com"
}
```

**Como funciona (resumo técnico)**

- O endpoint recebe o campo `pdfText` e concatena ao prompt jurídico `JURIDICAL_SYSTEM_PROMPT` definido em `index.js`.
- O código chama `ai.models.generateContent(...)` do pacote `@google/genai` para obter a análise do modelo.
- Em seguida, usa `nodemailer` para construir um e-mail HTML e enviar o resultado ao remetente informado.

**Prompt e regras de classificação**

O prompt embutido em `index.js` descreve regras rígidas de classificação (Decisão Interlocutória, Sentença, Monocrática, Acórdão, ou caso não enquadrado) e exige retorno estrito das strings previstas pelo projeto. A saída também deve incluir avaliação de risco quando houver recurso cabível.

**Dicas e troubleshooting**

- Se o envio de e-mail falhar, verifique as variáveis `SMTP_*` e teste com serviço de sandbox (ex.: Mailtrap).
- Se o LLM retornar erro de autenticação, confirme a variável `GEMINI_API_KEY` e o método de autenticação requerido pelo SDK `@google/genai`.
- Caso deseje testar sem LLM, você pode mockar `processPdf()` para retornar um texto estático durante o desenvolvimento.

**Próximos passos recomendados**

- Validar e sanitizar `pdfText` (tamanho e conteúdo) antes de enviar ao modelo para reduzir custos.
- Adicionar autenticação na rota (`API key` ou token) para limitar uso.
- Persistir logs/relatórios das análises em banco de dados para auditoria.
- Adicionar testes automatizados para rota e integração com `nodemailer` (usar mocks).

**Contribuição**

Abra issues ou envie pull requests. Mantenha o estilo do projeto e documente alterações significativas.