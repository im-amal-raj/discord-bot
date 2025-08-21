require('dotenv').config();

const { Client , IntentsBitField, EmbedBuilder , ActivityType } = require('discord.js');
const eventhandler = require('./handlers/eventhandler');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ],

});

client.on('ready' , (c) => {
    console.log(`${c.user.tag} is online`);

    client.user.setActivity({
        name: "grooving",
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1',
    });
});

eventhandler(client);


client.on('interactionCreate', async (interaction) => {
    //handles slash commands
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'hey') {
            await interaction.reply('hey');
        } else if (interaction.commandName === 'ping') {
            await interaction.reply('pong!');
        } else if (interaction.commandName === 'add') {
            const num1 = interaction.options.get('first-number').value;
            const num2 = interaction.options.get('second-number').value;
            await interaction.reply(`The sum of the two numbers is ${num1+num2}`);
        } else if(interaction.commandName === 'embed') {
            const embed = new EmbedBuilder()
            .setTitle("Embed title")
            .setDescription("This is an description")
            .setColor('Random')
            .addFields({ 
                name: 'field title',
                value: 'some random value',
                inline:true,
                },
                { 
                    name: 'second field title',
                    value: 'some random value',
                    inline:true,
                });

            await interaction.reply({ embeds: [embed]});
        }
        return ;
        }
        // handle button interactions 
        try {
            if (!interaction.isButton()) {
                return;
            }
            await interaction.deferReply({ephemeral: true,});
        
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role){
                interaction.reply({
                    content: 'I couldnt find that role',
                    
                })
                return;
            }

            const hasRole = interaction.member.roles.cache.has(role.id);
            if (hasRole) {
                await interaction.member.roles.remove(role);
                await interaction.editReply(`The role ${role} has been removed!`);
            } else {
                await interaction.member.roles.add(role);
                await interaction.editReply(`The role ${role} has been added to you!`);
            }
        } catch (error) {
            console.log(error)
        }
    
    
    

});

client.on('messageCreate', (message) => {

    if (message.author.bot) {
        return ;
    } 
    if (message.content === 'hello') {
       message.reply('# HELLO');
    }
    
    if (message.content === 'embed') {
        const embed = new EmbedBuilder()
        .setTitle("Embed title")
        .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1')
        .setDescription("This is an description")
        .setColor('Random')
        .setFields({ 
            name: 'field title',
            value: 'some random value',
            inline:true,
            },
            { 
            name: 'second field title',
            value: 'some random value',
            inline:true,
            });
        message.channel.send({ embeds: [embed]});
    }
});

client.login(process.env.BOT_TOKEN);