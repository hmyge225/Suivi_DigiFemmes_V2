export type Status = "todo" | "doing" | "done";

export type PlanItem = {
  id: string;
  date: string;
  title: string;
  kind: "feature" | "milestone";
  headline: string;
  points: string[];
  livrable: string;
  validation: string;
  stack?: string;
  initial: Status;
};

export type Week = {
  id: string;
  index: number;
  name: string;
  range: string;
  intent: string;
  friday: string;
  items: PlanItem[];
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire",
  doing: "En cours",
  done: "Terminé",
};

export const WEEKS: Week[] = [
  {
    id: "s1",
    index: 1,
    name: "Socle public",
    range: "12 – 16 octobre",
    intent: "Le site se visite, se lit en français et en anglais, et le CMS commence à alimenter les pages.",
    friday: "Présentation hebdomadaire",
    items: [
      {
        id: "d-1012",
        date: "2026-10-12",
        title: "Interface publique React",
        kind: "feature",
        headline: "Pages publiques navigables : routes, layout, menu et pied de page.",
        points: [
          "Intégrer les pages prioritaires à partir des maquettes.",
          "Poser les routes, le layout, la navigation et le pied de page.",
          "Réutiliser les composants existants, puis vérifier mobile et ordinateur.",
        ],
        livrable: "Pages principales navigables.",
        validation: "Aucune route prioritaire ne mène à une page vide ou à une erreur.",
        stack: "React, Vite, React Router, Tailwind CSS",
        initial: "doing",
      },
      {
        id: "d-1013",
        date: "2026-10-13",
        title: "Interface finalisée et traductions FR/EN",
        kind: "feature",
        headline: "Textes centralisés et sélecteur de langue sur toute l’interface prioritaire.",
        points: [
          "Finaliser les pages publiques prévues.",
          "Centraliser les textes dans les fichiers français et anglais.",
          "Couvrir menus, formulaires, messages d’erreur et boutons.",
        ],
        livrable: "Interface prioritaire disponible en français et en anglais.",
        validation: "Changer de langue met à jour les textes sans casser la navigation.",
        stack: "React, i18next, react-i18next, Tailwind CSS",
        initial: "todo",
      },
      {
        id: "d-1014",
        date: "2026-10-14",
        title: "CMS Directus",
        kind: "feature",
        headline: "Collections pages, articles et médias, avec traductions et SEO.",
        points: [
          "Créer les collections pages, articles et médias.",
          "Ajouter les champs de traduction et les informations SEO.",
          "Régler les droits de lecture et d’édition, puis saisir des contenus de test.",
        ],
        livrable: "CMS utilisable avec les collections prioritaires.",
        validation: "Un administrateur peut créer et modifier du contenu depuis Directus.",
        stack: "Directus, PostgreSQL",
        initial: "todo",
      },
      {
        id: "d-1015",
        date: "2026-10-15",
        title: "Contenus Directus et premier SSO",
        kind: "feature",
        headline: "React lit le CMS, et le premier retour Authentik arrive dans Laravel.",
        points: [
          "Brancher les pages React sur les contenus Directus, langues et médias compris.",
          "Créer l’application OIDC dans Authentik et les URL de redirection.",
          "Amorcer le retour d’authentification dans Laravel.",
        ],
        livrable: "Contenu dynamique dans React et premier test de connexion SSO.",
        validation: "React affiche un contenu créé dans Directus, et le flux SSO atteint le callback Laravel.",
        stack: "React, API Directus, Laravel, Authentik, OIDC",
        initial: "todo",
      },
      {
        id: "d-1016",
        date: "2026-10-16",
        title: "Présentation hebdomadaire",
        kind: "milestone",
        headline: "Point de fin de semaine : ce qui est montrable, et ce qui reste.",
        points: [
          "Interface publique prioritaire intégrée.",
          "Traductions FR/EN fonctionnelles.",
          "CMS Directus avec contenus et médias.",
          "Premier parcours SSO testé.",
          "Liste des corrections et tâches restantes.",
        ],
        livrable: "Semaine 1 présentée : interface, langues, CMS et premier SSO.",
        validation: "Chaque point coché est réellement démontrable, pas seulement décrit.",
        initial: "todo",
      },
    ],
  },
  {
    id: "s2",
    index: 2,
    name: "Accès et évaluations",
    range: "17 – 23 octobre",
    intent: "Connexion réelle, rôles distincts, puis les deux tests métier jusqu’au rapport.",
    friday: "Présentation des fonctionnalités métier",
    items: [
      {
        id: "d-1017",
        date: "2026-10-17",
        title: "Authentification SSO finalisée",
        kind: "feature",
        headline: "Connexion et déconnexion OIDC tenues côté serveur.",
        points: [
          "Finaliser le callback et l’échange du code OIDC.",
          "Vérifier l’identité reçue et ouvrir la session Laravel.",
          "Gérer les erreurs, la déconnexion et les URL de retour incorrectes.",
        ],
        livrable: "Connexion et déconnexion SSO fonctionnelles côté backend.",
        validation: "Un utilisateur se connecte puis se déconnecte sans contourner les vérifications serveur.",
        stack: "Authentik, OIDC, Laravel",
        initial: "todo",
      },
      {
        id: "d-1018",
        date: "2026-10-18",
        title: "Comptes utilisateurs et rôles",
        kind: "feature",
        headline: "Administrateur, entrepreneur et expert, avec des droits tenus par Laravel.",
        points: [
          "Retrouver ou créer le compte applicatif après une connexion réussie.",
          "Définir les rôles administrateur, entrepreneur et expert.",
          "Associer les permissions métier et protéger les API.",
        ],
        livrable: "Comptes applicatifs et premières permissions opérationnels.",
        validation: "L’identité Authentik ne donne pas les droits administrateur : Laravel les contrôle.",
        stack: "Laravel, MySQL",
        initial: "todo",
      },
      {
        id: "d-1019",
        date: "2026-10-19",
        title: "Rôles et accès verrouillés",
        kind: "feature",
        headline: "Routes privées et API refusent ce que l’écran masque déjà.",
        points: [
          "Finaliser rôles et permissions.",
          "Protéger les routes React et les API Laravel.",
          "Gérer les comptes inactifs ou sans rôle, et tester autorisé / interdit.",
        ],
        livrable: "SSO, session applicative et permissions intégrés.",
        validation: "Masquer un bouton dans React ne suffit pas : l’API refuse aussi l’action.",
        stack: "Laravel, MySQL, React Router",
        initial: "todo",
      },
      {
        id: "d-1020",
        date: "2026-10-20",
        title: "Test de littératie — questionnaire",
        kind: "feature",
        headline: "Le questionnaire se parcourt et les réponses sont enregistrées telles quelles.",
        points: [
          "Créer ou importer les questions et les choix.",
          "Afficher le questionnaire et la navigation entre les questions.",
          "Enregistrer les réponses et bloquer les envois incomplets.",
        ],
        livrable: "Questionnaire de littératie parcourable, réponses enregistrées.",
        validation: "Les réponses enregistrées correspondent exactement aux choix de l’utilisateur.",
        stack: "React, Laravel, MySQL",
        initial: "todo",
      },
      {
        id: "d-1021",
        date: "2026-10-21",
        title: "Test de littératie — score et rapport",
        kind: "feature",
        headline: "Score reproductible, recommandations et rapport consultable.",
        points: [
          "Calculer le score selon le barème validé.",
          "Enregistrer le résultat et ce qui sert à l’expliquer.",
          "Générer les recommandations et permettre de reprendre une tentative.",
        ],
        livrable: "Test de littératie complet, du questionnaire au rapport.",
        validation: "Des réponses connues produisent un score attendu et reproductible.",
        stack: "Laravel, MySQL, React",
        initial: "todo",
      },
      {
        id: "d-1022",
        date: "2026-10-22",
        title: "Test de maturité numérique",
        kind: "feature",
        headline: "Niveau global, résultat par dimension et recommandations.",
        points: [
          "Construire le questionnaire par dimensions.",
          "Calculer le niveau global et les résultats par dimension.",
          "Générer les recommandations et afficher le rapport.",
        ],
        livrable: "Test de maturité complet avec résultat détaillé.",
        validation: "Les calculs et les recommandations correspondent aux règles métier validées.",
        stack: "React, Laravel, MySQL",
        initial: "todo",
      },
      {
        id: "d-1023",
        date: "2026-10-23",
        title: "Présentation des fonctionnalités métier",
        kind: "milestone",
        headline: "Point de fin de semaine : auth, rôles, deux tests et CMS bilingue.",
        points: [
          "Authentik et OIDC intégrés à Laravel.",
          "Gestion des utilisateurs, rôles et permissions.",
          "Test de littératie avec score et rapport.",
          "Test de maturité avec résultats par dimension et recommandations.",
          "CMS intégré et contenus FR/EN.",
          "Liste des anomalies restantes.",
        ],
        livrable: "Semaine 2 présentée : accès, évaluations et contenus.",
        validation: "Chaque point coché a été montré, pas seulement annoncé.",
        initial: "todo",
      },
    ],
  },
  {
    id: "s3",
    index: 3,
    name: "Fiabilité et mise en ligne",
    range: "24 – 30 octobre",
    intent: "Résultats protégés, pilotage, sécurité, puis une démonstration qui ne dépend plus du poste local.",
    friday: "Validation et présentation finale",
    items: [
      {
        id: "d-1024",
        date: "2026-10-24",
        title: "Évaluations fiabilisées",
        kind: "feature",
        headline: "Plus de doublon, plus de rapport lisible en changeant un identifiant.",
        points: [
          "Gérer interruptions, doublons et questionnaires incomplets.",
          "Empêcher la modification des réponses après soumission.",
          "Rejouer les calculs sur plusieurs jeux de données.",
        ],
        livrable: "Évaluations plus robustes et résultats vérifiés.",
        validation: "Un visiteur ne consulte pas le rapport d’une autre personne en modifiant un identifiant.",
        stack: "Laravel, MySQL",
        initial: "todo",
      },
      {
        id: "d-1025",
        date: "2026-10-25",
        title: "CMS et parcours complets",
        kind: "feature",
        headline: "Visiteur, entrepreneur, expert et administrateur voient chacun ce qui leur est dû.",
        points: [
          "Vérifier traductions et médias.",
          "Tester contenus publiés et non publiés selon les droits.",
          "Parcourir les quatre profils et corriger les erreurs prioritaires.",
        ],
        livrable: "CMS et principaux parcours applicatifs vérifiés.",
        validation: "Les contenus et fonctions visibles correspondent aux droits prévus.",
        stack: "Directus, React, Laravel",
        initial: "todo",
      },
      {
        id: "d-1026",
        date: "2026-10-26",
        title: "Tableau de bord métier",
        kind: "feature",
        headline: "Tentatives, résultats et filtres, limités par les permissions.",
        points: [
          "Créer les API de statistiques.",
          "Afficher tentatives, résultats et indicateurs convenus.",
          "Ajouter le filtre de période et respecter les droits.",
        ],
        livrable: "Tableau de bord alimenté par les données métier.",
        validation: "Les indicateurs affichés correspondent aux données réellement enregistrées.",
        stack: "Laravel, MySQL, React, Recharts",
        initial: "todo",
      },
      {
        id: "d-1027",
        date: "2026-10-27",
        title: "Google Analytics et journaux d’activité",
        kind: "feature",
        headline: "La fréquentation se mesure, les actions sensibles se tracent, sans fuite de réponses.",
        points: [
          "Configurer GA4 et les événements de fréquentation.",
          "Journaliser dans Laravel : auteur, action, date, objet.",
          "Récupérer les événements Directus utiles, sans données de test ni données personnelles sensibles.",
        ],
        livrable: "Statistiques de fréquentation et journaux d’activité opérationnels.",
        validation: "Les événements utiles sont traçables sans envoyer les réponses aux tests ni des données personnelles sensibles à GA4.",
        stack: "GA4, Laravel, MySQL, Directus",
        initial: "todo",
      },
      {
        id: "d-1028",
        date: "2026-10-28",
        title: "Tests de sécurité et corrections",
        kind: "feature",
        headline: "Auth, rapports, formulaires et secrets passés au crible.",
        points: [
          "Tester l’authentification, les permissions et l’accès aux rapports.",
          "Tester formulaires, erreurs et parcours principaux.",
          "Vérifier les variables d’environnement et corriger les anomalies bloquantes.",
        ],
        livrable: "Tests exécutés et anomalies critiques corrigées.",
        validation: "Aucune faille bloquante connue ne subsiste dans les parcours testés.",
        stack: "PHPUnit ou Pest, Vitest, Playwright",
        initial: "todo",
      },
      {
        id: "d-1029",
        date: "2026-10-29",
        title: "Déploiement et documentation",
        kind: "feature",
        headline: "React, Laravel et Directus en ligne, avec la doc pour les refaire tourner.",
        points: [
          "Déployer en HTTPS et brancher MySQL et PostgreSQL.",
          "Vérifier les redirections Authentik, les migrations, les sauvegardes et les accès.",
          "Rédiger les instructions d’installation et d’utilisation.",
        ],
        livrable: "Version déployée et documentation initiale.",
        validation: "Le parcours complet fonctionne sur l’environnement de démonstration, pas seulement en local.",
        stack: "Serveur, HTTPS, MySQL, PostgreSQL",
        initial: "todo",
      },
      {
        id: "d-1030",
        date: "2026-10-30",
        title: "Validation et présentation finale",
        kind: "milestone",
        headline: "Démonstration de bout en bout, avec preuves et limites assumées.",
        points: [
          "Parcours de la page publique jusqu’au tableau de bord.",
          "SSO, rôles, évaluations et CMS démontrés.",
          "Statistiques, GA4 et journaux d’activité vérifiés.",
          "Résultats des tests, documentation et limites présentés.",
        ],
        livrable: "Version déployée et démontrable, bilan de validation et documentation.",
        validation: "Chaque fonctionnalité obligatoire a un résultat de test ou une limite explicitement documentée.",
        initial: "todo",
      },
    ],
  },
];

export const PLAN_ITEMS: PlanItem[] = WEEKS.flatMap((week) => week.items);

const WEEKDAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

export function dayParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    day,
    weekday: WEEKDAYS[date.getDay()],
    month: MONTHS[month - 1],
    label: `${WEEKDAYS[date.getDay()]} ${day} ${MONTHS[month - 1]}`,
  };
}

export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
