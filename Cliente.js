
export class Cliente {
    // Atributos privados (encapsulamento)
    #id; // Pode ser o CPF ou CNPJ
    #nome;
    #placas;

    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome;
        this.#placas = new Set(); // O Set garante automaticamente que não haverá placas duplicadas
    }

    // Getters para permitir a leitura dos dados privados
    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    // Retorna as placas como um array tradicional para facilitar a leitura no sistema
    get placas() {
        return Array.from(this.#placas);
    }

    // Método para vincular um veículo ao cliente
    adicionarPlaca(placa) {
        this.#placas.add(placa);
    }
}