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

https://github.com/Steeventim/Frontend-Search-Project.git

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

# Déploiement du Frontend - Application Web

Ce document décrit les étapes nécessaires pour déployer l'application frontend sur une machine x86.

## 🛠️ Prérequis

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre machine :

- Node.js (version 18.x ou supérieure recommandée)
- npm ou yarn
- Git (pour cloner le projet)
- Un serveur web (optionnel selon le mode de déploiement : `serve`, `nginx`, etc.)

## 📁 1. Clonage du projet

```bash
git clone https://github.com/Steeventim/Frontend-Search-Project.git
cd FrontBPM

## 📦 2. Installation des dépendances

npm install
# ou avec yarn
yarn install

## ⚙️ 3. Configuration (si nécessaire)

Créer un fichier .env.production à la racine du projet pour spécifier les variables d'environnement :

VITE_API_URL=https://api.example.com
VITE_ENV=production

## 4. Build de l’application

npm run build



## 💬 Support

Pour toute question ou problème :

1. Consultez la documentation
2. Ouvrez une issue sur GitHub
3. Contactez l'équipe de support
```
