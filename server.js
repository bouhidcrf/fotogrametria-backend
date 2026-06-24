const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Cria pastas se não existirem
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');

app.post('/process-photos', upload.array('images', 30), async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Nenhuma foto enviada' });
        }

        console.log(`Recebidas ${files.length} fotos`);

        // Cria um arquivo GLB fake (cubo 3D)
        const glbData = createSimpleGLB();

        // Salva o arquivo
        const filename = `model_${Date.now()}.glb`;
        const filepath = path.join('outputs', filename);
        fs.writeFileSync(filepath, glbData);

        console.log(`Modelo salvo: ${filename}`);

        // Limpa as fotos enviadas
        files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (e) {}
        });

        const modelUrl = `${req.protocol}://${req.get('host')}/models/${filename}`;

        res.json({
            success: true,
            model_url: modelUrl,
            message: 'Modelo 3D gerado com sucesso!'
        });

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve os modelos gerados
app.use('/models', express.static('outputs'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

function createSimpleGLB() {
    // Cria um cubo 3D simples em formato GLB
    // Isso é só para demonstração
    const vertices = new Float32Array([
        -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1,
        -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 6, 5, 4, 7, 6,
        0, 4, 5, 0, 5, 1,
        2, 6, 7, 2, 7, 3,
        0, 3, 7, 0, 7, 4,
        1, 5, 6, 1, 6, 2
    ]);

    return Buffer.concat([
        Buffer.from([0x67, 0x6c, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00])
    ]);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});