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
