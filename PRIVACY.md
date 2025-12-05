# Politique de Confidentialité - AI Reading Assistant

*Dernière mise à jour : 5 décembre 2025*

## Notre Engagement

AI Reading Assistant respecte votre vie privée. Cette extension a été conçue selon le principe de **minimisation des données** et de **transparence totale**.

## Données Collectées

### ❌ Nous NE collectons PAS :
- Vos données personnelles (nom, email, etc.)
- Votre historique de navigation
- Les URLs que vous visitez
- Votre comportement en ligne
- Des données analytiques ou statistiques
- Des cookies ou trackers

### ✅ Données Traitées Localement :
1. **Texte des articles** : Extrait temporairement pour générer le résumé, puis supprimé
2. **Résumés sauvegardés** : Stockés dans `chrome.storage.local` (votre navigateur uniquement)
3. **Clé API Gemini** : Stockée localement, utilisée uniquement pour vos requêtes

## Utilisation des Données

### Traitement de l'Article
Quand vous cliquez sur "Summarize" :
1. Le texte de l'article est extrait de la page
2. Il est envoyé à l'API Google Gemini (si configurée)
3. Gemini génère un résumé
4. Le résumé est affiché dans l'extension
5. **Le texte original n'est pas conservé**

### API Google Gemini
- Utilise votre clé API personnelle
- Soumis aux [Conditions d'utilisation de Google AI](https://ai.google.dev/terms)
- Google peut traiter le texte selon leur politique
- Nous n'avons aucun accès à ces échanges

### Mode Extractif (Sans API)
- Traitement 100% local dans votre navigateur
- Aucune donnée n'est envoyée à un serveur
- Extraction par algorithme de pertinence

## Stockage des Données

### Chrome Storage Local
- Les résumés sauvegardés sont stockés dans `chrome.storage.local`
- Ces données restent **sur votre appareil uniquement**
- Elles sont supprimées si vous désinstallez l'extension
- Accessible uniquement par cette extension

### Pas de Serveur
- Aucun serveur backend
- Aucune base de données externe
- Aucune synchronisation cloud (sauf si vous activez Chrome Sync)

## Permissions Utilisées

### `activeTab`
**Pourquoi** : Accéder au contenu de la page active pour extraire l'article
**Quand** : Uniquement quand vous cliquez sur l'icône de l'extension
**Portée** : Page active uniquement, pas d'accès à tout l'historique

### `storage`
**Pourquoi** : Sauvegarder vos résumés et paramètres localement
**Données** : Résumés, clé API, préférences
**Portée** : Stockage local, pas de synchronisation automatique

### `scripting`
**Pourquoi** : Injecter le script d'extraction d'article
**Quand** : Uniquement quand vous utilisez l'extension
**Portée** : Page active uniquement

## Sécurité

### Protection de votre Clé API
- Stockée dans `chrome.storage.local` (chiffré par Chrome)
- Jamais transmise à un tiers (sauf Google AI pour vos requêtes)
- Jamais affichée en clair dans l'interface

### Code Open Source
- Tout le code est disponible sur GitHub
- Auditable par la communauté
- Pas de code obfusqué ou caché

### Pas de Tracking
- Aucun Google Analytics
- Aucun pixel de tracking
- Aucune télémétrie

## Vos Droits

### Accès aux Données
Vous pouvez voir toutes vos données dans :
- Chrome DevTools → Application → Storage → Local Storage

### Suppression des Données
Pour supprimer vos données :
1. **Résumés** : Cliquez sur "View Saved" puis "Clear All"
2. **Paramètres** : Supprimez la clé API dans Settings
3. **Tout** : Désinstallez l'extension

### Export des Données
- Les résumés sont en JSON dans le stockage local
- Vous pouvez les exporter via Chrome DevTools

## Modifications de cette Politique

Nous nous réservons le droit de modifier cette politique. Les changements seront :
- Publiés dans ce fichier avec nouvelle date
- Notifiés dans les notes de version sur GitHub

## Contact

Questions sur la confidentialité ?
- Ouvrir une [Issue GitHub](https://github.com/azizbelhadjsayar/ai-reading-assistant/issues)
- Email : aziz.belhadjsayar@outlook.com
- Équipe : GrindMAN - Nuit de l'Info 2025

## Conformité

Cette extension respecte :
- ✅ RGPD (Règlement Général sur la Protection des Données)
- ✅ Chrome Web Store Developer Program Policies
- ✅ Principes de Privacy by Design
- ✅ Manifest V3 Security Guidelines

---

**En résumé** : Vos données restent chez vous. Nous ne collectons rien. Vous gardez le contrôle total.
