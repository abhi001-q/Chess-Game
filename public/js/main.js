const socket = io();
// Chess.js should be loaded via a <script> tag in your HTML for browser usage
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerColor = null;
let selectedSquare = null;
let suggestedMoves = [];

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + squareindex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareindex;

      // Highlight suggested moves
      if (
        suggestedMoves.some((m) => m.row === rowIndex && m.col === squareindex)
      ) {
        squareElement.classList.add("suggestion");
      }

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerColor === square.color;

        // Mouse/touch select for suggestions
        pieceElement.addEventListener("click", () => {
          if (playerColor === square.color) {
            selectedSquare = { row: rowIndex, col: squareindex };
            suggestedMoves = getSuggestions(selectedSquare);
            renderBoard();
          }
        });

        pieceElement.addEventListener("touchstart", (e) => {
          e.preventDefault();
          if (playerColor === square.color) {
            selectedSquare = { row: rowIndex, col: squareindex };
            suggestedMoves = getSuggestions(selectedSquare);
            renderBoard();
          }
        });

        // Drag events (desktop)
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceElement.addEventListener("dragend", (e) => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      // Drop for drag
      squareElement.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      squareElement.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
          selectedSquare = null;
          suggestedMoves = [];
        }
      });

      // Touch move
      squareElement.addEventListener("touchend", function (e) {
        if (
          selectedSquare &&
          suggestedMoves.some(
            (m) => m.row === rowIndex && m.col === squareindex
          )
        ) {
          handleMove(selectedSquare, { row: rowIndex, col: squareindex });
          selectedSquare = null;
          suggestedMoves = [];
          renderBoard();
        }
      });

      boardElement.appendChild(squareElement);
    });
  });
};
// Get move suggestions for a selected piece
function getSuggestions(square) {
  const board = chess.board();
  const piece = board[square.row][square.col];
  if (!piece || piece.color !== playerColor) return [];
  // Get all legal moves for this piece
  const moves = chess.moves({
    square: `${String.fromCharCode(97 + square.col)}${8 - square.row}`,
    verbose: true,
  });
  return moves.map((m) => {
    // Convert algebraic to board indices
    return {
      row: 8 - parseInt(m.to[1]),
      col: m.to.charCodeAt(0) - 97,
    };
  });
}

const handleMove = (sourceSquare, targetSquare) => {
  const move = {
    from: `${String.fromCharCode(97 + sourceSquare.col)}${
      8 - sourceSquare.row
    }`,
    to: `${String.fromCharCode(97 + targetSquare.col)}${8 - targetSquare.row}`,
    promotion: "q", // Only include promotion if needed
  };
  socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
  // Use color to determine which unicode to use
  const unicodePieces = {
    w: {
      p: "♙",
      r: "♖",
      n: "♘",
      b: "♗",
      q: "♕",
      k: "♔",
    },
    b: {
      p: "♙",
      r: "♜",
      n: "♞",
      b: "♝",
      q: "♛",
      k: "♚",
    },
  };
  if (!piece || !piece.type || !piece.color) return "";
  return unicodePieces[piece.color][piece.type] || "";
};

socket.on("playerColor", (color) => {
  playerColor = color;
  renderBoard();
});

socket.on("spectator", (message) => {
  playerColor = null;
  alert(message);
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
});
socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});
