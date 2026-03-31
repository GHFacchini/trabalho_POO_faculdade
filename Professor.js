import { Cliente } from './Cliente.js';

export class Professor extends Cliente {
    constructor(id, nome) {
        super(id, nome);
    }

    adicionarPlaca(placa) {
        if (this.placas.length >= 2) {
            throw new Error("Um Professor pode cadastrar no máximo 2 veículos.");
        }
        super.adicionarPlaca(placa);
    }

    // Regra: Entrada totalmente gratuita.
    calcularTarifa(quantidadeDias, horasPermanencia) {
        return 0.00; 
    }
}