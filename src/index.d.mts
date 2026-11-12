// Objectif : décrire les types de l’API métier publique.
import type{JevProvider}from"./jev.mjs";export const COVERAGE:readonly string[];export function finding(input:any):any;export function control(input:any):any;export function assessControl(finding:any,control:any,provider:JevProvider):Promise<any>;

export function controlCoverageLedger(findings:any[],controls:any[],assessments:any[]):{findings:any[];complianceCertified:boolean;providerCalls:number};
