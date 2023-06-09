axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
const tela1 = document.querySelector(".tela1");
const tela2 = document.querySelector(".tela2");
const tela3 = document.querySelector(".tela3");
let perguntasRespondidas;
let respostasCertas, respostasIncorretas;
let quizAtual;
let titulo, urlImagem, qtdPerguntas, qtdNiveis;
let textoPergunta, corFundo, respostaCorreta, urlImagemCorreta, respostaIncorreta, urlImagemIncorreta;
let novoQuizz = {
  title: "",
  image: "",
  questions: [],
  levels: [],
};

const chave = 'asdfghjl';
let ListaKeys = [];

//Tela 1 - Lista de Quizzes

let quiz;
const promisse = axios.get('https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes');
promisse.then(Get_Lista);
promisse.catch(voltaHome);

let Lista_Quizzes; //Variavel que vai receber a lista de quizzes

//Função para iniciar pegar lista do servidor quando conseguir conexão
function Get_Lista(resposta){
    console.log('conectado!');
    Lista_Quizzes = resposta.data;
    const lista = document.querySelector('.Quizz-lista-container');
    lista.innerHTML = '';
    resposta.data.forEach(adicionar_Quizz);
    getMemoria();
    if(ListaKeys != null){
      carregarMemoria()
    }else{
      let telax = document.querySelector('.msg-box');
      console.log('chegou aqui');
      telax.innerHTML = `Você não criou nenhum quizz ainda :(
        <button data-test="create-btn" onclick="preencher_pagina3()">Criar Quiz</button>`;
    };
}


function adicionar_Quizz(elemento){
    const lista = document.querySelector('.Quizz-lista-container');

    const id = elemento.id;
    const titulo = elemento.title;
    const img = elemento.image;



        //<img src="https://i.stack.imgur.com/vVbxw.png" alt="erro na imagem">


        lista.innerHTML += 
        `<div data-test="others-quiz" class="quizz-container Quizz${id}" onclick="selecionaQuiz(${elemento.id})">
        <img src="${img}" alt="" srcset="" onerror="imagemErrada(this)"/>
        <div class="gradiente">${titulo}</div>
        </div>`
}

function carregarMemoria(){
    const container = document.querySelector('.criarQuiz-container');
    container.classList.remove('centro','estilo_inicial');
    
    const div1 = document.querySelector('.msg-box');
    div1.classList.add('escondido');

    const div2 = document.querySelector('.Quizz-cadastrados-container');
    div2.classList.remove('escondido');

    let caixa1 = document.querySelector('.Quizz-cadastrado-lista');
    caixa1.innerHTML = '';
    ListaKeys.forEach((el,index) => {
      caixa1.innerHTML += `
      <div data-test="my-quiz" class="quizz-container personalQuizz${el.id}" onclick="selecionaQuiz(${el.id})">
        <img src="${el.imagem}" alt="" srcset="" onerror="imagemErrada(this)"/>
        <div class="gradiente">${el.titulo}</div>
      </div>`;
  })
}

// tela 2 - Página de um Quizz

