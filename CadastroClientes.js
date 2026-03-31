export class CadastroClientes {
    #clientes; // Map de ID -> Cliente

    constructor() {
        this.#clientes = new Map();
    }

    cadastrar(cliente) {
        if (cliente.constructor.name === "Avulso") {
             throw new Error("Um cliente Avulso não pode ser pré-cadastrado em sistema.");
        }
        this.#clientes.set(cliente.id, cliente);
    }

    buscarPorId(id) {
        return this.#clientes.get(id);
    }

    // Tenta encontrar pelas placas vinculadas
    buscarPorPlaca(placa) {
        for (let cliente of this.#clientes.values()) {
            if (cliente.placas.includes(placa)) {
                return cliente;
            }
        }
        return null; // Caso não encontre, trata-se de um Avulso
    }
}
