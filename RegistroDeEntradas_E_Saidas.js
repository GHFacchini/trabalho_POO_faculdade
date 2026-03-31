import { TicketEstacionamento } from './TicketEstacionamento.js';
import { Avulso } from './Avulso.js';
import { Estudante } from './Estudante.js';
import { Professor } from './Professor.js';
import { Empresa } from './Empresa.js';
import { SistemaDescontos } from './SistemaDescontos.js';

export class RegistroDeEntradas_E_Saidas {
    #cadastroClientes;
    #ticketsAtivos; // Map de placa -> TicketEstacionamento
    #historico;     // Array de TicketEstacionamento finalizados
    #placasBloqueadas; // Set de placas

    constructor(cadastroClientes) {
        this.#cadastroClientes = cadastroClientes;
        this.#ticketsAtivos = new Map();
        this.#historico = [];
        this.#placasBloqueadas = new Set();
    }

    get historico() { return this.#historico; }
    get placasBloqueadas() { return Array.from(this.#placasBloqueadas); }

    bloquearPlaca(placa) {
        this.#placasBloqueadas.add(placa);
    }
    
    desbloquearPlaca(placa) {
        this.#placasBloqueadas.delete(placa);
    }

    registrarEntrada(placa, dataSimulada = null) {
        if (this.#ticketsAtivos.has(placa)) {
            throw new Error(`Entrada negada: O veículo de placa ${placa} já se encontra no estacionamento.`);
        }

        // Verifica lista negra local (Avulsos ou Estudantes que ficaram devendo)
        if (this.#placasBloqueadas.has(placa)) {
            throw new Error(`Entrada negada: O veículo de placa ${placa} encontra-se bloqueado por débitos anteriores.`);
        }

        let cliente = this.#cadastroClientes.buscarPorPlaca(placa);
        if (!cliente) {
            cliente = new Avulso(placa);
        }

        // Regra de Empresa inadimplente (Bloqueia todos da frota)
        if (cliente instanceof Empresa && cliente.inadimplente) {
             throw new Error(`Entrada negada: Empresa ${cliente.nome} encontra-se bloqueada por inadimplência.`);
        }

        // Regra Professor (Apenas 1 carro no pátio por vez)
        if (cliente instanceof Professor) {
            let carrosDoProfessor = 0;
            for (let ticket of this.#ticketsAtivos.values()) {
                if (ticket.cliente === cliente) carrosDoProfessor++;
            }
            if (carrosDoProfessor >= 1) {
                throw new Error(`Entrada negada: O professor ${cliente.nome} já possui um veículo estacionado no momento.`);
            }
        }

        const novoTicket = new TicketEstacionamento(placa, cliente);
        if (dataSimulada) novoTicket.dataEntrada = dataSimulada;

        this.#ticketsAtivos.set(placa, novoTicket);

        console.log(`[ENTRADA] Autorizada p/ ${placa}. Cliente: ${cliente.nome} (${cliente.constructor.name})`);
        return novoTicket;
    }

    // Parâmetro recusouPagamento (Avulsos)
    registrarSaida(placa, recusouPagamento = false, dataSimulada = null) {
        if (!this.#ticketsAtivos.has(placa)) {
            throw new Error(`Saída falhou: O veículo ${placa} não está no estacionamento.`);
        }

        const ticket = this.#ticketsAtivos.get(placa);
        const cliente = ticket.cliente;
        
        const dataEntrada = ticket.dataEntrada;
        const dataSaida = dataSimulada ? dataSimulada : new Date();
        ticket.dataSaida = dataSaida; // Temporário pra poder passar p/ Desconto

        // Lógica de tempo e meia-noite
        const diaEntrada = new Date(dataEntrada.getFullYear(), dataEntrada.getMonth(), dataEntrada.getDate());
        const diaSaida = new Date(dataSaida.getFullYear(), dataSaida.getMonth(), dataSaida.getDate());

        const diferencaDias = Math.round((diaSaida - diaEntrada) / (1000 * 60 * 60 * 24));
        const quantidadeDias = diferencaDias + 1; // 1 = entrou e saiu no mesmo dia
        const horasPermanencia = Math.ceil((dataSaida - dataEntrada) / (1000 * 60 * 60)) || 1;

        // 1. Polimorfismo - A classe filha decide a tarifa base DE ACORDO com o tempo ou tipo de cliente (Ex: Empresa=Diária)
        const valorBase = cliente.calcularTarifa(quantidadeDias, horasPermanencia);

        // 2. Cálculo de Descontos Estratégicos (Regra restrita só funciona p/ Avulsos)
        const { nomeDesconto, valorDesconto } = SistemaDescontos.calcularDesconto(ticket, this.#historico);

        // 3. Aplica o desconto no valorBase se ele for maior que 0 e o cara tiver que pagar avulso na saída física
        let valorFinal = valorBase - valorDesconto;
        if (valorFinal < 0) valorFinal = 0;

        ticket.finalizarTicket(valorBase, nomeDesconto, valorDesconto, valorFinal);

        // Regras Finais de Saída e Bloqueio
        if (cliente instanceof Avulso && recusouPagamento) {
            console.log(`[ALERTA] Cliente avulso (${placa}) recusou pagamento. Veículo está sendo liberado, mas a Placa será bloqueada.`);
            this.bloquearPlaca(placa); // Lista Negra
        } else if (cliente instanceof Estudante) {
            if (cliente.saldo < 0) {
                 console.log(`[ALERTA] Estudante ${cliente.nome} esgotou os créditos e o saldo ficou negativo (R$ ${cliente.saldo.toFixed(2)}). Placa bloqueada até quitação.`);
                 this.bloquearPlaca(placa);
            }
        }

        this.#ticketsAtivos.delete(placa);
        this.#historico.push(ticket); // Salva no banco de relatórios

        console.log(`[SAÍDA] Registrada p/ ${placa} | Cliente: ${cliente.constructor.name}`);
        console.log(`      Tempo: ${horasPermanencia} hora(s) | Dias Cobrados: ${quantidadeDias}`);
        if(nomeDesconto !== "nenhum") console.log(`      Desconto: ${nomeDesconto} (R$ -${valorDesconto.toFixed(2)})`);
        if (cliente instanceof Empresa || cliente instanceof Estudante || cliente instanceof Professor) {
             console.log(`      Pago na Guarita Física: R$ 0.00 (Faturado pelo perfil)`);
        } else {
             console.log(`      Pago na Guarita Física: R$ ${valorFinal.toFixed(2)}`);
        }

        return ticket;
    }
}
