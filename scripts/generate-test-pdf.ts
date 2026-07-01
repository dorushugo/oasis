import puppeteer from "puppeteer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../docs/test-utilisateur-oasis.pdf");
const CITY = "Dax";
const URL_APP = "https://oasis-cyan.vercel.app";

const visitorTasks = [
  {
    n: 1,
    title: "Compréhension de la page d’accueil",
    steps: [
      "Ouvrez le site.",
      "Sans cliquer, pouvez-vous dire à quoi sert ce site en une phrase ?",
      "Combien de lieux frais sont disponibles en ce moment ?",
      "Y a-t-il une alerte en cours ? Si oui, quelle est sa gravité ?",
    ],
    success: "Réponses correctes en moins de 10 secondes.",
  },
  {
    n: 2,
    title: "Trouver un lieu de fraîcheur",
    steps: [
      "Trouvez une fontaine ouverte près de chez vous.",
      "Observer : le testeur clique-t-il sur « Consulter la carte » ou sur un lieu de la liste ?",
    ],
    success: "Arrive sur la carte en moins de 2 clics.",
  },
  {
    n: 3,
    title: "Filtrer les lieux sur la carte",
    steps: [
      "Sur la carte, affichez uniquement les bibliothèques.",
      "Observer : le testeur trouve-t-il les filtres, sur ordinateur comme sur mobile (bouton « Liste ») ?",
    ],
    success: "Filtre appliqué en moins de 15 secondes.",
  },
  {
    n: 4,
    title: "Signaler une situation (bouton d’aide)",
    steps: [
      "Imaginez que votre voisine âgée ne répond plus. Signalez-le via le site.",
      "Observer : le testeur repère-t-il le bouton rouge « Besoin d’aide » ? Comprend-il qu’il peut envoyer sans message ?",
    ],
    success: "Signalement envoyé en moins de 30 secondes.",
  },
  {
    n: 5,
    title: "Retrouver les recommandations sanitaires",
    steps: [
      "Revenez à l’accueil. Trouvez une recommandation sur l’hydratation.",
      "Observer : le testeur utilise-t-il l’en-tête, le bouton retour ou la navigation mobile ?",
    ],
    success: "Recommandation trouvée en moins de 10 secondes.",
  },
];

const adminTasks = [
  {
    n: 1,
    title: "Se connecter",
    steps: [
      "Accédez à l’espace agent et connectez-vous.",
      "Observer : le testeur trouve-t-il le lien « Espace agent » ? Le formulaire est-il compris immédiatement ?",
    ],
    success: "Connecté en moins de 30 secondes.",
  },
  {
    n: 2,
    title: "Ajouter un lieu via la carte",
    steps: [
      "Ajoutez un nouveau lieu de fraîcheur : « Gymnase des Arènes », Avenue Paul Lasaosa, type Gymnase, ouvert de 9 h à 19 h, capacité 150 personnes.",
      "Placez le point directement sur la carte.",
      "Observer : le testeur comprend-il qu’il faut cliquer sur la carte ? Le formulaire pré-rempli est-il clair ?",
    ],
    success: "Lieu ajouté en moins de 2 minutes.",
  },
  {
    n: 3,
    title: "Fermer un lieu",
    steps: [
      "La Fontaine Chaude est en maintenance. Désactivez-la.",
      "Observer : le testeur trouve-t-il l’interrupteur « Ouvert / Fermé » dans le tableau ?",
    ],
    success: "Lieu fermé en moins de 15 secondes.",
  },
  {
    n: 4,
    title: "Créer une notification",
    steps: [
      "Publiez une notification de type « Vigilance » invitant à éviter les sorties entre 14 h et 17 h.",
      "Observer : le testeur navigue-t-il vers « Notifications » ? Le formulaire est-il compris ?",
    ],
    success: "Notification publiée en moins d’une minute.",
  },
  {
    n: 5,
    title: "Consulter les signalements",
    steps: [
      "Vérifiez s’il y a des demandes d’aide en attente sur le tableau de bord.",
      "Observer : le testeur retourne-t-il au « Tableau de bord » naturellement ?",
    ],
    success: "Signalement trouvé en moins de 15 secondes.",
  },
];

const debriefing = [
  "Sur une échelle de 1 à 5, à quel point le site était-il facile à utiliser ?",
  "Qu’est-ce qui vous a semblé le plus clair ?",
  "Qu’est-ce qui vous a semblé confus ou difficile ?",
  "En pleine canicule, feriez-vous confiance à ce site pour vous aider ?",
  "Y a-t-il quelque chose que vous auriez aimé trouver et qui n’était pas présent ?",
  "(Espace agent) La carte cliquable pour ajouter un lieu était-elle intuitive ?",
];

const gridRows = [
  "V1 — Compréhension de l’accueil",
  "V2 — Trouver un lieu",
  "V3 — Filtrer les lieux",
  "V4 — Signalement d’aide",
  "V5 — Recommandations",
  "A1 — Connexion",
  "A2 — Ajout d’un lieu (carte)",
  "A3 — Fermeture d’un lieu",
  "A4 — Notification",
  "A5 — Signalements",
];

