const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");

module.exports = {
  name: "lyrics",
  description: "Shows the lyrics of the song searched",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    let songTitle = args.join(" ");
    if (!args[0] && !player)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );
    if (!args[0]) songTitle = player.queue.current.title;

    let lyrics = await lyricsFinder(songTitle, "");
    if (!lyrics)
      return client.sendTime(
        message.channel,
        `**No lyrics found for -** \`${songTitle}\``
      );
    lyrics = lyrics.replace(/(\[.+\])/g, ""); // Remove [Verse], [Chorus], etc. tags
    lyrics = lyrics.replace(/\n{2,}/g, "\n"); // Remove extra empty lines
    let splitedLyrics = _.chunk(lyrics.split("\n"), 40); // Split into chunks of 40 lines

    let pages = splitedLyrics.map((ly) => {
      let embed = new MessageEmbed()
        .setAuthor(`Lyrics for: ${songTitle}`, client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(ly.join("\n"))
        .setThumbnail(player.queue.current.displayThumbnail());

      return embed;
    });

    if (!pages.length || pages.length === 1)
      return message.channel.send(pages[0]);
    else return client.Pagination(message, pages);
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        description: "Enter a song name to search",
        required: false,
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
      let player = await client.Manager.get(interaction.guild_id);

      if (!interaction.data.options && !player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );

      const songTitle = interaction.data.options
        ? interaction.data.options[0].value
        : player.queue.current.title;

      let lyrics = await lyricsFinder(songTitle, "");
      if (!lyrics)
        return client.sendTime(
          interaction,
          `**No lyrics found for -** \`${songTitle}\``
        );
      lyrics = lyrics.replace(/(\[.+\])/g, ""); // Remove [Verse], [Chorus], etc. tags
      lyrics = lyrics.replace(/\n{2,}/g, "\n"); // Remove extra empty lines
      let splitedLyrics = _.chunk(lyrics.split("\n"), 40); // Split into chunks of 40 lines

      let pages = splitedLyrics.map((ly) => {
        let embed = new MessageEmbed()
          .setAuthor(`Lyrics for: ${songTitle}`, client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(ly.join("\n"))
          .setThumbnail(player.queue.current.displayThumbnail());

        return embed;
      });

      if (!pages.length || pages.length === 1)
        return interaction.send(pages[0]);
    },
  },
};

