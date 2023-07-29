const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to use this command!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "❌ | **You must be in the same voice channel as me to use this command!**"
      );

    const votesRequired = Math.ceil((message.member.voice.channel.members.size - 1) / 2); // Majority of users in the voice channel excluding the bot
    const currentVotes = player.get("votes") || [];
    
    if (currentVotes.includes(message.member.id)) {
      return client.sendTime(
        message.channel,
        "❌ | **You have already voted to skip!**"
      );
    }

    currentVotes.push(message.member.id);
    player.set("votes", currentVotes);

    const votesNeeded = votesRequired - currentVotes.length;

    if (votesNeeded <= 0) {
      player.stop();
      player.set("votes", []); // Reset the votes
      return message.react("✅");
    }

    const embed = new MessageEmbed()
      .setColor(client.botconfig.EmbedColor)
      .setDescription(`✅ | **Vote to skip successful!** ${votesNeeded} more vote(s) needed to skip.`);

    const voteMessage = await message.channel.send(embed);
    await voteMessage.react("🔁");

    const filter = (reaction, user) =>
      reaction.emoji.name === "🔁" && !user.bot && currentVotes.includes(user.id);

    const collector = voteMessage.createReactionCollector(filter, { time: 30000 });

    collector.on("collect", (reaction, user) => {
      if (!currentVotes.includes(user.id)) return;
      const userReactions = voteMessage.reactions.cache.filter((reaction) =>
        reaction.users.cache.has(user.id)
      );

      if (userReactions.size >= votesNeeded) {
        collector.stop();
        player.stop();
        player.set("votes", []); // Reset the votes
        message.react("✅");
        voteMessage.delete();
      }
    });

    collector.on("end", () => {
      voteMessage.reactions.removeAll().catch(console.error);
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
          "❌ | **You must be in the same voice channel as me to use this command!**"
        );

      const votesRequired = Math.ceil((member.voice.channel.members.size - 1) / 2); // Majority of users in the voice channel excluding the bot
      const currentVotes = player.get("votes") || [];

      if (currentVotes.includes(interaction.member.user.id)) {
        return client.sendTime(
          interaction,
          "❌ | **You have already voted to skip!**"
        );
      }

      currentVotes.push(interaction.member.user.id);
      player.set("votes", currentVotes);

      const votesNeeded = votesRequired - currentVotes.length;

      if (votesNeeded <= 0) {
        player.stop();
        player.set("votes", []); // Reset the votes
        return client.sendTime(interaction, "**Skipped!**");
      }

      const embed = new MessageEmbed()
        .setColor(client.botconfig.EmbedColor)
        .setDescription(`✅ | **Vote to skip successful!** ${votesNeeded} more vote(s) needed to skip.`);

      const voteMessage = await client.sendTime(interaction, embed);
      await voteMessage.react("🔁");

      const filter = (reaction, user) =>
        reaction.emoji.name === "🔁" && !user.bot && currentVotes.includes(user.id);

      const collector = voteMessage.createReactionCollector(filter, { time: 30000 });

      collector.on("collect", (reaction, user) => {
        if (!currentVotes.includes(user.id)) return;
        const userReactions = voteMessage.reactions.cache.filter((reaction) =>
          reaction.users.cache.has(user.id)
        );

        if (userReactions.size >= votesNeeded) {
          collector.stop();
          player.stop();
          player.set("votes", []); // Reset the votes
          client.sendTime(interaction, "**Skipped!**");
          voteMessage.delete();
        }
      });

      collector.on("end", () => {
        voteMessage.reactions.removeAll().catch(console.error);
      });
    },
  },
};
