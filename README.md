# FrontBPMF - Système de Gestion des Processus d'Entreprise

FrontBPMF est une application web moderne de Business Process Management (BPM) développée en React/TypeScript permettant de gérer et suivre les processus organisationnels d'une entreprise. L'application offre une interface intuitive pour la création, la gestion et le suivi des workflows d'entreprise.

## ✨ Statut du Projet

🎉 **Projet vérifié et prêt pour la production !**

- ✅ **Code qualité** : Toutes les erreurs de linting corrigées (1 warning non critique restant)
- ✅ **Build réussi** : Application compilée avec succès
- ✅ **Types sécurisés** : TypeScript strict mode activé
- ✅ **Bonnes pratiques** : Code conforme aux standards React/TypeScript
- ✅ **Documentation** : README.md mis à jour et complet

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** (version 8 ou supérieure)
- **Git** pour cloner le projet

### Installation

1. **Clonez le dépôt** :

```bash
git clone https://github.com/Steeventim/Frontend-Search-Project.git
cd FrontBPMF
```

2. **Installez les dépendances** :

```bash
npm install
```

3. **Lancez le serveur de développement** :

```bash
npm run dev
```

4. **Accédez à l'application** :

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

- `npm run dev` : Lance le serveur de développement (http://localhost:5173)
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint (✅ 0 erreur, 1 warning non critique)

### Vérification de la qualité du code

Pour vérifier l'état du code, utilisez le script de vérification inclus :

```bash
./check-lint.sh
```

## 🏗️ Architecture et Structure

### Structure du projet

```
FrontBPMF/
├── src/
│   ├── components/          # Composants React organisés par domaine
│   │   ├── admin/          # Interface d'administration
│   │   ├── auth/           # Authentification et autorisation
│   │   ├── common/         # Composants réutilisables
│   │   ├── dashboard/      # Tableau de bord
│   │   ├── layout/         # Composants de mise en page
│   │   ├── process/        # Gestion des processus
│   │   ├── setup/          # Assistant de configuration
│   │   └── user/           # Interface utilisateur
│   ├── services/           # Services API et logique métier
│   ├── hooks/              # Hooks React personnalisés
│   ├── types/              # Définitions TypeScript
│   ├── utils/              # Utilitaires et helpers
│   └── context/            # Contextes React
├── dist/                   # Build de production
└── public/                 # Assets statiques
```

## 🛠️ Technologies utilisées

- ⚛️ **React 18** - Bibliothèque UI avec les dernières fonctionnalités
- 🏷️ **TypeScript** - Typage statique pour une meilleure sécurité
- 🎨 **Tailwind CSS** - Framework CSS utilitaire
- 🔄 **React Router** - Navigation côté client
- 📦 **Vite** - Build tool moderne et rapide
- 🎯 **ESLint** - Linting et qualité du code
- 🖼️ **Lucide Icons** - Icônes modernes et cohérentes

## 📋 Fonctionnalités principales

### Configuration initiale

- Assistant de configuration en 5 étapes
- Personnalisation complète des processus
- Gestion des rôles et permissions

### Interface administrateur

- Gestion des utilisateurs et départements
- Configuration des modèles de processus
- Paramètres système et permissions
- Tableau de bord administrateur

### Interface utilisateur

- Tableau de bord personnalisé
- Création et suivi des processus
- Notifications en temps réel
- Gestion du profil utilisateur
- Interface de recherche avancée

## 🚀 Déploiement

### Build de production

1. **Compilation de l'application** :

```bash
npm run build
```

2. **Prévisualisation du build** :

```bash
npm run preview
```

3. **Déploiement** :

Le dossier `dist/` contient les fichiers optimisés pour la production.

### Variables d'environnement

Créez un fichier `.env.production` à la racine du projet :

```env
VITE_API_URL=https://api.votre-domaine.com
VITE_ENV=production
```

### Options de déploiement

- **Serveur statique** : Nginx, Apache
- **Services cloud** : Vercel, Netlify, AWS S3
- **Docker** : Conteneurisation pour déploiement

## 🔧 Développement

### Qualité du code

Le projet maintient des standards de qualité élevés :

- **ESLint** : Configuration stricte avec règles React/TypeScript
- **TypeScript** : Mode strict activé pour la sécurité des types
- **Formatage** : Code formaté de manière cohérente
- **Tests** : Structure préparée pour les tests unitaires

### Métriques de qualité actuelles

- ✅ **Erreurs ESLint** : 0
- ⚠️ **Warnings ESLint** : 1 (non critique - fast-refresh)
- ✅ **Erreurs TypeScript** : 0
- ✅ **Build** : Réussi

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Guidelines de contribution

- Respectez les conventions de nommage TypeScript
- Ajoutez des types appropriés pour toutes les variables
- Testez vos modifications avec `npm run lint` et `npm run build`
- Documentez les nouvelles fonctionnalités

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 💬 Support

Pour toute question ou problème :

- 📧 **Email** : support@frontbpmf.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/Steeventim/Frontend-Search-Project/issues)
- 📚 **Documentation** : Consultez ce README et les commentaires dans le code
- 🔧 **Support technique** : Ouvrez une issue détaillée sur GitHub

---

**Développé avec ❤️ par l'équipe FrontBPMF**
