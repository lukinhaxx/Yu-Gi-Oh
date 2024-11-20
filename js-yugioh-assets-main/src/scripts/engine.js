// Objeto que armazena o estado do jogo, incluindo pontuação, sprites das cartas e elementos do DOM
const state = {
    score: {
        // Pontuações do jogador e do computador
        playerScore: 0,
        computerScore: 0,
        // Referência ao elemento HTML que exibe os pontos
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        // Referências aos elementos de imagem, nome e tipo da carta exibida
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        // Referências aos elementos onde as cartas dos jogadores são exibidas
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        // Referências aos lados dos jogadores e seus elementos de container
        player1: 'player-cards',
        player1Box: document.querySelector("#player-cards"),
        computer: 'computer-cards',
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        // Referência ao botão para avançar para o próximo duelo
        button: document.getElementById('next-duel'),
    },
};

// Caminho para os ícones usados nas cartas
const pathImages = "./src/assets/icons/";

// Dados das cartas disponíveis no jogo
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon", // Nome da carta
        type: "Paper", // Tipo da carta
        img: `${pathImages}dragon.png`, // Caminho da imagem
        winOf: [1], // ID das cartas que esta carta vence
        loseOf: [2], // ID das cartas que esta carta perde
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

// Função para obter um ID de carta aleatório
async function getRandomCardId() {
    // Gera um índice aleatório com base no número de cartas disponíveis
    const randomIndex = Math.floor(Math.random() * cardData.length);
    // Retorna o ID da carta correspondente
    return cardData[randomIndex].id;
}

// Função para criar uma imagem de carta com base no ID e lado
async function createCardImage(IdCard, fieldSide) {
    // Cria um elemento de imagem para representar a carta
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px"); // Define a altura
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png"); // Define a imagem de fundo
    cardImage.setAttribute("data-id", IdCard); // Associa o ID da carta
    cardImage.classList.add("card"); // Adiciona uma classe CSS para estilização

    // Se o lado for o jogador, adiciona eventos de mouse
    if (fieldSide === state.playerSides.player1) {
        // Mostra os detalhes da carta ao passar o mouse
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });

        // Seleciona a carta ao clicar
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        
    }

    // Retorna a imagem da carta criada
    return cardImage;
}

// Função para exibir as cartas no campo de duelo
async function setCardsField(cardId) {
    // Remove todas as cartas atualmente exibidas
    await removeAllCardsImages();

    // Gera uma carta aleatória para o computador
    let computerCardId = await getRandomCardId();

    await drawCardsInField(cardId, computerCardId);
    await ShowHiddenCardFieldsImages(true);    
    await hiddenCardDetails();
    
    // Verifica o resultado do duelo (a lógica não está implementada aqui)
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function drawCardsInField(cardId, computerCardId) {
    // Define as imagens das cartas com base nos IDs
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}


async function ShowHiddenCardFieldsImages(value) {
    
    if(value === true){
         // Exibe as cartas do jogador e do computador
         state.fieldCards.player.style.display = "block";
         state.fieldCards.computer.style.display = "block";
    }
    if(value === false){

    }
    
}

async function hiddenCardDetails() {
    
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block"; 
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.
        playerScore} | Lose ${state.score.computerScore}`;
    
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";

    // Obtém os objetos de carta com base nos IDs fornecidos
    let playerCard = cardData[playerCardId];
    let computerCard = cardData[computerCardId];

    // Verifica se o jogador venceu
    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    // Verifica se o jogador perdeu
    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}


// Função para remover todas as imagens de cartas
async function removeAllCardsImages() {
    // Obtém os elementos do jogador e do computador
    let { player1Box, computerBox } = state.playerSides;

    // Remove todas as imagens de cartas do lado do computador
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    // Remove todas as imagens de cartas do lado do jogador
    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// Função para exibir os detalhes da carta selecionada
async function drawSelectedCard(index) {
    // Atualiza os elementos de sprite com os dados da carta
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "attribute " + cardData[index].type;
}

// Função para desenhar as cartas no lado especificado
async function drawCards(cardNumbers, fieldSide) {
    // Repete para criar o número de cartas solicitado
    for (let i = 0; i < cardNumbers; i++) {
        // Gera um ID de carta aleatório
        const randomIdCards = await getRandomCardId();
        // Cria a imagem da carta
        const cardImage = await createCardImage(randomIdCards, fieldSide);
        // Adiciona a carta ao container do lado especificado
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}


async function resetDuel() {
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";


    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    
    try{
        audio.play();
    }catch{

    }
    
}

// Função inicial para configurar o jogo
function init() {
    
    ShowHiddenCardFieldsImages(false);
    

    // Desenha 5 cartas no lado do jogador
    drawCards(5, state.playerSides.player1);
    // Desenha 5 cartas no lado do computador
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

// Chama a função de inicialização ao carregar o script
init();
