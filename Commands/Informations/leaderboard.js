const { MessageEmbed } = require('discord.js');
const db = require('quick.db')

module.exports.run = async (client, message, args, prefix, convertTtD, upperCaseFirstLettter) => {
    
    let sorted = [];
    const top3 = []
    
    db.all().forEach(table => {
        if (table.data.verifs) sorted.push(table.data.verifs)
    })

    sorted = sorted.sort((a, b) => a - b).reverse()
    
    let i = 0;
    while (i < (sorted.length)) {
        db.all().forEach(table => {
            const verifs = table.data.verifs;
            if (verifs === sorted[i] && verifs !== undefined) {
                top3.push(table.ID)
                i++;
            }
        })
    }

    let txt = '';
    for (let n = 0; n < top3.length; n++) {
        let medal = '';
        if (n === 0) medal = '🥇';
        if (n === 1) medal = '🥈';
        if (n === 2) medal = '🥉';
        if (n > 2) medal = `**${i}.**`

        txt += `> ${medal} <@!${top3[n]}> avec **${db.get(`${top3[n]}.verifs`)} verification.s !** \n`;
    }

    const embed = new MessageEmbed()
        .setTitle('🏆 LeaderBoard des vérifications !')
        .setDescription(`${txt === "" ? "❌ Aucune vérification recensée !" : "**__Voici les membres avec le plus de vérification !__** \n" + txt}`)
        .setColor(client.config.colors.default)
        .setFooter({text: `Leaderboard du serveur ${message.guild.name}`, iconURL: message.guild.iconURL()})

    message.channel.send({embeds: [embed]})
}


module.exports.help = {
    name: "leaderboard",
    category: 'informations',
    description: "Vous renvoie le leaderboard du staff !",
    args: false,
    usage: '',
    cooldown: 0,
    aliases: ["lb"],
    userPerms: [],
    userPermsName: [],
    botPerms: [],
    botPermsName: [],
    deletecmd: true,
} 