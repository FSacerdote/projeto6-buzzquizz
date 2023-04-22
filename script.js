axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
const tela1 = document.querySelector(".tela1");
const tela2 = document.querySelector(".tela2");
const tela3 = document.querySelector(".tela3");
let perguntasRespondidas;
let respostasCertas;
let quizAtual;

//Tela 1 - Lista de Quizzes

let quiz;
const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
promisse.then(Get_Lista);
promisse.catch(resposta => console.log('erro ao conectar com o servidor: ' + resposta));

let Lista_Quizzes; //Variavel que vai receber a lista de quizzes

//Função para iniciar pegar lista do servidor quando conseguir conexão
function Get_Lista(resposta){
    console.log('conectado!');
    Lista_Quizzes = resposta.data;
    const lista = document.querySelector('.Quizz-lista-container');
    lista.innerHTML = '';
    resposta.data.forEach(adicionar_Quizz);
}


function adicionar_Quizz(elemento){
    const lista = document.querySelector('.Quizz-lista-container');

    const id = elemento.id;
    const titulo = elemento.title;
    const img = elemento.image;



        //<img src="https://i.stack.imgur.com/vVbxw.png" alt="erro na imagem">


        lista.innerHTML += 
        `<div class="quizz-container Quizz${id}" onclick="selecionaQuiz(${elemento.id})">
            <p>${titulo}</p>
        </div>`

        const el = document.querySelectorAll('.Quizz'+id);
        const back = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%),url('${img}'), url('https://developers.google.com/static/maps/documentation/maps-static/images/error-image-generic.png')`;
        el.forEach(elemento => elemento.style.backgroundImage = back);
        //  onerror="corrigirImagem(this)"
}

function carregarMemoria(){
    const container = document.querySelector('.criarQuiz-container');
    container.classList.remove('centro','estilo_inicial');
    
    const div1 = document.querySelector('.msg-box');
    div1.classList.add('escondido');

    const div2 = document.querySelector('.Quizz-cadastrados-container');
    div2.classList.remove('escondido');
}

// tela 2 - Página de um Quizz

function selecionaQuiz(id){
    let promessaQuiz = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`);
    promessaQuiz.then(carregaQuiz);
}

