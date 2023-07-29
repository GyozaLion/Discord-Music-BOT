const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dashboard",
  description: "To Open Discord Bot Dashboard for your server",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["dash", "db"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setAuthor(
        "Open " + client.user.tag + " Dashboard with link below!",
        client.user.displayAvatarURL()
      )
      .setColor("BLUE")
      .setDescription(
        `You can use this link [here](https://bit.ly/LMX2Dash)`
      );
    const picture = "https://cdn.discordapp.com/attachments/751396313580437565/1097062334880563220/frame.png";
    message.channel.send(embed);
  },
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setAuthor(
        "Open " + client.user.tag + " Dashboard with link below!",
        client.user.displayAvatarURL()
      )
      .setColor("BLUE")
      .setDescription(
        `You can use this link [here](https://bit.ly/LMX2Dash)`
      );
    const picture = "https://cdn.discordapp.com/attachments/751396313580437565/1097062334880563220/frame.png";
      interaction.send(embed);
    },
  },
};
