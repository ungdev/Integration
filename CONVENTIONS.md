# Git Convention Guide

## Commits (Conventional Commits)

### Format

```
type(scope?): description
```

### Types principaux

* `feat`: nouvelle fonctionnalité
* `fix`: correction de bug
* `refactor`: modification interne sans changement fonctionnel
* `style`: formatage / UI mineur (pas de logique)
* `docs`: documentation
* `test`: ajout/modification de tests
* `chore`: maintenance (deps, config…)
* `perf`: amélioration de performance
* `build`: build / dépendances
* `ci`: intégration continue

### Exemples

```
feat(auth): add login with CAS
fix(navbar): fix mobile display issue
refactor(api): simplify error handling
style(ui): adjust spacing in header
```

### Bonnes pratiques

* écrire à l'impératif → `add`, `fix`, `update`
* description courte (-50 caractères) et explicite
* un commit = une seule intention

### Breaking changes

L'ajour d'un point d'exclamation est possible pour signifier un breaking change.
```
feat!: remove old API
```

---

## Branches

### Format

```
type/short-description
```

### Types

* `feat/`
* `fix/`
* `refactor/`
* `chore/`
* `docs/`
* `perf/`
* `test/`

### Exemples

```
feat/login-page
fix/navbar-mobile
refactor/auth-hooks
```

### Bonnes pratiques

* utiliser kebab-case
* rester court et clair
* une branche = un objectif

---

## Choisir le bon type (exemple avec le frontend)

| Situation                | Type     |
| ------------------------ | -------- |
| Nouvelle feature visible | feat     |
| Bug                      | fix      |
| Refacto interne          | refactor |
| Amélioration performance | perf     |
| Ajustement visuel mineur | style    |

---

## Exemple workflow

```
prod
 └── feat/login-page
      |── fix(auth): login-error
      └── style(auth): color for 2026 edition
```

1. créer une branche depuis prod
2. faire des commits propres
3. ouvrir une pull request
4. merge après review
