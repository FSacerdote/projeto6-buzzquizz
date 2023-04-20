axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
const promise = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
promise.then(Get_Lista);
promise.catch(resposta => console.log('erro ao conectar com o servidor: ' + resposta))

let Lista_Quizzes; //Variavel que vai recever a lista de quizzes

//Função para iniciar pegar lista do servidor quando conseguir conexão
function Get_Lista(){
    console.log('conectado!');
    promessa1 = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
    promessa1.then(preencher_pagina1);
}

function preencher_pagina1(resposta){
    Lista_Quizzes = resposta.data;
    let lista = document.querySelector('.Quizz-lista-container');
    lista.innerHTML = '';
    Lista_Quizzes.forEach(adicionar_Quizz);
}

function adicionar_Quizz(elemento, index){
    let lista = document.querySelector('.Quizz-lista-container');

    let titulo = elemento.title;
    let img = elemento.image;

    console.log(img + " "+index);
    lista.innerHTML += 
    `<div class="quizz-container">
    <img src="${img}" alt="">
    <label>${titulo}</label>
    </div>`

}