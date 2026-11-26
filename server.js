import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '100kb' }));
app.use(express.static(__dirname));

app.post('/api/gerar-receita', async (req, res) => {
    const pratos = Array.isArray(req.body?.pratos)
        ? req.body.pratos.map(prato => String(prato).trim()).filter(Boolean).slice(0, 30)
        : [];

    if (!pratos.length) {
        return res.status(400).json({ error: 'Selecione pelo menos um prato.' });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'A chave da NVIDIA_API_KEY ainda não foi configurada no servidor.' });
    }

    const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct';

    try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                temperature: 0.7,
                max_tokens: 1400,
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um chef de cozinha natalina brasileiro. Responda em português do Brasil. Gere uma receita completa para o prato solicitado, incluindo título, rendimento, tempo, lista completa de ingredientes com quantidades, modo de preparo numerado e dicas. Se houver vários pratos, organize uma receita principal e sugestões práticas. Não invente ingredientes indisponíveis e não use Markdown dentro de tabelas.'
                    },
                    {
                        role: 'user',
                        content: `Crie receitas práticas para estes itens da ceia: ${pratos.join(', ')}.`
                    }
                ]
            })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            const message = payload.error?.message || payload.detail || 'Erro ao consultar a NVIDIA.';
            return res.status(response.status).json({ error: message });
        }

        const receita = payload.choices?.[0]?.message?.content?.trim();
        if (!receita) {
            return res.status(502).json({ error: 'A IA não retornou conteúdo válido.' });
        }

        return res.json({ receita });
    } catch (error) {
        console.error('Erro na API da NVIDIA:', error);
        return res.status(502).json({ error: 'Não foi possível comunicar com a IA da NVIDIA.' });
    }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Servidor disponível em http://localhost:${port}`);
});
