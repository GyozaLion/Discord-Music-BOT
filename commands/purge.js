const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  description: "Delete all messages in a channel",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    member: ["MANAGE_GUILD"],
  },
  run: async (client, message) => {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return sendError(
        message.channel,
        "❌ | **You don't have permission to manage the server!**"
      );

    if (!message.guild.me.permissions.has("MANAGE_MESSAGES"))
      return sendError(
        message.channel,
        "❌ | **I don't have permission to manage messages!**"
      );

    try {
      const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
      const filteredMessages = fetchedMessages.filter((msg) => !msg.pinned);
      await message.channel.bulkDelete(filteredMessages, true);

      const successMessage = await sendSuccess(
        message.channel,
        "✅ | **All messages have been deleted!**"
      );

      setTimeout(() => {
        successMessage.delete().catch(console.error);
      }, 10000);
    } catch (error) {
      console.error(error);
      const errorMessage = await sendError(
        message.channel,
        "❌ | **An error occurred while deleting messages!**"
      );

      setTimeout(() => {
        errorMessage.delete().catch(console.error);
      }, 10000);
    }
  },
};

async function sendSuccess(channel, message) {
  const successMessage = await channel.send(message);
  return successMessage;
}

async function sendError(channel, message) {
  const errorMessage = await channel.send(message);
  return errorMessage;
}
