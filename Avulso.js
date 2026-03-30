import { Cliente } from './Cliente.js';

export class Avulso extends Cliente {
    #bloqueado;

    constructor(id = "Avulso", nome = "Cliente Avulso") {
        // Como é avulso, não tem um ID fixo como CPF/CNPJ no momento da entrada
        super(id, nome);
        this.#bloqueado = false;
    }

    get bloqueado() {
        return this.#bloqueado;
    }

    bloquear() {
        this.#bloqueado = true;
    }

    desbloquear() {
        this.#bloqueado = false;
    }

    // O cálculo de horas e virada da meia-noite será feito pelo Controlador do Estacionamento,
    // mas deixamos o método base preparado para o polimorfismo.
    calcularTarifa(valorCalculadoPeloSistema) {
        return valorCalculadoPeloSistema;
    }
}