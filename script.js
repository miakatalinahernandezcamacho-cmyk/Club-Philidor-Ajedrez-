// ============ MENÚ MÓVIL ============
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ TABLERO INTERACTIVO ============
const PIECES_UNICODE = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

function startingPosition() {
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let c = 0; c < 8; c++) {
    board[0][c] = 'b' + back[c];
    board[1][c] = 'bP';
    board[6][c] = 'wP';
    board[7][c] = 'w' + back[c];
  }
  return board;
}

const boardEl = document.getElementById('chess-board');
const statusEl = document.getElementById('board-status');
const resetBtn = document.getElementById('board-reset');

let boardState = startingPosition();
let selected = null; // {row, col}

function renderBoard() {
  if (!boardEl) return;
  boardEl.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const sq = document.createElement('button');
      sq.type = 'button';
      const isLight = (row + col) % 2 === 0;
      sq.className = 'square ' + (isLight ? 'light' : 'dark');
      sq.dataset.row = row;
      sq.dataset.col = col;

      const file = 'abcdefgh'[col];
      const rank = 8 - row;
      sq.setAttribute('aria-label', file + rank);

      const piece = boardState[row][col];
      if (piece) {
        const span = document.createElement('span');
        span.className = piece[0] === 'w' ? 'piece-white' : 'piece-black';
        span.textContent = PIECES_UNICODE[piece];
        sq.appendChild(span);
      }

      if (selected && selected.row === row && selected.col === col) {
        sq.classList.add('selected');
      }

      sq.addEventListener('click', () => handleSquareClick(row, col));
      boardEl.appendChild(sq);
    }
  }
}

function handleSquareClick(row, col) {
  const piece = boardState[row][col];

  if (selected) {
    if (selected.row === row && selected.col === col) {
      selected = null;
      statusEl.textContent = 'Selecciona una pieza para mover.';
      renderBoard();
      return;
    }
    // mover pieza seleccionada a la casilla destino (sin validar reglas)
    boardState[row][col] = boardState[selected.row][selected.col];
    boardState[selected.row][selected.col] = null;
    selected = null;
    statusEl.textContent = 'Movimiento realizado. Selecciona otra pieza.';
    renderBoard();
    return;
  }

  if (piece) {
    selected = { row, col };
    const file = 'abcdefgh'[col];
    const rank = 8 - row;
    statusEl.textContent = 'Pieza en ' + file + rank + ' seleccionada. Elige la casilla de destino.';
    renderBoard();
  }
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    boardState = startingPosition();
    selected = null;
    statusEl.textContent = 'Tablero reiniciado. Selecciona una pieza para mover.';
    renderBoard();
  });
}

renderBoard();
