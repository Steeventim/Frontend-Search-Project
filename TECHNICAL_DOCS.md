# Documentation Technique - FrontBPMF

## Vue d'ensemble

FrontBPMF est une application React TypeScript moderne pour la gestion de processus métier (Business Process Management). L'application utilise Vite comme bundler et inclut des optimisations avancées de performance.

## Architecture

### Structure du projet

```
src/
├── components/           # Composants React réutilisables
│   ├── admin/           # Composants d'administration
│   ├── auth/            # Composants d'authentification
│   ├── common/          # Composants communs (Button, Card, etc.)
│   ├── dashboard/       # Composants du tableau de bord
│   ├── error/           # Composants de gestion d'erreurs
│   ├── layout/          # Composants de mise en page
│   ├── lazy/            # Composants lazy-loaded
│   ├── process/         # Composants de gestion des processus
│   ├── setup/           # Composants de configuration initiale
│   └── user/            # Composants utilisateur
├── constants/           # Constantes de l'application
├── context/             # Contextes React (State management)
├── hooks/               # Hooks personnalisés
├── services/            # Services API et logique métier
├── types/               # Définitions TypeScript
├── utils/               # Fonctions utilitaires
└── __tests__/           # Tests unitaires
```

### Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **React Router v6** pour le routing
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Recharts** pour les graphiques
- **Jest & React Testing Library** pour les tests
- **ESLint & Prettier** pour la qualité du code

## Patterns et bonnes pratiques

### 1. Composants

#### Structure d'un composant

```typescript
import React from "react";
import { ComponentProps } from "./types";

interface Props extends ComponentProps {
  // Props spécifiques
}

export const Component: React.FC<Props> = ({ prop1, prop2, ...props }) => {
  // Logique du composant

  return <div {...props}>{/* JSX */}</div>;
};

export default Component;
```

#### Conventions de nommage

- **Composants** : PascalCase (`UserProfile`, `ProcessDetails`)
- **Fichiers** : PascalCase pour les composants (`UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useProcessData`, `useAuth`)
- **Services** : camelCase avec suffix `Service` (`authService`, `processService`)
- **Types** : PascalCase (`User`, `Process`, `AuthResponse`)

### 2. Gestion d'état

#### Context API

```typescript
// context/ExampleContext.tsx
import React, { createContext, useContext, useReducer } from "react";

interface State {
  // État
}

interface Actions {
  // Actions
}

const ExampleContext = createContext<(State & Actions) | null>(null);

export const ExampleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Logique du provider

  return (
    <ExampleContext.Provider value={value}>{children}</ExampleContext.Provider>
  );
};

export const useExample = () => {
  const context = useContext(ExampleContext);
  if (!context) {
    throw new Error("useExample must be used within ExampleProvider");
  }
  return context;
};
```

#### Hooks personnalisés

```typescript
// hooks/useCustomHook.ts
import { useState, useEffect } from "react";

export const useCustomHook = (param: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Logique du hook
  }, [param]);

  return { data, loading, error };
};
```

### 3. Services API

#### Structure d'un service

```typescript
// services/exampleService.ts
import api from "./api";
import { Example, CreateExampleDto } from "../types";

export const exampleService = {
  async getAll(): Promise<Example[]> {
    const response = await api.get("/examples");
    return response.data;
  },

  async getById(id: string): Promise<Example> {
    const response = await api.get(`/examples/${id}`);
    return response.data;
  },

  async create(data: CreateExampleDto): Promise<Example> {
    const response = await api.post("/examples", data);
    return response.data;
  },

  async update(id: string, data: Partial<Example>): Promise<Example> {
    const response = await api.put(`/examples/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/examples/${id}`);
  },
};

export default exampleService;
```

### 4. Gestion des erreurs

#### ErrorBoundary

```typescript
// components/error/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI />;
    }

    return this.props.children;
  }
}
```

### 5. Performance

#### Lazy Loading

