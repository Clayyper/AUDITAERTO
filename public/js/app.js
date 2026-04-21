const form = document.getElementById('calculoForm');
const limparBtn = document.getElementById('limparBtn');
const resultadoVazio = document.getElementById('resultadoVazio');
const resultadoBox = document.getElementById('resultadoBox');
const resumoTotais = document.getElementById('resumoTotais');
const rubricasTabela = document.getElementById('rubricasTabela');
const memoriaLista = document.getElementById('memoriaLista');
const avisosLista = document.getElementById('avisosLista');
const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
const panels = document.querySelectorAll('.tab-panel');

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function formToJSON(formElement) {
  const data = new FormData(formElement);
  const payload = {};
  for (const [key, value] of data.entries()) payload[key] = value;
  payload.feriasVencidasEmDobro = formElement.querySelector('[name="feriasVencidasEmDobro"]').checked;
  return payload;
}

function setTab(tabId) {
  tabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  panels.forEach((panel) => panel.classList.toggle('hidden', panel.id !== tabId));
}

function renderResultado(resultado) {
  resultadoVazio.classList.add('hidden');
  resultadoBox.classList.remove('hidden');

  resumoTotais.innerHTML = `
    <div class="summary-item"><small>Bruto</small><strong>${formatBRL(resultado.totais.bruto)}</strong></div>
    <div class="summary-item"><small>Descontos</small><strong>${formatBRL(resultado.totais.descontos)}</strong></div>
    <div class="summary-item"><small>Líquido</small><strong>${formatBRL(resultado.totais.liquido)}</strong></div>
  `;

  const rows = Object.entries(resultado.rubricas)
    .map(([chave, valor]) => `<tr><td>${chave}</td><td>${formatBRL(valor)}</td></tr>`)
    .join('');

  rubricasTabela.innerHTML = `
    <table class="table">
      <thead><tr><th>Rubrica</th><th>Valor</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  memoriaLista.innerHTML = (resultado.memoriaTexto || []).map((item) => `<li>${item}</li>`).join('');
  avisosLista.innerHTML = (resultado.avisos || []).map((item) => `<div class="alert">${item}</div>`).join('');
}

function restoreForm() {
  const state = window.AppState?.loadState?.() || {};
  const formulario = state.formulario || {};
  Object.entries(formulario).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) return;
    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
    } else {
      field.value = value;
    }
  });

  if (state.calculo) {
    renderResultado(state.calculo);
  }
}

function persistForm() {
  const payload = formToJSON(form);
  window.AppState?.saveState?.({ formulario: payload });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = formToJSON(form);
  persistForm();

  const response = await fetch('/api/calculo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const resultado = await response.json();
  localStorage.setItem('ultimoCalculoRescisao', JSON.stringify(resultado));
  window.AppState?.saveState?.({ formulario: payload, calculo: resultado });
  renderResultado(resultado);
  setTab('tab-resultado');
});

form.addEventListener('input', persistForm);
form.addEventListener('change', persistForm);

limparBtn.addEventListener('click', () => {
  form.reset();
  window.AppState?.saveState?.({ formulario: {}, calculo: null });
});

tabButtons.forEach((btn) => btn.addEventListener('click', () => setTab(btn.dataset.tab)));

restoreForm();
