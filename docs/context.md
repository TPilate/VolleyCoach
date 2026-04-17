# VolleyCoach — Context & Décisions Projet

> Document de référence — à garder à la racine du projet et à mettre à jour au fil du développement.

---

## 1. Vision du projet

Application web **mobile-first** dédiée au volleyball, permettant à la fois aux **coachs** de gérer leurs équipes et entraînements, et aux **joueurs** de suivre leur progression de manière autonome ou au sein d'un club.

---

## 2. Stack technique validée

| Couche | Technologie |
|---|---|
| Frontend | Nuxt 3 (SSR, PWA pour les notifications) |
| Backend | Nuxt server routes / Nitro (API intégrée) |
| Base de données | Supabase (PostgreSQL + Auth + Storage) |
| Déploiement | Vercel |
| Terrain interactif | Konva.js (Canvas) + GSAP (animations) |
| Stockage vidéos | Supabase Storage (ou embed YouTube en option) |
| Notifications push | Web Push API via Supabase ou OneSignal |

---

## 3. Rôles et permissions

### Principe fondamental : rôle contextuel
Un utilisateur n'a pas de rôle global fixe. Son rôle est défini **par contexte** (par club, par équipe).

Exemples :
- Être `JOUEUR` dans l'équipe A et `COACH` dans l'équipe B sur le même compte
- Être `ADMIN` d'un club et `JOUEUR` dans un autre

### Rôles possibles par club
- `ADMIN` — gère le club, peut nommer des coachs
- `COACH` — crée des entraînements, des matchs, note les joueurs
- `JOUEUR` — consulte ses entraînements, saisit ses actions en match

