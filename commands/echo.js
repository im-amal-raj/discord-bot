module.exports = {
    name: 'e',
    description: 'replies with the message the user sent',
    async execute(message, args) {
        // Check if args are provided
        if (!args.length) {
            return message.reply("You need to provide the required arguments, e.g. `.e message`.");
        }

        const replyContent = args.join(' ');
        // if message is a reply to a user 
        if (message.reference) {
            try {
                // fetch replied-to message
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

                if (repliedMessage) {
                    // delete the user command message to keep the chat clean
                    await message.delete();

                    // reply to the original message with the content
                    await repliedMessage.reply(replyContent);
                    return; // finished
                }
            } catch (error) {
                console.log('error fetching the replied to message', error);
                // If fetching the replied message failed (e.g. deleted), just send a normal reply
            }
        }
        // if not a reply or replied message invalid , reply normally 

        await message.reply(replyContent);

    }
};
