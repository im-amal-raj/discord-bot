const { PermissionsBitField, Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'used to get information of a purticular user',
    async execute(message, args) {
       
        let targetMember;
        let targetUser;


        if (message.reference) {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
            console.log('Replied message fetched:', repliedMessage);

            try {
                targetMember = await message.guild.members.fetch(repliedMessage.author.id);
                console.log('Fetched targetMember from guild:', targetMember.user.tag);
            } catch (error) {
                targetMember = null;
                console.log('Failed to fetch targetMember from guild. Maybe user is not in guild.');
            }

            targetUser = repliedMessage.author;
            console.log('Target user from replied message:', targetUser.tag);
        }
        else if (message.mentions.members.size > 0) {
            // Mentioned user in guild
            targetMember = message.mentions.members.first();
            targetUser = targetMember.user;

        } else if (args[0]) {
            try {
                // Try to fetch member by ID in guild
                targetMember = await message.guild.members.fetch(args[0]);
                targetUser = targetMember.user;
            } catch {
                // If not in guild, fetch user globally by ID
                try {
                    targetUser = await message.client.users.fetch(args[0]);
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
        console.log(`this is ${targetMember} this is ${targetUser}`);

        // SAFETY CHECK!
        if (!targetUser) return message.reply("User not found or invalid ID provided.");

        const userembed = new EmbedBuilder()
            .setTitle(`Info about ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setColor(targetMember ? targetMember.displayHexColor : 'Default')
            .addFields(
                { name: 'Username', value: targetUser.tag, inline: true },
                { name: 'ID', value: targetUser.id, inline: true },
                { name: 'Bot', value: targetUser.bot ? 'Yes' : 'No', inline: true },
                { name: 'Account Created', value: targetUser.createdAt.toDateString(), inline: false }
            );

        if (targetMember) {
            userembed.addFields(
                { name: 'Nickname', value: targetMember.nickname || 'None', inline: true },
                { name: 'Joined Server', value: targetMember.joinedAt.toDateString(), inline: true },
                { name: 'Roles', value: targetMember.roles.cache.map(role => role.name).join(', '), inline: false }
            );
        }
        userembed.setTimestamp();

        message.channel.send({ embeds: [userembed] });

    }
};