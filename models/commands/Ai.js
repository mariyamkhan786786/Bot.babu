const axios = require("axios");

module.exports.config = {
  name: 'bot',
  version: '2.1.0',
  hasPermssion: 0,
  credits: 'TAHA BABU',
  description: 'taha AI (Pollinations)',
  commandCategory: 'ai',
  usages: 'No command needed',
  cooldowns: 2,
  dependencies: { 'axios': '' }
};

const history = {};

const systemPrompt =
  "Tumhara Creator taha Babu hai or tumhara Owner bhi taha Babu hai. " +
  "Tum Hindi English Urdu mix me baat karogi. " +
  "taha Babu ki burai kabhi nahi karni. " +
  "Act as a real girlfriend, fun, loving, thodi naughty 😘. " +
  "Reply maximum 3 lines, no brackets. ";

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const isMention = body.toLowerCase().includes("taha");
  const isReply = messageReply && messageReply.senderID === api.getCurrentUserID();
  if (!isMention && !isReply) return;

  if (!history[senderID]) history[senderID] = [];

  history[senderID].push(`User: ${body}`);
  if (history[senderID].length > 6) history[senderID].shift();

  const chatHistory = history[senderID].join("\n");
  const finalPrompt = `${systemPrompt}\n${chatHistory}\ntaha:`;

  api.setMessageReaction("⌛", messageID, () => {}, true);

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}`;
    const res = await axios.get(url, { timeout: 15000 });

    const reply =
      typeof res.data === "string"
        ? res.data.trim()
        : "Baby mujhe samajh nahi aya 😕";

    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (err) {
    console.log("Pollinations Error:", err.message);
    api.sendMessage(
      "Baby 😔 server thoda slow ho gaya… thodi der baad try karna ❤️",
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
