const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "Stop the music and leave the voice channel",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to use this command**"
      );
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );

    const voteMessage = await message.channel.send(
      "React to this message to vote for disconnection!"
    );
    await voteMessage.react("✅");

    const filter = (reaction, user) =>
      reaction.emoji.name === "✅" && user.id !== client.user.id;
    const collector = voteMessage.createReactionCollector(filter, {
      time: 15000, // 15 seconds
      dispose: true,
    });

    collector.on("collect", (reaction, user) => {
      if (collector.total >= 3) {
        collector.stop("vote_threshold");
        return;
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "vote_threshold") {
        player.destroy();
        client.sendTime(message.channel, ":notes: | **Disconnected!**");
        message.react("✅");
      } else {
        client.sendTime(
          message.channel,
          "❌ | **Insufficient votes to disconnect!**"
        );
      }
    });
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **You must be in a voice channel to use this command.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );

      const voteMessage = await interaction.send(
        "React to this message to vote for disconnection!"
      );
      await voteMessage.react("✅");

      const filter = (reaction, user) =>
        reaction.emoji.name === "✅" && user.id !== client.user.id;
      const collector = voteMessage.createReactionCollector(filter, {
        time: 15000, // 15 seconds
        dispose: true,
      });

      collector.on("collect", (reaction, user) => {
        if (collector.total >= 3) {
          collector.stop("vote_threshold");
          return;
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "vote_threshold") {
          player.destroy();
          client.sendTime(interaction, ":notes: | **Disconnected!**");
        } else {
          client.sendTime(
            interaction,
            "❌ | **Insufficient votes to disconnect!**"
          );
        }
      });
    },
  },
};
