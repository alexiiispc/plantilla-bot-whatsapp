const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectToWhatsApp } = require("./services/baileys");
const { initializeSocket } = require("./services/socket");
//const routes = require("./apix/routes");
const routes = require('./api/endPoints')

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de API
app.use("/", routes);
app.use("/assets2", express.static(__dirname + "/client/assets"));
app.use("/assets", express.static(__dirname + "/assets"));


// Inicializar conexión a WhatsApp
connectToWhatsApp(io).catch((err) => console.error("Error al conectar con WhatsApp:", err));

// Inicializar socket
initializeSocket(io);

// Iniciar servidor
const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
