const balanceCommands = require('../balanceCommands');
const dataManager = require('../dataManager');
const messageUtils = require('../messageUtils');
const { Client, Intents } = require('discord.js');

jest.mock('../dataManager');
jest.mock('../messageUtils');

describe('balanceCommands', () => {
    let message, args, client;

    beforeEach(() => {
        client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        message = {
            author: { id: '123456', username: 'testuser' },
            member: { roles: { cache: [{ name: 'Admin' }] } },
            reply: jest.fn(),
            channel: { send: jest.fn() }
        };
        args = [];
        dataManager.readJSON.mockReturnValue({ '123456': { username: 'testuser', balance: 1000 } });
    });

    test('checks user balance', async () => {
        args = ['check'];
        await balanceCommands.execute(message, args);
        expect(message.channel.send).toHaveBeenCalledWith('testuser, your balance is $1000');
    });

    test('updates user balance', async () => {
        args = ['update', '5000'];
        await balanceCommands.execute(message, args);
        expect(dataManager.writeJSON).toHaveBeenCalledWith(expect.any(String), { '123456': { username: 'testuser', balance: 5000 } });
        expect(message.reply).toHaveBeenCalledWith('Balance updated to $5000');
        expect(messageUtils.updateLeaderboard).toHaveBeenCalledWith(client, expect.any(Object));
    });

    test('fails to update balance with invalid amount', async () => {
        args = ['update', 'invalid'];
        await balanceCommands.execute(message, args);
        expect(message.reply).toHaveBeenCalledWith('Invalid amount.');
    });
});
