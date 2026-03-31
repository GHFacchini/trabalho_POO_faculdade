import { CadastroClientes } from './CadastroClientes.js';
import { RegistroDeEntradas_E_Saidas } from './RegistroDeEntradas_E_Saidas.js';
import { RelatoriosGerenciais } from './RelatoriosGerenciais.js';

import { Estudante } from './Estudante.js';
import { Professor } from './Professor.js';
import { Empresa } from './Empresa.js';

// Função utilitária para criar datas falsas rapidinho
function criarDataAtraso(dias, horas) {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    d.setHours(d.getHours() - horas);
    return d;
}

function inicializarSistema() {
    console.log("=========================================");
    console.log("=  EstACME - SISTEMA DE ESTACIONAMENTO  =");
    console.log("=========================================\n");

    const cadastros = new CadastroClientes();
    const fluxo = new RegistroDeEntradas_E_Saidas(cadastros);
    const relatorios = new RelatoriosGerenciais(fluxo);

    // 1. Populando Cadastro
    console.log("=> Cadastrando Clientes...");
    const estudante = new Estudante("CPF-ES-01", "João Estudante", 20.00); // R$ 20 reais (cobre 1 diária de 15, mas n cobre 2)
    estudante.adicionarPlaca("EST-1234");
    cadastros.cadastrar(estudante);

    const professor = new Professor("CPF-PR-01", "Dr. Alan Turing");
    professor.adicionarPlaca("PRF-0001");
    professor.adicionarPlaca("PRF-0002"); // 2º carro
    cadastros.cadastrar(professor);

    const empresa = new Empresa("CNPJ-EM-01", "ACME Corp", 0.0);
    empresa.adicionarPlaca("EMP-0001");
    empresa.adicionarPlaca("EMP-0002");
    cadastros.cadastrar(empresa);

    console.log("\n=> INICIANDO SIMULAÇÕES:\n");

    try {
        // Cenário 1: Estudante gastando os créditos e bloqueando
        let dataEnt = criarDataAtraso(0, 5); 
        let dataSai = criarDataAtraso(0, 1);
        fluxo.registrarEntrada("EST-1234", dataEnt);
        fluxo.registrarSaida("EST-1234", false, dataSai); // Gastou R$15. Sobrou R$ 5
        
        // Entra de novo amanhã pra virar o dia e comer diária nova
        let dataEnt2 = criarDataAtraso(-1, 0); 
        let dataSai2 = criarDataAtraso(-1, -2);
        fluxo.registrarEntrada("EST-1234", dataEnt2);
        fluxo.registrarSaida("EST-1234", false, dataSai2); // Desconta mais 15. Saldo fica negativo, libera catraca, mas BLOQUEIA a placa
        
        try {
            // Tenta entrar com o estudante bloqueado
            fluxo.registrarEntrada("EST-1234", criarDataAtraso(-2, 0));
        } catch(e) { console.error(`[TESTE BARRADO COM SUCESSO]: ${e.message}`); }

    } catch(e) { console.error(e.message); }

    try {
        console.log("\n---");
        // Cenário 2: Professor entrando com 2 carros juntos (Deve barrar)
        fluxo.registrarEntrada("PRF-0001", criarDataAtraso(0, 2));
        try {
            fluxo.registrarEntrada("PRF-0002", criarDataAtraso(0, 1));
        } catch(e) { console.error(`[TESTE BARRADO COM SUCESSO]: ${e.message}`); }
        fluxo.registrarSaida("PRF-0001");

    } catch(e) { console.error(e.message); }

    try {
        console.log("\n---");
        // Cenário 3 e 4: Desconto Frequente e Recusa de Pagamento
        // 3 vezes na semana
        fluxo.registrarEntrada("AVU-9999", criarDataAtraso(4, 2)); fluxo.registrarSaida("AVU-9999", false, criarDataAtraso(4, 0));
        fluxo.registrarEntrada("AVU-9999", criarDataAtraso(3, 2)); fluxo.registrarSaida("AVU-9999", false, criarDataAtraso(3, 1));
        fluxo.registrarEntrada("AVU-9999", criarDataAtraso(1, 4)); fluxo.registrarSaida("AVU-9999", false, criarDataAtraso(1, 2));
        
        // Quarta vez = Desconto aplicado no Avulso
        fluxo.registrarEntrada("AVU-9999", criarDataAtraso(0, 3)); 
        fluxo.registrarSaida("AVU-9999", true, criarDataAtraso(0, 0)); // Aplica desconto e RECUSA PAGAMENTO

        try {
            // Tenta voltar e descobre que ta bloqueado
            fluxo.registrarEntrada("AVU-9999", new Date());
        } catch(e) { console.error(`[TESTE BARRADO COM SUCESSO]: ${e.message}`); }

    } catch(e) { console.error(e.message); }

    try {
        console.log("\n---");
        // Cenário 5: Empresa Inadimplente
        // Empresa entra no dia d-3, dorme e sai em d-1 (Vai ganhar multa de pernoite)
        fluxo.registrarEntrada("EMP-0001", criarDataAtraso(3, 0));
        fluxo.registrarSaida("EMP-0001", false, criarDataAtraso(1, 0)); 
        
        console.log(`Dívida da empresa no fechamento de mês: R$ ${empresa.saldoDevedor.toFixed(2)}`);
        
        // RH não pagou, inativa a frota
        empresa.marcarComoInadimplente();

        try {
            fluxo.registrarEntrada("EMP-0002", new Date());
        } catch(e) { console.error(`[TESTE BARRADO COM SUCESSO]: ${e.message}`); }

        empresa.quitarDivida();
        fluxo.registrarEntrada("EMP-0002", new Date()); // Agora funciona
        fluxo.registrarSaida("EMP-0002");

    } catch(e) { console.error(e.message); }

    relatorios.relatorioFluxoVeiculos();
    relatorios.relatorioPlacasBloqueadas();
}

inicializarSistema();
