import * as mocha from 'mocha';
//import * as chai from 'chai';
//import { expect } from 'chai';

const { before, after } = mocha;

before(() => {
  console.log("🔧 Iniciando testes...");
});

after(() => {
  console.log("🧹 Finalizando testes...");
});
