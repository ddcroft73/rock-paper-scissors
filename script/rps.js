/*
Simple RPS game in JS

THis script should manupulate te DOM as well as house the logic
User can select their choicce by clicking and the choice will be displayed
Computer will randomy select when the user clicks "throw".
Each win will be recorded up to 5 and the results will be displayed after
each round
*/ 


let wins = ["rock.png scissors.png", "scissors.png paper.png", "paper.png rock.png", "rock.png scissors.png", "scissors.png paper.png", "paper.png rock.png"];

// Global variables
let gameRounds = 0;
let gameCnt = 0;
let humanScore = 0;
let puterScore = 0;
let roundWinner = null;

const rock = document.querySelector('#rock');
const paper = document.querySelector('#paper');
const scissors = document.querySelector('#scissors');
const play =  document.querySelector('#play');
const clear = document.querySelector('#clear');
const human_score = document.querySelector('#human-score');
const puter_score = document.querySelector('#puter-score');

rock.addEventListener('click', (e) => setUserChoice(e.target.id));
paper.addEventListener('click', (e) =>  setUserChoice(e.target.id));
scissors.addEventListener('click', (e) => setUserChoice(e.target.id));
play.addEventListener('click', () => throwHands());
clear.addEventListener('click', () => history.go(0));

    
let queryUserChoice = () => {
    const img = document.querySelector("#human-choice");
    return img.src.split('/').slice(-2).join('/');
}
let getFileNameOnly = (path) => {
    // This works to get the name and ext from a path
    let fnameAndExt = path.split('/').slice(-1);
    // The below expressioin causes an error
    // stating that fnameAndExt is not a function?? It will not let me split
    // the string and take the first item in the array.
    //const choice = fnameAndExt.split('.')[0];
    return fnameAndExt; 
}

// Swap the image that refers to the human with the choice
const setUserChoice = (choice) => {
    clearPuterChoice()
    choice = 'image/' + choice + '.png';
    const img = document.querySelector("#human-choice");
    img.src = choice;
}

// resets the computer choice
const clearPuterChoice = () => {
    choice = 'image/puter.png';
    const img = document.querySelector("#puter-choice");
    img.src = choice;
}

    // Swap the image that refers to the human with the choice
let getPuterChoice = (choice) => {         
    let selection = '';
    if (choice === 1) {
        selection = 'image/rock.png';            
    }
    else if (choice === 2) {
        selection = 'image/paper.png';
    }
    else if (choice  === 3) {
        selection = 'image/scissors.png';
    }     
    const img = document.querySelector("#puter-choice");
    img.src = selection;
    return selection;
}

//Play a round
const throwHands = () => {
    // Only play 5 games        
    if (gameCnt === 5) {
        reportResults();
        newGame();
        return;
    }        
    
    let userChoice = queryUserChoice();    
    if (userChoice === 'image/user.png') {
        alert("Select your weapon To play.");
        return;
    }

    let selection = Math.floor(Math.random() * 3) + 1;                
    let puterChoice = getPuterChoice(selection);

    let winner = getWinner(userChoice, puterChoice);
    updateScore(winner);
}
    
const newGame = () => {
    gameCnt = 0;
    humanScore = 0;
    puterScore = 0;

    const imgHuman = document.querySelector("#human-choice");
    imgHuman.src = 'image/user.png';
    human_score.textContent  = '0';

    const imgPuter = document.querySelector("#puter-choice");        
    imgPuter.src = 'image/puter.png';
    puter_score.textContent = '0';

    const resultContainer = document.querySelector('.status');
    let msg = 'Select your weapon for a <span>NEW GAME</span>.';    
    resultContainer.innerHTML = msg;
}

// THis logic is flawed. Spend mre time on this.
const getWinner = (user, puter) => {
    // assume computer will win, until otherwise proven.
    let curWinner = 'puter';    
    
    const profile = getFileNameOnly(user) + ' ' + getFileNameOnly(puter);
    
    for (let i = 0;  i < 5; i++) {
        if (user === puter) {           
            curWinner = 'tie';
            break;
        } 
        if (profile === wins[i] ) {
            curWinner = 'user';           
            break;                  
        }             
    } 
    
    updateStatus(curWinner);
    return curWinner;
}

const updateStatus = (winner) => {    
    //  display the current results.
    const resultContainer = document.querySelector('.status');
    if (winner === 'puter') winner = 'Computer';
    if (winner === 'user') winner = 'Player';
    if (winner === 'tie') winner = 'Tie Game';
    let msg = '<span>WINNER</span>: ['+ winner+ ']';    
    resultContainer.innerHTML = msg;
}

const updateScore = (winner) => {
    if (winner === 'user' ) {
        humanScore++;
        human_score.textContent = humanScore;
    }    
    if (winner === 'puter') {
        puterScore++;
        puter_score.textContent = puterScore;
    }
    gameCnt++;

    if (winner === 'tie') {
        // disregard the count due to tie.
        gameCnt--;       
    }
}

// Final round report
const reportResults = () => {
    gameRounds++;

    if (humanScore > puterScore) {
        roundWinner = "Player";
    }
    else {
        roundWinner = 'Computer';
    }    
    let textContent = 'Round ' + gameRounds + ':  [' + humanScore + '] [' + puterScore + '] '+ roundWinner + ' wins.';
    // add a div in the "results" section to display the results.
    const resultContainer = document.querySelector('.results');
    const content = document.createElement('div');
    content.classList.add('content');
    content.textContent = textContent;
    resultContainer.appendChild(content);    
}