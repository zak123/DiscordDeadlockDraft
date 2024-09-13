const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const config = {
  prefix: "!",
  adminRole: "girth haver",
};

const default_draft = {
  isActive: false,
  teams: ["amber", "sapphire"],
  characters: [
    "abrams",
    "bebop",
    "dynamo",
    "grey talon",
    "haze",
    "infernus",
    "ivy",
    "kelvin",
    "lady geist",
    "lash",
    "mcginnis",
    "mo krill",
    "paradox",
    "pocket",
    "seven",
    "shiv",
    "vindicta",
    "viscous",
    "warden",
    "wraith",
    "yamato",
  ],
  currentTeamIndex: 0,
  picks: { amber: [], sapphire: [] },
};

const draft = {
  isActive: false,
  teams: ["amber", "sapphire"],
  characters: [
    "abrams",
    "bebop",
    "dynamo",
    "grey talon",
    "haze",
    "infernus",
    "ivy",
    "kelvin",
    "lady geist",
    "lash",
    "mcginnis",
    "mo krill",
    "paradox",
    "pocket",
    "seven",
    "shiv",
    "vindicta",
    "viscous",
    "warden",
    "wraith",
    "yamato",
  ],
  currentTeamIndex: 0,
  picks: { amber: [], sapphire: [] },
};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Check if the user has the admin role
  const isAdmin = message.member.roles.cache.some(
    (role) => role.name === config.adminRole
  );

  if (!isAdmin) {
    return message.reply("You don't have permission to use this command.");
  }

  switch (command) {
    case "start":
      if (draft.isActive) {
        return message.reply("A draft is already in progress.");
      }
      draft.isActive = true;
      draft.teams = ["amber", "sapphire"];
      draft.currentTeamIndex = 0;
      picks = { amber: [], sapphire: [] };
      message.channel.send(
        `Draft started with teams: ${draft.teams.join(", ")}`
      );
      break;

    case "pick":
      if (!draft.isActive) {
        return message.reply("No draft is currently active.");
      }
      const pickedCharacter = args.join(" ");
      if (!draft.characters.includes(pickedCharacter)) {
        console.log(pickedCharacter);

        return message.reply("That character is not in the draft pool.");
      }
      const currentTeam = draft.teams[draft.currentTeamIndex];
      if (!draft.picks[currentTeam]) {
        draft.picks[currentTeam] = [];
      }
      draft.picks[currentTeam].push(pickedCharacter);
      draft.characters = draft.characters.filter(
        (char) => char !== pickedCharacter
      );
      draft.currentTeamIndex =
        (draft.currentTeamIndex + 1) % draft.teams.length;

      var t1_rounds = draft.picks?.[draft.teams[0]].length;
      var t2_rounds = 0;
      if (t1_rounds === 1) {
      } else {
        t2_rounds = draft.picks?.[draft.teams[1]].length;
      }
      var title = `Pick Round ${t1_rounds + t2_rounds}`;
      if (t1_rounds + t2_rounds == 12) {
        title = "FINAL RESULT";
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .addFields(
          {
            name: draft.teams[0],
            value: `${draft.teams[0]}: ${
              draft.picks[draft.teams[0]]
                ? draft.picks[draft.teams[0]].join(", ")
                : "No picks"
            }`,
          },
          {
            name: draft.teams[1],
            value: `${draft.teams[1]}: ${
              draft.picks[draft.teams[1]]
                ? draft.picks[draft.teams[1]].join(", ")
                : "No picks"
            }`,
          },
          {
            name: "available characters",
            value: draft.characters.join(", "),
          }
        )
        .setColor("#0099ff");
      message.channel.send({ embeds: [embed] });

      break;

    case "status":
      if (!draft.isActive) {
        return message.reply("No draft is currently active.");
      }
      let status = "Current draft status:\n";
      for (const team of draft.teams) {
        status += `\n${team}: ${
          draft.picks[team] ? draft.picks[team].join(", ") : "No picks yet"
        }`;
      }

      status += `\n\nRemaining characters: ${draft.characters.join(", ")}`;
      status += `\n\nNext pick: ${draft.teams[draft.currentTeamIndex]}`;
      message.channel.send(status);
      break;

    case "end":
      if (!draft.isActive) {
        return message.reply("No draft is currently active.");
      }
      for (const team of draft.teams) {
        message.channel.send(
          `${team}: ${
            draft.picks[team] ? draft.picks[team].join(", ") : "No picks"
          }`
        );
      }

      draft.characters = default_draft.characters;
      draft.isActive = false;
      draft.teams = ["amber", "sapphire"];
      draft.currentTeamIndex = 0;
      draft.picks = { amber: [], sapphire: [] };

      break;
    default:
      message.reply(
        "Unknown command. Available commands: !start, !pick, !status, !end"
      );
  }
});

client.login(process.env.DISCORD_TOKEN);
