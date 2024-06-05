import './normalize.css';
import './index.html';
import './style.css';
import './cards.js';
import "@babel/polyfill";
import cards from "./cards";


let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.menu');
let popup = document.querySelector('.wrapperPopup');
let dontShowAgainCheckbox = document.getElementById('dontShowAgain');
let closePopupButton = document.getElementById('closePopup');
closePopupButton.addEventListener('click', closePopup);
let overlay = document.createElement('div');
let playPanel = document.querySelector('.playPanel');
let startGameBtn = document.querySelector('.startGame');
let repeatSoundBtn = document.querySelector('.repeatSound');
let starsBlock = document.querySelector('.stars');
let audioRight = document.getElementById('audioRight');
let audioWrong = document.getElementById('audioWrong');

let lastWord = null;
let lastAudio = null;

overlay.classList.add('overlay');
document.body.appendChild(overlay);


function toggleMenu() {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
}

function closeMenu() {
    menu.classList.remove('active');
    menuBtn.classList.remove('active');
}

function openPlayPanel() {
    playPanel.classList.add('enable');
}

function removePlayPanel() {
    playPanel.classList.remove('enable');
}

function collapseCards() {
    document.querySelectorAll('.cardsItem').forEach(e => e.classList.add('collapsed'));
}

function expandCards() {
    document.querySelectorAll('.cardsItem').forEach(e => e.classList.remove('collapsed'));
}

menuBtn.addEventListener('click', function () {
    toggleMenu();
});

document.addEventListener('click', function (e) {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleMenu();
    }
});
const cardsContainer = document.querySelector('.cardsContainer');
const cardsMappings = [];
let cardSections = cards[0];

for (let i = 0; i < cardSections.length; i++) {
    cardsMappings[i] = {title: cardSections[i], items: cards[i + 1]};
}

function renderContent() {
    let hash = window.location.hash;
    if (hash.startsWith('#section-')) {
        let sectionIndex = hash.substring(9);
        renderCards(sectionIndex);
        if (getCurrentMode() === "play") {
            openPlayPanel();
        }
    } else {
        renderSections();
        removePlayPanel();
    }
}

function renderSections() {
    cardsContainer.innerHTML = '';
    for (let i = 0; i < cardsMappings.length; i++) {
        let mapping = cardsMappings[i]
        let cardsItem = document.createElement('div');
        cardsItem.classList.add('cardsItem');
        cardsItem.innerHTML = `
            <a class="linkCard" href="#section-${i}">
                <div class="cardsImage cardsImageAction">
                    <img src="assets/${mapping.items[0].image}"  alt="img" width="240px" ">
                </div>
                <div class="cardsTitle">${mapping.title}</div>
            </a>
        `
        cardsContainer.append(cardsItem);
    }
}

function getCurrentMode() {
    return localStorage.getItem("playMode");
}

function checkUserChoiceForWord(card) {
    let starItem = document.createElement('span');
    if (lastWord === card.word) {
        starItem.classList.add('correctAnswer');
        audioRight.play();
        lastWord = null;
        document.getElementById(`card-${card.word}`).classList.add('inactiveCard');
    } else {
        starItem.classList.add('wrongAnswer');
        audioWrong.play();
    }
    starsBlock.append(starItem);
}

