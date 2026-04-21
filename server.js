const express = require('express');
const path = require('path');

const calculoRoutes = require('./src/routes/calculo.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const auditoriaRoutes = require('./src/routes/auditoria.routes');
const relatorioRoutes = require('./src/routes/relatorio.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'rescisao-trct-auditoria' });
});

app.use('/api/calculo', calculoRoutes);
app.use('/api/upload-trct', uploadRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/relatorio', relatorioRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auditoria', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auditoria.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: 'Erro interno do servidor.',
    details: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
