import { RegistroEstacionamento } from './RegistroEstacionamento.js';
import { Avulso } from './Avulso.js';
import { Professor } from './Professor.js';

export class Estacionamento {
    #registrosAtivos; // Map: associa a placa (matrícula) ao ticket atual
    #clientesCadastrados; // Map: associa o ID do cliente à sua instância

    constructor() {
        // A utilização de Map (dicionário) garante eficiência na procura e cumpre
        // os requisitos de estruturas de dados avançadas exigidas no projeto.
        this.#registrosAtivos = new Map();
        this.#clientesCadastrados = new Map();
    }

    // Método para popular a base de dados em memória
    cadastrarCliente(cliente) {
        this.#clientesCadastrados.set(cliente.id, cliente);
    }

    // Método auxiliar privado para descobrir de quem é o carro que está a entrar
    #identificarCliente(placa) {
        for (let cliente of this.#clientesCadastrados.values()) {
            if (cliente.placas.includes(placa)) {
                return cliente; // Encontrou um cliente pré-registado com esta placa
            }
        }
        // Se a placa não está no sistema, assume-se que é um cliente avulso
        return new Avulso();
    }

    // O momento em que o carro chega à cancela
    registrarEntrada(placa) {
        if (this.#registrosAtivos.has(placa)) {
            throw new Error("O veículo já se encontra no parque de estacionamento.");
        }

        const cliente = this.#identificarCliente(placa);

        // 1ª Regra de Negócio: Bloqueio de Inadimplentes (Avulso)
        if (cliente instanceof Avulso && cliente.bloqueado) {
            throw new Error("Entrada negada: Cliente avulso com bloqueio por falta de pagamento anterior.");
        }

        // 2ª Regra de Negócio: Limite de veículos simultâneos para Professores
        if (cliente instanceof Professor) {
            let carrosDoProfessor = 0;
            for (let registro of this.#registrosAtivos.values()) {
                if (registro.cliente === cliente) carrosDoProfessor++;
            }
            if (carrosDoProfessor >= 1) {
                throw new Error("Entrada negada: O professor já possui um veículo estacionado no momento.");
            }
        }

        // Se passou por todas as validações, a cancela abre e o registo é criado
        const novoRegistro = new RegistroEstacionamento(placa, cliente);
        this.#registrosAtivos.set(placa, novoRegistro);

        console.log(`Entrada autorizada para o veículo ${placa}. Cliente: ${cliente.nome}`);
        return novoRegistro;
    }

    // Método a ser adicionado DENTRO da classe Estacionamento
    registrarSaida(placa) {
        // Verifica se o carro está realmente no pátio
        if (!this.#registrosAtivos.has(placa)) {
            throw new Error("Veículo não encontrado no parque de estacionamento.");
        }

        const registro = this.#registrosAtivos.get(placa);
        const cliente = registro.cliente;

        const dataEntrada = registro.dataEntrada;
        const dataSaida = new Date(); // Captura o momento exato da saída

        // 1. Lógica da Meia-Noite (Cálculo de dias no calendário)
        // Zeramos as horas para comparar apenas a viragem dos dias
        const diaEntrada = new Date(dataEntrada.getFullYear(), dataEntrada.getMonth(), dataEntrada.getDate());
        const diaSaida = new Date(dataSaida.getFullYear(), dataSaida.getMonth(), dataSaida.getDate());

        // Calcula a diferença em dias (+1 porque entrar e sair no mesmo dia conta como 1 ingresso/diária)
        const diferencaDias = Math.round((diaSaida - diaEntrada) / (1000 * 60 * 60 * 24));
        const quantidadeDiarias = diferencaDias + 1;

        // 2. Cálculo de horas totais (arredondado para cima)
        const horasPermanencia = Math.ceil((dataSaida - dataEntrada) / (1000 * 60 * 60));

        // 3. Definição do Valor Base (Pode ajustar os valores conforme a necessidade)
        const VALOR_HORA = 10.00;
        const VALOR_DIARIA = 50.00;
        const TARIFA_ESTUDANTE = 15.00;

        let valorBase = 0;

        // Aplicação das regras documentadas
        if (cliente.constructor.name === "Estudante") {
            // O estudante paga o valor fixo multiplicado pelos dias (se virar a meia-noite, paga 2x)
            valorBase = quantidadeDiarias * TARIFA_ESTUDANTE;
        } else {
            // Regra Avulso e Empresa
            if (quantidadeDiarias > 1) {
                valorBase = quantidadeDiarias * VALOR_DIARIA; // Virou a meia-noite = diária
            } else {
                // Mesmo dia
                if (horasPermanencia > 6) {
                    valorBase = VALOR_DIARIA; // Passou de 6 horas vira diária
                } else {
                    valorBase = horasPermanencia * VALOR_HORA; // Menos de 6 horas paga por hora
                }
            }
        }

        // 4. A Mágica do Polimorfismo!
        // Enviamos o valor base calculado para o cliente decidir o que fazer.
        // O Professor vai retornar 0. A Empresa vai jogar para o Saldo Devedor e retornar 0.
        const valorFinal = cliente.calcularTarifa(valorBase);

        // Regista a saída e guarda o valor efetivamente cobrado no ticket
        registro.finalizarRegistro(valorFinal);

        // Liberta a vaga no dicionário (Map)
        this.#registrosAtivos.delete(placa);

        console.log(`\n--- SAÍDA REGISTRADA ---`);
        console.log(`Placa: ${placa} | Cliente: ${cliente.nome} (${cliente.constructor.name})`);
        console.log(`Tempo: ${horasPermanencia} hora(s) | Dias cobrados: ${quantidadeDiarias}`);
        console.log(`Valor a pagar na cancela: R$ ${valorFinal.toFixed(2)}\n`);

        return registro;
    }
}