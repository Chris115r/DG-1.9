const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of commands, including admin commands if you are an admin'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        const userRoles = interaction.member.roles.cache;

        const embed = new MessageEmbed()
            .setTitle('Help - List of Commands')
            .setColor('#00FF00')
            .setTimestamp();

        commands.forEach(command => {
            if (!command.data.defaultPermission) {
                if (userRoles.some(role => role.name === 'Admin')) {
                    embed.addField(command.data.name, command.data.description, false);
                }
            } else {
                embed.addField(command.data.name, command.data.description, false);
            }
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
