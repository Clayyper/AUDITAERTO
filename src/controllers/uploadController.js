const { parseTRCT } = require('../services/parserTRCT');
const { normalizeTRCT } = require('../services/normalizadorTRCT');

async function importar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'Nenhum arquivo enviado.' });
    }

    const parsed = await parseTRCT(req.file.path, req.file.mimetype);
    const normalized = normalizeTRCT(parsed);

    return res.status(parsed.ok === false ? 422 : 200).json({
      ok: parsed.ok !== false,
      arquivo: {
        nome: req.file.originalname,
        tipo: req.file.mimetype,
        tamanho: req.file.size
      },
      ...normalized,
      erroLeitura: parsed.erroLeitura || null
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  importar
};
