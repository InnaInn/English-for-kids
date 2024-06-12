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


function openStatistic() {
    wrapperStatistic.classList.remove('hidden');
}

export function closeStatistic() {
    wrapperStatistic.classList.add('hidden');
}

export function renderStatistics() {
    cardsContainer.innerHTML = '';
    openStatistic();
    let statistic = JSON.parse(localStorage.getItem('statistic'));
    for (let categoryName in statistic) {
        let category = statistic[categoryName];
        for (let cardName in category) {
            let card = category[cardName];
            let tableRow = document.createElement('tr');
            bodyTable.append(tableRow);
            let totalAnswers = card.correct + card.incorrect;
            let correctAnswersPercentage = 0;
            if (totalAnswers !== 0) {
                correctAnswersPercentage = 100 * card.correct / totalAnswers;
            }
            tableRow.innerHTML = `
                <td>${categoryName}</td>
                <td>${cardName}</td>
                <td>${card.translation}</td>
                <td>${card.trained}</td>
                <td>${card.correct}</td>
                <td>${card.incorrect}</td>
                <td>${correctAnswersPercentage}</td>
            `;
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
