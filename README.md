# ProcessFlow - Système de Gestion des Processus d'Entreprise

ProcessFlow est une application web moderne de Business Process Management (BPM) permettant de gérer et suivre les processus organisationnels d'une entreprise.

## 🚀 Installation locale

### Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 8 ou supérieure)

### Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-username/processflow.git
cd processflow
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Premier lancement

Lors de la première utilisation, vous serez guidé à travers un assistant de configuration en 5 étapes :

1. **Configuration de l'entreprise**

   - Nom de l'entreprise
   - Description générale

2. **Types de projets**

   - Définition des différents types de projets
   - Spécificités et caractéristiques

3. **Étapes des processus**

   - Configuration des étapes pour chaque type de projet
   - Ordre et dépendances

4. **Utilisateurs**

   - Création des comptes utilisateurs
   - Attribution des responsabilités

5. **Rôles et permissions**
   - Définition des rôles
   - Configuration des permissions

### Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## 📁 Structure du projet

```
src/
├── components/                     # Composants de l'interface utilisateur
│   ├── admin/                      # Interface administrateur
│   │   ├── modals/                 # Modals pour l'administration
│   │   │   ├── DeleteUserModal.tsx
│   │   │   ├── UserFormModal.tsx
│   │   ├── AdminDashboard.tsx      # Tableau de bord admin
│   │   ├── DepartmentsList.tsx     # Liste des départements
│   │   ├── ProcessTemplatesList.tsx # Liste des modèles de processus
│   │   ├── Settings.tsx            # Paramètres admin
│   │   ├── UsersList.tsx           # Liste des utilisateurs
│   ├── auth/                       # Authentification
│   │   ├── LoginForm.tsx           # Formulaire de connexion
│   │   ├── RegisterForm.tsx        # Formulaire d'inscription
│   ├── common/                     # Composants réutilisables
│   │   ├── form/                   # Composants de formulaire
│   │   │   ├── TextArea.tsx
│   │   ├── Button.tsx              # Bouton réutilisable
│   │   ├── Card.tsx                # Carte réutilisable
│   │   ├── InputField.tsx          # Champ de saisie
│   ├── dashboard/                  # Tableau de bord
│   │   ├── Dashboard.tsx           # Vue du tableau de bord
│   ├── layout/                     # Layout de l'application
│   │   ├── navigation/             # Menu et navigation
│   │   │   ├── MenuItems.ts        # Items du menu
│   │   │   ├── NavLink.tsx         # Lien de navigation
│   │   │   ├── UserMenu.tsx        # Menu utilisateur
│   │   ├── AdminLayout.tsx         # Layout administrateur
│   │   ├── AdminNavbar.tsx         # Navbar administrateur
│   │   ├── Layout.tsx              # Layout principal
│   │   ├── Navbar.tsx              # Navbar générale
│   │   ├── UserLayout.tsx          # Layout utilisateur
│   │   ├── UserNavbar.tsx          # Navbar utilisateur
│   ├── process/                    # Gestion des processus
│   │   ├── components/             # Composants spécifiques aux processus
│   │   │   ├── ProcessComments.tsx # Commentaires sur les processus
│   │   │   ├── ProcessStepStatus.tsx # Statut des étapes des processus
│   │   ├── hooks/                  # Hooks spécifiques aux processus
│   │   │   ├── useProcessActions.ts # Actions sur les processus
│   │   ├── NewProcess.tsx          # Création d'un nouveau processus
│   │   ├── ProcessDetails.tsx      # Détails d'un processus
│   │   ├── ProcessList.tsx         # Liste des processus
│   │   ├── ProcessStepCard.tsx     # Carte d'une étape de processus
│   ├── setup/                      # Configuration de l'application
│   │   ├── steps/                  # Étapes de configuration
│   │   │   ├── CompanySetup.tsx    # Configuration de l'entreprise
│   │   │   ├── ProcessStepsSetup.tsx # Configuration des étapes de processus
│   │   │   ├── ProjectSetup.tsx    # Configuration du projet
│   │   │   ├── RolesSetup.tsx      # Configuration des rôles
│   │   │   ├── UsersSetup.tsx      # Configuration des utilisateurs
│   │   ├── ProcessTemplateSetup.tsx # Configuration des modèles de processus
│   │   ├── SetupWizard.tsx         # Assistant de configuration
│   ├── user/                       # Interface utilisateur
│   │   ├── UserProfile.tsx         # Profil utilisateur
│   │   ├── UserSettings.tsx        # Paramètres utilisateur
├── constants/                      # Constantes de l'application
│   ├── routes.ts                   # Routes de l'application
├── data/                           # Données fictives ou statiques
│   ├── mockData.ts                 # Données de test
├── features/                       # Fonctionnalités principales
│   ├── auth/                       # Authentification
│   │   ├── services/               # Services d'authentification
│   │   │   ├── authService.ts      # Logique d'authentification
│   ├── process/                    # Fonctionnalités des processus
│   │   ├── components/             # Composants des processus
│   │   ├── hooks/                  # Hooks des processus
│   │   ├── services/               # Services des processus
│   │   │   ├── processService.ts   # Logique des processus
│   │   ├── types/                  # Types des processus
│   │   │   ├── comment.ts         # Types des commentaires
│   │   │   ├── process.ts         # Types des processus
│   │   │   ├── step.ts            # Types des étapes
├── hooks/                          # Hooks globaux
│   ├── useAuth.ts                  # Hook d'authentification
│   ├── useProcessData.ts           # Hook pour les données des processus
│   ├── useProcesses.ts             # Hook pour les processus
├── services/                       # Services pour l'API et la logique métier
│   ├── api.ts                      # Gestion des appels API
│   ├── authService.ts              # Services d'authentification
│   ├── processService.ts           # Service pour la gestion des processus
│   ├── userService.ts              # Service pour la gestion des utilisateurs
├── shared/                         # Composants et utilitaires partagés
│   ├── components/                 # Composants réutilisables
│   ├── utils/                      # Utilitaires partagés
├── types/                           # Définition des types TypeScript
│   ├── auth.ts                     # Types d'authentification
│   ├── comment.ts                  # Types des commentaires
│   ├── process.ts                  # Types des processus
│   ├── setup.ts                    # Types des paramètres de configuration
├── utils/                          # Fonctions utilitaires générales
│   ├── auth.ts                     # Fonctions utilitaires d'authentification
│   ├── date.ts                     # Fonctions utilitaires pour les dates
│   ├── process.ts                  # Fonctions utilitaires pour les processus
│   ├── validation.ts               # Fonctions utilitaires de validation
├── App.tsx                         # Composant principal de l'application
├── index.css                       # Styles globaux
├── main.tsx                        # Entrée principale de l'application
├── vite-env.d.ts                   # Types de l'environnement Vite
├── .env                            # Variables d'environnement
├── .gitignore                      # Fichiers à ignorer dans Git
├── eslint.config.js                # Configuration de l'ESLint
├── index.html                      # Fichier HTML principal
├── package-lock.json               # Gestion des dépendances
├── package.json                    # Dépendances et scripts
├── postcss.config.js               # Configuration PostCSS
├── README.md                       # Documentation du projet
├── tailwind.config.js              # Configuration de Tailwind CSS
├── tsconfig.app.json               # Configuration TypeScript pour l'application
├── tsconfig.json                   # Configuration TypeScript globale
├── tsconfig.node.json              # Configuration TypeScript pour le backend
└── vite.config.ts                  # Configuration de Vite

```

## 🛠️ Technologies utilisées

- ⚛️ React 18
- 🏷️ TypeScript
- 🎨 Tailwind CSS
- 🔄 React Router
- 📦 Vite
- 🎯 ESLint
- 🖼️ Lucide Icons

## 📋 Fonctionnalités principales

### Configuration initiale

- Assistant de configuration en 5 étapes
- Personnalisation complète des processus
- Gestion des rôles et permissions

### Interface administrateur

- Gestion des utilisateurs
- Configuration des départements
- Création de modèles de processus
- Paramètres système

### Interface utilisateur

- Tableau de bord personnalisé
- Création de nouveaux processus
- Suivi des processus en cours
- Notifications
- Gestion du profil

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT

## 💬 Support

Pour toute question ou problème :

1. Consultez la documentation
2. Ouvrez une issue sur GitHub
3. Contactez l'équipe de support
