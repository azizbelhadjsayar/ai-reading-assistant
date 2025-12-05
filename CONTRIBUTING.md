# Guide de Contribution - AI Reading Assistant

Merci de votre intérêt pour contribuer à AI Reading Assistant ! 🎉

## Comment Contribuer

### 🐛 Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/azizbelhadjsayar/ai-reading-assistant/issues)
2. Ouvrez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Captures d'écran si pertinent
   - Version de Chrome et de l'extension

### 💡 Proposer une Fonctionnalité

1. Ouvrez une issue avec le template "Feature Request"
2. Décrivez :
   - Le problème que cela résoudrait
   - Comment cela fonctionnerait
   - Exemples d'utilisation

### 🔧 Soumettre du Code

1. **Fork** le repository
2. **Créez une branche** :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. **Développez** votre fonctionnalité
4. **Testez** localement dans Chrome
5. **Commitez** avec des messages clairs :
   ```bash
   git commit -m "Add: génération de résumés multilingues"
   git commit -m "Fix: correction du bug de détection de langue"
   git commit -m "Docs: mise à jour du README avec exemples"
   ```
6. **Push** vers votre fork :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
7. **Ouvrez une Pull Request** avec :
   - Description des changements
   - Référence à l'issue (si applicable)
   - Screenshots/GIFs pour les changements UI

## Standards de Code

### Style JavaScript
- Utiliser `const` et `let` (pas `var`)
- Noms de variables en camelCase
- Commentaires en anglais dans le code
- Documentation en français ET anglais

### Structure des Commits
Format : `Type: Description courte`

Types :
- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Docs:` Documentation
- `Style:` Formatage, pas de changement de code
- `Refactor:` Refactorisation sans changement de fonctionnalité
- `Test:` Ajout ou modification de tests
- `Chore:` Maintenance (dependencies, config, etc.)

Exemples :
```
Add: support pour la langue espagnole
Fix: correction du crash lors du résumé de pages dynamiques
Docs: ajout d'exemples dans le README
Refactor: simplification de la fonction detectLanguage()
```

### Tests

Avant de soumettre :
1. ✅ Testez sur au moins 5 sites différents
2. ✅ Vérifiez les erreurs dans la console
3. ✅ Testez avec et sans API key
4. ✅ Testez les résumés en français et anglais

## Architecture du Projet

```
extension chrome/
├── manifest.json         # Configuration Manifest V3
├── background.js         # Service Worker (gestion des messages)
├── content.js            # Injection dans pages (extraction d'articles)
├── popup.html/css/js     # Interface principale
├── options.html/js       # Page de configuration
├── saved.html/js         # Page des résumés sauvegardés
├── api.js                # Wrapper API Gemini
├── summarizer.js         # Résumés extractifs (fallback)
└── libs/readability.js   # Bibliothèque Mozilla
```

## Domaines de Contribution

### 🌟 Priorité Haute
- Support de nouvelles langues (espagnol, allemand, etc.)
- Amélioration de la détection de langue
- Support de nouveaux sites web difficiles
- Optimisation des performances

### 🚀 Améliorations
- Dark mode
- Export des résumés (PDF, Markdown)
- Statistiques de lecture
- Raccourcis clavier
- Résumés par IA vocaux

### 📚 Documentation
- Traductions du README
- Tutoriels vidéo
- Guides d'utilisation
- Exemples de cas d'usage

## Questions ?

N'hésitez pas à :
- Ouvrir une [Discussion](https://github.com/votre-username/ai-reading-assistant/discussions)
- Poser vos questions dans les Issues
- Contacter par email

## Code de Conduite

- Soyez respectueux et bienveillant
- Accueillez les nouveaux contributeurs
- Donnez des retours constructifs
- Respectez les différences d'opinion

---

**Merci de contribuer à rendre la lecture en ligne plus accessible ! 📚✨**
