const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Delete bulk messages',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply("You need to provide the required arguments.");
        }
        // check perms for both the user and the bot

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('You dont have permission to perform this action.');
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('I do not have the necessary permissions to perform this action.');
        }

        let amount = parseInt(args[0]);
        if (!amount || amount < 1 ) {
            return message.reply('Please enter a number between 1 and 100.');
        }
        if (amount > 99) {
            amount = 99;
        }

        try {
            // Fetch messages first
            const fetchedMessages = await message.channel.messages.fetch({ limit: amount + 1 });

            // Bulk delete with filterOld = true
            const deletedMessages = await message.channel.bulkDelete(fetchedMessages, true);

            if (deletedMessages.size === 0) {
                return message.channel.send('No messages were deleted. They might all be older than 14 days.');
            }

            const confirmMsg = await message.channel.send(`Deleted ${deletedMessages.size} messages.`);
            setTimeout(() => confirmMsg.delete(), 5000);
        } catch (error) {
            console.error(error);
            message.reply('Failed to delete messages.');
        }

    }
};