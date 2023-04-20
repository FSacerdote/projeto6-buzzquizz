axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
let tela1 = document.querySelector(".tela1");
let tela2 = document.querySelector(".tela2");
let tela3 = document.querySelector(".tela3");

// tela 2 - página de um quiz

let promisse = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
promisse.then((resposta)=>{
    console.log(resposta.data);
});
promisse.catch((erro)=>{
    console.log(erro.data);
});

function selecionaQuiz(quiz){
    let id = quiz.id;
    let promessaQuiz = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`);
    promessaQuiz.then(carregaQuiz);
}   

function carregaQuiz(resposta){
    console.log(resposta);
    tela1.classList.add("escondido");
    tela2.classList.remove("escondido");
    tela3.classList.add("escondido");
    const tituloQuiz = resposta.data.title;
    const imgQuiz = resposta.data.image;
    const perguntas = resposta.data.questions;
    tela2.innerHTML += `
        <div class="header-Quiz">
            <img src="${imgQuiz}"/>
            <p>${tituloQuiz}</p>
        </div>
    `;
    for (let i = 0; i < perguntas.length; i++) {
        tela2.innerHTML += `
            <div class="container-perguntas">
                <div style="background-color:${perguntas[i].color};"  class="pergunta">${perguntas[i].title}</div>
                <div id ="${i}" class="respostas"></div>
            </div>
        `;
        perguntas[i].answers.sort(comparador);
        for (let j = 0; j < perguntas[i].answers.length; j++) {
            let respostas = document.getElementById(i);
            respostas.innerHTML += `
            <div class="resposta">
                <img src="${perguntas[i].answers[j].image}"/>
                <p>${perguntas[i].answers[j].text}</p>
            </div>
            `
        }
    }
}
function comparador() { 
	return Math.random() - 0.5; 
}

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
