const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {

  const logsChannel = client.channels.cache.get(client.config.IDs.channels.logs);
  
  await member.guild.members.ban(member.id, {days: 7}).catch(err => console.log(err))
  await member.guild.members.unban(member.id).catch(err => console.log(err))
  
  const leaveEmbed = new MessageEmbed()
    .setAuthor({name: `${member.user.tag} nous a quitté !`, iconURL: member.user.displayAvatarURL()})
    .setDescription(`🔥 ${member.user.tag} vient de quitter le serveur ! Ses messages ont été supprimés !`)
    .setColor(client.config.colors.error)
    .setFooter({text: `Logs du serveur ${member.guild.name}`, iconURL: member.guild.iconURL()})
    .setTimestamp();
  
  logsChannel.send({embeds: [leaveEmbed]})
}