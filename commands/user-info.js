const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const dm = require('moment')

module.exports = {
    name: 'info',
    description: 'used to get information of a purticular user',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply("You need to provide the required arguments.");
        }
        let targetMember;
        let targetUser;

        if (message.reference) {
            // Get user from replied message
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            targetMember = message.guild.members.cache.get(repliedMessage.author.id);
            targetUser = repliedMessage.author;

        } else if (message.mentions.members.size > 0) {
            // Mentioned user in guild
            targetMember = message.mentions.members.first();
            targetUser = targetMember.user;

        } else if (args[0]) {
            try {
                // Try to fetch member by ID in guild
                targetMember = await message.guild.members.fetch(args);
                targetUser = targetMember.user;
            } catch {
                // If not in guild, fetch user from Discord globally (outside guild)
                try {
                    targetUser = await message.client.users.fetch(args);
                    targetMember = null; // not in guild
                } catch {
                    return message.reply('User not found.');
                }
            }

        } else {
            // fallback to command author info
            targetMember = message.member;
            targetUser = message.author;
        }


        const userembed = new EmbedBuilder()
            .setTitle(`Info about ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setColor(targetMember.displayHexColor || 'Default')
            .addFields(
                { name: 'Username', value: targetUser.tag, inline: true },
                { name: 'ID', value: targetUser.id, inline: true },
                { name: 'Bot', value: targetUser.bot ? 'Yes' : 'No', inline: true },
                { name: 'Account Created', value: targetUser.createdAt.toDateString(), inline: false });
        if (targetMember) {
            userembed.addFields(
                { name: 'Nickname', value: targetMember.nickname || 'None', inline: true },
                { name: 'Joined Server', value: targetMember.joinedAt.toDateString(), inline: true },
                { name: 'Roles', value: targetMember.roles.cache.map(role => role.name).join(', '), inline: false },

            )
        .setTimestamp();
        }
        message.channel.send({ embeds: [userembed] });


    }
};