function renderCards(sectionIndex) {
    cardsContainer.innerHTML = '';
    if (sectionIndex >= 0 && sectionIndex < cardsMappings.length) {
        for (let card of cardsMappings[sectionIndex].items) {
            let cardsItem = document.createElement('div');
            let audioImageId = `myImageForAudio-${card.word}`;
            let audioId = `myAudio-${card.word}`;
            let cardsRotateId = `rotateId-${card.word}`;
            //let containerRotate = `containerRotate-${card.word}`;
            let cardItemId = `card-${card.word}`;
            let imageId = `image-${card.word}`;
            cardsItem.classList.add('cardsItem');
            if (getCurrentMode() === "play") {
               cardsItem.classList.add("collapsed")
            }
            cardsItem.setAttribute("id", cardItemId)
            cardsItem.innerHTML = `
                <div class="cardContent">
                    <div class="front">
                        <div class="cardsImage cardsImageActionOne">
                            <img id="${imageId}" class="imgDescription" src="assets/${card.image}" alt="img" >
                        </div>
                        <div class="bottomInfo">
                            <div class="soundBtn">
                                <img id="${audioImageId}" src="assets/img/audio.png" width="30px" height="30px">
                            </div>
                            <audio id="${audioId}">
                                <source src="assets/${card.audioSrc}" type="audio/mp3">
                            </audio>
                            <div class="cardsTitleOne">${card.word}</div>
                            <div class="infoBtn">
                                <img id="${cardsRotateId}" src="assets/img/rotate.png" width="30px" height="30px">
                            </div>
                        </div>
                    </div>
                    <div class="back">
                        <div class="cardsImage cardsImageActionOne">
                            <img class="imgDescription" src="assets/${card.image}" alt="img">
                        </div>
                        <div class="bottomInfo">
                            <div class="cardsTitleOne">${card.translation}</div>
                            <div class="infoBtn">
                                <img id="${cardsRotateId}-back" src="assets/img/rotate.png" width="30px" height="30px">
                            </div>
                        </div>
                    </div>
                </div>
            `
            cardsContainer.append(cardsItem);
            document.getElementById(cardsRotateId).addEventListener('click',
                () => document.getElementById(cardItemId).classList.add("rotate"));
            document.getElementById(cardsRotateId + "-back").addEventListener('click',
                () => document.getElementById(cardItemId).classList.remove("rotate"));
            document.getElementById(audioImageId).addEventListener('click',
                () => document.getElementById(audioId).play());
            document.getElementById(imageId).addEventListener('click', (event) => {
                let cardItem = event.target.closest(".cardsItem");
                if (lastWord != null && !cardItem.classList.contains("inactiveCard")) {
                    checkUserChoiceForWord(card);
                }
            });
        }
    } else {
        window.location.hash = '';
    }
}

renderContent()
window.addEventListener('hashchange', () => {
    renderContent()
    closeMenu()
    resetGame();
});

function isSectionPageOpen() {
    let hash = window.location.hash;
    return hash.startsWith('#section-')
}

function infoPopupShouldBeShown() {
    let dontShowPopup = localStorage.getItem('dontShowPopup');
    return !(dontShowPopup === 'true');
}

function openInfoPopup() {
    overlay.style.display = 'block';
    popup.classList.remove('hidden')
}

function closePopup() {
    if (dontShowAgainCheckbox.checked) {
        localStorage.setItem('dontShowPopup', 'true');
    }
    overlay.style.display = 'none';
    popup.classList.add('hidden');
}

let playSwitch = document.getElementById('switchInput');
if (getCurrentMode() === "play") {
    playSwitch.checked = true;
}

function resetGame() {
    starsBlock.innerHTML = '';
    startGameBtn.classList.remove('disabled');
    repeatSoundBtn.classList.add('disabled');
    lastWord = null;
    lastAudio = null;
}

playSwitch.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('alternate-background');
        if (isSectionPageOpen()) {
            openPlayPanel();
            collapseCards();
        } else if (infoPopupShouldBeShown()) {
            openInfoPopup()
        }
    } else {
        document.body.classList.remove('alternate-background');
        removePlayPanel();
        expandCards();
        resetGame();
    }
    localStorage.setItem("playMode", this.checked ? "play" : "train");
});

/*play*/
let currentGameCards;
function startGame() {
    let hash = window.location.hash;
    let sectionIndex = hash.substring(9);
    if (sectionIndex >= 0 && sectionIndex < cardsMappings.length) {
        currentGameCards = Array.from(cardsMappings[sectionIndex].items);
    }
    startGameBtn.classList.add('disabled');
    repeatSoundBtn.classList.remove('disabled');
    continueGame();
}

function playRandomAudio() {
    const randomIndex = Math.floor(Math.random() * currentGameCards.length);
    let randomCard = currentGameCards[randomIndex];
    lastWord = randomCard.word;
    lastAudio = new Audio("assets/" + randomCard.audioSrc);
    // noinspection JSIgnoredPromiseFromCall
    lastAudio.play();
    currentGameCards.splice(randomIndex, 1);
}

/*Доделать*/
function continueGame() {
    if (currentGameCards === undefined || currentGameCards.length === 0) {
        alert("Finished");
    } else {
        playRandomAudio();
    }
}

function repeatRandomAudio() {
    if (lastAudio) {
        lastAudio.play();
    }
}

startGameBtn.addEventListener('click', startGame);
repeatSoundBtn.addEventListener('click', repeatRandomAudio);
audioRight.addEventListener('ended', continueGame);
