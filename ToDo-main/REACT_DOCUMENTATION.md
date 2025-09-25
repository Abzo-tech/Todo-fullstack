# Documentation React - Concepts et Structure de Projet

## 1. Introduction à React

React est une bibliothèque JavaScript open-source développée par Facebook pour construire des interfaces utilisateur. Elle permet de créer des applications web dynamiques et interactives en utilisant des composants réutilisables.

### Principales caractéristiques :
- **Composants** : Blocs de construction modulaires
- **JSX** : Syntaxe pour écrire du HTML dans JavaScript
- **Virtual DOM** : Optimisation des performances
- **Unidirectionnel** : Flux de données descendant
- **Écosystème riche** : Hooks, Context, Router, etc.

---

## 2. Concepts Fondamentaux

### 2.1 Composants

Les composants sont les éléments de base de React. Ils peuvent être :
- **Fonctionnels** : Fonctions JavaScript retournant du JSX
- **Classe** : Classes ES6 étendant `React.Component` (moins utilisé depuis les hooks)

```jsx
// Composant fonctionnel
function Welcome(props) {
  return <h1>Bonjour, {props.name} !</h1>;
}

// Utilisation
<Welcome name="Alice" />
```

### 2.2 JSX

JSX est une extension syntaxique qui permet d'écrire du HTML dans JavaScript :

```jsx
const element = <h1>Bonjour, monde !</h1>;
```

### 2.3 Props (Propriétés)

Les props permettent de passer des données d'un composant parent à un enfant :

```jsx
function Greeting({ name, age }) {
  return <p>{name} a {age} ans.</p>;
}

// Utilisation
<Greeting name="Alice" age={25} />
```

### 2.4 State (État)

Le state représente les données internes d'un composant qui peuvent changer :

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

### 2.5 Hooks

Les hooks permettent d'utiliser l'état et d'autres fonctionnalités React dans les composants fonctionnels :

- `useState` : Gestion de l'état local
- `useEffect` : Effets secondaires (API calls, timers)
- `useContext` : Accès au contexte
- `useReducer` : État complexe
- `useMemo` / `useCallback` : Optimisation

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <div>Chargement...</div>;

  return <div>{user.name}</div>;
}
```

---

## 3. Structure Typique d'un Projet React

### 3.1 Structure de Base (Create React App)

```
my-react-app/
├── public/
│   ├── index.html          # Page HTML principale
│   ├── favicon.ico         # Icône du site
│   └── manifest.json       # Configuration PWA
├── src/
│   ├── App.js              # Composant principal
│   ├── index.js            # Point d'entrée
│   ├── components/         # Composants réutilisables
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Button.js
│   ├── pages/              # Pages/routes
│   │   ├── Home.js
│   │   ├── About.js
│   │   └── Contact.js
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── context/            # Context providers
│   │   └── AuthContext.js
│   ├── services/           # Appels API
│   │   └── api.js
│   ├── utils/              # Fonctions utilitaires
│   │   └── helpers.js
│   ├── styles/             # Styles CSS/SCSS
│   │   ├── App.css
│   │   └── components/
│   └── assets/             # Images, icônes
│       ├── images/
│       └── icons/
├── package.json            # Dépendances et scripts
├── .gitignore
└── README.md
```

### 3.2 Explication des Dossiers

#### `public/`
- Contient les fichiers statiques servis directement
- `index.html` : Template de base avec `<div id="root">` où React s'attache
- Accessible via `/` (ex: `/favicon.ico`)

#### `src/`
- Code source de l'application
- `index.js` : Point d'entrée qui rend `<App />` dans `#root`
- `App.js` : Composant racine gérant le routing et layout global

#### `components/`
- Composants réutilisables
- Peuvent être organisés en sous-dossiers par fonctionnalité

#### `pages/`
- Composants représentant des pages/routes complètes
- Utilisés avec React Router

#### `hooks/`
- Hooks personnalisés pour logique réutilisable
- Ex: `useLocalStorage`, `useDebounce`

#### `context/`
- Providers de contexte pour état global
- Alternative à Redux pour petits projets

#### `services/`
- Fonctions pour appels API
- Gestion des requêtes HTTP

#### `utils/`
- Fonctions utilitaires pures
- Helpers, formatters, validateurs

#### `styles/`
- Feuilles de style
- Peut utiliser CSS modules, styled-components, etc.

#### `assets/`
- Images, polices, icônes
- Importés dans les composants

---

## 4. Fichiers Importants

### 4.1 `package.json`

```json
{
  "name": "my-react-app",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

### 4.2 `src/index.js`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 4.3 `src/App.js`

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

### 4.4 `public/index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mon App React</title>
  </head>
  <body>
    <noscript>Vous devez activer JavaScript pour utiliser cette application.</noscript>
    <div id="root"></div>
  </body>
</html>
```

---

## 5. Cycle de Vie d'une Application React

### 5.1 Création
```bash
npx create-react-app my-app
cd my-app
npm start
```

### 5.2 Développement
- Écrire des composants dans `src/`
- Utiliser `npm start` pour développement local
- Tests avec `npm test`

### 5.3 Build de Production
```bash
npm run build
```
Crée un dossier `build/` optimisé pour le déploiement.

### 5.4 Déploiement
- Serveur web statique (Netlify, Vercel, GitHub Pages)
- Intégration avec backend API
- Configuration de routes côté serveur si nécessaire

---

## 6. Bonnes Pratiques

### 6.1 Organisation du Code
- Un composant par fichier
- Nommage PascalCase pour composants
- camelCase pour fonctions/hooks
- Séparation logique métier / présentation

### 6.2 Performance
- Utiliser `React.memo` pour éviter re-renders inutiles
- `useMemo` / `useCallback` pour calculs coûteux
- Lazy loading avec `React.lazy`
- Code splitting

### 6.3 Accessibilité
- Utiliser des balises sémantiques
- Attributs ARIA quand nécessaire
- Gestion du focus clavier

### 6.4 Tests
- Tests unitaires avec Jest
- Tests d'intégration avec React Testing Library
- Tests E2E avec Cypress

---

## 7. Écosystème React

### 7.1 Routing
- **React Router** : Navigation côté client

### 7.2 Gestion d'État
- **Redux** / **Zustand** : État global complexe
- **Context API** : État partagé simple

### 7.3 Styling
- **CSS Modules** : CSS scoped
- **Styled Components** : CSS-in-JS
- **Tailwind CSS** : Utility-first

### 7.4 Formulaires
- **React Hook Form** : Gestion performante
- **Formik** : Gestion d'état complexe

### 7.5 API Calls
- **Axios** : Client HTTP
- **React Query** : Gestion cache/synchronisation
- **SWR** : Hooks pour données

---

## 8. Migration et Évolution

### De Classes à Hooks
```jsx
// Avant (Classe)
class Counter extends React.Component {
  state = { count: 0 }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>
  }
}

// Après (Hooks)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### TypeScript avec React
```tsx
interface Props {
  name: string;
  age?: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return <div>{name} {age && `(${age} ans)`}</div>;
};
```

---

Cette documentation couvre les concepts essentiels de React et explique la structure typique d'un projet. Pour des cas d'usage spécifiques, consultez la documentation officielle de React : https://react.dev/

*Document généré par BLACKBOXAI*
