const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

app.post('/process-photos', upload.array('photos', 30), (req, res) => {
  console.log('Fotos recebidas:', req.files.length);
  res.json({ 
    message: 'Modelo 3D gerado!',
    photosReceived: req.files.length 
  });
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});