const { Client, GatewayIntentBits, EmbedBuilder ,AttachmentBuilder, ButtonBuilder , ButtonStyle, ActionRowBuilder } = require('discord.js');

require('dotenv').config();

const file = new AttachmentBuilder('./src/media/goofy-knight.gif');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once('ready', () => {
    console.log('The bot is now online! ')
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    const button = new ButtonBuilder()
        .setCustomId('button-1')
        .setLabel('Button Label')
        .setStyle(ButtonStyle.Primary)
    
    const button2 = new ButtonBuilder()
        .setCustomId('button-2')
        .setLabel('Button Label')
        .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(button,button2);
    
    message.reply(" # Hey this is me!")

    const embed = new EmbedBuilder()
        .setColor(0x9c9e95)
        .setTitle('I am Title , also click for stuff')
        .setURL("https://youtu.be/dQw4w9WgXcQ?si=8J5jzp0n_gGSrDZG")
        .setDescription(' i am a bot under construcion')
        .setImage('attachment://goofy-knight.gif')
        .setTimestamp()
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })

    if (message.content === 'hi'){
        embed.setDescription("# HI")
    } else if (message.content === 'hello')
        embed.setDescription('# HELLO')

    const sentMessage = await message.channel.send({ embeds: [embed], files: [file] , components: [row] });

    setTimeout(async () => {
        embed.setDescription('This message is the edited embed after 3 seconds ');
        await sentMessage.edit({ embeds: [embed]})

    }, 3000)
    
    

})

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === 'button-1') {
        interaction.reply('you clicked me')
    } else if (interaction.customId ===  'button-2')
        interaction.reply('you clicked the second button')

});

client.login(process.env.BOT_TOKEN);
