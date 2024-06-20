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

function findCard(categoryName, cardName) {
    for (let category of cardsMappings) {
        if(category.title === categoryName){
            for (let item of category.items) {
                if (item.word === cardName) {
                    return item;
                }
            }
        }
    }
}

export function getDifficultWords() {
    let difficultWords = [];
    let statistic = JSON.parse(localStorage.getItem('statistic'));
    for (let categoryName in statistic) {
        let category = statistic[categoryName];
        for (let cardName in category) {
            let card = category[cardName];
            if (card.incorrect > 0) {
                console.log(categoryName + " " +  cardName);
                let difficultWord = findCard(categoryName, cardName);
                difficultWords.push({category: categoryName, card: difficultWord});
            }
        }
    }
    return difficultWords;
}

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

function resetSortClasses() {
    document.querySelectorAll('.startTable th').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
}

function setSortClass(element, isAscending) {
    resetSortClasses();
    element.classList.add(isAscending ? 'asc' : 'desc');
}

document.getElementById('categories').addEventListener('click', () => {
    let isAscending = document.getElementById('categories').classList.contains('asc');
    setSortClass(document.getElementById('categories'), !isAscending);
    renderStatistics((a, b) => a.category.localeCompare(b.category) * (isAscending ? -1 : 1));
});

document.getElementById('words').addEventListener('click', () => {
    let isAscending = document.getElementById('words').classList.contains('asc');
    setSortClass(document.getElementById('words'), !isAscending);
    renderStatistics((a, b) => a.word.localeCompare(b.word) * (isAscending ? -1 : 1));
});

document.getElementById('translation').addEventListener('click', () => {
    let isAscending = document.getElementById('translation').classList.contains('asc');
    setSortClass(document.getElementById('translation'), !isAscending);
    renderStatistics((a, b) => a.translation.localeCompare(b.translation) * (isAscending ? -1 : 1));
});

document.getElementById('trained').addEventListener('click', () => {
    let isAscending = document.getElementById('trained').classList.contains('asc');
    setSortClass(document.getElementById('trained'), !isAscending);
    renderStatistics((a, b) => (a.trained - b.trained) * (isAscending ? -1 : 1));
});

document.getElementById('correct').addEventListener('click', () => {
    let isAscending = document.getElementById('correct').classList.contains('asc');
    setSortClass(document.getElementById('correct'), !isAscending);
    renderStatistics((a, b) => (a.correct - b.correct) * (isAscending ? -1 : 1));
});

document.getElementById('incorrect').addEventListener('click', () => {
    let isAscending = document.getElementById('incorrect').classList.contains('asc');
    setSortClass(document.getElementById('incorrect'), !isAscending);
    renderStatistics((a, b) => (a.incorrect - b.incorrect) * (isAscending ? -1 : 1));
});


document.getElementById('percent').addEventListener('click', () => {
    let isAscending = document.getElementById('percent').classList.contains('asc');
    setSortClass(document.getElementById('percent'), !isAscending);
    renderStatistics((a, b) => (a.percent - b.percent) * (isAscending ? -1 : 1));
});
