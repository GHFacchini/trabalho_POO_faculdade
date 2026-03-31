export class TicketEstacionamento {
    #placa;
    #cliente; // Instância de Cliente, Avulso, Estudante, etc.
    #dataEntrada;
    #dataSaida;
    #valorBase;
    #nomeDesconto;
    #descontoAplicado;
    #valorFinal;

    constructor(placa, cliente) {
        this.#placa = placa;
        this.#cliente = cliente;
        this.#dataEntrada = new Date();
        this.#dataSaida = null;
        this.#valorBase = 0.0;
        this.#nomeDesconto = "nenhum";
        this.#descontoAplicado = 0.0;
        this.#valorFinal = 0.0;
    }

    get placa() { return this.#placa; }
    get cliente() { return this.#cliente; }
    get dataEntrada() { return this.#dataEntrada; }
    get dataSaida() { return this.#dataSaida; }
    get valorBase() { return this.#valorBase; }
    get nomeDesconto() { return this.#nomeDesconto; }
    get descontoAplicado() { return this.#descontoAplicado; }
    get valorFinal() { return this.#valorFinal; }

    set dataEntrada(data) { this.#dataEntrada = data; }
    set dataSaida(data) { this.#dataSaida = data; }

    finalizarTicket(valorBase, nomeDesconto, descontoAplicado, valorFinal) {
        if(!this.#dataSaida) this.#dataSaida = new Date();
        this.#valorBase = valorBase;
        this.#nomeDesconto = nomeDesconto;
        this.#descontoAplicado = descontoAplicado;
        this.#valorFinal = valorFinal;
    }
}
