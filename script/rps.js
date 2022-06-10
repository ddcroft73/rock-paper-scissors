/*
Simple RPS game in JS
*/ 

// a more elegant solution would be to use JSON. Should refactor this when I get to know JS better.
let wins = ["rock scissors", "scissors paper", "paper rock", "rock scissors"];

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
    path = path.split('.')[0];            
    return path.split('/').slice(-1);
}

const setUserChoice = (choice) => {
    clearPuterChoice()
    choice = 'image/' + choice + '.png';
    const img = document.querySelector("#human-choice");
    img.src = choice;
}

const clearPuterChoice = () => {
    choice = 'image/puter.png';
    const img = document.querySelector("#puter-choice");
    img.src = choice;
}

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

//Play the round
const throwHands = () => {        
    
    let userChoice = queryUserChoice();    
    if (userChoice === 'image/user.png') {
        writeToStatus("Please <span>select a weapon</span>.");
        return;
    }
    // didnt overthink the AI in this. 
    let selection = Math.floor(Math.random() * 3) + 1;                
    let puterChoice = getPuterChoice(selection);
    let winner = getWinner(userChoice, puterChoice);
    updateScore(winner);
}
    
const newGame = () => {

    gameCnt = 0;
    humanScore = 0;
    puterScore = 0;

    // let the user play again.
    document.getElementById("play").disabled = false; 

    const imgHuman = document.querySelector("#human-choice");
    imgHuman.src = 'image/user.png';
    human_score.textContent  = '0';

    const imgPuter = document.querySelector("#puter-choice");        
    imgPuter.src = 'image/puter.png';
    puter_score.textContent = '0';

    writeToStatus('&nbsp;&nbsp;<span>NEW GAME</span>?');
}

// an array of wins for the user is defined in wins[]. Loops thorugh the array and checks 
// to see if the user one. If not the computer won or there was a tie.
const getWinner = (user, puter) => {
    let curWinner = 'puter';    
    const profile = getFileNameOnly(user) + ' ' + getFileNameOnly(puter);
    
    for (let i = 0, l = wins.length;  i < l; i++) {
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
    //  display the current results on the last game played.
    if (winner === 'puter') winner = 'Computer';
    if (winner === 'user')  winner = 'Player';
    if (winner === 'tie')   winner = 'Tie Game';

    writeToStatus('<span>WINNER</span>: [<span>'+ winner+ '</span>]');
}

const updateScore = (winner) => {
    gameCnt++;           
    
    if (winner === 'user' ) {
        humanScore++;
        human_score.textContent = humanScore;
    }    
    if (winner === 'puter') {
        puterScore++;
        puter_score.textContent = puterScore;
    }
    if (winner === 'tie') {
        gameCnt--;       
    }    

    //on game 5, report the results. 
    if (gameCnt == 5) {
        reportResults();    
        // give the user a second to see the last results before resetting.
        document.getElementById("play").disabled = true; 
        setTimeout(newGame, 1500);  
        
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
    let textContent = '<span>Round ' + gameRounds + '</span>:  [<span>' + humanScore + '</span>] [<span>' + puterScore + '</span>] '+ roundWinner + ' wins.';
    appendResults(textContent);       
}

const writeToStatus = (message) => {
    const resultContainer = document.querySelector('.status');
    resultContainer.innerHTML = message;
}
const appendResults = (message) => {
    // add a div in the "results" section to display the results.
    const resultContainer = document.querySelector('.results');
    const content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = message;
    resultContainer.appendChild(content); 
}