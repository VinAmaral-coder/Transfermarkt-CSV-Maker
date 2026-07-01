import axios from "axios";
import { load } from "cheerio";
import { writeFileSync } from "fs";
import { json2csv } from "json-2-csv";
import competitions from "./competitions.js";

const BASE = "https://www.transfermarkt.com";

/**
  Transfermarkt blocks many requests that do not mimic a real browser.
  The headers below reproduce a common Chromium browser request.
 */

const headers = { 
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// CLUBES
async function getTeams(url) {
  const { data } = await axios.get(url, { headers });
  const $ = load(data);
  const teams = [];

  $(".items tbody tr").each((i, el) => {
 const link = $(el)
    .find("td a")
    .attr("href");
    const name = $(el)
    .find("td.hauptlink a")
    .text()
    .trim();

    if (link && link.includes("/verein/")) {
      teams.push({
        name,
        url: BASE + link,
      });
    }
  });

  return teams;
}

// LOGO DO CLUBE
async function getTeamLogo(teamUrl) {
  try {
    const { data } = await axios.get(teamUrl, { headers });
    const $ = load(data);
    const logo =
      $(".data-header__profile-container img").attr("src") ||
      $(".data-header__profile-container img").attr("data-src") ||
      "";

    return logo;
  } catch (err) {
    console.error("Erro ao buscar logo:", err.message);
    return "";
  }
}

// ELENCO
async function getPlayers(team) {
  const squadUrl = team.url.replace("startseite", "kader");
  const { data } = await axios.get(squadUrl, { headers });
  const $ = load(data);
  const players = [];

  $(".items tbody tr").each((i, el) => {
    const playerLink = $(el).find("td.posrela a").attr("href");
    const name = $(el).find("td.posrela a").text().trim();

    if (playerLink && playerLink.includes("/spieler/")) {
      players.push({
        name,
        url: BASE + playerLink,
        team: team.name,
      });
    }
  });

  return players;
}

// DADOS DO JOGADOR
async function getPlayerData(player) {
  try {
    const { data } = await axios.get(player.url, { headers });
    const $ = load(data);

  const number = $(".data-header__shirt-number")
  .text()
  .trim();

  const hd = $("h1").clone();
hd.find(".data-header__shirt-number").remove();
  const nome = hd
  .text()
  .trim();
    const idade =
      $(".data-header__content")
        .text()
        .match(/\((\d+)\)/)?.[1] || "";
    const valor = $(".data-header__market-value-wrapper")
      .text()
      .split("Last update:")[0]
      .trim();
    const positions = $(".detail-position__position");
    const posicao = positions.first()
  .text()
  .trim();
    const id = player.url.match(/spieler\/(\d+)/)?.[1];
    const imagem =
    $(".data-header__profile-container img").attr("src")
    "";
    return {
      Numero: number,
      Nome: nome,
      Idade: idade,
      Clube: player.team,
      Valor: valor,
      Posição: posicao,
      Imagem: imagem,
    };
  } catch (err) {
    console.error(
      `Erro ao buscar jogador ${player.name}:`,
      err.message
    );

    return null;
  }
}

// MAIN
(async () => {
  const resultado = [];

  try {
    for (const comp of competitions.slice(0, 1)) { // Testes iniciais com os times da Premier League
      console.log(`🏆 Competição: ${comp.name}`);
      const teams = await getTeams(comp.url);

      for (const team of teams) { // Testes iniciais com apenas 1 clubes da Premier League
        console.log(`🏟️ Time: ${team.name}`);
        const logo = await getTeamLogo(team.url);
        const players = await getPlayers(team);
        for (const player of players) { // Testes iniciais apenas com jogadores da Premier League
          console.log(`👤 ${player.name}`);
          const data = await getPlayerData(player);
          if (data) {
            resultado.push({
              ...data,
              Logo: logo,
              Competição: comp.name,
            });
          }

          await delay(800);
        }
      }
    }

    const csv = await json2csv(resultado);

    writeFileSync("data/database.csv", csv, "utf8");

    console.log(
      `✅ Finalizado! ${resultado.length} jogadores salvos em database.csv`
    );
  } catch (err) {
    console.error("❌ Erro geral:", err);
  }
})();