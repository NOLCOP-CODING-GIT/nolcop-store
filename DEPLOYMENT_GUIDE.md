# 🚀 Guide de Déploiement du Portfolio

## 📋 Étapes complétées

✅ **Git initialisé**  
✅ **Fichiers commités**  
✅ **Configuration Git** (Jean Orland Zinsou <jeanorlandzinsou@gmail.com>)

## 🌐 Options de Déploiement

### **Option 1: Vercel (Recommandé)**

#### Étapes:

1. **Créer un compte GitHub**
   - Allez sur [github.com](https://github.com)
   - Créez un compte avec `jeanorlandzinsou@gmail.com`

2. **Créer un dépôt GitHub**
   - Cliquez sur "New repository"
   - Nom: `portfolio-typescript`
   - Public
   - Ne cochez pas "Add README"

3. **Pousser le code vers GitHub**

   ```bash
   git remote add origin https://github.com/VOTRE_USERNAME/portfolio-typescript.git
   git branch -M main
   git push -u origin main
   ```

4. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Cliquez "New Project"
   - Sélectionnez `portfolio-typescript`
   - Cliquez "Deploy"

#### Avantages Vercel:

- ✅ Gratuit pour les projets personnels
- ✅ Déploiement automatique
- ✅ HTTPS inclus
- ✅ Domaine personnalisé
- ✅ CDN mondial

### **Option 2: Netlify**

#### Étapes:

1. **Pousser sur GitHub** (même étapes que Vercel)
2. **Allez sur [netlify.com](https://netlify.com)**
3. **Connectez-vous avec GitHub**
4. **Sélectionnez le dépôt**
5. **Configurez le build**:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Avantages Netlify:

- ✅ 100GB/mois gratuit
- ✅ Formulaires gratuits
- ✅ Déploiement continu

### **Option 3: GitHub Pages**

#### Étapes:

1. **Installer gh-pages**:

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Modifier package.json**:

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Déployer**:
   ```bash
   npm run deploy
   ```

#### Avantages GitHub Pages:

- ✅ 100% gratuit
- ✅ Intégration GitHub
- ✅ HTTPS automatique

## 🔧 Configuration pour le déploiement

### **Variables d'environnement**

Pour EmailJS en production:

1. **Vercel**: Project Settings → Environment Variables
2. **Netlify**: Site settings → Build & deploy → Environment
3. **GitHub Pages**: Repository Settings → Secrets

### **Build command**

```bash
npm run build
```

### **Output directory**

```
dist
```

## 📱 Test après déploiement

1. **Vérifiez que le site fonctionne**
2. **Testez le formulaire de contact**
3. **Testez le responsive sur mobile**
4. **Vérifiez toutes les pages**

## 🌍 Domaine personnalisé (Optionnel)

### **Vercel**

1. Project Settings → Domains
2. Ajoutez votre domaine
3. Configurez le DNS

### **Netlify**

1. Site settings → Domain management
2. Ajoutez votre domaine
3. Suivez les instructions DNS

## ⚡ Prochaines étapes

1. **Choisissez votre plateforme** (Vercel recommandé)
2. **Créez votre compte GitHub**
3. **Poussez le code**
4. **Déployez**
5. **Testez le formulaire EmailJS**

## 🔐 Sécurité

- **Ne jamais** partager vos clés EmailJS
- **Utilisez** les variables d'environnement
- **Activez** HTTPS (automatique sur ces plateformes)

---

**Prêt à déployer ?** Choisissez Vercel pour la meilleure expérience !
