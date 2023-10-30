const { Events } = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const canal = client.channels.cache.get('1137412247421980752');

        async function obterInformacoesDoSite() {
            try {
                const response = await axios.get('https://flyffmadrigal.com.br/index.php?site=ranking&rnk=stats');
                const $ = cheerio.load(response.data);
                const uonline = $('#jogadores').text().match(/\d+/);
                return uonline[0];
            } catch (error) {
                console.error(error);
                return 'Desconhecido';
            }
        }

        async function atualizarContador() {
            try {
                const uonline = await obterInformacoesDoSite();
                await canal.setName(`🎮 • Jogando: ${uonline} / 500`);
            } catch (error) {
                console.error(error);
            }

            setTimeout(atualizarContador, 180000);
        }

        atualizarContador();
    }
}
