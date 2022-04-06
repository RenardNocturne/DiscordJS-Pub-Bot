const { readdirSync } = require('fs');

const loadCommands = (bot, dir = './Commands') => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const file of commands) {
        const getFileName = require(`../${dir}/${dirs}/${file}`);
        bot.commands.set(getFileName.help.name, getFileName);
        console.log(`✅ La commande ${getFileName.help.name} a bien été chargée !`);
        };
    });
};

const loadEvents = (bot, dir = './Events') => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const event of events) {
        const evt = require(`../${dir}/${dirs}/${event}`);
        const evtName = event.split(".")[0];
        bot.on(evtName, evt.bind(null, bot));

        console.log(`✅ L'évènement ${evtName} a bien été chargée !`);
        };
    });
};

const loadButtons = (bot, dir = './Events/Interactions/Buttons') => {
    readdirSync(dir).forEach(dirs => {
        const buttons = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const file of buttons) {
            const command = require(`../${dir}/${dirs}/${file}`);
            bot.buttons.set(command.name, command);
            console.log(`✅ Le bouton ${command.name} a bien été chargée !`);
        };
    });
};

module.exports = {
    loadCommands,
    loadEvents,
    loadButtons
}