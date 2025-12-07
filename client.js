const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// --- AJUSTE AQUI: O CAMINHO PARA O SEU ARQUIVO PDF DE TESTE ---
const PDF_FILE_PATH = path.join(__dirname, 'docs/manifestação.pdf');
// Certifique-se de que este arquivo existe ou mude o caminho.
// -----------------------------------------------------------

const SERVER_URL = 'http://localhost:3000/upload-pdf';

async function sendPdfForAnalysis() {
    console.log(`📡 Tentando enviar o arquivo: ${PDF_FILE_PATH}`);

    // 1. Verifica se o arquivo existe
    if (!fs.existsSync(PDF_FILE_PATH)) {
        console.error(`\n❌ Erro: Arquivo PDF não encontrado no caminho: ${PDF_FILE_PATH}`);
        console.error("Por favor, verifique se o caminho acima está correto.");
        return;
    }

    try {
        // 2. Cria o objeto FormData
        const form = new FormData();

        // Adiciona o arquivo. O nome do campo DEVE ser 'pdfFile', 
        // conforme configurado no `multer` do servidor (`upload.single("pdfFile")`).
        form.append('pdfFile', fs.createReadStream(PDF_FILE_PATH));

        // 3. Envia a requisição POST
        const response = await axios.post(SERVER_URL, form, {
            headers: {
                // Necessário para que o Axios use o Boundary correto do FormData
                ...form.getHeaders(), 
            },
            maxBodyLength: Infinity,
        });

        // 4. Exibe o resultado da análise
        console.log('\n--- ✅ Resposta do Servidor ---');
        console.log(`Status HTTP: ${response.status}`);
        console.log('Classificação e Ação Sugerida (Resposta do Gemini):');

        // Formata a saída de forma mais legível
        console.log('\x1b[1m\x1b[31m%s\x1b[0m', response.data.analysis);
        console.log('-------------------------------\n');
    } catch (error) {
        if (error.response) {
            // Erros retornados pelo servidor (ex: 400 Bad Request, 500 Internal Server Error)
            console.error('\n--- ❌ Erro na Requisição ---');
            console.error(`Status: ${error.response.status}`);
            console.error('Mensagem:', error.response.data);
        } else {
            // Erros de rede (ex: Servidor offline)
            console.error("\n❌ Erro de Rede: Verifique se o servidor Express está rodando em http://localhost:3000.");
            console.error(error.message);
        }
    }
}

sendPdfForAnalysis();