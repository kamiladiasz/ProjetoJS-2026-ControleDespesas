
// ==============================
// CAPTURA DOS ELEMENTOS HTML
// ==============================

const formularioPerfil = document.getElementById("form-perfil");
const formularioDespesas = document.getElementById("form-despesas");

const btnAbrirCadastro = document.getElementById("btnAbrirCadastro");
const abasPessoas = document.getElementById("abasPessoas");

const nome = document.getElementById("nome");
const salario = document.getElementById("salario");
const alimentacao = document.getElementById("alimentacao");

const datadespesa = document.getElementById("dataDespesa");
const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");
const valor = document.getElementById("valor");

const listaDespesas = document.getElementById("listaDespesas");

const salarioResumo = document.getElementById("salarioResumo");
const alimentacaoResumo = document.getElementById("alimentacaoResumo");
const totalResumo = document.getElementById("totalResumo");
const saldoPagar = document.getElementById("saldoPagar");

const cardDespesas = document.getElementById("cardDespesas");
const tituloResumo = document.getElementById("tituloResumo");
const tituloLista = document.getElementById("tituloLista");


// ==============================
// VARIÁVEIS DO SISTEMA
// ==============================

const chaveArmazenamento = "controleDespesas2026";

let pessoas = [];
let pessoaSelecionadaId = null;


// ==============================
// FORMATAR MOEDA
// ==============================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ==============================
// SALVAR DADOS EM JSON
// ==============================

function salvarDados() {

    const dados = {
        pessoas: pessoas,
        pessoaSelecionadaId: pessoaSelecionadaId
    };

    try {

        localStorage.setItem(
            chaveArmazenamento,
            JSON.stringify(dados)
        );

    } catch (erro) {

        console.log("Erro ao salvar os dados:", erro);

        alert("Não foi possível salvar os dados.");

    }

}


// ==============================
// CARREGAR DADOS SALVOS
// ==============================

function carregarDados() {

    const dadosSalvos = localStorage.getItem(chaveArmazenamento);

    if (dadosSalvos) {

        try {

            const dados = JSON.parse(dadosSalvos);

            // Verifica se os dados estão no formato de várias pessoas

            if (Array.isArray(dados.pessoas)) {

                pessoas = dados.pessoas;

                pessoaSelecionadaId = dados.pessoaSelecionadaId;

            } else {

                // Aproveita os dados antigos de uma única pessoa

                if (dados.nome) {

                    pessoas = [{
                        id: Date.now(),
                        nome: dados.nome,
                        salario: Number(dados.salario) || 0,
                        alimentacao: Number(dados.alimentacao) || 0,
                        despesas: Array.isArray(dados.despesas)
                            ? dados.despesas
                            : []
                    }];

                    pessoaSelecionadaId = pessoas[0].id;

                }

            }

        } catch (erro) {

            console.log("Erro ao carregar os dados:", erro);

            pessoas = [];
            pessoaSelecionadaId = null;

        }

    }

    // Verifica se a pessoa selecionada ainda existe

    const pessoaExiste = pessoas.some(function(pessoa) {
        return pessoa.id === pessoaSelecionadaId;
    });

    if (!pessoaExiste) {

        pessoaSelecionadaId = pessoas.length > 0
            ? pessoas[0].id
            : null;

    }

    // Atualiza os dados salvos
    salvarDados();

    renderizarAbas();
    atualizarTela();

}


// ==============================
// ABRIR E FECHAR CADASTRO
// ==============================

btnAbrirCadastro.addEventListener("click", function() {

    formularioPerfil.hidden = !formularioPerfil.hidden;

});


// ==============================
// CADASTRAR PESSOA
// ==============================

formularioPerfil.addEventListener("submit", function(event) {

    event.preventDefault();

    const novaPessoa = {

        id: Date.now(),

        nome: nome.value.trim(),

        salario: Number(salario.value),

        alimentacao: Number(alimentacao.value),

        despesas: []

    };

    pessoas.push(novaPessoa);

    // Seleciona a pessoa recém-cadastrada

    pessoaSelecionadaId = novaPessoa.id;

    salvarDados();

    formularioPerfil.reset();

    formularioPerfil.hidden = true;

    renderizarAbas();

    atualizarTela();

    alert("Pessoa cadastrada com sucesso!");

});


// ==============================
// RENDERIZAR ABAS DAS PESSOAS
// ==============================

