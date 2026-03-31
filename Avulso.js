import { Cliente } from './Cliente.js';

export class Avulso extends Cliente {
    constructor(placa) {
        // Avulso usa a placa como ID temporário no polimorfismo e nome genérico
        super(placa, "Cliente Avulso");
        this.adicionarPlaca(placa);
    }

    // Regra: até 6 horas, cobra hora-fracionada. Acima de 6h cobra diária. Virou meia-noite é nova diária.
    calcularTarifa(quantidadeDias, horasPermanencia) {
        const VALOR_HORA = 10.00;
        const VALOR_DIARIA = 50.00;

        let valorTotal = 0.0;

        if (quantidadeDias > 1) {
            // Se virou "dias" na meia noite, cobra-se diárias equivalentes
            valorTotal = quantidadeDias * VALOR_DIARIA;
        } else {
            // Mesmo dia civil
            if (horasPermanencia > 6) {
                valorTotal = VALOR_DIARIA;
            } else {
                valorTotal = horasPermanencia * VALOR_HORA;
            }
        }

        return valorTotal;
    }
}