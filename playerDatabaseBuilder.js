import { get } from "axios";
import { load } from "cheerio";
import { writeFileSync } from "fs";
import competitions from "./competitions.js";

const BASE = "https://www.transfermarkt.com";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
};

// Delay para evitar bloqueios por excesso de requisições (Importante)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// CLUBES OU SELEÇÕES
async function getTeams(url) {
  const { data } = await get(url, { headers });
  const $ = load(data);
  const teams = [];
  $(".items tbody tr").each((i, el) => {
    const link = $(el).find("td a").attr("href");
    const name = $(el).find("td a").text().trim();

    if (link && link.includes("/verein/")) {
      teams.push({
        name,
        url: BASE + link,
      });
    }
  });
  return teams;
}

// LOGO DO TIMES
async function getTeamLogo(teamUrl) {
  try {
    const { data } = await get(teamUrl, { headers });
    const $ = load(data);
    const logo = $(".data-header__profile-container img").attr("src");
    return logo || "";
  } catch {
    return "";
  }
}

// ELENCOS
async function getPlayers(team) {
  const squadUrl = team.url.replace("startseite", "kader");
  const { data } = await get(squadUrl, { headers });
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

// DADOS DO JOGADORES
async function getPlayerData(player) {
  try {
    const { data } = await get(player.url, { headers });
    const $ = load(data);
    const nome = $("h1").text().trim();
    const idade = $(".data-header__content")
      .text()
      .match(/(\d+)\s*anos/)?.[1] || "";
    const valor = $(".data-header__market-value-wrapper")
      .text()
      .trim();
    const posicao = $(".detail-position__position").text().trim();
    const id = player.url.match(/spieler\/(\d+)/)?.[1];
    const imagem = id
      ? `https://img.a.transfermarkt.technology/portrait/big/${id}.jpg`
      : "";
    return {
      nome,
      idade,
      clube: player.team,
      valor,
      posicao,
      imagem,
    };
  } catch {
    return null;
  }
}

// MAIN
(async () => {
  const resultado = [];
  for (const comp of competitions) {
    console.log("🏆 Competição:", comp.name);
    const teams = await getTeams(comp.url);
    for (const team of teams.slice(0, 3)) {
      console.log("🏟️ Time:", team.name);
      const logo = await getTeamLogo(team.url);
      const players = await getPlayers(team);
      for (const player of players.slice(0, 8)) {
        console.log("👤", player.name);
        const data = await getPlayerData(player);
        if (data) {
          resultado.push({
            ...data,
            logo,
            competicao: comp.name,
          });
        }

        await delay(800);
      }
    }
  }

  writeFileSync("database.json", JSON.stringify(resultado, null, 2));

  console.log("Finalizado: database.json");
})();