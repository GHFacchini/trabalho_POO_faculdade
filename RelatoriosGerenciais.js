export class RelatoriosGerenciais {
    #registroManager;

    constructor(registroManager) {
        this.#registroManager = registroManager;
    }

    faturamentoTotal() {
        let soma = 0;
        for (let ticket of this.#registroManager.historico) {
            soma += ticket.valorFinal;
        }
        return soma;
    }

    relatorioFluxoVeiculos() {
        const historico = this.#registroManager.historico;
        const countPorTipo = {
            "Avulso": 0, "Estudante": 0, "Professor": 0, "Empresa": 0
        };
        historico.forEach(t => countPorTipo[t.cliente.constructor.name]++);

        console.log("\n### RELATÓRIO DE FLUXO DE TIPOS DE VEÍCULOS ###");
        for (let [tipo, count] of Object.entries(countPorTipo)) {
            console.log(` - ${tipo}: ${count} vez(es)`);
        }
        console.log(` - FATURAMENTO FISICO NA GUARITA: R$ ${this.faturamentoTotal().toFixed(2)}\n`);
    }

    relatorioPlacasBloqueadas() {
        console.log("\n### RELATÓRIO DE PLACAS BLOQUEADAS ###");
        const bloqueadas = this.#registroManager.placasBloqueadas;
        if(bloqueadas.length === 0) console.log(" Nenhuma placa bloqueada.");
        else bloqueadas.forEach(p => console.log(` - ${p}`));
        console.log("\n");
    }
}
