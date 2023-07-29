const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dice",
  description: "Rolls a dice",
  usage: "[Dice Used]s[Sides on Dice]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["roll"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!args[0])
      return client.sendTime(
        message.channel,
        "Please provide the number of dice and the number of sides. Example: `!dice 2s6` which means 2 dice with 6 sides"
      );

    const [diceCount, sides] = args[0].split("s");
    const rolls = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Dice Roll")
      .addField("Dice", `${diceCount}d${sides}`);

    const rollMessage = await message.channel.send(embed);

    // Roll animation
    const delay = 100; // Delay between each animation frame (in milliseconds)
    const frames = 10; // Number of animation frames

    for (let frame = 0; frame < frames; frame++) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Update results with random numbers for each frame
      const frameRolls = rolls.map((roll) =>
        Math.floor(Math.random() * sides) + 1
      );

      embed.spliceFields(1, 1, { name: "Results", value: frameRolls.join(", ") });
      rollMessage.edit(embed);
    }

    // Final results
    embed.spliceFields(1, 1, { name: "Results", value: rolls.join(", ") });
    rollMessage.edit(embed);
  },
};

