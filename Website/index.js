const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const db = require("./models/db");
const AuthRoute = require("./routes/auth");
const Order = require("./models/orders.js");
const Supply = require("./models/cocktailSupply.js");

const app = express();
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);
const io = socketio(server);

const viewsDirectory = path.join(__dirname, "/templates/views");
const partialsDirectory = path.join(__dirname, "/templates/partials");
const publicDirectory = path.join(__dirname, "./public");

app.set("view engine", "hbs");
app.set("views", viewsDirectory);
hbs.registerPartials(partialsDirectory);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(AuthRoute);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New websocket connection!");
  Order.watch().on("change", async (change) => {
    socket.emit("latestTransaction", change.fullDocument);
    return socket.emit("supplyUpdate", change.fullDocument);
  });
});
