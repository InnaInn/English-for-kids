import './normalize.css';
import './index.html';
import './style.css';
import './statistic.css';
import './cards.js';
import "@babel/polyfill";
import cardsMappings from "./cards";

const cardsContainer = document.querySelector('.cardsContainer');
let bodyTable = document.querySelector('.bodyTable');
let wrapperStatistic = document.querySelector('.wrapperStatistic');
let playPanel = document.querySelector('.playPanel');



document.querySelector('.btnDeleteStat').addEventListener('click', clearStatistics);
document.getElementById('percent').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.percent > b.percent) {
        return -1;
    }
    if (a.percent < b.percent) {
        return  1;
    }
    return 0;
}));
document.getElementById('incorrect').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.incorrect > b.incorrect) {
        return -1;
    }
    if (a.incorrect < b.incorrect) {
        return  1;
    }
    return 0;
}));
document.getElementById('correct').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.correct > b.correct) {
        return -1;
    }
    if (a.correct < b.correct) {
        return  1;
    }
    return 0;
}));
document.getElementById('trained').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.trained > b.trained) {
        return -1;
    }
    if (a.trained < b.trained) {
        return  1;
    }
    return 0;
}));
document.getElementById('translation').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.translation > b.translation) {
        return 1;
    }
    if (a.translation < b.translation) {
        return  -1;
    }
    return 0;
}));
document.getElementById('words').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.words > b.words) {
        return 1;
    }
    if (a.words < b.words) {
        return  -1;
    }
    return 0;
}));
document.getElementById('categories').addEventListener('click', () => renderStatistics((a, b) => {
    if (a.categories > b.categories) {
        return 1;
    }
    if (a.categories < b.categories) {
        return  -1;
    }
    return 0;
}));


function clearStatistics() {
    let statistic = JSON.parse(localStorage.getItem('statistic'));
    for (let categoryName in statistic) {
        let category = statistic[categoryName];
        for (let cardName in category) {
            let card = category[cardName];
            card.trained = 0;
            card.correct = 0;
            card.incorrect = 0;
        }
    }
    localStorage.setItem('statistic', JSON.stringify(statistic));
    renderStatistics();
}


function openStatistic() {
    wrapperStatistic.classList.remove('hidden');
}

export function closeStatistic() {
    wrapperStatistic.classList.add('hidden');
}

export function renderStatistics(sortFunction) {
    cardsContainer.classList.add('hidden');
    playPanel.classList.remove('enable');
    bodyTable.innerHTML = '';
    openStatistic();
    let items = getStatisticItems();
    items.sort(sortFunction);
    for (let card of items) {
        let tableRow = document.createElement('tr');
        bodyTable.append(tableRow);
        tableRow.innerHTML = `
            <td>${card.category}</td>
            <td>${card.word}</td>
            <td>${card.translation}</td>
            <td>${card.trained}</td>
            <td>${card.correct}</td>
            <td>${card.incorrect}</td>
            <td>${card.percent}</td>
        `;
    }
}


function getStatisticItems() {
    let items = [];
    let statistic = JSON.parse(localStorage.getItem('statistic'));
    for (let categoryName in statistic) {
        let category = statistic[categoryName];
        for (let wordName in category) {
            let wordStatistic = category[wordName];
            items.push(new StatisticItem(categoryName, wordName, wordStatistic));
        }
    }
    return items;
}

class StatisticItem {
    constructor(category, word, wordStatistic) {
        this.category = category;
        this.word = word;
        this.translation = wordStatistic.translation;
        this.trained = wordStatistic.trained;
        this.incorrect = wordStatistic.incorrect;
        this.correct = wordStatistic.correct;
        let totalAnswers = this.correct + this.incorrect;
        if (totalAnswers !== 0) {
            this.percent = 100 * this.correct / totalAnswers;
        } else {
            this.percent = 0;
        }
    }
}

if (!localStorage.getItem('statistic')) {
    let statistic = {};
    for (let category of cardsMappings) {
        let categoryStatistic = {};
        statistic[category.title] = categoryStatistic;
        for (let item of category.items) {
            categoryStatistic[item.word] = {
                translation: item.translation,
                trained: 0,
                incorrect: 0,
                correct: 0
            };
        }
    }
    localStorage.setItem('statistic', JSON.stringify(statistic));
}

export function increaseStatistic(category, word, type) {
    let statistic = JSON.parse(localStorage.getItem('statistic'));
    statistic[category][word][type]++;
    localStorage.setItem('statistic', JSON.stringify(statistic));
}
