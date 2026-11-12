import test from 'node:test';import assert from 'node:assert/strict';
import {controlCoverageLedger}from '../src/index.mjs';const f={id:'f',facilityId:'site',text:'fixture',inspectionDate:'2026-11-01',reportUrl:'https://example.invalid'},c=id=>({id,facilityId:'site',description:'fixture'});
test('unknown controls remain distinct from control gaps',()=>{const x=controlCoverageLedger([f],[c('a'),c('b')],[{findingId:'f',controlId:'a',coverage:'control_gap'}]);assert.equal(x.findings[0].unknownControls,1);assert.equal(x.findings[0].coverageCounts.control_gap,1);assert.equal(x.complianceCertified,false);});
test('other-facility pair cannot claim coverage',()=>assert.throws(()=>controlCoverageLedger([f],[{...c('a'),facilityId:'other'}],[{findingId:'f',controlId:'a',coverage:'covered'}])));
test('duplicate assessments cannot inflate counts',()=>{const a={findingId:'f',controlId:'a',coverage:'covered'};assert.throws(()=>controlCoverageLedger([f],[c('a')],[a,a]));});
