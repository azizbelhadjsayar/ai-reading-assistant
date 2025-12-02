# 📤 Guide de Publication - Chrome Web Store

## Prérequis

- ✅ Extension fonctionnelle (SecureNav ✓)
- ✅ Compte Google
- 💳 5 USD pour les frais d'inscription développeur (paiement unique)

## Étape 1: Préparer le Package

### 1.1 Créer le fichier ZIP

Depuis le dossier de l'extension, créez un fichier ZIP contenant tous les fichiers :

```powershell
# Depuis PowerShell dans le dossier de l'extension
Compress-Archive -Path * -DestinationPath securenav-v1.0.0.zip -Force
```

**Fichiers à inclure** :
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html, popup.css, popup.js
- ✅ icons/ (dossier complet)
- ✅ README.md (optionnel mais recommandé)
- ✅ LICENSE

**À EXCLURE** :
- ❌ .git/
- ❌ .gitignore
- ❌ node_modules/ (si présent)

### 1.2 Préparer les Assets

**Icônes requises** :
- ✅ Icon 128x128 (déjà créé dans icons/)

**Screenshots recommandés** (pour la page du store) :
- Taille : 1280x800 ou 640x400 pixels
- Format : PNG ou JPEG
- Minimum : 1 screenshot
- Maximum : 5 screenshots

**Promotional Tile** (optionnel mais recommandé) :
- Taille : 440x280 pixels
- Apparaît dans la page d'accueil du Chrome Web Store

## Étape 2: S'inscrire comme Développeur

1. **Accéder au Dashboard**
   - URL : https://chrome.google.com/webstore/devconsole/
   - Connectez-vous avec votre compte Google

2. **Payer les Frais d'Inscription**
   - Coût : 5 USD (paiement unique)
   - Accepter les conditions d'utilisation
   - Entrer les informations de paiement

3. **Vérifier votre Email**
   - Google peut demander une vérification d'email

## Étape 3: Publier l'Extension

### 3.1 Upload du Package

1. Dans le Developer Dashboard, cliquez sur **"New Item"**
2. Cliquez sur **"Choose file"** et sélectionnez `securenav-v1.0.0.zip`
3. Attendez la validation automatique

### 3.2 Remplir les Informations

#### **Détails de l'Extension**

**Listing**
- **Nom** : SecureNav - Privacy & Security Companion
- **Résumé** : Analyze website security, detect trackers, and protect your privacy with real-time security insights.
- **Description détaillée** :
  ```
  SecureNav is your privacy and security companion that provides instant analysis of websites you visit.
  
  KEY FEATURES:
  • Real-time HTTPS security verification
  • Cookie and tracker detection
  • Form security analysis
  • Security score calculation (0-100)
  • Beautiful, modern cybersecurity-themed interface
  
  HOW IT WORKS:
  1. Visit any website
  2. Click the SecureNav icon
  3. Get instant security insights with recommendations
  
  PRIVACY-FIRST:
  All analysis happens locally. No data is sent to external servers.
  
  Open source project developed for NEVERHACK Hackathon 2025.
  ```

**Catégorie**
- Choisir : **"Productivity"** ou **"Privacy & Security"**

**Langue**
- Principale : Français
- Ajouter aussi : English

#### **Graphiques**

1. **Icon 128x128** : Upload `icons/icon128.png`
2. **Screenshots** : 
   - Prenez des captures d'écran réelles après avoir chargé l'extension
   - Montrez l'interface avec un site sécurisé
   - Montrez l'interface avec un site non sécurisé
3. **Promotional Tile** (optionnel) : À créer si souhaité

#### **Confidentialité**

**Justification des Permissions**
- **activeTab** : "Required to analyze the security of the current webpage"
- **storage** : "Used to save user preferences locally"
- **scripting** : "Needed to inject security analysis script into web pages"
- **host_permissions (<all_urls>)** : "Required to analyze security of any website the user visits"

**Single Purpose** :
```
SecureNav analyzes website security and privacy to help users make informed decisions about their online safety.
```

**Privacy Policy** (REQUIS si vous utilisez certaines permissions) :
- Vous devrez créer une page de politique de confidentialité
- Peut être hébergée sur GitHub Pages
- Exemple de contenu :

```markdown
# Privacy Policy for SecureNav

Last updated: December 2025

## Data Collection
SecureNav does NOT collect, store, or transmit any personal data.

## Local Processing
All security analysis is performed locally in your browser. No information about your browsing habits or visited websites is sent to any external servers.

## Permissions
- activeTab: To analyze the current webpage's security
- storage: To save your preferences locally on your device
- scripting: To inject the security analysis script

## Contact
For questions: [your-email@example.com]
```

### 3.3 Distribution

**Visibilité**
- ✅ **Public** : Disponible à tous
- ou **Unlisted** : Seulement via lien direct

**Pays**
- Sélectionner : **Tous les pays** ou spécifiques

**Tarification**
- ✅ **Gratuit**

### 3.4 Vérification et Publication

1. **Cliquez sur "Save Draft"** pour sauvegarder
2. **Review** : Vérifiez toutes les informations
3. **Cliquez sur "Submit for Review"**

## Étape 4: Processus de Review

**Timeline**
- ⏱️ Review initial : 1-3 jours ouvrables
- 📧 Notification par email
- 🔄 Possibilité de demandes de modifications

**Statuts possibles**
- 🟡 **Pending Review** : En attente
- 🟢 **Published** : Publié !
- 🔴 **Rejected** : Modifications nécessaires

## Étape 5: Après Publication

### URL de votre Extension
```
https://chrome.google.com/webstore/detail/[extension-id]
```

### Mises à Jour Futures

1. Modifier le code
2. Incrémenter la version dans `manifest.json` :
   ```json
   "version": "1.0.1"
   ```
3. Créer nouveau ZIP
4. Upload dans le dashboard (même extension)
5. Submit for review

## Commandes Utiles

### Créer le ZIP de publication
```powershell
# Exclure les fichiers Git
$files = Get-ChildItem -Exclude .git,.gitignore
Compress-Archive -Path $files -DestinationPath securenav-v1.0.0.zip -Force
```

### Vérifier la taille du package
```powershell
# Max 20 MB pour Chrome Web Store
(Get-Item securenav-v1.0.0.zip).Length / 1MB
```

## Ressources Utiles

- 📚 **Documentation officielle** : https://developer.chrome.com/docs/webstore/
- 📋 **Program Policies** : https://developer.chrome.com/docs/webstore/program-policies/
- 💬 **Forum** : https://groups.google.com/a/chromium.org/g/chromium-extensions

## Alternative : Distribution Privée

Si vous ne voulez pas publier publiquement :

1. **GitHub Releases**
   - Upload le ZIP sur GitHub
   - Les utilisateurs téléchargent et installent manuellement

2. **Unlisted sur Chrome Web Store**
   - Publié mais seulement accessible via lien direct
   - Bon pour les tests beta

## Checklist de Publication

- [ ] Créer compte développeur (5 USD)
- [ ] Préparer fichier ZIP (sans .git)
- [ ] Créer screenshots de l'extension en action
- [ ] Rédiger description détaillée
- [ ] Créer privacy policy page
- [ ] Justifier les permissions
- [ ] Upload et soumettre
- [ ] Attendre la review (1-3 jours)

---

**Bon courage pour la publication ! 🚀**
