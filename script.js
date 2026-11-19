formulario.addEventListener("submit", function(event){
    event.preventDefault();

const formulario = document.getElementById("form-despesas");const descricao = document.getElementById("descricao");
const categoria = document.getElementById("categoria");
const valor = document.getElementById("valor");
const listaDespesas = document.getElementById("listaDespesas");

let nomeDespesa = descricao.value;
let categoriaDespesa = categoria.value;
let valorDespesa = Number(valor.value);

let linha = document.createElement("tr");

linha.innerHTML = `
    <td>${nomeDespesa}</td>
    <td>${categoriaDespesa}</td>
    <td>${valorDespesa.toFixed(2)}</td>
    <td>
        <button onclick="excluirDespesa(this)">Excluir</button>
    </td>

`;

listaDespesas.appendChild(linha);

formulario.reset();
});

function excluirDespesa(botao) {

    let linha = botao.parentElement.parentElement;

    linha.remove();

}

    formulario.reset();