function carregaQuiz(resposta){
    document.querySelector(".principal").scrollIntoView();
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
    tela2.innerHTML = `
        <div class="header-Quiz">
            <img src="${imgQuiz}"/>
            <p>${tituloQuiz}</p>
        </div>
    `;
    for (let i = 0; i < perguntas.length; i++) {
        tela2.innerHTML += `
            <div class="container-perguntas nRespondido">
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
    let perguntaAtual = respostas.parentNode;
    perguntaAtual.classList.remove("nRespondido");
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
    let proxPergunta = document.querySelector(".nRespondido");
    if(perguntasRespondidas === perguntas.length){
        fimDeQuiz();
    }else{
        setTimeout(()=>{
            if (perguntasRespondidas < perguntas.length) {
                proxPergunta.scrollIntoView({behavior: "smooth", block: "center"});
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
    setTimeout(()=>{final.scrollIntoView({behavior: "smooth", block: "center"});}, 2000);
}
function reiniciaQuiz(){
    selecionaQuiz(quizAtual.data.id);
}
function voltaHome(){
    let comeco = document.querySelector(".header-Quiz");
    comeco.scrollIntoView();
    tela2.innerHTML = "";
    tela1.classList.remove("escondido");
    tela2.classList.add("escondido");
}
function comparador() { 
	return Math.random() - 0.5; 
}

//Tela 3 - Criação do Quizz


function preencher_pagina3() {
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
        
    <div onclick="validarInfoQuizz()" class="next-step">Prosseguir para criar perguntas</div>`
};

function validarInfoQuizz() {
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
  
    if (!qtdPerguntas.value || isNaN(parseInt(qtdPerguntas.value)) || parseInt(qtdPerguntas.value) < 3) {
      alert('Por favor, informe uma quantidade de perguntas maior ou igual a 3.');
      return;
    }
  
    if (!qtdNiveis.value || isNaN(parseInt(qtdNiveis.value)) || parseInt(qtdNiveis.value) < 2) {
      alert('Por favor, informe uma quantidade de níveis maior ou igual a 2.');
      return;
    }
  
    let perguntasHTML = '';

    for (let i = 1; i <= parseInt(qtdPerguntas.value); i++) {
      let collapsedClass = i > 1 ? 'collapsed' : '';
      perguntasHTML += `
        <div class="create-question ${collapsedClass}">
          <div class="question-header" onclick="toggleQuestion(this)">
            <span>Pergunta ${i}</span>
            <img src="./img.png">
          </div>
          <div class="question-content">
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
      
            <span>Resposta correta</span>
            <input type="text" placeholder="Resposta correta">
            <input type="text" placeholder="URL da imagem">
      
            <span>Respostas incorretas</span>
            <input type="text" placeholder="Resposta incorreta 1">
            <input type="text" placeholder="URL da imagem 1">
            <input type="text" placeholder="Resposta incorreta 2">
            <input type="text" placeholder="URL da imagem 2">
            <input type="text" placeholder="Resposta incorreta 3">
            <input type="text" placeholder="URL da imagem 3">
          </div>
        </div>
      `;
    }
    
    tela3.innerHTML = `
      <span>Crie suas perguntas</span>
      <div class="questions">
        ${perguntasHTML}
      </div>
      <div onclick="validarPerguntas()" class="next-step">Prosseguir para criar níveis</div>
    `;
 }

 function toggleQuestion(questionHeader) {
    const question = questionHeader.parentNode;
    const questionContent = question.querySelector('.question-content');
  
    const allQuestions = document.querySelectorAll('.create-question');
  
    allQuestions.forEach((q) => {
      const qHeader = q.querySelector('.question-header');
      const qContent = q.querySelector('.question-content');
  
      if (q !== question) {
        qHeader.classList.remove('expanded');
        qContent.classList.add('escondido');
        q.classList.add('collapsed');
        q.classList.remove('expanded');
        qHeader.querySelector('img').classList.remove('escondido'); 
      }
    });
  
    if (question.classList.contains('collapsed')) {
      question.classList.remove('collapsed');
      question.classList.add('expanded');
      questionHeader.classList.add('expanded');
      questionContent.classList.remove('escondido');
      questionHeader.querySelector('img').classList.add('escondido'); 
    } else {
      question.classList.remove('expanded');
      question.classList.add('collapsed');
      questionHeader.classList.remove('expanded');
      questionContent.classList.add('escondido');
      questionHeader.querySelector('img').classList.remove('escondido');
    }
  }
  function validarPerguntas() {
    let perguntas = document.querySelectorAll(".create-question");
  
    for (let i = 0; i < perguntas.length; i++) {
      let pergunta = perguntas[i];
  
      let textoPergunta = pergunta.querySelector("input[type='text'][placeholder='Texto da pergunta']").value;
      if (textoPergunta.length < 20) {
        alert("O texto da pergunta " + (i + 1) + " deve ter pelo menos 20 caracteres.");
        return false;
      }
  
      let corFundo = pergunta.querySelector("input[type='text'][placeholder='Cor de fundo da pergunta']").value;
      if (!/^#[0-9A-Fa-f]{6}$/.test(corFundo)) {
        alert("A cor de fundo da pergunta " + (i + 1) + " deve ser uma cor em hexadecimal.");
        return false;
      }
  
      let respostaCorreta = pergunta.querySelector("input[type='text'][placeholder='Resposta correta']").value;
      if (respostaCorreta === "") {
        alert("A resposta correta da pergunta " + (i + 1) + " não pode estar vazia.");
        return false;
      }
  
      let urlImagemCorreta = pergunta.querySelector("input[type='text'][placeholder='URL da imagem']").value;
      if (!isUrlValida(urlImagemCorreta)) {
        alert("A URL da imagem da resposta correta da pergunta " + (i + 1) + " deve ter formato de URL.");
        return false;
      }
  
      let respostasIncorretas = pergunta.querySelectorAll("input[type='text'][placeholder^='Resposta incorreta']");
      let peloMenosUmaRespostaIncorretaPreenchida = false;
  
      for (let j = 0; j < respostasIncorretas.length; j += 2) {
        let respostaIncorreta = respostasIncorretas[j].value;
        if (respostaIncorreta !== "") {
          peloMenosUmaRespostaIncorretaPreenchida = true;
          let urlImagemIncorreta = respostasIncorretas[j + 1].value;
          if (!isUrlValida(urlImagemIncorreta)) {
            alert("A URL da imagem da resposta incorreta da pergunta " + (i + 1) + " deve ter formato de URL.");
            return false;
          }
        }
      }
  
      if (!peloMenosUmaRespostaIncorretaPreenchida) {
        alert("Pelo menos uma resposta incorreta da pergunta " + (i + 1) + " deve estar preenchida.");
        return false;
      }
    }
  
    return true;
  }
  
 
  

  //função para preencher os níveis na tela de cadastro (retorna HTML)
  
  function preencher_cadastro_nivel(qtdNiveis){
    let pagina = `<span>Agora, decida os níveis</span>`
    
    pagina+=`
    <div class="lvl-container">
        <div class="lvl-head" onclick="lvlscroll('lvl1','lvlbtn1')">
            <div>Nível 1</div>   
            <img id= 'lvlbtn1' class='escondido' src="./img.png" alt="caderno">
        </div>
        <div id='lvl1' class="lvl-scroll">
            <textarea placeholder="  Título do nivel"></textarea>
            <textarea placeholder="  % de Acerto mínimo"></textarea>
            <textarea placeholder="  URL da imagem"></textarea>
            <textarea class="big" placeholder="  Descrição do nível"></textarea>
        </div>
    </div>`;

    for(let cont = 2;cont <= qtdNiveis;cont++){
        pagina+= `
        <div class="lvl-container">
            <div class="lvl-head" onclick="lvlscroll('lvl${cont}','lvlbtn${cont}')">
                <div>Nível ${cont}</div>   
                <img id= 'lvlbtn${cont}' src="./img.png" alt="caderno">
            </div>
            <div id='lvl${cont}' class="lvl-scroll lvlHidden">
                <textarea placeholder="  Título do nivel"></textarea>
                <textarea placeholder="  % de Acerto mínimo"></textarea>
                <textarea placeholder="  URL da imagem"></textarea>
                <textarea class="big" placeholder="  Descrição do nível"></textarea>
            </div>
        </div>`;
    }

    pagina+= `
        <div onclick="alert('fim')" class="next-step btn-ajust">Finalizar Quizz</div> 
    `;
    return pagina;
  }
  
  //Função para escrolar texto e desativar botão na página de cadastro do nivel
  function lvlscroll(id,btn){
    const el = document.getElementById(id);
    const icone = document.getElementById(btn);
    el.classList.toggle('lvlHidden');
    icone.classList.toggle('escondido');
  }
  
  //função para validar nível
  function validarNivel(){
    let pagina = document.querySelectorAll('.lvl-scroll');
    let resultado = true;
    let porcentagens = [];
    pagina.forEach(el=>{
        let nivel = el.querySelectorAll('textarea');
        porcentagens.push(nivel[1].value);
        resultado = resultado && (validar_titulo(nivel[0].value))&&(validar_porcentagem(nivel[1].value))&&(validar_url(nivel[2].value))&&(validar_descricao(nivel[3].value));
        console.log(resultado);
    }
    )

    resultado = resultado && validar_lista_porcentagens(porcentagens);
    console.log(resultado);
    console.log(porcentagens);
    return resultado;
  }

  function validar_titulo(titulo){
    if(titulo.length > 19 && titulo.length < 66){
        return true;
    }
    return false;
  }

  function validar_porcentagem(valor){
    if(!(isNaN(valor)) && valor != '' ){
        if(valor >= 0 & valor < 101){
            return true;
        }
    }
    return false;
  }
   function validar_url(url){
    if (url.includes('https')) {
        return true;
    }
    return false;
   }

   function validar_descricao(texto){
    if(texto.length>29){
        return true;
    }
    return false;
   }

   function validar_lista_porcentagens(lista){
    const x = lista.map(Number)
        for(let cont1 = 0; cont1<x;cont1++){
            let elemento = x[cont1];
            let cont2 = cont1+1;
            for(cont2; cont2<x;cont2++){
                let elemento_teste = x[cont2]
                if(elemento_teste == elemento){
                    return false;
                }
            }
        }
        if(x.includes(0)){
            return true;
        }
    return false;
   }
  
  
  



