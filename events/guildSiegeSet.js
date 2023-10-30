const { Events, Client } = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const winnersChannel = client.channels.cache.get('1136066211910795335');
        const mvpChannel = client.channels.cache.get('1136066105560006776');

        async function obterInformacoesDoSite() {
            try {
                const response = await axios.get('https://flyffmadrigal.com.br/');
                const $ = cheerio.load(response.data);
                const winners = $('.hof-crown').text();
                const mvp = $('.hof-mvp').text();
                return { winner: winners, mvp: mvp };
            } catch (error) {
                console.error(error);
                return 'Desconhecido';
            }
        }

        async function atualizarContador() {
            try {
                const siege = await obterInformacoesDoSite();
                await winnersChannel.setName(`⚔ WINNERS: ${siege.winner}`);
                await mvpChannel.setName(`🗡MVP: ${siege.mvp}`);
            } catch (error) {
                console.error(error);
            }

            setTimeout(atualizarContador, 86400000);
        }

        atualizarContador();
    }
}
