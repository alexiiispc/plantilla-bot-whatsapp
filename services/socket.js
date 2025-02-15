const qrcode = require("qrcode");
const { getQRCode, isConnected, getSock } = require("./baileys");

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected to socket.");

    if (isConnected()) {
      emitStatus(socket, "connected");
    } else if (getQRCode()) {
      emitStatus(socket, "qr");
    }

    function emitStatus(socket, status) {
      switch (status) {
        case "qr":
          qrcode.toDataURL(getQRCode(), (err, url) => {
            socket.emit("qr", url);
            socket.emit("log", "QR Code generated, scan to connect.");
          });
          break;
        case "connected":
          const { id, name } = getSock().user;
          socket.emit("qrstatus", "assets2/check.svg");
          socket.emit("log", "User connected.");
          socket.emit("user", `${id} ${name}`);
          break;
        default:
          break;
      }
    }
  });
}

module.exports = { initializeSocket };