function renderizarAbas() {

    abasPessoas.innerHTML = "";

    // ABA VISÃO GERAL

    const botaoGeral = document.createElement("button");

    botaoGeral.type = "button";

    botaoGeral.textContent = "Visão Geral";

    botaoGeral.className = "aba-pessoa";

    if (pessoaSelecionadaId === null) {

        botaoGeral.classList.add("ativa");

    }

    botaoGeral.addEventListener("click", function() {

        pessoaSelecionadaId = null;

        formularioPerfil.hidden = true;

        salvarDados();

        renderizarAbas();

        atualizarTela();

    });

    abasPessoas.appendChild(botaoGeral);


    // CRIAR UMA ABA PARA CADA PESSOA

    pessoas.forEach(function(pessoa) {

        const aba = document.createElement("div");

        aba.className = "aba-pessoa-container";


        // BOTÃO COM O NOME DA PESSOA

        const botaoNome = document.createElement("button");

        botaoNome.type = "button";

        botaoNome.textContent = pessoa.nome;

        botaoNome.className = "aba-pessoa";

        if (pessoa.id === pessoaSelecionadaId) {

            botaoNome.classList.add("ativa");

        }

        botaoNome.addEventListener("click", function() {

            pessoaSelecionadaId = pessoa.id;

            formularioPerfil.hidden = true;

            salvarDados();

            renderizarAbas();

            atualizarTela();

        });


        // BOTÃO X PARA EXCLUIR PESSOA

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";

        botaoExcluir.textContent = "×";

        botaoExcluir.className = "btn-excluir-pessoa";

        botaoExcluir.title = "Excluir cadastro";


        botaoExcluir.addEventListener("click", function() {

            excluirPessoa(pessoa.id);

        });


        aba.appendChild(botaoNome);

        aba.appendChild(botaoExcluir);

        abasPessoas.appendChild(aba);

    });

}


// ==============================
// EXCLUIR PESSOA
// ==============================

function excluirPessoa(idPessoa) {

    const pessoa = pessoas.find(function(item) {

        return item.id === idPessoa;

    });

    if (!pessoa) {

        return;

    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir " + pessoa.nome +
        "?\n\nTodas as despesas cadastradas para essa pessoa também serão excluídas."
    );

    if (!confirmar) {

        return;

    }

    // Remove a pessoa e todas as despesas vinculadas

    pessoas = pessoas.filter(function(item) {

        return item.id !== idPessoa;

    });

    // Se a pessoa excluída estava selecionada,
    // volta para a Visão Geral

    if (pessoaSelecionadaId === idPessoa) {

        pessoaSelecionadaId = null;

    }

    // Atualiza o localStorage

    salvarDados();

    // Atualiza abas, tabela e resumo financeiro

    renderizarAbas();

    atualizarTela();

    alert("Cadastro excluído com sucesso!");

}


// ==============================
// ADICIONAR DESPESAS
// ==============================

formularioDespesas.addEventListener("submit", function(event) {

    event.preventDefault();

    const pessoa = pessoas.find(function(pessoa) {

        return pessoa.id === pessoaSelecionadaId;

    });

    if (!pessoa) {

        alert("Selecione uma pessoa primeiro!");

        return;

    }

    const novaDespesa = {

        id: Date.now(),

        data: datadespesa.value,

        descricao: descricao.value.trim(),

        categoria: categoria.options[categoria.selectedIndex].text,

        valor: Number(valor.value)

    };

    pessoa.despesas.push(novaDespesa);

    salvarDados();

    formularioDespesas.reset();

    atualizarTela();

});


// ==============================
// ATUALIZAR A TELA
// ==============================

function atualizarTela() {

    const pessoa = pessoas.find(function(pessoa) {

        return pessoa.id === pessoaSelecionadaId;

    });

    if (pessoa) {

        // MODO INDIVIDUAL

        cardDespesas.style.display = "block";

        tituloResumo.textContent = "Resumo de " + pessoa.nome;

        tituloLista.textContent = "Despesas de " + pessoa.nome;

        mostrarDespesas(pessoa.despesas);

        atualizarResumoIndividual(pessoa);

    } else {

        // MODO VISÃO GERAL

        cardDespesas.style.display = "none";

        tituloResumo.textContent = "Resumo Geral";

        tituloLista.textContent = "Todas as Despesas";

        mostrarTodasDespesas();

        atualizarResumoGeral();

    }

}


// ==============================
// MOSTRAR DESPESAS INDIVIDUAIS
// ==============================

function mostrarDespesas(despesasPessoa) {

    listaDespesas.innerHTML = "";

    if (despesasPessoa.length === 0) {

        mostrarTabelaVazia();

        return;

    }

    const pessoa = pessoas.find(function(item) {

        return item.id === pessoaSelecionadaId;

    });

    despesasPessoa.forEach(function(despesa) {

        criarLinhaDespesa(despesa, pessoa.nome, pessoa.id);

    });

}


// ==============================
// MOSTRAR TODAS AS DESPESAS
// ==============================

