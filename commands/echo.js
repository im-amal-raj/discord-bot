module.exports = {
    name: 'e',
    description: 'replies with the message the user sent',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply("You need to provide the required arguments, e.g. `.e message`.");
        }
        const rep = args.join(' ')
        console.log(args.join(' '))
        await message.reply(rep)

    }
};