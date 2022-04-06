const { writeFile } = require("fs")
const inquirer = require("inquirer")

const loadData = async () => {
    inquirer.prompt([
        {
            type: 'password',
            name: 'TOKEN',
            message: "Merci d'entrer le token de votre bot:",
            mask: '*'
        },
        {
            type: 'input',
            name: 'PREFIX',
            message: 'Prefix à utiliser:',
        },
        {
            type: 'input',
            name: 'CATEGORIES',
            message: "Entrez les ID des catégories contenant les salons de pub:",
        },
        {
            type: 'input',
            name: 'STAFF',
            message: "Entrez l'ID du rôle staff:",
        },
        {
            type: 'input',
            name: 'VERIFCHANNEL',
            message: "Entrez l'ID du salon de vérification des pubs:",
        }, 
        {
            type: 'input',
            name: 'LOGSCHANNEL',
            message: "Entrez l'ID du salon contenant les logs:",
        },
        {
            type: 'input',
            name: 'SANCTIONCHANNEL',
            message: "Entrez l'ID du salon des sanctions:",
        }
    ])
    .then(res => {
        const data = {
            IDs: {
                roles: {
                    staff: res.STAFF,
                },
                channels: {
                    pub: [],
                    verif: res.VERIFCHANNEL,
                    logs: res.LOGSCHANNEL,
                    sanctions: res.SANCTIONCHANNEL,
                },
                categories: res.CATEGORIES.split(" "),
                client: "",
            },
            colors: {
                default: "A3E4D7",
                error: "DE2916",
                success: "27AE60",
            },
            PREFIX: "!",
            TOKEN: res.TOKEN,
        }
        dataString = `module.exports = ${JSON.stringify(data)}`
        writeFile("./Utils/config.js", dataString, ((err, result) => {
            console.log("✅ Données initialisées avec succès ! You pouvez désormais entrer node .\\index.js modifier les données entrées manuellement dans le fichier config.js !");    
        }))
    })
    .catch(err => console.log(err + "❌ An error has occurred !"))
}

module.exports = {
    loadData
}