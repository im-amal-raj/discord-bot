const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, embedLength, Embed } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'To kick users',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply("You need to provide the required arguments.");
        }
        //check permissions 
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permissions to kick a user');
        }
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('I do not have permisssions to kick users ');
        }

        // get target member

        let targetMember = message.mentions.members.first();
        // if there is no mentions we go buy the logic the user is mentioned along with the command 
        // where first arg is the target user id 
        if (!targetMember && args[0]) {
            targetMember = message.guild.members.cache.get(args[0]);
        }
        if (!targetMember) {
            return message.reply('Please mention a user or give their ID.');
        }

        // occationally get the ban reason if provided
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // Check wether the targetmember role is higher than the bots role 
        if (targetMember.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply("I can't ban this user because their highest role is equal or higher than mine.");
        }

        // try to kick
        try {
            const kickEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Are you sure you want to Kick ${targetMember.user.tag}?`)
                .setDescription(`Reason ${reason}`)
                .setTimestamp();
            const button1 = new ButtonBuilder()
                .setCustomId('button-1')
                .setLabel('CONFIRM-KICK')
                .setStyle(ButtonStyle.Danger);

            const button2 = new ButtonBuilder()
                .setCustomId('button-2')
                .setLabel('CANCEL-KICK')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(button1, button2);
            const reply = await message.channel.send({ embeds: [kickEmbed], components: [row] });

            // Only allow the user who called the command to interact
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = reply.createMessageComponentCollector({
                filter,
                componentType: ComponentType.Button,
                time: 15000 //15 sec 
            });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'button-1') {
                    try {
                        await targetMember.kick(reason);
                        await interaction.update({
                            content: `Successfully kicked ${targetMember.user.tag}.`,
                            embeds: [],
                            components: []
                        });
                    } catch (error) {
                        console.log(error);
                        await interaction.update({
                            content: '❌ Failed to Kick the user. Check my permissions and role position.',
                            embeds: [],
                            components: []
                        });
                    }
                } else if (interaction.customId === 'button-2') {
                    await interaction.update({
                        content: 'Kick action cancelled',
                        embeds: [],
                        components: []
                    });
                }
            });

            collector.on('end', (_, reason) => {
                if (reason === 'time') {
                    reply.edit({
                        content: 'Kick confirmation timed out.',
                        embeds: [],
                        components: []
                    });
                }
            })
        } catch (error) {
            console.log(error);
            if (error.code === 50013) {
                await message.reply('❌ Kick failed: I lack either the "Kick Members" permission or my role isn’t high enough in the role list to Kick this user. Please adjust my role and permissions.');
            } else {
                await message.reply('❌ Kick failed due to an unexpected error.');
            }
        }
    }
};