function mostrarTodasDespesas() {

    listaDespesas.innerHTML = "";

    let todasDespesas = [];

    pessoas.forEach(function(pessoa) {

        pessoa.despesas.forEach(function(despesa) {

            todasDespesas.push({

                ...despesa,

                nomePessoa: pessoa.nome,

                pessoaId: pessoa.id

            });

        });

    });

    if (todasDespesas.length === 0) {

        mostrarTabelaVazia();

        return;

    }

    // Organiza as despesas pela data

    todasDespesas.sort(function(a, b) {

        return a.data.localeCompare(b.data);

    });

    todasDespesas.forEach(function(despesa) {

        criarLinhaDespesa(
            despesa,
            despesa.nomePessoa,
            despesa.pessoaId
        );

    });

}


// ==============================
// CRIAR LINHA DA TABELA
// ==============================

function criarLinhaDespesa(despesa, nomePessoa, pessoaId) {

    const linha = document.createElement("tr");

    const colunaData = document.createElement("td");

    const colunaPessoa = document.createElement("td");

    const colunaDescricao = document.createElement("td");

    const colunaCategoria = document.createElement("td");

    const colunaValor = document.createElement("td");

    const colunaAcao = document.createElement("td");


    colunaData.textContent = despesa.data
        ? despesa.data.split("-").reverse().join("/")
        : "";

    colunaPessoa.textContent = nomePessoa;

    colunaDescricao.textContent = despesa.descricao;

    colunaCategoria.textContent = despesa.categoria;

    colunaValor.textContent = formatarMoeda(despesa.valor);


    // BOTÃO EXCLUIR DESPESA

    const botaoExcluir = document.createElement("button");

    botaoExcluir.type = "button";

    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function() {

        excluirDespesa(despesa.id, pessoaId);

    });

    colunaAcao.appendChild(botaoExcluir);


    linha.appendChild(colunaData);

    linha.appendChild(colunaPessoa);

    linha.appendChild(colunaDescricao);

    linha.appendChild(colunaCategoria);

    linha.appendChild(colunaValor);

    linha.appendChild(colunaAcao);

    listaDespesas.appendChild(linha);

}


// ==============================
// EXCLUIR DESPESA
// ==============================

function excluirDespesa(idDespesa, pessoaId) {

    const pessoa = pessoas.find(function(item) {

        return item.id === pessoaId;

    });

    if (!pessoa) {

        return;

    }

    const confirmar = confirm("Deseja excluir esta despesa?");

    if (!confirmar) {

        return;

    }

    // Remove a despesa da pessoa correspondente

    pessoa.despesas = pessoa.despesas.filter(function(despesa) {

        return despesa.id !== idDespesa;

    });

    // Atualiza o localStorage

    salvarDados();

    // Recalcula o resumo e atualiza a tabela

    atualizarTela();

}


// ==============================
// TABELA VAZIA
// ==============================

function mostrarTabelaVazia() {

    listaDespesas.innerHTML = `
        <tr>
            <td colspan="6">
                Nenhuma despesa cadastrada.
            </td>
        </tr>
    `;

}


// ==============================
// RESUMO FINANCEIRO INDIVIDUAL
// ==============================

function atualizarResumoIndividual(pessoa) {

    let totalDespesas = 0;

    pessoa.despesas.forEach(function(despesa) {

        totalDespesas += Number(despesa.valor);

    });

    const saldo = pessoa.salario -
                  pessoa.alimentacao -
                  totalDespesas;

    salarioResumo.textContent = formatarMoeda(pessoa.salario);

    alimentacaoResumo.textContent = formatarMoeda(pessoa.alimentacao);

    totalResumo.textContent = formatarMoeda(totalDespesas);

    saldoPagar.textContent = formatarMoeda(saldo);

}


// ==============================
// RESUMO FINANCEIRO GERAL
// ==============================

function atualizarResumoGeral() {

    let totalSalarios = 0;

    let totalAlimentacao = 0;

    let totalDespesas = 0;

    pessoas.forEach(function(pessoa) {

        totalSalarios += Number(pessoa.salario);

        totalAlimentacao += Number(pessoa.alimentacao);

        pessoa.despesas.forEach(function(despesa) {

            totalDespesas += Number(despesa.valor);

        });

    });

    const saldo = totalSalarios -
                  totalAlimentacao -
                  totalDespesas;

    salarioResumo.textContent = formatarMoeda(totalSalarios);

    alimentacaoResumo.textContent = formatarMoeda(totalAlimentacao);

    totalResumo.textContent = formatarMoeda(totalDespesas);

    saldoPagar.textContent = formatarMoeda(saldo);

}


// ==============================
// INICIALIZAR SISTEMA
// ==============================

carregarDados();