```typescript
// components/lazy/LazyComponents.tsx
import { lazy } from "react";

export const LazyComponent = lazy(() => import("../Component"));

// Usage avec Suspense
import React, { Suspense } from "react";
import { LazyComponent } from "./lazy/LazyComponents";

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);
```

#### Optimisations React

```typescript
import React, { memo, useMemo, useCallback } from "react";

const OptimizedComponent = memo<Props>(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map((item) => processItem(item));
  }, [data]);

  const handleAction = useCallback(
    (id: string) => {
      onAction(id);
    },
    [onAction]
  );

  return (
    <div>
      {processedData.map((item) => (
        <Item key={item.id} data={item} onAction={handleAction} />
      ))}
    </div>
  );
});
```

## Tests

### Configuration

Les tests utilisent Jest et React Testing Library. Configuration dans `jest.config.cjs`.

### Patterns de test

#### Test de composant

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Component } from "./Component";

describe("Component", () => {
  test("renders correctly", () => {
    render(<Component prop="value" />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  test("handles user interaction", async () => {
    const mockHandler = jest.fn();
    render(<Component onAction={mockHandler} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

#### Test de hook

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useCustomHook } from "./useCustomHook";

describe("useCustomHook", () => {
  test("returns expected data", async () => {
    const { result } = renderHook(() => useCustomHook("param"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## Déploiement

### Build de production

```bash
npm run build
```

Le build génère :

- **JavaScript chunks** optimisés avec code splitting
- **CSS** minifié et optimisé
- **Assets** avec cache busting (hash dans les noms)

### Configuration Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@headlessui/react", "framer-motion"],
          // ... autres chunks
        },
      },
    },
  },
});
```

### Optimisations incluses

1. **Code splitting** automatique par route
2. **Lazy loading** des composants
3. **Bundle analysis** avec visualisation des chunks
4. **Tree shaking** pour éliminer le code mort
5. **Minification** du JavaScript et CSS
6. **Optimisation des images** et assets

## Sécurité

### Authentification

- **JWT tokens** stockés dans des cookies sécurisés
- **Refresh tokens** pour la persistance de session
- **Protection CSRF** avec tokens

### Autorisation

```typescript
// utils/auth.ts
export const hasPermission = (user: User, permission: string): boolean => {
  return user.permissions.includes(permission);
};

export const hasRole = (user: User, roles: string | string[]): boolean => {
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.some((role) => user.roles.includes(role));
};
```

### Routes protégées

```typescript
// components/auth/ProtectedRoute.tsx
const ProtectedRoute = ({ roles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !hasRole(user, roles)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

## Contribution

### Workflow Git

1. **Branch** : Créer une branche depuis `main`
2. **Develop** : Développer la fonctionnalité
3. **Test** : Exécuter les tests
4. **Lint** : Vérifier la qualité du code
5. **PR** : Créer une Pull Request
6. **Review** : Code review obligatoire
7. **Merge** : Fusion après validation

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Linting du code
npm run lint:fix     # Correction automatique du linting
npm run test         # Exécution des tests
npm run test:watch   # Tests en mode watch
npm run type-check   # Vérification TypeScript
```

### Standards de code

- **Prettier** pour le formatage automatique
- **ESLint** pour la qualité du code
- **TypeScript** strict mode activé
- **Commits** : Messages conventionnels

## Maintenance

### Monitoring

- **Bundle size** : Surveiller la taille des chunks
- **Performance** : Lighthouse CI intégré
- **Erreurs** : Error tracking avec boundary components

### Mises à jour

```bash
npm audit              # Audit de sécurité
npm outdated           # Packages obsolètes
npm update             # Mise à jour des dépendances
```

### Debug

```typescript
// utils/debug.ts
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  performance: (label: string, fn: () => void) => {
    if (process.env.NODE_ENV === "development") {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  },
};
```

## Contact et support

- **Repository** : `/home/tims/Dev/FrontBPMF`
- **Documentation** : Ce fichier (`TECHNICAL_DOCS.md`)
- **Issues** : Utiliser les GitHub Issues pour les bugs et demandes
- **Wiki** : Documentation utilisateur dans le wiki du projet
