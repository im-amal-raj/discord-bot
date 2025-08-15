require('dotenv').config();

const { Client , IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ],

});


const roles = [
    {
        id: '1405947614444257381',
        label: 'Blue',
    },
    {
        id: '1405947880379777154',
        label: 'Red',
    },
    {
        id: '1405948047757938850',
        label: 'Green',
    },
]

client.on('ready' , async(c) => {
    try {
        const channel = await client.channels.cache.get('1006857466195226646');
        if (!channel) return;

        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                .setCustomId(role.id)
                .setLabel(role.label)
                .setStyle(ButtonStyle.Primary)
            );
        });
        await channel.send({
            content: 'claim or remove a role',
            components: [row]
        });
        process.exit();
    } catch (error) {
        console.log(error);
    }

});


client.login(process.env.BOT_TOKEN);