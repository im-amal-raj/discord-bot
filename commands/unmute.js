const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Removes timeout from a user',
  async execute(message, args) {
    // Check if args are provided
    if (!args.length) {
      return message.reply("You need to provide the required arguments.");
    }
    // Permission checks
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply("You don't have permission to unmute members.");
    }
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply("I don't have permission to unmute members.");
    }

    // Get target member
    let targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!targetMember) {
      return message.reply("Please mention a user or provide their ID.");
    }

    // Check role hierarchy
    if (targetMember.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("I cannot unmute a member with higher or equal role than mine.");
    }

    // Check if user is currently muted (timed out)
    if (!targetMember.communicationDisabledUntil || targetMember.communicationDisabledUntil <= new Date()) {
      return message.reply(`${targetMember.user.tag} is not currently muted.`);
    }

    // Remove timeout
    try {
      await targetMember.timeout(null, `Unmuted by ${message.author.tag}`);
      await message.channel.send(`Successfully unmuted ${targetMember.user.tag}.`);
    } catch (error) {
      console.error(error);
      await message.reply("Failed to unmute the user. Check my permissions and role hierarchy.");
    }
  },
};
