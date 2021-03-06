const { Client, ButtonInteraction, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: "invalid",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    async execute (client, interaction, args) {
        const messageID = args[0];
        const channelID = args[1];
        const row = interaction.message.components[0]
        const message = await client.channels.cache.get(channelID).messages.fetch(messageID).catch(err => console.log(err));

        const reasonRow = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId(`reasonMenu`)
              .setPlaceholder('❓ Pour quelle raison supprimez-vous cette pub ?')
              .addOptions([
                {
                  label: 'Mauvais salon !',
                  description: 'La publicité n\'est pas dans le bon salon !',
                  emoji: '📌',
                  value: 'channel',
                },
                {
                  label: 'Pub sans description !',
                  description: 'La publicité ne contient aucune information !',
                  emoji: '📋',
                  value: 'description',
                }, 
                {
                  label: 'Publicité interdite !',
                  description: 'Aucune autorisation fournie !',
                  emoji: '⛔',
                  value: 'authorization',
                }, 
                {
                  label: 'Lien.s invalide.s !',
                  description: 'Le lien ne fonctionne pas ou est malveillant !',
                  emoji: '🔗',
                  value: 'link',
                },
                {
                  label: 'Raison autre:',
                  description: 'Aucune de ces possibilité ne correspond !',
                  emoji: '📝',
                  value: 'autre',
                },
                {
                  label: 'Je me suis trompé !',
                  description: 'Souhaitez-vous annuler l\'action ?',
                  emoji: '❌',
                  value: 'fail',
                }
            ])
        )

        interaction.update({components: [reasonRow], fetchReply: true})
        .then(res => {
            filter = i => i.customId === 'reasonMenu' && i.user.id === interaction.user.id;
            res.awaitMessageComponent({filter})
            .then(i => {
                const verifEmbed =  interaction.message.embeds[0];

                async function removeAd (r) {
                    !db.get(`${interaction.user.id}.verifs`) ? await db.set(`${interaction.user.id}.verifs`, 1) : await db.add(`${interaction.user.id}.verifs`, 1)
                    !db.get(`${message.author.id}.warns`) ? await db.set(`${message.author.id}.warns`, 1) : await db.add(`${message.author.id}.warns`, 1)  

                    message.delete().catch(err => console.log(err));

                    const invalidEmbed = new MessageEmbed()
                      .setAuthor({name: `Publicité refusée par ${interaction.user.username} !`, iconURL: interaction.user.displayAvatarURL()})
                      .setDescription(`${interaction.message.embeds[0].description} \n \n **__🚀 Vérification :__** \n **❌ Publicité refusée** par \`\`${interaction.user.username}\`\` / <@!${interaction.user.id}> qui réalise sa ${db.get(`${interaction.user.id}.verifs`) === 1 ? db.get(`${interaction.user.id}.verifs`) + "ère" : db.get(`${interaction.user.id}.verifs`) + "ème"} vérification ! \n\n Le membre \`\`${message.author.username}\`\` / <@!${message.author.id}> a bien été avertit car ${r} et possède désormais ${db.get(`${message.author.id}.warns`) === 1 ? db.get(`${message.author.id}.warns`) + " avertissement" : db.get(`${message.author.id}.warns`) + " avertissements"}.`)
                      .setFooter({text: `Merci à ${interaction.user.username} pour la vérification !`, iconURL: interaction.user.displayAvatarURL()})
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/871123050114998322/873311588768170074/image1.png')
                      .setColor(client.config.colors.error);
                    const sanctionEmbed = new MessageEmbed()
                      .setAuthor({name: `Publicité refusée par ${interaction.user.username} !`, iconURL: interaction.user.displayAvatarURL()})
                      .setDescription(`👤 Auteur ・ ${message.author.tag} \n 🕵️‍♂️ Modérateur・${interaction.user.tag}\n ❓ Raison・${r} !\n 🔢 Nombre d'avertissements・${db.get(`${message.author.id}.warns`)}`)
                      .setFooter({text: `Merci à ${interaction.user.username} pour la vérification !`, iconURL: interaction.user.displayAvatarURL()})
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/871123050114998322/873311588768170074/image1.png')
                      .setColor(client.config.colors.error);

                  interaction.message.delete().catch(err => console.log(err));
                  client.channels.cache.get(client.config.IDs.channels.logs).send({embeds: [invalidEmbed]});
                  client.channels.cache.get(client.config.IDs.channels.sanctions).send({embeds: [sanctionEmbed]})
                }

                switch (i.values[0]) {
                    case "channel":
                        removeAd("la publicité n'est pas dans le bon salon");
                        break;
                    case "description":
                        removeAd("la publicité ne contient aucune information");
                        break;
                    case "authorization":
                        removeAd("aucune autorisation n'a été fournie");
                        break;
                    case "link":
                        removeAd("le lien ne fonctionne pas ou est malveillant");
                        break;
                    case "autre":
                        removeAd("quelque chose pose problème (autre)");
                        break;
                    case "fail":
                        i.update({embeds: [verifEmbed], components: [row]});
                        break;
                    default:
                        break;
                }
            })
        })
    }
}