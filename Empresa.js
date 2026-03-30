
import { Cliente } from './Cliente.js';

export class Empresa extends Cliente {
    #saldoDevedor;

    constructor(id, nome, saldoDevedor = 0.0) {
        super(id, nome);
        this.#saldoDevedor = parseFloat(saldoDevedor);
    }

    // Getter para o saldo
    get saldoDevedor() {
        return this.#saldoDevedor;
    }

    // Método para abater ou redefinir a dívida (útil para os relatórios e pagamentos)
    quitarSaldo() {
        this.#saldoDevedor = 0.0;
    }

    // Polimorfismo: Em vez de devolver um valor para ser pago na hora, 
    // a empresa acumula a dívida e liberta o veículo com tarifa zero no momento da saída.
    calcularTarifa(valorCalculado) {
        this.#saldoDevedor += valorCalculado;
        return 0.00; // O motorista não paga nada na cancela
    }
}