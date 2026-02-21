# ♟ Chess Game

A real-time multiplayer chess game built with **Node.js**, **Express**, **Socket.IO**, and **Chess.js**. Two players can play against each other in the browser with live move updates, while additional users can join as spectators.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=fff)

## Features

- **Real-time Multiplayer** — Two players connect via WebSockets and play live against each other.
- **Spectator Mode** — Additional users automatically join as spectators and can watch the game in real time.
- **Drag & Drop** — Move pieces by dragging them on desktop.
- **Click to Move** — Click a piece to see suggested moves highlighted on the board, then click a destination square.
- **Move Validation** — All moves are validated server-side using Chess.js to prevent illegal moves.
- **Board Flipping** — The board automatically flips for the black player.
- **Unicode Chess Pieces** — Clean piece rendering using Unicode characters.
- **Responsive Layout** — Styled with Tailwind CSS for a centered, clean board UI.

## Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Backend  | Node.js, Express 5 |
| Realtime | Socket.IO 4        |
| Logic    | Chess.js           |
| View     | EJS                |
| Styling  | Tailwind CSS (CDN) |
| Client   | Vanilla JavaScript |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abhi001-q/Chess-Game.git
   cd Chess-Game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   node app.js
   ```

4. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Play!**
   - Open a second browser tab/window to connect as the second player.
   - Any additional tabs will join as spectators.

## Project Structure

```
Chess-Game/
├── app.js              # Express server, Socket.IO setup, game logic
├── package.json
├── views/
│   └── index.ejs       # Main HTML page with chessboard UI
├── public/
│   ├── css/
│   │   └── style.css   # Additional styles
│   └── js/
│       └── main.js     # Client-side game logic (rendering, drag/drop, sockets)
```

## How It Works

1. The server creates a chess game instance using Chess.js.
2. The first two players to connect are assigned **white** and **black** respectively.
3. Players make moves via drag-and-drop or click-to-move on the board.
4. Each move is sent to the server via Socket.IO, validated, and if legal, broadcast to all connected clients.
5. The board state syncs in real time across all clients.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
