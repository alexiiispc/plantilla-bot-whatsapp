const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const log = require("pino")({ level: "silent" });
const Function = require('../Model/Function')
const functions = new Function()

let sock;
let qrCode;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

    sock = makeWASocket({
        auth: state,
        logger: log,
        printQRInTerminal: true,
    });

    // Manejo de conexión
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        qrCode = qr;

        if (connection === "close") {
            const reason = new Boom(lastDisconnect.error).output.statusCode;

            switch (reason) {
                case DisconnectReason.badSession:
                    console.log("Bad Session, please delete session and scan again.");
                    sock.logout();
                    break;
                case DisconnectReason.connectionClosed:
                case DisconnectReason.connectionLost:
                    console.log("Connection lost, reconnecting...");
                    connectToWhatsApp();
                    break;
                case DisconnectReason.loggedOut:
                    console.log("Logged out. Delete session and scan again.");
                    sock.logout();
                    break;
                case DisconnectReason.restartRequired:
                    console.log("Restart required, reconnecting...");
                    connectToWhatsApp();
                    break;
                case DisconnectReason.timedOut:
                    console.log("Connection timed out, reconnecting...");
                    connectToWhatsApp();
                    break;
                default:
                    console.error("Unknown disconnection reason: ", reason);
                    break;
            }
        }
    });


    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const msg of messages) {

            if (!msg.message) continue; // Ignorar mensajes vacíos

            const sender = msg.key.remoteJid;
            const isFromBot = msg.key.fromMe;
            const messageType = Object.keys(msg.message)[0];

            if (!isFromBot) {
                let text = "";
                if (msg.message.conversation) {
                    text = msg.message.conversation;
                } else if (msg.message.extendedTextMessage) {
                    text = msg.message.extendedTextMessage.text;
                } else{
                    text = messageType;
                }
                
            

                
                await sock.sendMessage(sender,{
                    text: "Hola soy un robot"
                }) 
               


            }
        }
    });


    sock.ev.on("creds.update", saveCreds);


}

function isConnected() {
    return !!sock?.user;
}

function getSock() {
    return sock;
}

function getQRCode() {
    return qrCode;
}

module.exports = { connectToWhatsApp, isConnected, getSock, getQRCode };