### Création de compte
- Un coach peut créer un compte joueur (et lui envoyer un lien d'invitation)
- Un joueur peut se créer lui-même un compte et rejoindre un club

---

## 4. Structure des données — Relations clés

- Un **joueur** peut appartenir à **plusieurs équipes**
- Un **coach** peut gérer **plusieurs clubs**
- Un **utilisateur** peut être à la fois joueur et coach (rôles distincts par contexte)
- Les **exercices** sont partagés entre tous les coachs (base commune) + possibilité d'en ajouter

---

## 5. Fonctionnalités validées

### 5.1 Gestion de club
- Création et gestion d'un club
- Membres du club avec rôles contextuels
- Liaison clubs > équipes > joueurs

### 5.2 Gestion d'équipe
- Création d'équipes au sein d'un club
- Attribution de joueurs à plusieurs équipes
- Notion de saison sportive

### 5.3 Gestion de joueurs
- Profil joueur avec poste (libero, passeur, attaquant...)
- Appartenance multi-équipes
- Historique de présence aux entraînements

### 5.4 Base d'exercices
- **Partagée** entre tous les coachs de la plateforme
- Tout coach peut **ajouter un exercice** à la base (public ou privé)
- Catégorisation par **niveau** (débutant / intermédiaire / avancé / expert)
- Catégorisation par **thème** (service, réception, passe, attaque, bloc, défense, rotation...)
- Support de **vidéos** (upload Supabase ou lien YouTube)
- Support de **schémas terrain** (JSON de positions des joueurs, rendu SVG)
- Statistiques : exercices les plus utilisés par les coachs

### 5.5 Création d'entraînements
- Sélection d'exercices depuis la base
- Ordonnancement des exercices dans la séance
- Attribution à une équipe + date
- **Vue terrain SVG** : positionnement des joueurs (ronds déplaçables)
  - Phase 1 (MVP) : terrain statique avec positions fixes
  - Phase 2 (futur) : animations, flèches de trajectoire, séquences de jeu
- Visualisation des **rotations par poste** au volleyball
- Historique des présences (joueur présent / absent)

### 5.6 Suivi de match
- Création d'un match (équipe, adversaire, date, score par set)
- **Actions prédéfinies** (vocabulaire volleyball) :

  | Action | Résultats possibles |
  |---|---|
  | SERVICE | Ace / En jeu / Faute |
  | RÉCEPTION | Parfaite / Acceptable / Ratée |
  | PASSE | Précise / Imprécise |
  | ATTAQUE | Gagnante / Contrée / Faute |
  | BLOC | Point / Touche / Faute |
  | DÉFENSE | Réussie / Ratée |
  | FAUTE | Filet / Sortie / Pied |

- **Saisie flexible** : coach ou joueur peut saisir les actions (champ `created_by`)
- **Notation coach** :
  - Note par action individuelle (1 à 5)
  - Commentaire par action
  - Bilan global du match (score + commentaire texte)
- **Visibilité joueur** : le joueur voit ses notes et le bilan uniquement **après validation du coach**

### 5.7 Mode autodidacte (solo / duo max)
- Contenu **distinct** des exercices d'entraînement d'équipe
- Orienté apprentissage individuel ou à deux
- Structure en **parcours pédagogiques** :
  - Parcours → Modules → Leçons → Quiz/Défi de validation
- **Gamification** :
  - ⭐ Points XP après chaque leçon
  - 🏅 Badges (ex: "Premier service ace", "7 jours consécutifs")
  - 🔥 Streak de jours consécutifs (avec système de "bouclier" contre la pression négative)
  - 📈 Niveaux débloquables (Débutant → Intermédiaire → Avancé → Expert)
  - 🔓 Contenu avancé débloqué par la progression
  - 🏆 Classement optionnel entre amis (pas de classement global pour éviter la découragement)

### 5.8 Notifications push
- Activables par l'utilisateur
- Cas d'usage : convocation à un entraînement, validation d'une note coach, nouveau badge...
- Implémentation via Web Push API (Supabase ou OneSignal)

---

## 6. Fonctionnalités hors scope (pour l'instant)

- ❌ Messagerie interne
- ❌ Calendrier / Agenda
- ❌ Statistiques avancées de match (à envisager en phase ultérieure)

---

## 7. Schéma de base de données

```sql
-- UTILISATEURS
users
  id, email, name, avatar_url, created_at

-- CLUBS
clubs
  id, name, logo_url, created_by → users, created_at

-- MEMBRES D'UN CLUB (rôle contextuel)
club_members
  user_id → users
  club_id → clubs
  role: enum (ADMIN, COACH, JOUEUR)

-- ÉQUIPES
teams
  id, name, level, club_id → clubs, season

-- MEMBRES D'UNE ÉQUIPE (multi-équipes possible)
team_members
  user_id → users
  team_id → teams
  position: enum (LIBERO, PASSEUR, ATTAQUANT, CENTRAL, POINTU, UNIVERSEL)

-- EXERCICES
exercises
  id, title, description, level, theme
  video_url, schema_json  ← positions joueurs sur terrain
  created_by → users
  is_public: boolean
  created_at

-- ENTRAÎNEMENTS
trainings
  id, team_id → teams, coach_id → users
  date, notes, schema_json  ← plan de séance terrain

-- EXERCICES DANS UNE SÉANCE
training_exercises
  training_id → trainings
  exercise_id → exercises
  order, duration_minutes

-- PRÉSENCES AUX ENTRAÎNEMENTS
training_attendees
  training_id → trainings
  user_id → users
  present: boolean

-- MATCHS
matches
  id, team_id → teams, coach_id → users
  opponent, date, score_us, score_them
  sets_json  ← scores par set

-- ACTIONS EN MATCH
match_actions
  id, match_id → matches, user_id → users
  action_type: enum (SERVICE, RECEPTION, PASSE, ATTAQUE, BLOC, DEFENSE, FAUTE)
  action_result: enum (POSITIF, NEUTRE, NEGATIF)
  created_by → users          ← coach ou joueur qui saisit
  coach_note: int (1-5)
  coach_comment: text
  is_validated: boolean        ← coach a validé
  is_visible_to_player: boolean
  created_at

-- BILAN GLOBAL DU MATCH
match_reviews
  match_id → matches, coach_id → users
  global_score: int (1-5)
  comment: text
  created_at

-- AUTODIDACTE : PARCOURS
learning_paths
  id, title, description, level, thumbnail_url, order

-- MODULES DANS UN PARCOURS
learning_modules
  id, path_id → learning_paths, title, order

-- LEÇONS DANS UN MODULE
learning_lessons
  id, module_id → learning_modules
  title, content_text, video_url
  xp_reward: int
  order

-- PROGRESSION INDIVIDUELLE
user_progress
  user_id → users
  lesson_id → learning_lessons
  completed_at, score

-- GAMIFICATION
user_gamification
  user_id → users
  total_xp: int
  current_streak: int
  longest_streak: int
  last_activity_date
  level: int

badges
  id, name, description, icon_url
  condition_type, condition_value

user_badges
  user_id → users
  badge_id → badges
  earned_at
```

---

## 8. Architecture Nuxt — Structure des pages

```
/pages
├── /auth                      ← login, register, invite
├── /dashboard                 ← vue adaptée au rôle connecté
├── /club
│   ├── /[id]                  ← détail club
│   └── /create
├── /team/[id]                 ← détail équipe + membres
├── /training
│   ├── /[id]                  ← détail séance + terrain SVG
│   └── /create
├── /match
│   ├── /[id]                  ← saisie actions + bilan
│   └── /create
├── /learn                     ← mode autodidacte
│   ├── /index                 ← liste des parcours
│   ├── /parcours/[id]
│   └── /lecon/[id]
└── /profile                   ← XP, badges, stats personnelles

/components
├── /terrain
│   ├── TerrainStatic.vue      ← SVG Phase 1
│   └── TerrainEditor.vue      ← préparé pour Phase 2
├── /match
│   ├── ActionForm.vue
│   └── MatchReview.vue
├── /training
│   ├── ExerciseCard.vue
│   └── AttendanceList.vue
└── /learn
    ├── LessonCard.vue
    ├── XpBar.vue
    └── BadgeGrid.vue
```

---

## 9. Roadmap — Phases de développement

### Phase 1 — Fondations (6-8 semaines)
- Auth + profils + rôles contextuels (Supabase Auth)
- Clubs > Équipes > Joueurs (CRUD complet)
- Base d'exercices (CRUD, niveaux, thèmes, vidéo, schéma terrain)
- Création d'entraînements + gestion des présences
- Terrain SVG statique (positions des joueurs)

### Phase 2 — Match & Coaching (4-6 semaines)
- Suivi de match + saisie d'actions prédéfinies
- Notation coach par action + bilan global
- Validation coach → visibilité joueur
- Visualisation des rotations sur terrain

### Phase 3 — Autodidacte & Gamification (6-8 semaines)
- Parcours / Modules / Leçons
- Système XP, badges, streaks, niveaux
- Notifications push

### Phase 4 — Terrain Niveau 2 (futur)
- Animations de trajectoires
- Séquences de jeu avec flèches de mouvement
- Export d'un schéma de séance en PDF

---

## 10. Format de données — Schémas de terrain

### Structure JSON pour `schema_json`

Utilisé dans les tables `exercises` et `trainings` pour représenter les positions des joueurs sur le terrain.

```json
{
  "matchContext": {
    "set": 1,
    "serve": "home",
    "score": {"home": 15, "away": 12},
    "timestamp": "2026-04-17T14:30:00Z"
  },
  "players": [
    {
      "id": 1,
      "team": "home",
      "number": 12,
      "role": "P",
      "x": 80,
      "y": 60,
      "label": "Passeur",
      "status": "active",
      "direction": 45
    },
    {
      "id": 2,
      "team": "home",
      "number": 7,
      "role": "A",
      "x": 20,
      "y": 70,
      "label": "Réceptionneur 1",
      "status": "active",
      "direction": 0
    },
    {
      "id": 3,
      "team": "home",
      "number": 4,
      "role": "B",
      "x": 50,
      "y": 85,
      "label": "Libero",
      "status": "active",
      "direction": null
    }
  ],
  "ball": {
    "x": 50,
    "y": 20,
    "velocity": {"x": 2, "y": -3},
    "height": 2.5
  },
  "targets": [
    {
      "x": 10,
      "y": 10,
      "type": "zone_attaque",
      "intensity": 0.8
    }
  ]
}
```

### Spécification des champs

| Champ | Type | Optionnel | Description |
|-------|------|-----------|-------------|
| `matchContext.set` | int | Non | Numéro du set (1-5) |
| `matchContext.serve` | string | Non | Équipe au service ("home" ou "away") |
| `matchContext.score` | object | Non | Scores actuels `{home: int, away: int}` |
| `matchContext.timestamp` | ISO 8601 | Oui | Horodatage du schéma |
| `players[].id` | int | Non | ID unique du joueur |
| `players[].team` | string | Non | Équipe ("home" ou "away") |
| `players[].number` | int | Non | Numéro de maillot |
| `players[].role` | string | Non | Poste : "P" (Passeur), "A" (Attaquant), "B" (Bloc), "L" (Libero), "C" (Central), "R" (Récepteur universel) |
| `players[].x` | float | Non | Position X sur terrain (0-100, en pourcentage ou unités SVG) |
| `players[].y` | float | Non | Position Y sur terrain (0-100) |
| `players[].label` | string | Non | Nom/description du poste |
| `players[].status` | string | Non | État : "active", "substituted", "injured" |
| `players[].direction` | float | Oui | Angle de direction en degrés (0-360) — null si sans objet |
| `ball.x` | float | Non | Position X de la balle |
| `ball.y` | float | Non | Position Y de la balle |
| `ball.velocity` | object | Oui | Vélocité `{x: float, y: float}` pour les animations Phase 2 |
| `ball.height` | float | Oui | Hauteur de la balle en mètres (pour futur rendu 3D) |
| `targets[].x` | float | Non | Position X de la zone/cible |
| `targets[].y` | float | Non | Position Y de la zone/cible |
| `targets[].type` | string | Non | Type de cible : "zone_attaque", "zone_defense", "point_de_chute", etc. |
| `targets[].intensity` | float | Oui | Intensité/importance (0-1) — pour styliser les priorités |

### Utilisation par Phase

- **Phase 1 (MVP)** : Afficher positions statiques de joueurs + balle. Champs obligatoires : `players`, `ball`.
- **Phase 2** : Ajouter animations via `velocity` et `direction`. Utiliser `targets` pour les zones d'attaque/défense.
- **Phase 3+** : Exploiter `height` et `intensity` pour rendu avancé.

---

## 11. Conseils & Points de vigilance

### Architecture
- **Trancher les rôles en premier** avant d'écrire une ligne de code — toute la BDD en découle. Le système de rôles contextuels (par club/équipe) est plus complexe à mettre en place mais indispensable pour couvrir les cas réels (joueur/coach en même temps).
- **Utiliser Row Level Security (RLS) de Supabase** dès le départ pour sécuriser les accès par rôle — ne pas le rajouter après.
- **Penser `schema_json` extensible** pour le terrain SVG : prévoir dès maintenant un format de données qui pourra accueillir des animations en Phase 2 sans migration lourde.

### UX / Mobile
- L'app sera principalement utilisée **sur le bord du terrain**, souvent avec une main. Penser aux grands boutons, aux actions rapides, au mode offline partiel (PWA).
- La **saisie d'actions en match** doit être ultra-rapide : 2 taps max (type d'action → résultat). Pas de formulaires longs.
- Prévoir un **mode sombre** dès le départ — les gymnases sont souvent sombres.

