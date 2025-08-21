const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Timeout (mute) a user for a specified duration with a reason',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply('Usage: .mute @user <duration> [reason]');
        }

        // Permission checks
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permission to mute members.');
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('I do not have permission to mute members.');
        }

        let targetMember;
        let durationArg;
        let reason;

        // Fetch target based on reply
        if (message.reference) {
            try {
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                targetMember = message.guild.members.cache.get(repliedMessage.author.id);
                durationArg = args[0];
                reason = args.slice(1).join(' ');
            } catch {
                return message.reply('Failed to fetch the replied message.');
            }

        } else if (message.mentions.members.size > 0) {
            // Target is mentioned user
            targetMember = message.mentions.members.first();
            durationArg = args[1];
            reason = args.slice(2).join(' ');

        } else if (args) {
            // Try to get member by ID string
            targetMember = message.guild.members.cache.get(args);
            durationArg = args;
            reason = args.slice(2).join(' ');

        } else {
            return message.reply('Please mention a user, reply to their message, or provide their ID.');
        }

        // Check if targetMember found
        if (!targetMember) {
            return message.reply("Couldn't find that user in this server.");
        }

        // Check role hierarchy
        if (targetMember.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply("I can't mute this user because their highest role is equal to or higher than mine.");
        }

        // Validate duration
        const durationInMS = ms(durationArg);
        if (!durationArg || !durationInMS) {
            return message.reply("Please specify a valid duration like '10m', '1h', or '30s'.");
        }
        if (durationInMS > 2419200000) { // 28 days
            return message.reply("Duration must be less than or equal to 28 days.");
        }

        // Default reason
        if (!reason) reason = 'No reason provided';

        // Confirmation embed + buttons
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Are you sure you want to mute ${targetMember.user.tag}?`)
            .setDescription(`**Reason:** ${reason}\n**Duration:** ${durationArg}`)
            .setTimestamp();

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm-mute')
            .setLabel('Confirm Mute')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel-mute')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        const reply = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id && ['confirm-mute', 'cancel-mute'].includes(interaction.customId);

        const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'confirm-mute') {
                try {
                    await targetMember.timeout(durationInMS, reason);
                    await interaction.update({ content: `Successfully muted ${targetMember.user.tag} for ${durationArg}.`, embeds: [], components: [] });
                } catch (error) {
                    console.error(error);
                    await interaction.update({ content: '❌ Failed to mute the user. Check my permissions and role hierarchy.', embeds: [], components: [] });
                }
                collector.stop(); // Stops the collector explicitly
            } else if (interaction.customId === 'cancel-mute') {
                await interaction.update({ content: 'Mute cancelled.', embeds: [], components: [] });
            }
            collector.stop(); // Stops the collector explicitly
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                reply.edit({ content: 'Mute confirmation timed out.', embeds: [], components: [] });
            }
        });
    },
};
