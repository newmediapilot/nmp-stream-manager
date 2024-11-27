const { twitchClipCreate } = require("./clip");
const { twitchTwipCreate } = require("../twip/create");
const { twitchMessageCreate } = require("./message");

const COMMANDS = {
  "#clip ": twitchClipCreate,
  "#twip ": twitchTwipCreate,
  "#test ": () => twitchMessageCreate("testing beep boop!"),
};

async function parseCommand(message) {
  console.log2(process.cwd(), "Message: ", message);

  const match = Object.keys(COMMANDS).find((key) => message.startsWith(key));

  if ("#test" === message.trim()) {
    await twitchMessageCreate("testing beep boop!");
    return true;
  }

  if (match) {
    const description = message.split(match)[1];
    console.log2(process.cwd(), "Match", match, "Description:", description);
    await COMMANDS[match](description);
    return true;
  } else {
    console.err2(process.cwd(), "No matching command found", match);
    return false;
  }
}

module.exports = { parseCommand };