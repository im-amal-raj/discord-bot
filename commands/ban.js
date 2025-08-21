const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban people',
  async execute(message, args) {
    // Check if args are provided
    if (!args.length) {
      return message.reply("You need to provide the required arguments.");
    }
    // 1. Check permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permission to ban members.');
    }
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('I do not have permission to ban members.');
    }

    // 2. Get the target member
    let targetMember = message.mentions.members.first();
    // If not mention, treat first arg as user ID
    if (!targetMember && args[0]) {
      targetMember = message.guild.members.cache.get(args[0]);
    }
    if (!targetMember) {
      return message.reply('Please mention a user or give their ID.');
    }
    // Optionally: get the ban reason if provided
    const reason = args.slice(1).join(' ') || 'No reason provided';

    if (targetMember.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("I can't ban this user because their highest role is equal or higher than mine.");
    }

    // 3. Try to ban
    try {
      const banEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Are you sure you want to ban ${targetMember.user.tag}?`)
        .setDescription(`Reason ${reason}`)
        .setTimestamp();
      const button1 = new ButtonBuilder()
        .setCustomId('button-1')
        .setLabel('CONFIRM-BAN')
        .setStyle(ButtonStyle.Danger);

      const button2 = new ButtonBuilder()
        .setCustomId('button-2')
        .setLabel('CANCEL-BAN')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(button1, button2);
      const reply = await message.channel.send({ embeds: [banEmbed], components: [row] });

      // Only allow the user who called the command to interact
      const filter = (interaction) => interaction.user.id === message.author.id;

      const collector = reply.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 15000 // 15 seconds
      });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'button-1') {
          try {
            await targetMember.ban({ reason });
            await interaction.update({
              content: `Successfully banned ${targetMember.user.tag}.`,
              embeds: [],
              components: []
            });
          } catch (error) {
            console.log(error);
            await interaction.update({
              content: '❌ Failed to ban the user. Check my permissions and role position.',
              embeds: [],
              components: []
            });
          }
        } else if (interaction.customId === 'button-2') {
          await interaction.update({
            content: `Ban action cancelled.`,
            embeds: [],
            components: []
          });
        }
      });


      collector.on('end', (_, reason) => {
        if (reason === 'time') {
          reply.edit({ content: 'Ban confirmation timed out.', embeds: [], components: [] });
        }
      });

    } catch (error) {
      console.log(error);
      if (error.code === 50013) {
        await message.reply('❌ Ban failed: I lack either the "Ban Members" permission or my role isn’t high enough in the role list to ban this user. Please adjust my role and permissions.');
      } else {
        await message.reply('❌ Ban failed due to an unexpected error.');
      }
    }

  }
};
