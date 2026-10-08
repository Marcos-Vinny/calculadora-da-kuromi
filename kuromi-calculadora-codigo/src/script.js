const telaAtual = document.getElementById('atual');
const telaHistorico = document.getElementById('historico');

let atual = '0';
let anterior = '';
let operador = null;
let digitou = false;     
let novoNumero = false; 
const MAX_DIGITOS = 10;

function formatar(n) {
  if (!isFinite(n)) return '0';
  let t = String(parseFloat(n.toFixed(10)));
  if (t.replace('-', '').replace('.', '').length > MAX_DIGITOS) {
    t = String(parseFloat(n.toPrecision(MAX_DIGITOS - 2)));
    if (t.length > MAX_DIGITOS + 1) t = n.toExponential(4);
  }
  return t;
}

function atualizarTela() {
  telaAtual.textContent = atual.replace('.', ',');
  telaHistorico.textContent = anterior && operador ? `${anterior} ${operador}` : '';
}

function limpar() {
  novoNumero = false;
  digitou = false;
  atual = '0';
  anterior = '';
  operador = null;
  atualizarTela();
}

function apagar() {
  atual = atual.length > 1 ? atual.slice(0, -1) : '0';
  atualizarTela();
}

function inserirNumero(num) {
  if (novoNumero) { atual = '0'; novoNumero = false; }
  if (atual.replace('-', '').replace('.', '').length >= MAX_DIGITOS) return;
  digitou = true;
  if (atual === '0') {
    atual = num;
  } else {
    atual += num;
  }
  atualizarTela();
}

function inserirPonto() {
  digitou = true;
  if (novoNumero) { atual = '0'; novoNumero = false; }
  if (!atual.includes('.')) {
    atual += '.';
    atualizarTela();
  }
}

function porcento() {
  atual = formatar(parseFloat(atual) / 100);
  novoNumero = false;
  atualizarTela();
}

function inverterSinal() {
  if (atual !== '0') {
    atual = atual.startsWith('-') ? atual.slice(1) : '-' + atual;
    atualizarTela();
  }
}

function escolherOperador(op) {
  if (operador && anterior !== '' && digitou) {
    calcular();
  }
  anterior = atual;
  operador = op;
  atual = '0';
  novoNumero = false;
  digitou = false;
  atualizarTela();
}

function calcular() {
  if (!operador || anterior === '') return;
  const a = parseFloat(anterior);
  const b = parseFloat(atual);
  let resultado = 0;

  if (operador === '+') resultado = a + b;
  if (operador === '-') resultado = a - b;
  if (operador === '*') resultado = a * b;
  if (operador === '/') resultado = b === 0 ? 0 : a / b;

  atual = formatar(resultado);
  anterior = '';
  operador = null;
  novoNumero = true;
  digitou = false;
  atualizarTela();
}

document.querySelectorAll('.btn').forEach((botao) => {
  botao.addEventListener('click', () => {
    const num = botao.dataset.num;
    const op = botao.dataset.op;
    const acao = botao.dataset.acao;

    if (num !== undefined) inserirNumero(num);
    if (op !== undefined) escolherOperador(op);

    if (acao === 'limpar') limpar();
    if (acao === 'apagar') apagar();
    if (acao === 'ponto') inserirPonto();
    if (acao === 'porcento') porcento();
    if (acao === 'inverter') inverterSinal();
    if (acao === 'igual') calcular();

    botao.blur(); 
  });
});


document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const k = e.key;
  let tratado = true;

  if (k >= '0' && k <= '9') inserirNumero(k);
  else if (k === '+' || k === '-' || k === '*' || k === '/') escolherOperador(k);
  else if (k === ',' || k === '.') inserirPonto();
  else if (k === 'Enter' || k === '=') calcular();
  else if (k === 'Backspace') apagar();
  else if (k === 'Escape' || k === 'Delete') limpar();
  else if (k === '%') porcento();
  else tratado = false;

  if (tratado) e.preventDefault();
});

atualizarTela();


document.getElementById('btn-min').addEventListener('click', () => window.janela.minimizar());
document.getElementById('btn-fechar').addEventListener('click', () => window.janela.fechar());
