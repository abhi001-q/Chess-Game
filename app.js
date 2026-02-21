const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { chess });
});

io.on("connection", function (unqiuesocket) {
  console.log("user connected: ");

  if (!players.white) {
    players.white = unqiuesocket.id;
    unqiuesocket.emit("playerColor", "w");
  } else if (!players.black) {
    players.black = unqiuesocket.id;
    unqiuesocket.emit("playerColor", "b");
  } else {
    unqiuesocket.emit("spectator", "You are a spectator");
    return;
  }

  unqiuesocket.on("disconnect", function () {
    if (unqiuesocket.id === players.white) {
      delete players.white;
    } else if (unqiuesocket.id === players.black) {
      delete players.black;
    }
  });

  unqiuesocket.on("move", (move) => {
    try {
        if (chess.turn() === "w" && unqiuesocket.id !== players.white) return;
        if (chess.turn() === "b" && unqiuesocket.id !== players.black) return;

     const result =  chess.move(move);
     if(result){
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
     }
     else{
        console.log("Invalid move attempted: ", move);
        unqiuesocket.emit("invalidMove", move ); 
     }

    } catch (error) {
        console.log(error);
        unqiuesocket.emit('invalidMove : ', move);
    }
  });

});

server.listen(3000, function () {
  console.log("Server is running on port 3000");
});

