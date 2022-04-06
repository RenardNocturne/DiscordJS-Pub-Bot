module.exports = async (bot, guild) => {
    await bot.updateGuild(guild, { prefix:  'p!'});
    console.log(guild.name + ' nous a quitté !');
}