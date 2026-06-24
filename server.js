const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process-photos', upload.array('photos', 30), (req, res) => {
  console.log('Fotos recebidas:', req.files.length);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhuma foto enviada' });
  }

  res.json({
    message: 'Fotos processadas com sucesso!',
    photosCount: req.files.length,
    modelUrl: 'https://seu-modelo-3d.com/modelo.glb'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} ✅`);
});
