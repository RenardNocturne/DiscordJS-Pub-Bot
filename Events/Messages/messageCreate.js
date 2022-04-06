const { MessageEmbed, MessageActionRow, MessageButton, Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (client, message) => {

  if (message.author.bot) return
  //Constantes
  const pubChannels = client.config.IDs.channels.pub;
  const verifChannel = client.channels.cache.get(client.config.IDs.channels.verif);

  //Si le message vient d'un salon pub
  if (pubChannels.includes(message.channel.id)) {
    message.channel.messages.fetch({ limit: 3}, {cache: true}).then(m => {
      const oldMsg = m.find(m => m.author.id === client.config.IDs.client);
      if (oldMsg) oldMsg.delete().catch(err => console.log(err));
    })  

    const pubEmbed = new MessageEmbed()
      .setAuthor({name: `🎉 Publicité envoyée sur  ${message.guild.name} !`, iconURL: message.guild.iconURL()})
      .setDescription(`<@!${message.author.id}>, merci pour ta publicité sur ${message.guild.name} ! \n \n **__❗ Pour éviter que ta publicité ne soit refusée:__** \n ➜ Votre publicité doit avoir au moins 3 lignes ! \n ➜ Merci de respecter les TOS de et le règlement ! \n ➜ Pas de serveur NSFW !`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({text: `${message.channel.guild.name} et tes projets vont plus loin !`, iconURL: message.channel.guild.iconURL()})
      .setTimestamp()
      .setColor(client.config.colors.default);

    const verifEmbed =  new MessageEmbed()
      .setAuthor({name: `Publicité de ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
      .setDescription(`**__📋 Contenu :__** \n ${message.content} \n \n **__👤 Auteur :__** \`\`${message.author.username}\`\` / <@!${message.author.id}>  \n \n **__📌 Salon :__** <#${message.channel.id}> \n \n **[🔗 Sauter vers la pub afin d'en savoir plus !](${message.url})**`)
      .setFooter({text: 'Utilisez les boutons ci-dessous pour valider ou non la pub !', iconURL: message.channel.guild.iconURL()})
      .setTimestamp()
      .setColor(client.config.colors.default);

    const row = new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setCustomId(`valid/${message.id}/${message.channel.id}`)
          .setLabel('Valider !')
          .setStyle('SUCCESS'),

        new MessageButton()
          .setCustomId(`invalid/${message.id}/${message.channel.id}`)
          .setLabel('Supprimer !')
          .setStyle('DANGER')
      ]);
    
    message.react('⏳');
    message.channel.send({embeds: [pubEmbed]});
    verifChannel.send({embeds: [verifEmbed], components: [row]});
  }

  const prefix = client.config.PREFIX;
  const args = message.content.slice(prefix.length).split(/ +/);
  if(!message.content.toLowerCase().startsWith(prefix)) return;

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

  //sécurité
  if (message.type !== 'DEFAULT' || message.author.bot || !command) return;
  
  //args
  if (args.length < command.help.args) return message.channel.send(embedError(undefined, `**Utilisation attendue:** \n \`${prefix}${command.help.name} ${command.help.usage}\` \n \n *[Obligatoire], <Optionnel>*`))

  if (!message.member.permissions.has(command.help.userPerms)) return message.channel.send(embedError("Une ou plusieurs permissions manquantes !", `Certaines permissions semblent manquées. \n\n *__Permissions requises pour effectuer la commande:__* \n > ${command.help.userPermsName.join(' \n > ')}`));
  if (!message.guild.me.permissions.has(command.help.botPerms)) return message.channel.send(embedError("Une ou plusieurs permissions manquantes !", `Certaines permissions semblent me manquer. \n\n *__J'ai besoin des permissions:__* \n > ${command.help.botPermsName.join('\n > ')}`));

  //delete
  if(command.help.deletecmd === true && message.deletable) message.delete().catch(err => console.log(err)) // Si dans le command help on a mis true à delete et que le message est deletable on le delete. Si ça marche po on catch les errors

  function embedError (title = ":x: Une erreur est survenue !", description = "Quelque chose semble causer problème :thinking:") {
    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor(client.config.colors.error)
      .setDescription(description)
      .setFooter({text: `Demandée par ${message.author.username}`, iconURL: `${message.author.avatarURL()}`})
      .setTimestamp();

    return {embeds: [embed]};
  };

  command.run(client, message, args, prefix, embedError);
}
