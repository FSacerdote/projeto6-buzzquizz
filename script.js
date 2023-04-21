axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
let tela1 = document.querySelector(".tela1");
let tela2 = document.querySelector(".tela2");
let tela3 = document.querySelector(".tela3");
let perguntasRespondidas;
let respostasCertas;
let quizAtual;

// tela 2 - página de um quiz

function selecionaQuiz(id){
    let promessaQuiz = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`);
    promessaQuiz.then(carregaQuiz);
}   

function carregaQuiz(resposta){
    tela2.innerHTML = "";
    respostasCertas = 0;
    perguntasRespondidas = 0;
    quizAtual = resposta;
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
            <div onclick="selecionaResposta(this)" class="resposta ${perguntas[i].answers[j].isCorrectAnswer}">
                <img src="${perguntas[i].answers[j].image}"/>
                <p>${perguntas[i].answers[j].text}</p>
            </div>
            `;
        }
    }
}
function selecionaResposta(resposta) {
    perguntasRespondidas++;
    let respostas = resposta.parentNode;
    let listaRespostas = respostas.querySelectorAll(".resposta");
    if (resposta.classList.contains("true")) {
        respostasCertas++;
    }
    for (let i = 0; i < listaRespostas.length; i++) {
        listaRespostas[i].classList.add("apagado");
        listaRespostas[i].onclick = false;
        if(listaRespostas[i].classList.contains("true")) {
            listaRespostas[i].classList.add("correta");
        }else{
            listaRespostas[i].classList.add("errada");
        }
    }
    resposta.classList.remove("apagado");
    let perguntas = document.querySelectorAll(".container-perguntas");
    if(perguntasRespondidas === perguntas.length){
        fimDeQuiz();
    }else{
        setTimeout(()=>{
            if (perguntasRespondidas < perguntas.length) {
                perguntas[perguntasRespondidas].scrollIntoView();
            }
        }, 2000);
    }
}
function fimDeQuiz(){
    let levels = quizAtual.data.levels;
    let acerto = (respostasCertas/perguntasRespondidas*100).toFixed(0);
    let idLevel = 0;
    for (let i = 0; i < levels.length; i++) {
        if (acerto >= levels[i].minValue) {
            idLevel = i;
        }
    }
    tela2.innerHTML += `
            <div class="container-final">
                <div class="level">${acerto}% de acerto: ${levels[idLevel].title}</div>
                <div class="levels-info">
                    <img src="${levels[idLevel].image}"/>
                    <p>${levels[idLevel].text}</p>
                </div>
            </div>
            <button class="reiniciar" onclick="reiniciaQuiz()">Reiniciar Quizz</button>
            <button class="voltar" onclick="voltaHome()">Voltar pra home</button>
    `;
    let final = document.querySelector(".container-final");
    setTimeout(()=>{final.scrollIntoView();}, 2000);
}
function reiniciaQuiz(){
    let comeco = document.querySelector(".header-Quiz");
    comeco.scrollIntoView();
    console.log(quizAtual.data.id);
    selecionaQuiz(quizAtual.data.id);
}
function voltaHome(){
    tela2.innerHTML = "";
    tela1.classList.remove("escondido");
    tela2.classList.add("escondido");
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
