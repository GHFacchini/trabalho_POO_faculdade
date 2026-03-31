import { Cliente } from './Cliente.js';

export class Empresa extends Cliente {
    #saldoDevedor;
    #inadimplente;

    constructor(id, nome, saldoDevedor = 0.0) {
        super(id, nome);
        this.#saldoDevedor = parseFloat(saldoDevedor);
        this.#inadimplente = false;
    }

    get saldoDevedor() { return this.#saldoDevedor; }
    get inadimplente() { return this.#inadimplente; }

    // Simulação do pagamento de contas pela empresa
    quitarDivida() {
        this.#saldoDevedor = 0.0;
        this.#inadimplente = false;
        console.log(`\n[FINANCEIRO] Empresa ${this.nome} quitou sua dívida e saiu da inadimplência.`);
    }

    marcarComoInadimplente() {
        this.#inadimplente = true;
        console.log(`\n[FINANCEIRO] Aviso: Empresa ${this.nome} marcada como Inadimplente! Frotas serão bloqueadas.`);
    }

    // Regra: Tudo pago por diária (sempre). Pernoite (quantidadeDias > 1) = multa.
    calcularTarifa(quantidadeDias, horasPermanencia) {
        const VALOR_DIARIA = 50.00;
        const MULTA_PERNOITE = 20.00; // Multa por dia que pernoitou

        let valorDaPermanencia = VALOR_DIARIA; // Paga 1 diária no mínimo (entrou, pagou uma diária)

        if (quantidadeDias > 1) {
            // Paga a diária dos dias adicionais + multa para cada dia a mais que dormiu lá
            const diasExtras = quantidadeDias - 1;
            valorDaPermanencia += (diasExtras * VALOR_DIARIA) + (diasExtras * MULTA_PERNOITE);
        }

        // Acumula a dívida
        this.#saldoDevedor += valorDaPermanencia;

        // Liberado na guarita sem pagar, pois foi pra fatura da empresa
        return 0.00; 
    }
}