const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports.run = (client, message, args, prefix, embedError) => {

    if (!message.member.roles.cache.find(r => r.id === client.config.IDs.roles.staff)) return message.channel.send(embedError(undefined, `Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&${client.config.IDs.roles.staff}>`))
    if (!message.mentions.users.first()) return message.channel.send(embedError(undefined, '**Mention invalide !**'))

    const target = message.mentions.users.first();
    let warns = !db.get(`${target.id}.warns`) ? 0 : db.get(`${target.id}.warns`);

    const embed = new MessageEmbed()
        .setAuthor({name: `Avertissements de ${target.username}`, iconURL: target.displayAvatarURL()})
        .setDescription(`<@!${target.id}> possède **${warns === 0 || warns === 1 ? `${warns} avertissement` : `${warns} avertissements`} !**`)
        .setColor(client.config.colors.default)
        .setFooter(`Demandée par ${message.author.username}`, message.author.displayAvatarURL())
        .setTimestamp();

    message.channel.send({embeds: [embed]})
}

module.exports.help = {
    name: "seewarns",
    category: 'moderation',
    description: "Vous permet de vérifier les avertissements la personne mentionnée !",
    args: true,
    usage: '[@Gentille personne]',
    cooldown: 0,
    aliases: ["seewarn"],
    userPerms: [],
    userPermsName: [],
    botPerms: [],
    botPermsName: [],
    deletecmd: true,
}