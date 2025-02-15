const { isConnected, getSock,connectToWhatsApp } = require("../services/baileys");
const axios = require("axios")
const {hoy,convierte} = require("../services/funciones")

const sendMessage = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ status: false, response: "Missing fields" });
  }

  try {
    const sock = getSock();
    if (!isConnected()) {
      return res
        .status(500)
        .json({ status: false, response: "Not connected to WhatsApp" });
    }

    const numberWA = `${number}@s.whatsapp.net`;
    const exists = await sock.onWhatsApp(numberWA);

    if (exists?.jid || (exists && exists[0]?.jid)) {
      const result = await sock.sendMessage(exists.jid || exists[0].jid, {
        text: message,
      });
      return res.status(200).json({ status: true, response: result });
    } else {
      return res
        .status(404)
        .json({ status: false, response: "Number not found on WhatsApp" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, response: error.message });
  }
};



module.exports = { sendMessage };
