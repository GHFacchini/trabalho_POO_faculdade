export class Cliente {
    // Atributos privados
    #id; // CPF ou CNPJ (ou a própria placa no caso do Avulso)
    #nome;
    #placas;

    constructor(id, nome) {
        if (new.target === Cliente) {
            throw new Error("Não é possível instanciar a classe abstrata Cliente diretamente.");
        }
        this.#id = id;
        this.#nome = nome;
        this.#placas = new Set(); // O Set garante automaticamente que não haverá placas duplicadas
    }

    get id() { return this.#id; }
    get nome() { return this.#nome; }

    get placas() {
        return Array.from(this.#placas);
    }

    adicionarPlaca(placa) {
        this.#placas.add(placa);
    }

    // Método abstrato (polimorfo) que as subclasses devem implementar
    calcularTarifa(quantidadeDias, horasPermanencia) {
        throw new Error("O método calcularTarifa deve ser implementado pela subclasse.");
    }
}