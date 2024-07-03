const fs = require('fs');
const path = require('path');
const { createEmbedMessage } = require('./messageUtils');
const { updateLeaderboard } = require('./utils'); // Ensure this is imported
const playersFilePath = path.join(__dirname, 'players.json');

module.exports = {
    data: {
        name: 'register',
        description: 'Register as a paper trader'
    },
    execute: async (interaction) => {
        const userId = interaction.user.id;
        const username = interaction.user.username;

        if (!fs.existsSync(playersFilePath)) {
            fs.writeFileSync(playersFilePath, JSON.stringify({}));
        }

        const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));

        if (players[userId]) {
            return interaction.reply({ content: 'You are already registered.', ephemeral: true });
        }

        players[userId] = { id: userId, username: username, balance: 100000 };
        fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));

        interaction.reply({ embeds: [createEmbedMessage('Registration Successful', `Welcome ${username}! You have been registered with a balance of $100,000.`)] });

        // Update the leaderboard after registration
        await updateLeaderboard(interaction.client, interaction.guild);
    }
};
