# 🛡️ SecureNav - Privacy & Security Companion

<div align="center">

![SecureNav Logo](icons/icon128.png)

**Extension Chrome pour l'analyse de sécurité et de confidentialité en temps réel**

*Développé pour le hackathon NEVERHACK 2025*

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green.svg)](https://github.com)

</div>

---

## 📋 À Propos

**SecureNav** est une extension Chrome moderne qui analyse instantanément la sécurité et la confidentialité des sites web que vous visitez. Conçue avec un focus cybersécurité pour répondre au défi NEVERHACK, elle offre des insights en temps réel sur :

- ✅ **Protocole HTTPS** - Vérification de la sécurité de la connexion
- 🍪 **Cookies & Trackers** - Détection et comptage des cookies
- 📝 **Formulaires** - Analyse de sécurité des formulaires de saisie
- 🌐 **Resources Tierces** - Identification des domaines tiers
- 📊 **Score de Sécurité** - Évaluation globale de 0 à 100

## 🎯 Problème Résolu

Les utilisateurs naviguent souvent sans connaître le niveau de sécurité des sites qu'ils visitent. Ils peuvent involontairement :
- Soumettre des données sensibles sur des connexions HTTP non chiffrées
- Être suivis par de nombreux trackers sans le savoir
- Accéder à des sites avec une configuration de sécurité médiocre

**SecureNav** résout ce problème en fournissant des informations de sécurité instantanées et compréhensibles.

## ✨ Fonctionnalités

### Analyse en Temps Réel
- 🔍 **Vérification HTTPS automatique** pour chaque page visitée
- 📈 **Score de sécurité dynamique** calculé selon plusieurs critères
- 🎨 **Interface moderne** avec thème cybersécurité (glassmorphism, gradients)
- 🔔 **Badge visuel** avec code couleur (A/B/C/D) sur l'icône de l'extension

### Indicateurs Détaillés
- **HTTPS Status** : Indique si la connexion est sécurisée
- **Cookies** : Nombre de cookies détectés sur la page
- **Trackers Tiers** : Nombre de domaines tiers chargeant du contenu
- **Formulaires** : Détection de formulaires non sécurisés

### Recommandations
- ⚠️ Alertes pour les connexions HTTP non sécurisées
- 📋 Conseils de sécurité personnalisés selon le contexte
- 🚨 Détection de contenu mixte (HTTP sur HTTPS)

## 🚀 Installation

### Installation en Mode Développeur

1. **Télécharger l'extension**
   ```bash
   git clone https://github.com/votre-username/securenav.git
   cd securenav
   ```

2. **Charger dans Chrome**
   - Ouvrez Chrome et allez à `chrome://extensions/`
   - Activez le **Mode développeur** (coin supérieur droit)
   - Cliquez sur **Charger l'extension non empaquetée**
   - Sélectionnez le dossier `extension chrome`

3. **C'est prêt !**
   - L'icône SecureNav apparaît dans la barre d'outils
   - Visitez n'importe quel site pour voir l'analyse

### Installation depuis le Chrome Web Store
*À venir - Après publication sur le Chrome Web Store*

## 💻 Utilisation

1. **Naviguez sur n'importe quel site web**
2. **Cliquez sur l'icône SecureNav** dans la barre d'outils
3. **Consultez l'analyse de sécurité** :
   - Score global (0-100)
   - Détails par catégorie
   - Recommandations personnalisées

### Interprétation du Score

| Score | Badge | Signification |
|-------|-------|---------------|
| 80-100 | 🟢 A | Excellente sécurité |
| 60-79 | 🔵 B | Bonne sécurité |
| 40-59 | 🟠 C | Sécurité moyenne |
| 0-39 | 🔴 D | Sécurité faible |

## 🏗️ Architecture Technique

### Stack Technique
- **Manifest Version** : V3 (dernière norme Chrome)
- **Frontend** : HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **APIs utilisées** :
  - `chrome.tabs` - Gestion des onglets
  - `chrome.storage` - Stockage local
  - `chrome.scripting` - Injection de scripts
  - `chrome.runtime` - Messagerie interne

### Structure du Projet
```
extension chrome/
├── manifest.json          # Configuration Manifest V3
├── background.js          # Service worker (gestion badges)
├── content.js             # Script d'analyse de page
├── popup.html             # Interface utilisateur
├── popup.css              # Styles (thème cyber)
├── popup.js               # Logique du popup
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # Documentation
├── LICENSE                # Licence MIT
└── .gitignore             # Fichiers ignorés
```

### Flux de Données
1. **Content Script** (`content.js`) analyse la page active
2. Les données sont envoyées au **Background Script** (`background.js`)
3. Le **Background** met à jour le badge et stocke les données
4. Le **Popup** (`popup.js`) récupère et affiche les résultats

## 🔒 Permissions

L'extension demande les permissions suivantes :

- `activeTab` : Analyser l'onglet actif
- `storage` : Sauvegarder les préférences utilisateur
- `scripting` : Injecter le script d'analyse
- `<all_urls>` : Analyser n'importe quel site web

**Note** : Aucune donnée n'est envoyée à des serveurs externes. Tout est traité localement.

## 🛠️ Développement

### Prérequis
- Google Chrome ou navigateur basé sur Chromium
- Éditeur de code (VS Code recommandé)
- Git pour le versioning

### Développement Local

1. **Modifier le code**
   - Éditez les fichiers selon vos besoins
   - Testez dans Chrome Developer Mode

2. **Recharger l'extension**
   - Allez à `chrome://extensions/`
   - Cliquez sur le bouton de rechargement

3. **Déboguer**
   - **Background Script** : Cliquez sur "Service worker" dans chrome://extensions
   - **Popup** : Clic droit sur popup → Inspecter
   - **Content Script** : Console de la page web

### Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add: Amazing Feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

**Conventions de commit** :
- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Update:` Mise à jour de code existant
- `Docs:` Documentation
- `Style:` Mise en forme (CSS, design)

## 📝 Roadmap

### Version 1.0 (Actuelle)
- ✅ Analyse HTTPS
- ✅ Détection cookies
- ✅ Analyse formulaires
- ✅ Score de sécurité
- ✅ Interface moderne

### Version 1.1 (À venir)
- [ ] Analyse des en-têtes de sécurité (CSP, HSTS, etc.)
- [ ] Historique des sites visités avec scores
- [ ] Exportation de rapports PDF
- [ ] Mode sombre/clair
- [ ] Support multilingue (EN, ES, DE)

### Version 2.0 (Futur)
- [ ] Intelligence artificielle pour détection d'anomalies
- [ ] Base de données de sites malveillants
- [ ] Synchronisation multi-appareils
- [ ] API publique pour développeurs

## 🏆 Hackathon NEVERHACK

Cette extension a été développée pour le défi **"La Ligue des Extensions"** du hackathon NEVERHACK, avec les objectifs suivants :

- ✅ Extension Manifest V3 compatible tous navigateurs modernes
- ✅ Solution innovante à un problème réel de navigation
- ✅ Code source open source sur GitHub
- ✅ Bonnes pratiques de développement (commits clairs, documentation)
- ✅ Thématique sécurité alignée avec NEVERHACK

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 NEVERHACK Hackathon Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 👥 Auteurs

Développé avec ❤️ pour le hackathon NEVERHACK 2025

## 🙏 Remerciements

- **NEVERHACK** pour l'organisation du hackathon
- La communauté Chrome Extensions pour la documentation
- Tous les contributeurs open source

---

<div align="center">

**Made with 🛡️ for a safer web**

[Documentation](README.md) • [Issues](https://github.com/votre-username/securenav/issues) • [Contribuer](CONTRIBUTING.md)

</div>