function renderTasks(tasks: typeof visitorTasks) {
  return tasks
    .map(
      (t) => `
      <div class="task">
        <div class="task-head">
          <span class="task-num">${t.n}</span>
          <h3>${t.title}</h3>
        </div>
        <ul>${t.steps.map((s) => `<li>${s}</li>`).join("")}</ul>
        <p class="success"><strong>Critère de réussite —</strong> ${t.success}</p>
      </div>`
    )
    .join("");
}

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Marianne";
    src: url("file://${path.resolve(__dirname, "../public/fonts/Marianne-Regular.woff2")}") format("woff2");
    font-weight: 400;
  }
  @font-face {
    font-family: "Marianne";
    src: url("file://${path.resolve(__dirname, "../public/fonts/Marianne-Medium.woff2")}") format("woff2");
    font-weight: 500;
  }
  @font-face {
    font-family: "Marianne";
    src: url("file://${path.resolve(__dirname, "../public/fonts/Marianne-Bold.woff2")}") format("woff2");
    font-weight: 700;
  }
  :root {
    --blue: #000091;
    --ink: #161616;
    --muted: #666666;
    --border: #e0e0e0;
    --bg-soft: #f6f6f6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Marianne", system-ui, sans-serif;
    color: var(--ink);
    font-size: 11px;
    line-height: 1.5;
  }
  .page { padding: 32px 40px; }
  .cover {
    border-top: 6px solid var(--blue);
    padding-top: 24px;
  }
  .brand { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 10px 0 6px; }
  .subtitle { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; border: 1px solid var(--border); border-radius: 6px; padding: 14px 16px; margin-bottom: 20px; }
  .meta div { font-size: 11px; }
  .meta strong { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 2px; font-weight: 700; }
  .note { background: var(--bg-soft); border-left: 3px solid var(--blue); padding: 12px 14px; border-radius: 0 4px 4px 0; margin-bottom: 20px; }
  .note h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .note ul { padding-left: 16px; }
  h2.section { font-size: 15px; font-weight: 700; margin: 24px 0 4px; padding-bottom: 6px; border-bottom: 2px solid var(--ink); }
  .flow-context { font-style: italic; color: var(--muted); background: var(--bg-soft); padding: 10px 12px; border-radius: 4px; margin: 10px 0 14px; }
  .task { border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; margin-bottom: 10px; page-break-inside: avoid; }
  .task-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .task-num { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: var(--blue); color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .task h3 { font-size: 12px; font-weight: 700; }
  .task ul { padding-left: 30px; margin: 4px 0; }
  .task li { margin-bottom: 2px; }
  .success { font-size: 10px; color: var(--blue); margin-top: 6px; padding-left: 30px; }
  .creds { display: inline-block; background: var(--bg-soft); border: 1px solid var(--border); border-radius: 4px; padding: 4px 10px; font-size: 11px; margin: 8px 0 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
  th, td { border: 1px solid var(--border); padding: 7px 8px; text-align: left; vertical-align: top; }
  th { background: var(--bg-soft); font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: 0.03em; }
  td.fill { height: 26px; }
  ol.debrief { padding-left: 18px; }
  ol.debrief li { margin-bottom: 5px; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 9px; color: var(--muted); }
  .pagebreak { page-break-before: always; }
</style>
</head>
<body>
  <div class="page">
    <div class="cover">
      <p class="brand">Ville de ${CITY} · Plateforme Oasis</p>
      <h1>Protocole de test utilisateur</h1>
      <p class="subtitle">Évaluation de la clarté et de l’accessibilité du service canicule</p>
    </div>

    <div class="meta">
      <div><strong>Durée estimée</strong>10 à 15 minutes par testeur</div>
      <div><strong>Matériel</strong>Smartphone ou ordinateur avec accès internet</div>
      <div><strong>Adresse du service</strong>${URL_APP}</div>
      <div><strong>Méthode</strong>Verbalisation à voix haute (« think-aloud »)</div>
    </div>

    <div class="note">
      <h2>Consignes pour l’observateur</h2>
      <ul>
        <li>Ne pas aider ni guider le testeur pendant les tâches.</li>
        <li>Noter les hésitations, erreurs et commentaires spontanés.</li>
        <li>Chronométrer chaque tâche.</li>
        <li>Poser les questions de débriefing à la fin de la session.</li>
      </ul>
    </div>

    <h2 class="section">Parcours 1 — Usager (habitant)</h2>
    <p class="flow-context">« Imaginez qu’il fait 40 °C dehors. Vous cherchez un endroit frais à proximité. Un voisin vous a transmis ce lien. »</p>
    ${renderTasks(visitorTasks)}

    <div class="pagebreak"></div>

    <h2 class="section">Parcours 2 — Agent municipal</h2>
    <p class="flow-context">« Vous êtes agent à la mairie de ${CITY}. Un nouveau gymnase climatisé vient d’ouvrir : vous devez l’ajouter à la plateforme. »</p>
    <span class="creds"><strong>Identifiants de test :</strong> admin@mairie-dax.fr &nbsp;/&nbsp; admin123</span>
    ${renderTasks(adminTasks)}

    <div class="pagebreak"></div>

    <h2 class="section">Débriefing</h2>
    <p style="margin:8px 0 4px; color: var(--muted);">À poser oralement une fois toutes les tâches réalisées.</p>
    <ol class="debrief">
      ${debriefing.map((q) => `<li>${q}</li>`).join("")}
    </ol>

    <h2 class="section">Grille d’observation</h2>
    <p style="margin:8px 0 4px; color: var(--muted);">À compléter pendant la session.</p>
    <table>
      <thead>
        <tr>
          <th style="width:38%">Tâche</th>
          <th style="width:12%">Durée</th>
          <th style="width:12%">Réussite</th>
          <th>Hésitations / commentaires</th>
        </tr>
      </thead>
      <tbody>
        ${gridRows
          .map(
            (r) => `<tr><td>${r}</td><td class="fill"></td><td></td><td></td></tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="footer">
      Trois testeurs suffisent à détecter environ 80 % des problèmes d’utilisabilité (loi de Nielsen).<br />
      Ville de ${CITY} — Plateforme Oasis · Document interne de test.
    </div>
  </div>
</body>
</html>`;

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: OUT,
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  await browser.close();
  console.log(`PDF généré : ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
