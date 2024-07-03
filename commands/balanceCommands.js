const { SlashCommandBuilder } = require('@discordjs/builders');
const dataManager = require('../utils/dataManager'); // Correct path to dataManager
const { updateLeaderboard } = require('../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check or update your balance')
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('Check your balance'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Update your balance')
                .addIntegerOption(option => option.setName('amount').setDescription('The amount to update').setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.user;

        const players = dataManager.readJSON('./data/players.json');

        if (subcommand === 'check') {
            const balance = players[user.id]?.balance || 0;
            return interaction.reply(`Your current balance is $${balance}`);
        } else if (subcommand === 'update') {
            const amount = interaction.options.getInteger('amount');
            players[user.id].balance += amount;
            dataManager.writeJSON('./data/players.json', players);

            // Update the leaderboard after balance change
            await updateLeaderboard(interaction.client, interaction.guild);

            return interaction.reply(`Your balance has been updated by $${amount}`);
        }
    }
};
