const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },

    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },

    actions: {
        button: document.getElementById('next-duel'),
    },

    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1, 5, 7],
        loseOf: [2, 4, 8],
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2, 4, 8],
        loseOf: [0, 3, 6],
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0, 3, 6],
        loseOf: [1, 5, 7],
    },

    {
        id: 3,
        name: "Mistycal ELf",
        type: "Paper",
        img: `${pathImages}elf.png`,
        winOf: [1, 5, 7],
        loseOf: [2, 4, 8],
    },

    {
        id: 4,
        name: "Dark Magician Girl",
        type: "Scissors",
        img: `${pathImages}magician-girl.png`,
        winOf: [0, 3, 6],
        loseOf: [1, 5, 7],
    },

    {
        id: 5,
        name: "Time Wizard",
        type: "Rock",
        img: `${pathImages}time-wizard.png`,
        winOf: [2, 4, 8],
        loseOf: [0, 3, 6],
    },

    {
        id: 6,
        name: "Summoned Skull",
        type: "Paper",
        img: `${pathImages}skull.png`,
        winOf: [1, 5, 7],
        loseOf: [2, 4, 8],
    },

    {
        id: 7,
        name: "Giant Soldier of Stone",
        type: "Rock",
        img: `${pathImages}giant.png`,
        winOf: [2, 4, 8],
        loseOf: [0, 3, 6],
    },

    {
        id: 8,
        name: "Harpie Lady",
        type: "Scissors",
        img: `${pathImages}harpie-lady.png`,
        winOf: [0, 3, 6],
        loseOf: [1, 5, 7],
    },
    
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;

}



async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
    state.actions.button.style.visibility = "visible";
    state.actions.button.innerText = text;

}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}


async function ShowHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomCardId = await getRandomCardId();
        const cardImage = await createCardImage(randomCardId, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.visibility = "hidden";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";

    init();
}

async function playAudio(status) {
    let audio = new Audio(`./src/assets/audios/${status}.wav`);
    ;
    try {
        audio.play();
    } catch { };
}

function init() {

    ShowHiddenCardFieldsImages(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5;
    bgm.play();
}

init();