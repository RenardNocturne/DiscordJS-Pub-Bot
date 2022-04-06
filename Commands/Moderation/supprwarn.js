const { MessageEmbed, Permissions } = require('discord.js');
const db = require('quick.db')

module.exports.run = async (client, message, args, prefix, embedError) => {
    
    if (!message.member.roles.cache.find(r => r.id === client.config.IDs.roles.staff)) return message.channel.send(embedError(undefined, `Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&${client.config.IDs.roles.staff}>`))
    if (!message.mentions.users.first()) return message.channel.send(embedError(undefined, 'Veuillez mentionner une utilisateur !'))
    
    const target = message.mentions.users.first();

    if (db.get(`${target.id}.warns`) === null || db.get(`${target.id}.warns`) === 0) return message.channel.send(embedError(undefined, '**L\'utilisateur n\'a reçu aucun avertissement !**' ));
    await db.set(`${target.id}.warns`, (db.get(`${target.id}.warns`) - 1));

    const warns = await db.get(`${target.id}.warns`);
    const embed = new MessageEmbed()
        .setAuthor({name: `Avertissement de ${target.username} retiré !`, iconURL: target.displayAvatarURL()})
        .setDescription(`<@!${target.id}> possède désormais **${warns === 0 || warns === 1 ? warns + " avertissement" : warns + " avertissements"} !** \n \n **👤 Modérateur:** <@!${message.author.id}>`)
        .setColor(client.config.colors.success)
        .setFooter({text: `Demandée par ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTimestamp();
    
    message.channel.send({embeds: [embed]})
    client.channels.cache.get(client.config.IDs.channels.sanctions).send({embeds: [embed]})
}


module.exports.help = {
    name: "supprwarn",
    category: 'moderation',
    description: "Vous permet de retirer un warn à la personne mentionnée !",
    args: true,
    usage: '[@victime d\'une erreur judiciaire]',
    cooldown: 0,
    aliases: [],
    userPerms: [],
    userPermsName: [],
    botPerms: [],
    botPermsName: [],
    deletecmd: true,
} 