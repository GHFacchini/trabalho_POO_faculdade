
export class RegistroEstacionamento {
    #placa;
    #cliente; // Armazena a instância do cliente (Professor, Estudante, Avulso, etc.)
    #dataEntrada;
    #dataSaida;
    #valorCobrado;

    constructor(placa, cliente) {
        this.#placa = placa;
        this.#cliente = cliente;
        this.#dataEntrada = new Date(); // Captura a data e hora exatas do momento da criação
        this.#dataSaida = null;
        this.#valorCobrado = 0.0;
    }

    // Getters para acessar os dados encapsulados
    get placa() { return this.#placa; }
    get cliente() { return this.#cliente; }
    get dataEntrada() { return this.#dataEntrada; }
    get dataSaida() { return this.#dataSaida; }
    get valorCobrado() { return this.#valorCobrado; }

    // Setter opcional, mas muito útil nesta Fase 1 para podermos criar testes unitários 
    // simulando datas de entrada no passado (ex: carro que entrou ontem)
    set dataEntrada(data) {
        this.#dataEntrada = data;
    }

    // Método chamado no momento em que o veículo vai embora
    finalizarRegistro(valorCalculado) {
        this.#dataSaida = new Date();
        // O valor final já passou pelas regras de polimorfismo do cliente antes de chegar aqui
        this.#valorCobrado = valorCalculado;
    }
}