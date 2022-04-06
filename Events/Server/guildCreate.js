module.exports = async (bot, guild) => {
    const newGuild = {
        guildID: guild.id,
        guildName: guild.name,
    };

    const settings = await bot.getGuild(guild);
    console.log(`J'ai rejoint le serveur ${guild.name} !`);
    if (!settings.guildID) await bot.createGuild(newGuild);
}