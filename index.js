require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const ai = new GoogleGenAI({});

function fileToLlmData(filePath, mimeType) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  return { inlineData: { data: base64Data, mimeType } };
}

async function main() {
  const pdfPath = path.join(process.cwd(), "docs/manifestação.pdf");

  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: arquivo não encontrado em ${pdfPath}`);
    return;
  }

  try {
    const pdfPart = fileToLlmData(pdfPath, "application/pdf");
    const contents = [
      pdfPart,
      {
        text: 
          `Você é um Analista Jurídico de Triagem especializado em decisões de Primeiro Grau. Sua única função é analisar o texto completo da intimação judicial fornecida abaixo e classificá-lo, indicando a ação processual imediata (recurso ou manifestação) e os prazos estritos. O tom deve ser objetivo, técnico e focado em prazos.

          Restrições:

          A análise é restrita a decisões de Primeiro Grau. Ignore tribunais superiores.
          Não faça inferências sobre o mérito do processo. Responda apenas com a classificação e a ação sugerida.

          Regras de Classificação (Exceção/Gatilho Prioritário):

          1-(SENTENÇA/JULGAMENTO DE MÉRITO): Se o texto contiver 'julgo parcialmente', 'procedente', 'parcialmente improcedente' e/ou 'julgo improcedente', a classificação deve ser 'Sentença de Mérito (Primeiro Grau)'. A ação sugerida é 'Decisão cabível: Embargos de Declaração em 5 dias úteis OU Apelação em 15 dias úteis.'
          2-(MANIFESTAÇÃO - MANIF): Se o texto contiver a variável 'manif' (e não se enquadrar na Regra 1), a classificação deve ser 'Diligência/Manifestação Necessária'. A ação sugerida é 'Necessária manifestação processual da parte sobre o teor da publicação. Nenhum recurso imediato cabível.'
          3-(OUTROS/GERAL): Se não se enquadrar nas regras 1 ou 2, a classificação deve ser 'Publicação Informativa'. A ação sugerida é 'Aguardar andamento ou cumprimento de rotina. Nenhuma ação recursal ou manifestação urgente requerida.'

          Formato de Saída Requerido:

          Sua resposta deve ter EXATAMENTE duas linhas (Classificação e Ação/Recurso), seguindo este modelo:
          Classificação da DecisãoAção/Recurso Sugerido (com prazos)
          Siga as regras e me retorne apenas uma das strings definidos no projeto.`
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", contents: contents,
    });

    console.log('\n-'+response.text+'\n-');
  } catch (error) {
    console.error(error.message);
  }
}

main().catch(console.error);