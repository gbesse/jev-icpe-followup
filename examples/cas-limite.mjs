// Cas limite : les identifiants d’installation doivent correspondre exactement.
import assert from "node:assert/strict";
import { assessControl } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await assessControl(
  {
    id: "f-2",
    facilityId: "icpe-1",
    text: "Registre incomplet",
    inspectionDate: "2026-06-04",
    reportUrl: "https://georisques.gouv.fr",
  },
  { id: "c-2", facilityId: "icpe-2", description: "Revue mensuelle" },
  jev,
);
assert.equal(resultat.coverage, "different_facility");
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
