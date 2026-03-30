import { Cliente } from './Cliente.js';

export class Professor extends Cliente {
    constructor(id, nome) {
        super(id, nome); // O 'super' chama o construtor da superclasse (Cliente)
    }

    // Polimorfismo: Sobrescrevemos o método para aplicar a regra de limite de veículos
    adicionarPlaca(placa) {
        if (this.placas.length >= 2) {
            throw new Error("Um Professor pode cadastrar no máximo 2 veículos.");
        }
        super.adicionarPlaca(placa); // Chama a lógica original se a regra for validada
    }

    // Método que será usado futuramente pelo sistema de cobrança
    calcularTarifa(tempoDePermanencia) {
        return 0.00; // Entrada gratuita
    }
}