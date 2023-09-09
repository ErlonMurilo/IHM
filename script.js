window.addEventListener('load', function() {
    resetGame();    
});

const questionCards = document.querySelectorAll('.question-card');
const answerCards = document.querySelectorAll('.answer-card');
var meuAudioErro = document.getElementById('meuAudioErro');
var meuAudioAcerto = document.getElementById('meuAudioAcerto');
var listaPerguntas = [];
var posicaoCartas = ['a','b','c','d','e','f'];
var listaNum =[];

meuAudioErro.volume=0.5;

let selectedQuestion = null;
let selectedAnswer = null;

// Mapeamento das perguntas e respostas corretas
const correctAnswers = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f'
};

function resetCards(cards) {
    cards.forEach(card => {
        card.classList.add('normal');
        card.classList.remove('matched', 'selected', 'wrong');
    });
}

function checkMatch() {
    if (selectedQuestion && selectedAnswer) {
        const questionNumber = selectedQuestion.dataset.card;
        const answerNumber = selectedAnswer.dataset.card;

        if (correctAnswers[questionNumber] === answerNumber) {
            meuAudioAcerto.play();
            selectedQuestion.classList.add('matched');
            selectedAnswer.classList.add('matched');
            selectedQuestion = null;
            selectedAnswer = null;
        } else {
            meuAudioErro.play();
            selectedQuestion.classList.add('wrong');
            selectedAnswer.classList.add('wrong');

            // Remover classe temporária após um período
            setTimeout(() => {
                resetCards([selectedQuestion, selectedAnswer]);
                selectedQuestion = null;
                selectedAnswer = null;
            }, 2500); // Tempo em milissegundos (1 segundo)
        }
    }
}

questionCards.forEach(questionCard => {
    questionCard.addEventListener('click', () => {
        if (!selectedQuestion && !questionCard.classList.contains('matched')) {
            selectedQuestion = questionCard;
            selectedQuestion.classList.add('selected');
            checkMatch();
        }
    });
});

answerCards.forEach(answerCard => {
    answerCard.addEventListener('click', () => {
        if (!selectedAnswer && !answerCard.classList.contains('matched')) {
            selectedAnswer = answerCard;
            selectedAnswer.classList.add('selected');
            checkMatch();
        }
    });
});

// Adicionar código para o botão de reiniciar
const resetButton = document.getElementById('reset-button');


async function resetGame() {
    // Remover todas as classes e redefinir o estado dos cartões
    resetCards(questionCards);
    resetCards(answerCards);

    // Limpar seleções
    selectedQuestion = null;
    selectedAnswer = null;

    // Buscar perguntas aleatórias da API
    const randomQuestions = await fetchRandomQuestions();

    const listaDePerguntasERespostas = [];

    console.log(randomQuestions);

    // Itere sobre cada objeto no JSON e adicione-o à lista
    randomQuestions.forEach(item => {
        if(item != null){
            const pergunta = item.pergunta;
            const resposta = item.resposta;
            const id = item.id;
            listaDePerguntasERespostas.push({ pergunta, resposta, id });
        }
    });

    // Agora, "listaDePerguntasERespostas" é uma lista de objetos JavaScript
    console.log(listaDePerguntasERespostas);

    if (listaDePerguntasERespostas && listaDePerguntasERespostas.length >= 5) {
        // Preencher os cartões com as perguntas e respostas aleatórias
        for (let i = 0; i < 6; i++) {
            if(listaPerguntas.length>=48){
                console.log("ja usou todas as perguntas")
                break;
            }
            
            var status = true;
            
            var numeroAleatorio = Math.floor(Math.random() * (48 - 0 + 1)) + 0;
            console.log(listaPerguntas);
            console.log("primeiro:"+numeroAleatorio);
            
            while (status) {
                console.log('entrou')
                console.log(numeroAleatorio)
                if(listaPerguntas.includes(numeroAleatorio)){
                    console.log(numeroAleatorio +'repetido')
                    numeroAleatorio = Math.floor(Math.random() * (48 - 0 + 1)) + 0;
                    console.log(numeroAleatorio +'novo')
                }else{
                    console.log("terceiro:"+numeroAleatorio);
                    status=false;
                }

                console.log("segundo:"+numeroAleatorio);
            }

            listaPerguntas.push(numeroAleatorio);
            console.log(listaPerguntas);

            
            var status2=true;

            console.log("----------")

            console.log("listaNum =",listaNum);

            var numeroAleatorio2 = Math.floor(Math.random() * (5 - 0 + 1)) + 0;

            console.log(numeroAleatorio2);

            while (status2) {
                if(listaNum.includes(numeroAleatorio2)){
                    numeroAleatorio2 = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
                }else{
                    listaNum.push(numeroAleatorio2);
                    status2 = false;
                }
            } 
            console.log("listaNum =",listaNum);
            console.log("logo ",i)

            const questionCard = document.querySelector('#question-'+i);
            const answerCard = document.querySelector('#answer-'+numeroAleatorio2);
            const dado = listaDePerguntasERespostas[numeroAleatorio];

            answerCards[numeroAleatorio2].setAttribute('data-card', posicaoCartas[i]);
            
            questionCard.textContent = dado.pergunta;
            answerCard.textContent = dado.resposta;
        }
    }

    listaNum=[];
}

// function embaralharCartas(){
//     var listaNum =[];
//     console.log(listaNum);
//     var status=true;
//     console.log(answerCards);
//     console.log(answerCards.length)

//     answerCards.forEach(function(elemento) {
//         console.log('oi')
//         console.log(elemento)
//         var numeroAleatorio = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
//         console.log(numeroAleatorio)
//         while (status) {
//             if(listaNum.includes(numeroAleatorio)){
//                 numeroAleatorio = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
//             }else{
//                 elemento.setAttribute('data-card', posicaoCartas[numeroAleatorio]);
//                 listaNum.push(numeroAleatorio);
//                 status = false;
//             }
//         }    
//     });
// }

resetButton.addEventListener('click', resetGame);

const muteButton = document.getElementById('mute-button');
let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;

    // Toggle the mute symbol on the button
    muteButton.textContent = isMuted ? '🔇' : '🔊';

    // Mute or unmute the audio elements
    meuAudioErro.muted = isMuted;
    meuAudioAcerto.muted = isMuted;
}

muteButton.addEventListener('click', toggleMute);

async function fetchRandomQuestions() {
    const api_Url = 'https://projeto-ihm-c4daf-default-rtdb.firebaseio.com/questoes/.json';
    
    try {
        const response = await fetch(api_Url);
        if (!response.ok) {
            throw new Error('Erro ao buscar perguntas da API');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}