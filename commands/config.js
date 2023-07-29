const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Edit the bot settings",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .addField("Prefix", GuildDB.prefix, true)
      .setDescription(`
What would you like to edit?

:one: - Server Prefix
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel,
        "❌ | **You took too long to respond. If you want to edit the settings, run the command again!**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(
        message.channel,
        "What do you want to change the prefix to?"
      );
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(
          message.channel,
          "You took too long to respond."
        );
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
      });

      client.sendTime(
        message.channel,
        `Successfully saved guild prefix as \`${prefix}\``
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "Check the bot's prefix",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Set the bot's prefix",
            type: 3,
            required: false,
          },
        ],
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let config = interaction.data.options[0].name;
      if (config === "prefix") {
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
          });
          client.sendTime(
            interaction,
            `The prefix has now been set to \`${prefix}\``
          );
        } else {
          client.sendTime(
            interaction,
            `The prefix of this server is \`${GuildDB.prefix}\``
          );
        }
      }
    },
  },
};