### Contenu autodidacte
- C'est un **produit dans le produit** — prévoir une vraie réflexion éditoriale sur les parcours, pas seulement technique.
- La gamification fonctionne si et seulement si le contenu est de qualité. Les XP et badges ne rattraperont pas un contenu pauvre.
- Prévoir un système de **bouclier streak** (à la Duolingo) pour éviter la frustration des utilisateurs occasionnels.

### Exercices partagés
- Mettre en place un système de **modération légère** si la base est ouverte à tous les coachs (signalement, validation admin) pour éviter la dégradation de la qualité.
- Envisager un système de **favoris / collections** pour que chaque coach retrouve rapidement ses exercices préférés.

### Performance
- Les vidéos peuvent vite faire exploser les coûts Supabase Storage — envisager une **limite de taille** (ex: 100 Mo par vidéo) et privilegier les embeds YouTube/Vimeo pour les longues vidéos.
- Paginer les listes d'exercices dès le départ — la base va grossir rapidement.

### Évolutions futures à anticiper dans le modèle
- **Statistiques agrégées par joueur** (taux de réussite par type d'action sur la saison) — prévoir les index BDD.
- **Export PDF d'une séance** (schéma terrain + liste d'exercices) — très demandé par les coachs.
- **Partage d'un entraînement** entre coachs — le champ `created_by` sur les exercises est déjà prévu pour ça.
