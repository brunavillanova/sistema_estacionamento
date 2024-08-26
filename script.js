"use strict";
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function patio() {
        function ler() {
            const veiculosStr = localStorage.getItem('patio') || '[]';
            const veiculos = JSON.parse(veiculosStr);
            return veiculos.map(veiculo => (Object.assign(Object.assign({}, veiculo), { entrada: new Date(veiculo.entrada) // Converte a string de volta para Date
             })));
        }
        function adicionar(veiculo) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;
            const tabela = $("#patio");
            if (tabela) {
                tabela.appendChild(row);
            }
        }
        function calcularTempoNoPatio(entrada) {
            const agora = new Date();
            const tempoNoPatio = agora.getTime() - entrada.getTime();
            const dias = Math.floor(tempoNoPatio / (1000 * 60 * 60 * 24));
            const horas = Math.floor((tempoNoPatio % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((tempoNoPatio % (1000 * 60 * 60)) / (1000 * 60));
            return `${dias} dias, ${horas} horas e ${minutos} minutos`;
        }
        function remover(placa) {
            const veiculos = ler();
            const veiculoRemovido = veiculos.find(veiculo => veiculo.placa === placa);
            const veiculosAtualizados = veiculos.filter(veiculo => veiculo.placa !== placa);
            if (veiculoRemovido) {
                const tempoNoPatio = calcularTempoNoPatio(veiculoRemovido.entrada);
                alert(`O veículo com placa ${placa} permaneceu no pátio por ${tempoNoPatio}.`);
            }
            salvar(veiculosAtualizados);
            render();
        }
        function salvar(veiculos) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }
        function render() {
            const veiculos = ler();
            const tabela = $("#patio");
            if (tabela) {
                tabela.innerHTML = ''; // Limpa a tabela
                veiculos.forEach(veiculo => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    const patioInstance = patio(); // Cria uma instância de patio
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        const novoVeiculo = { nome, placa, entrada: new Date() };
        const veiculos = patioInstance.ler();
        veiculos.push(novoVeiculo);
        patioInstance.salvar(veiculos);
        patioInstance.render();
        // Limpar os campos de entrada
        $('#nome').value = '';
        $('#placa').value = '';
    });
    // Evento para remover veículos
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('delete')) {
            const placa = target.getAttribute('data-placa');
            if (placa) {
                patioInstance.remover(placa);
            }
        }
    });
    patioInstance.render(); // Renderiza os veículos ao carregar a página
})();
