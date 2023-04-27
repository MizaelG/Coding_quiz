const highscore_table = document.getElementById('highscores-table');
const clear_highscore_btn = document.getElementById('clear-highscores');

clear_highscore_btn.addEventListener('click', clearHighscores);

generateHighscoresTable();

function generateHighscoresTable(){
    let highscores = localStorage.getItem('scoreList');
    if(highscores){
        addHighscoreTableRows(highscores);
    }
}

function addHighscoreTableRows(highscores){
    highscores = JSON.parse(highscores);

    highscores.forEach(function(scoreItem, index){
        const rankCell = createRankCell(index = 1);
        const scoreCell = createScoreCell(scoreItem.score);
        const initialCell = createInitalsCell(scoreItem.initials);
        const addHighscoreTableRow = createHighscoreTableRow(rankCell, scoreCell, initialCell);
        highscore_table.appendChild(addHighscoreTableRow);
    });
}

function createRankCell(rank){
    const rankCell = document.createElement('td');
    rankCell.textContent = `#${rank}`;
    return rankCell;
}

function createScoreCell(score) {
    const scoreCell = document.createElement('td');
    scoreCell.textContent = score;
    return scoreCell;
}

function createInitalsCell(initials){
    const initialCell = document.createElement('td');
    initialCell.textContent = initials;
    return initialCell;
}

function createHighscoreTableRow(rankCell, scoreCell, initialCell){
    const tableRow = document.createElement('tr');
    tableRow.appendChild(rankCell);
    tableRow.appendChild(scoreCell);
    tableRow.appendChild(initialCell);
    return tableRow;
}


// Clear table
function clearHighscores(){
    localStorage.setItem('scoreList', []);
    while (highscore_table.children.length > 1){
        highscore_table.removeChild(highscore_table.lastChild);
    }
}