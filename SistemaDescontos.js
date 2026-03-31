export class SistemaDescontos {
    // Retorna { valorDesconto, nomeDesconto }
    static calcularDesconto(ticket, historicoDoEstacionamento) {
        // Regra ClienteFrequente para Avulsos: 3 vezes nos últimos 5 dias = 20%
        if (ticket.cliente.constructor.name === "Avulso") {
            const visitas = historicoDoEstacionamento.filter(t => 
                t.placa === ticket.placa && 
                t.dataSaida != null
            );

            const cincoDiasAtras = new Date();
            // Ajeita se a entrada atual for com data fake
            cincoDiasAtras.setDate(ticket.dataEntrada.getDate() - 5);

            const visitasRecentes = visitas.filter(t => t.dataEntrada >= cincoDiasAtras);

            // A regra diz: "usaram o estacionamento 3 vezes nos últimos 5 dias"
            if (visitasRecentes.length >= 3) {
                // Aplica 20% de desconto sobre o valor calculado base da tarifa
                const valorDesconto = ticket.valorBase * 0.20;
                return {
                    nomeDesconto: "ClienteFrequente",
                    valorDesconto: valorDesconto
                };
            }
        }

        return { nomeDesconto: "nenhum", valorDesconto: 0 };
    }
}
