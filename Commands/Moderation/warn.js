const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports.run = async (client, message, args, prefix, embedError) => {

    if (!message.member.roles.cache.find(r => r.id === client.config.IDs.roles.staff)) return message.channel.send(embedError(undefined, `Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&${client.config.IDs.roles.staff}>`))
    if (!message.mentions.users.first()) return  message.channel.send(embedError(undefined, '**Mention invalide !**'))

    const target = message.mentions.users.first();
    const reason = args[1] ? `**📝 Raison:** ${args.slice(1).join(' ')}` : "";

    !db.get(`${target.id}.warns`) ? await db.set(`${target.id}.warns`, 1) : await db.add(`${target.id}.warns`, 1 );
    const warns = !db.get(`${target.id}.warns`) ? 0 : db.get(`${target.id}.warns`);

    const embed = new MessageEmbed()
        .setAuthor({name: `${target.username} a été avertit !`, iconURL: target.displayAvatarURL()})
        .setDescription(`<@!${target.id}> possède **désormais ${warns === 0 || warns === 1 ? warns + " avertissement" : warns + " avertissements"} !** \n \n **👤 Modérateur:** <@!${message.author.id}> \n \n ${reason}`)
        .setColor(client.config.colors.error)
        .setFooter({text: `Demandée par ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
        .setTimestamp();
    
    message.channel.send({embeds: [embed]})
    client.channels.cache.get(client.config.IDs.channels.sanctions).send({embeds: [embed]})
}

module.exports.help = {
    name: "warn",
    category: 'moderation',
    description: "Ajoute un avertissement à la personne mentionnée !",
    args: true,
    usage: '[@Gentille personne]',
    cooldown: 0,
    aliases: [],
    userPerms: [],
    userPermsName: [],
    botPerms: [],
    botPermsName: [],
    deletecmd: true,
}