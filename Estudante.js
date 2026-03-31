import { Cliente } from './Cliente.js';

export class Estudante extends Cliente {
    #saldo;
    #tarifaDiaria;

    constructor(id, nome, saldoInicial = 0.0) {
        super(id, nome);
        this.#saldo = parseFloat(saldoInicial);
        this.#tarifaDiaria = 15.00; // Valor fixo por "ingresso" no dia
    }

    get saldo() { return this.#saldo; }

    adicionarPlaca(placa) {
        if (this.placas.length >= 1) {
            throw new Error("Um Estudante pode cadastrar apenas 1 veículo.");
        }
        super.adicionarPlaca(placa);
    }

    adicionarCreditos(valor) {
        this.#saldo += valor;
    }

    // Polimorfismo: Calcula débito baseado nos dias e subtrai do saldo. Retorna o que faltar pagar na hora (0).
    calcularTarifa(quantidadeDias, horasPermanencia) {
        const valorDebitado = quantidadeDias * this.#tarifaDiaria;
        this.#saldo -= valorDebitado;
        
        // Na saída física o estudante não paga dinheiro, ele só acerta no saldo.
        // Se o saldo ficar negativo, ele libera, mas o RegistroDeEntradas_E_Saidas vai bloqueá-lo.
        return 0.00; 
    }
}