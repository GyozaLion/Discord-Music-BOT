const { MessageEmbed } = require("discord.js");

// Define the symbols for the slot machine
const symbols = ["🍒", "🍊", "🍇", "🍋", "🍉", "🍓"];

module.exports = {
  name: "slot",
  description: "Play a slot machine",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["slots"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    // Set the number of slots in the machine
    const slotsCount = 3;

    // Generate random symbols for each slot
    const slots = Array.from({ length: slotsCount }, () =>
      symbols[Math.floor(Math.random() * symbols.length)]
    );

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Slot Machine")
      .addField("Results", slots.join(" | "));

    const slotMessage = await message.channel.send(embed);

    // Slot machine animation
    const delay = 100; // Delay between each animation frame (in milliseconds)
    const frames = 10; // Number of animation frames

    for (let frame = 0; frame < frames; frame++) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Shuffle the slots for each frame
      slots.forEach((_, index) => {
        slots[index] = symbols[Math.floor(Math.random() * symbols.length)];
      });

      embed.spliceFields(0, 1, { name: "Results", value: slots.join(" | ") });
      slotMessage.edit(embed);
    }

    // Final results
    embed.spliceFields(0, 1, { name: "Results", value: slots.join(" | ") });
    slotMessage.edit(embed);
  },
};

