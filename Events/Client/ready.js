module.exports = (client) => {
  console.log("🚀 Client successfully logged in !")
  client.config.IDs.client = client.user.id
  client.user.setPresence({ activities: [{ name: 'vos meilleures pubs !', type: 'WATCHING' }], status: 'online'});

  function getAllAdsChannelsIDs (category) {
    client.channels.cache.get(category).children.forEach(channel => {
      client.config.IDs.channels.pub.push(channel.id);
    })
  }

  for (let category of client.config.IDs.categories) {
    getAllAdsChannelsIDs(category);
  }
}
