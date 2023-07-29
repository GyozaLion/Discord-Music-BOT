const { MessageEmbed } = require("discord.js");

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Stay hungry, stay foolish. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "The secret of success is to know something nobody else knows. - Aristotle Onassis",
  "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
  "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
  "Success is not about the destination, it's about the journey. - Zig Ziglar",
  "The secret of success is to be ready when your opportunity comes. - Benjamin Disraeli",
  "Success is not just about making money. It's about making a difference. - Unknown",
  "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
  "Success is not in what you have, but who you are. - Bo Bennett",
  "Success is not the absence of failure; it's the persistence through failure. - Aisha Tyler",
  "Success is not the result of spontaneous combustion. You must set yourself on fire. - Arnold H. Glasow",
  "Success is not about being the best. It's about being better than you were yesterday. - Unknown",
  "Success is not just a destination; it's a journey of continuous growth. - Brian Tracy",
  "Success is not for the chosen few; it's for the few who choose it. - Unknown",
  "Success is not measured by what you accomplish, but by the opposition you have encountered and the courage with which you have maintained the struggle against overwhelming odds. - Orison Swett Marden",
  "Success is not the absence of problems; it's the ability to deal with them. - Unknown",
  "Success is not about luck; it's about hard work, perseverance, and learning from failure. - Unknown",
  "Success is not about waiting for the perfect moment; it's about creating it. - Unknown",
  "Success is not about pleasing everyone; it's about staying true to yourself. - Unknown",
];

module.exports = {
  name: "quote",
  description: "Sends a random quote",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["qt"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Random Quote")
      .setDescription(randomQuote);

    message.channel.send(embed);
  },
};
