import './normalize.css';
import './index.html';
import './style.css';
import './cards.js';
import "@babel/polyfill";
import cards from "./cards";


let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.menu');
menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
})

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
        renderCards(sectionIndex)
    } else {
        renderSections();
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
                    <img src="assets/${mapping.items[0].image}"  alt="img">
                </div>
                <div class="cardsTitle">${mapping.title}</div>
            </a>
        `
        cardsContainer.append(cardsItem);
    }
}

function renderCards(sectionIndex) {
    cardsContainer.innerHTML = '';
    if (sectionIndex >= 0 && sectionIndex < cardsMappings.length) {
        for (let card of cardsMappings[sectionIndex].items) {
            let cardsItem = document.createElement('div');
            let audioImageId = `myImageForAudio-${card.word}`;
            let audioId = `myAudio-${card.word}`;
            cardsItem.classList.add('cardsItem');
            cardsItem.innerHTML = `
                <a class="linkCard">
                    <div class="cardsImage cardsImageActionOne">
                        <img  class="imgDescription" src="assets/${card.image}"  alt="img">
                    </div>
                    <div class="bottomInfo">
                    <div class="soundBtn"><img id="${audioImageId}" src="assets/img/audio.png" width="30px" height="30px"></div>
                    <audio id="${audioId}">
                    <source src="assets/${card.audioSrc}" type="audio/mp3">
                     </audio>
                    <div class="cardsTitleOne">${card.word}</div>
                    <div class="infoBtn"><img src="assets/img/rotate.png" width="30px" height="30px"></div>
                    </div>
                </a>
            `
            cardsContainer.append(cardsItem);
            document.getElementById(audioImageId).addEventListener('click',
                () => document.getElementById(audioId).play());
        }
    } else {
        window.location.hash = '';
    }
}

renderContent()
window.addEventListener('hashchange', () => {
    renderContent()
});
