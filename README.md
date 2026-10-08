# Jev ICPE Follow-up

**Transforme les constats publics d’inspection ICPE en candidats de suivi de contrôle sourcés et vérifiables.**

[![Tests](https://github.com/gbesse/jev-icpe-followup/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-icpe-followup/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.5 · Documentation française

Le dépôt rapproche un constat d’inspection, l’action demandée et un contrôle interne accompagné de ses preuves afin de détecter une couverture complète, partielle ou absente.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-icpe-followup.git
cd jev-icpe-followup
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple compare un constat d’inspection ICPE à un contrôle interne. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { assessControl } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    coverage: {
      type: "choice",
      choice: "partially_covered",
      probabilities: {
        covered: 0.12,
        partially_covered: 0.72,
        control_gap: 0.12,
        unrelated: 0.04,
      },
      confidence: 0.72,
    },
  },
  usage: {},
}));
const resultat = await assessControl(
  {
    id: "f1",
    facilityId: "icpe-1",
    text: "Le registre des contrôles n'est pas complet.",
    requestedAction: "Compléter les contrôles périodiques",
    inspectionDate: "2026-06-04",
    deadline: "2026-10-01",
    reportUrl: "https://georisques.gouv.fr",
  },
  {
    id: "c1",
    facilityId: "icpe-1",
    description: "Revue mensuelle des contrôles",
    evidence: ["Planning signé"],
    owner: "HSE",
  },
  p,
);
assert.equal(resultat.coverage, "partially_covered");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `coverage: partially_covered`.

### Cas limite à tester

Un contrôle appartenant à un autre site ICPE est rejeté localement. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `coverage: different_facility · appels Jev: 0`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-icpe-followup`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

L’établissement, la date d’inspection, l’échéance explicite et le responsable restent dans le code. Jev ne peut ni clore un constat ni remplacer l’autorité d’inspection.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://www.data.gouv.fr/dataservices/api-georisques](https://www.data.gouv.fr/dataservices/api-georisques)
- [https://www.georisques.gouv.fr/articles-risques/installations-classees/les-installations-classees-pour-lenvironnement](https://www.georisques.gouv.fr/articles-risques/installations-classees/les-installations-classees-pour-lenvironnement)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-icpe-followup** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).

## October 2026 improvement · Amélioration d’octobre 2026 · Mejora de octubre de 2026

An unknown coverage category or invalid probability/confidence now fails before a control recommendation is returned. Run `npm test`.

Une couverture inconnue ou une probabilité/confiance invalide échoue désormais avant toute recommandation de contrôle. Lancez `npm test`.

Una cobertura desconocida o una probabilidad/confianza inválida falla antes de devolver una recomendación de control. Ejecute `npm test`.
