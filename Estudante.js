import { Cliente } from './Cliente.js';

export class Estudante extends Cliente {
    #tarifaFixa; // Atributo privado específico do estudante

    constructor(id, nome, tarifaFixa = 15.00) {
        super(id, nome);
        this.#tarifaFixa = tarifaFixa;
    }

    adicionarPlaca(placa) {
        if (this.placas.length >= 1) {
            throw new Error("Um Estudante pode cadastrar apenas 1 veículo.");
        }
        super.adicionarPlaca(placa);
    }

    calcularTarifa(tempoDePermanencia) {
        // A lógica complexa de virada de meia-noite ficará no controlador, 
        // mas a base de cálculo da subclasse retorna a sua tarifa fixa.
        return this.#tarifaFixa;
    }
}