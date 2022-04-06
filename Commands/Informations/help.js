const { MessageEmbed, MessageAttachment } = require("discord.js");
const { readdirSync } = require('fs');

module.exports.run = async (client, message, args, prefix, embedError) => {
    const categoryList = readdirSync('./Commands');
    const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));
    function upperCaseFirstLetter(str){
        return (str + ' ').charAt(0).toUpperCase() + str.substr(1);
    };

    if (args.length === 0 || command === undefined) {
        const embed = new MessageEmbed()
            .setTitle(`💡 Voici la liste des commandes !`)
            .setColor(client.config.colors.default)
            .setDescription(`**Pour plus d'informations sur l'une des commandes, tapez** \`${prefix}help <Nom d'une commande>\` !`)
            .setFooter({text: `Demandée par ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTimestamp()

        categoryList.forEach(category => {
            let categoryName;

            switch (category.toString()) {
                case 'Informations':
                    categoryName = '🔍 Inforrmations'
                    break;

                case 'Moderation':
                    categoryName = '🛡 Modération'
                    break;

                default:
                    break;
            }

            let txt = '';
            client.commands.filter(cat => cat.help.category === category.toLowerCase()).forEach(cmd => {
                txt += `> \`${prefix}${cmd.help.name}\` ${cmd.help.description} \n`
            })
            embed.addField(`${categoryName}`, `${txt}`)
        });

        return message.channel.send({embeds: [embed]})
    } else {
        let txt = '';
        txt += `**__✨ Nom de la commande:__** \n > \`\`${command.help.name}\`\` \n \n `;
        if (command.help.aliases.length !== 0) txt += `**__📝 Aliases:__** \n > \`\`${command.help.aliases.join(' \n > ')}\`\` \n \n`
        txt += `**__📜 Description:__** \n > ${command.help.description} \n \n **__📂 Catégorie:__** \n > ${upperCaseFirstLetter(command.help.category)} \n \n **__🔖 Utilisation:__** \n > \`${prefix}${command.help.name} ${command.help.usage}\` \n\n`;
        if (command.help.userPermsName.length !== 0) txt += `**__🔒 Permissions utilisateur requises:__** \n > ${(command.help.userPermsName.join(' \n > '))} \n \n`
        if (command.help.botPermsName.length !== 0) txt += `**__🤖 Permissions du bot requises:__** \n > ${command.help.botPermsName.join(' \n > ').toLowerCase()} \n \n`

        const embed = new MessageEmbed()
            .setTitle(`💡 Voici les informations pour la commande ${command.help.name} !`)
            .setColor(client.config.colors.default)
            .setDescription(txt)
            .setTimestamp()
            .setFooter({text: `Demandée par ${message.author.username}`, iconURL: message.author.displayAvatarURL()});
        message.channel.send({embeds: [embed]})
    }
}

module.exports.help = {
    name: "help",
    category: 'informations',
    description: "Vous renvoie la liste des commandes et leurs descriptions !",
    args: false,
    usage: '<Nom d\'une commande>',
    cooldown: 0,
    aliases: [],
    userPerms: [],
    userPermsName: [],
    botPerms: [],
    botPermsName: [],
    deletecmd: true,
} 