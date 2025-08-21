module.exports = {
    name: 'ping',
    description: 'replies with pong',
    execute(message,args) {
        message.channel.send('pong');
    }
};