function selecionaQuiz(id){
    let promessaQuiz = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`);
    promessaQuiz.then(carregaQuiz);
}

function carregaQuiz(resposta){
    scrollTo(0,0);
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
        <div data-test="banner" class="header-Quiz">
            <img src="${imgQuiz}"/>
            <p>${tituloQuiz}</p>
        </div>
    `;
    for (let i = 0; i < perguntas.length; i++) {
        tela2.innerHTML += `
            <div data-test="question" class="container-perguntas nRespondido">
                <div data-test="question-title" style="background-color:${perguntas[i].color};"  class="pergunta">${perguntas[i].title}</div>
                <div id ="${i}" class="respostas"></div>
            </div>
        `;
        perguntas[i].answers.sort(comparador);
        for (let j = 0; j < perguntas[i].answers.length; j++) {
            let respostas = document.getElementById(i);
            respostas.innerHTML += `
            <div data-test="answer" onclick="selecionaResposta(this)" class="resposta ${perguntas[i].answers[j].isCorrectAnswer}">
                <img src="${perguntas[i].answers[j].image}"/>
                <p data-test="answer-text">${perguntas[i].answers[j].text}</p>
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
    let minAnterior = -1;
    console.log(acerto);  
    for (let i = 0; i < levels.length; i++) {
        console.log(levels[i].minValue);
        console.log(minAnterior);
        if (acerto >= levels[i].minValue && levels[i].minValue > minAnterior) {
            minAnterior = levels[i].minValue;
            idLevel = i;
        }
    }
    tela2.innerHTML += `
            <div class="container-final">
                <div data-test="level-title" class="level">${acerto}% de acerto: ${levels[idLevel].title}</div>
                <div class="levels-info">
                    <img data-test="level-img" src="${levels[idLevel].image}"/>
                    <p data-test="level-text">${levels[idLevel].text}</p>
                </div>
            </div>
            <button data-test="restart" class="reiniciar" onclick="reiniciaQuiz()">Reiniciar Quizz</button>
            <button data-test="go-home" class="voltar" onclick="voltaHome()">Voltar pra home</button>
    `;
    let final = document.querySelector(".container-final");
    setTimeout(()=>{final.scrollIntoView({behavior: "smooth", block: "center"});}, 2000);
    let cadaResposta = document.querySelectorAll(".resposta");
    for (let k = 0; k < cadaResposta.length; k++) {
        cadaResposta[k].onclick = false;
    }
}
function reiniciaQuiz(){
    selecionaQuiz(quizAtual.data.id);
}
function voltaHome(){
    scrollTo(0,0);
    window.location.reload();
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
        <input data-test="title-input" type="text" placeholder="Título do seu quizz">
        <input data-test="img-input" type="text" placeholder="URL da imagem do seu quizz">
        <input data-test="questions-amount-input" type="text" placeholder="Quantidade de perguntas do quizz">
        <input data-test="levels-amount-input" type="text" placeholder="Quantidade de níveis do quizz">
    </div>
        
    <div data-test="go-create-questions" onclick="validarInfoQuizz()" class="next-step">Prosseguir para criar perguntas</div>`
};

function validarInfoQuizz() {
   titulo = document.querySelector('input[placeholder="Título do seu quizz"]');
   urlImagem = document.querySelector('input[placeholder="URL da imagem do seu quizz"]');
   qtdPerguntas = document.querySelector('input[placeholder="Quantidade de perguntas do quizz"]');
   qtdNiveis = document.querySelector('input[placeholder="Quantidade de níveis do quizz"]');
  
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
      let collapsedClass = i > 1 ? 'collapsed' : 'expanded';
      perguntasHTML += `
        <div data-test="question-ctn" class="create-question ${collapsedClass}">
          <div class="question-header" onclick="toggleQuestion(this)">
            <span>Pergunta ${i}</span>
            <img data-test="toggle" src="./img.png">
          </div>
          <div class="question-content">
            <input data-test="question-input" type="text" placeholder="Texto da pergunta">
            <input data-test="question-color-input" type="text" placeholder="Cor de fundo da pergunta">
      
            <span>Resposta correta</span>
            <input data-test="correct-answer-input" type="text" placeholder="Resposta correta">
            <input data-test="correct-img-input" type="text" placeholder="URL da imagem">
      
            <span>Respostas incorretas</span>
            <input data-test="wrong-answer-input" type="text" placeholder="Resposta incorreta 1">
            <input data-test="wrong-img-input" type="text" placeholder="URL da imagem 1">
            <input data-test="wrong-answer-input" type="text" placeholder="Resposta incorreta 2">
            <input data-test="wrong-img-input" type="text" placeholder="URL da imagem 2">
            <input data-test="wrong-answer-input" type="text" placeholder="Resposta incorreta 3">
            <input data-test="wrong-img-input" type="text" placeholder="URL da imagem 3">
          </div>
        </div>
      `;
    }
    
    tela3.innerHTML = `
      <span>Crie suas perguntas</span>
      <div class="questions">
        ${perguntasHTML}
      </div>
      <div data-test="go-create-levels" onclick="validarPerguntas()" class="next-step">Prosseguir para criar níveis</div>
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
      if (!q.classList.contains('initialized')) {
        q.classList.add('collapsed');
        qHeader.querySelector('img').classList.remove('escondido');
      }
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
    novoQuizz.questions = [];

    for (let i = 0; i < perguntas.length; i++) {
      let pergunta = perguntas[i];
      let questions = {
        title:"",
        color: "",
        answers:[],
      };

      textoPergunta = pergunta.querySelector("input[type='text'][placeholder='Texto da pergunta']").value;
      if (textoPergunta.length < 20) {
        alert("O texto da pergunta " + (i + 1) + " deve ter pelo menos 20 caracteres.");
        return false;
      }

      corFundo = pergunta.querySelector("input[type='text'][placeholder='Cor de fundo da pergunta']").value;
      if (!/^#[0-9A-Fa-f]{6}$/.test(corFundo)) {
        alert("A cor de fundo da pergunta " + (i + 1) + " deve ser uma cor em hexadecimal.");
        return false;
      }

      respostaCorreta = pergunta.querySelector("input[type='text'][placeholder='Resposta correta']").value;
      if (respostaCorreta === "") {
        alert("A resposta correta da pergunta " + (i + 1) + " não pode estar vazia.");
        return false;
      }

      urlImagemCorreta = pergunta.querySelector("input[type='text'][placeholder='URL da imagem']").value;
      if (!urlImagemCorreta || !/^(ftp|http|https):\/\/[^ "]+$/.test(urlImagemCorreta)) {
        alert("A URL da imagem da resposta correta da pergunta " + (i + 1) + " deve ter formato de URL.");
        return false;
      }
      let answerCorreta = {
        text: "",
        image: "",
        isCorrectAnswer: true,
      }
      questions.answers = [];
      questions.title = textoPergunta;
      questions.color = corFundo;
      answerCorreta.text = respostaCorreta;
      answerCorreta.image = urlImagemCorreta;
      questions.answers.push(answerCorreta);

      respostasIncorretas = pergunta.querySelectorAll("input[type='text'][placeholder^='Resposta incorreta']");
      let temRespostaIncorreta = false;

      for (let j = 0; j < respostasIncorretas.length; j++) {
        console.log(j);
        let answerErrada = {
          text: "",
          image: "",
          isCorrectAnswer: false,
        }
        let respostaIncorreta = respostasIncorretas[j].value;
        if (respostaIncorreta !== "") {
          temRespostaIncorreta = true;
          urlImagemIncorreta = respostasIncorretas[j].nextElementSibling.value;
          console.log(urlImagemIncorreta);
          if (!urlImagemIncorreta || !/^(ftp|http|https):\/\/[^ "]+$/.test(urlImagemIncorreta)) {
            alert("A URL da imagem da resposta incorreta da pergunta " + (i + 1) + " deve ter formato de URL.");
            return false;
          }
          answerErrada.text = respostaIncorreta;
          answerErrada.image = urlImagemIncorreta;
          questions.answers.push(answerErrada);
        }
      }      

      if (!temRespostaIncorreta) {
        alert("Pelo menos uma resposta incorreta da pergunta " + (i + 1) + " deve estar preenchida.");
        return false;
      }
      novoQuizz.questions.push(questions);
    }

   let pagina3 = preencher_cadastro_nivel(qtdNiveis.value);
   tela3.innerHTML = pagina3;
  }
  //função para preencher os níveis na tela de cadastro (retorna HTML)
  
  function preencher_cadastro_nivel(qtdNiveis){
    pagina = `<span>Agora, decida os níveis</span>`
    
    for (let i = 1; i <= qtdNiveis; i++) {
      let collapsedClass = i > 1 ? 'collapsed' : 'expanded';
      pagina += `
        <div data-test="level-ctn" class="create-question ${collapsedClass}">
          <div class="question-header" onclick="toggleQuestion(this)">
            <span>Nível ${i}</span>
            <img data-test="toggle" src="./img.png">
          </div>
          <div class="question-content">
            <input data-test="level-input" type="text" placeholder="Título do nível">
            <input data-test="level-percent-input" type="number" placeholder="% de acerto mínima" id="quantity${i}" name="qunatity${i}" min="0" max="100">
            <input data-test="level-img-input" type="text" placeholder="URL da imagem">
            <textarea data-test="level-description-input" placeholder='Descrição do nível' class='big'></textarea>
          </div>
        </div>
      `;
    }
    pagina+= `
        <div data-test="finish" onclick="validarNivel()" class="next-step btn-ajust">Finalizar Quizz</div> 
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
    let pagina = document.querySelectorAll('.question-content');
    let resultado = true;
    let porcentagens = [];
    pagina.forEach(el=>{
        let nivel_lista = el.querySelectorAll('input');

        let descricao_nivel = el.querySelector('textarea').value;
        let titulo_nivel = nivel_lista[0].value;
        let porcentagem_nivel = nivel_lista[1].value;
        let URL_nivel = nivel_lista[2].value;

        let nivel = el.querySelectorAll('input');
        porcentagens.push(porcentagem_nivel);
        resultado = resultado && (validar_titulo(titulo_nivel))&&(validar_porcentagem(porcentagem_nivel))&&(validar_url(URL_nivel))&&(validar_descricao(descricao_nivel));
        console.log(resultado);
    }

    )

    resultado = resultado && validar_lista_porcentagens(porcentagens);
    console.log(resultado);
    console.log(porcentagens);
    if(resultado){
      finalizaQuizz()
    }else{
      alert('Alguns itens não estão preenchidos corretamente, corrija para prosseguir');
    }
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

// tela 3.4
function finalizaQuizz(){
  objNiveis();
  novoQuizz.image = urlImagem.value;
  novoQuizz.title = titulo.value;
  console.log(novoQuizz);
  let promessaNovoQuiz = axios.post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes", novoQuizz);
  promessaNovoQuiz.then(carregaQuizzPronto);
}
function carregaQuizzPronto(resposta){
  console.log(resposta);
  let novoQuizzResposta = resposta;
  let quizzCriado = {id:novoQuizzResposta.data.id,key:novoQuizzResposta.data.key,imagem:novoQuizzResposta.data.image, titulo: novoQuizzResposta.data.title};
  guardarNaMemoria(quizzCriado);
  tela3.innerHTML = `
    <p class="textoFinal">Seu quizz está pronto!</p>
    <div data-test="success-banner" class="quizzFinalizado" onclick="selecionaQuiz(${resposta.data.id})">
      <img src="${urlImagem.value}"/>
      <p>${titulo.value}</p>
    </div>
    <button data-test="go-quiz" class="reiniciar" onclick="selecionaQuiz(${resposta.data.id})">Acessar Quizz</button>
    <button data-test="go-home" class="voltar" onclick="voltaHome()">Voltar pra home</button>
  `;
}

function guardarNaMemoria(objeto){
  let ListaMemoria = JSON.parse(localStorage.getItem(chave));
  if(ListaMemoria == null){
    ListaMemoria=[];
  }
  ListaMemoria.push(objeto);
  localStorage.setItem(chave,JSON.stringify(ListaMemoria))
  getMemoria();
}

function getMemoria(){
  ListaKeys = JSON.parse(localStorage.getItem(chave));
  console.log(ListaKeys);
}

function pegarLista(){
  if (localStorage.getItem(chave) == null) {
    console.log('criando registro local');
    const modelo = [];
    localStorage.setItem(chave, JSON.stringify(modelo));
  };
  
  if (localStorage.getItem(chave) == '') {
    return localStorage.getItem(chave);
  } else {
    return JSON.parse(localStorage.getItem(chave));
  }
  
}

  
function preencher_tela1(){
  titulo = document.querySelector('input[placeholder="Título do seu quizz"]');
  urlImagem = document.querySelector('input[placeholder="URL da imagem do seu quizz"]');
  qtdPerguntas = document.querySelector('input[placeholder="Quantidade de perguntas do quizz"]');
  qtdNiveis = document.querySelector('input[placeholder="Quantidade de níveis do quizz"]');

  titulo.value = "Teste do Sonic de novo, SORRY";
  urlImagem.value = "https://play-lh.googleusercontent.com/4F-WwVKAs56rT6DGSfu1-9sW4MqSjenlIUqWS1K_8iB25ktsHKXXScAwJonvwo7DuMA";
  qtdPerguntas.value = 3;
  qtdNiveis.value = 3;
}
function preencher_tela2(){
  let perguntas = document.querySelectorAll(".create-question");

  for (let i = 0; i < perguntas.length; i++) {
    let lista = perguntas[i].querySelectorAll("input");
    lista[0].value = `titulo da pergunta ${i} COm mais de 20 caracteres`;
    lista[1].value = "#1e1eff";
    lista[2].value = "Titulo da resposta correta";
    lista[3].value = 'https://segredosdomundo.r7.com/wp-content/uploads/2020/08/sonic-origem-historia-e-curiosidades-sobre-o-velocista-4.jpg';
    lista[4].value = "Titulo da resposta errada";
    lista[5].value = 'https://i.kym-cdn.com/entries/icons/original/000/009/798/sanichedgehog.jpg';
  }
}
function preencher_tela3(){
  let pagina = document.querySelectorAll('.question-content');
  pagina.forEach((el,index)=>{
      let nivel_lista = el.querySelectorAll('input');

      let descricao_nivel = el.querySelector('textarea');
      let titulo_nivel = nivel_lista[0];
      let porcentagem_nivel = nivel_lista[1];
      let URL_nivel = nivel_lista[2];
      descricao_nivel.value = "Descrição do nivel que é um valor meio grande então estou escrevendo qualquer coisa só para ocupar espaço"
      titulo_nivel.value = "titulo do nivel x com mais de 20 caracteres"
      porcentagem_nivel.value = index;
      URL_nivel.value = "https://i.pinimg.com/originals/a4/63/fb/a463fbb24303a7f39d0cdbb65f014c00.png";
  }
  )
}

function preencher_tudo(){
  preencher_tela1();
  validarInfoQuizz();
  preencher_tela2();
  validarPerguntas();
  preencher_tela3();
}
function objNiveis(){
  let pagina = document.querySelectorAll('.question-content');
  pagina.forEach((el,index)=>{
      let nivel = {
        title: "",
			  image: "",
			  text: "",
			  minValue: 0
      }
      let nivel_lista = el.querySelectorAll('input');

      let descricao_nivel = el.querySelector('textarea').value;
      let titulo_nivel = nivel_lista[0].value;
      let porcentagem_nivel = nivel_lista[1].value;
      let URL_nivel = nivel_lista[2].value;
      nivel.title = titulo_nivel;
      nivel.image = URL_nivel;
      nivel.text = descricao_nivel;
      nivel.minValue = Number(porcentagem_nivel);
      novoQuizz.levels.push(nivel);
  }
  )
}

function LimparMemoria(){
  localStorage.setItem(chave, null);
  getMemoria();
}

function imagemErrada(img){
  img.src = "https://i.stack.imgur.com/vVbxw.png";
}