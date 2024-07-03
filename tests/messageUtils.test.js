const { MessageEmbed } = require('discord.js');
const messageUtils = require('../messageUtils');
const fs = require('fs');

jest.mock('fs');
jest.mock('discord.js', () => ({
    MessageEmbed: jest.fn().mockImplementation(() => ({
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setColor: jest.fn().mockReturnThis()
    }))
}));

describe('messageUtils', () => {
    test('creates embed message', () => {
        const embed = messageUtils.createEmbedMessage('Title', 'Description');
        expect(embed.setTitle).toHaveBeenCalledWith('Title');
        expect(embed.setDescription).toHaveBeenCalledWith('Description');
        expect(embed.setColor).toHaveBeenCalledWith('#00FF00');
    });

    test('updates leaderboard message', async () => {
        const client = {
            guilds: { cache: [{ channels: { cache: [{ name: 'leaderboard', messages: { fetch: jest.fn() } }] } }] }
        };
        const guild = client.guilds.cache[0];
        const channel = guild.channels.cache[0];
        const message = { edit: jest.fn() };

        fs.readFileSync.mockReturnValue('{"123456": {"username": "testuser", "balance": 5000}}');
        fs.readFileSync.mockReturnValue('{"id": "123"}');
        channel.messages.fetch.mockResolvedValue(message);

        await messageUtils.updateLeaderboard(client, guild);
        expect(message.edit).toHaveBeenCalledWith(expect.stringContaining('Leaderboard:\n1. testuser - $5000\n'));
    });
});
