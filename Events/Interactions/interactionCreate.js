module.exports = (client, interaction) => {
    if (interaction.isButton()) {
        const commandName = interaction.customId.split("/")[0]
        const command = client.buttons.get(commandName);
        const args = interaction.customId.split("/").slice(1);

        //sécurité
        if (interaction.user.bot || !command) return;
        
        try {
            command.execute(client, interaction, args)
            .then(() => {
                console.log(`✅ Bouton ${command.name} réalisée avec succès !`);
            })
        } catch (err) {
            console.log(`❌ Une erreur est survenue lors de l'interaction du bouton ${command.name} !`)
            console.log(err);
        }
    }
}