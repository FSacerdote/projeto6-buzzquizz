axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
let tela1 = document.querySelector(".tela1");
let tela2 = document.querySelector(".tela2");
let tela3 = document.querySelector(".tela3");

//Tela 1 - Lista de Quizzes

let quiz;

const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
promisse.then(Get_Lista);
promisse.catch(resposta => console.log('erro ao conectar com o servidor: ' + resposta));

let Lista_Quizzes; //Variavel que vai receber a lista de quizzes

//Função para iniciar pegar lista do servidor quando conseguir conexão
function Get_Lista(){
    console.log('conectado!');
    const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
    promisse.then(preencher_pagina1);
}

function preencher_pagina1(resposta){
    Lista_Quizzes = resposta.data;
    const lista = document.querySelector('.Quizz-lista-container');
    lista.innerHTML = '';
    Lista_Quizzes.forEach(adicionar_Quizz);
}

function adicionar_Quizz(elemento, index){
    const lista = document.querySelector('.Quizz-lista-container');

    const titulo = elemento.title;
    const img = elemento.image;

    console.log(img + " "+index);
    lista.innerHTML += 
    `<div class="quizz-container" onclick="selecionaQuiz(quiz)">
    <img src="${img}" alt="">
    <label>${titulo}</label>
    </div>`

}

// tela 2 - Página de um Quizz

function selecionaQuiz(quiz){
    const id = quiz.id;
    const promisse = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`);
    promisse.then(carregaQuiz);
}   

function carregaQuiz(resposta){
    console.log(resposta);
    tela1.classList.add("escondido");
    tela2.classList.remove("escondido");
    tela3.classList.add("escondido");
    const tituloQuiz = resposta.data.title;
    const imgQuiz = resposta.data.image;
    const perguntas = resposta.data.questions;
    tela2.innerHTML = `
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

//Tela 3 - Criação do Quizz

const botao = document.querySelector('button');
botao.addEventListener('click', function preencher_pagina3() {
  tela1.classList.add('escondido');
  tela2.classList.add('escondido');
  tela3.classList.remove('escondido');

  tela3.innerHTML = 
  `<span>Comece pelo começo</span>
  <div class="basic-info">
    <input type="text" placeholder="Título do seu quizz">
    <input type="text" placeholder="URL da imagem do seu quizz">
    <input type="text" placeholder="Quantidade de perguntas do quizz">
    <input type="text" placeholder="Quantidade de níveis do quizz">
    </div>
    
    <div onclick="validarInformacoesQuizz()" class="next-step">Prosseguir para criar perguntas</div>`
});

const btnNextStep = document.querySelector('.next-step');
btnNextStep.addEventListener('click', validarInformacoesQuizz);

function validarInformacoesQuizz() {
    const titulo = document.querySelector('input[placeholder="Título do seu quizz"]');
    const urlImagem = document.querySelector('input[placeholder="URL da imagem do seu quizz"]');
    const qtdPerguntas = document.querySelector('input[placeholder="Quantidade de perguntas do quizz"]');
    const qtdNiveis = document.querySelector('input[placeholder="Quantidade de níveis do quizz"]');
  
    if (!titulo.value || titulo.value.length < 20 || titulo.value.length > 65) {
      alert('Por favor, informe um título com no mínimo 20 e no máximo 65 caracteres.');
      return;
    }
  
    if (!urlImagem.value || !/^(ftp|http|https):\/\/[^ "]+$/.test(urlImagem.value)) {
      alert('Por favor, informe uma URL de imagem válida.');
      return;
    }
  
    if (!qtdPerguntas.value || parseInt(qtdPerguntas.value) < 3) {
      alert('Por favor, informe uma quantidade de perguntas maior ou igual a 3.');
      return;
    }
  
    if (!qtdNiveis.value || parseInt(qtdNiveis.value) < 2) {
      alert('Por favor, informe uma quantidade de níveis maior ou igual a 2.');
      return;
    }
  
    // Caso todas as validações estejam corretas, podemos fazer o envio dos dados para a API
    // utilizando o formato JSON indicado.
  }
  



