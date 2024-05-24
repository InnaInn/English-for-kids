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
                    <img src="assets/${mapping.items[0].image}"  alt="img" width="240px" ">
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
            let cardsRotateId = `rotateId-${card.word}`;
            //let containerRotate = `containerRotate-${card.word}`;
            let cardItemId = `card-${card.word}`;
            cardsItem.classList.add('cardsItem');
            cardsItem.setAttribute("id", cardItemId)
            cardsItem.innerHTML = `
                <div class="cardContent">
                    <div class="front">
                        <div class="cardsImage cardsImageActionOne">
                            <img class="imgDescription" src="assets/${card.image}" alt="img" >
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
        }
    } else {
        window.location.hash = '';
    }
}

renderContent()
window.addEventListener('hashchange', () => {
    renderContent()
    closeMenu()
});

function playPopupShouldBeShown() {
    let hash = window.location.hash;
    let dontShowPopup = localStorage.getItem('dontShowPopup');
    return !(dontShowPopup === 'true' || hash.startsWith('#section-'));
}

function openPopup() {
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

document.getElementById('switchInput').addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('alternate-background');

        if (playPopupShouldBeShown()) {
            openPopup()
        }
    } else {
        document.body.classList.remove('alternate-background');
    }
});



