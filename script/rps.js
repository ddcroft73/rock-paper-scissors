/*
Simple RPS game in JS
*/ 

const profiles = {
    "userWins": ["rock scissors", "scissors paper", "paper rock"]
};

let gameRounds = 0;
let gameCnt = 0;
let humanScore = 0;
let puterScore = 0;
let humanScore_running = 0;
let puterScore_running = 0;

let roundWinner = null;

const rock = document.querySelector('#rock');
const paper = document.querySelector('#paper');
const scissors = document.querySelector('#scissors');
const play =  document.querySelector('#play');
//const clear = document.querySelector('#clear');
const human_score = document.querySelector('#human-score');
const puter_score = document.querySelector('#puter-score');


rock.addEventListener('click', (e) => setUserChoice(e.target.id));
paper.addEventListener('click', (e) =>  setUserChoice(e.target.id));
scissors.addEventListener('click', (e) => setUserChoice(e.target.id));
play.addEventListener('click', () => throwHands());
//clear.addEventListener('click', () => history.go(0));

    
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
    gameCnt++;  
    let userChoice = queryUserChoice();    
    if (userChoice === 'image/user.png') {
        statusReport("Please <span>select a weapon</span>.");
        return;
    }
    // didnt overthink the AI in this. 
    let selection = Math.floor(Math.random() * 3) + 1;                
    let puterChoice = getPuterChoice(selection);
    let winner = getWinner(userChoice, puterChoice);  
    let trueGameCount = updateScore(winner); 
    updateStatus(winner, trueGameCount); 
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

    statusReport('<span>NEW GAME</span>?');
}

//defined an object with any profile where the user will win. Compare that to the current
// profile of user vs puter. If the user didn't win and there was not a tie. Computer won.
const getWinner = (user, puter) => {
    let curWinner = 'puter';    
    const profile = getFileNameOnly(user) + ' ' + getFileNameOnly(puter);
    
    for (var i = 0, l = profiles.userWins.length; i < l; i++) {
        let win = profiles.userWins[i];

        if (user === puter) {           
            curWinner = 'tie';
            break;
        } 
        if (profile === win ) {
            curWinner = 'user';           
            break;                  
        }  
    }
    //updateStatus(winner);  
    return curWinner;
}

const updateStatus = (winner, actualGameCount) => {    
    //  display the current results on the last game played.
    if (winner === 'puter') winner = 'Computer';
    if (winner === 'user')  winner = 'Player';
    if (winner === 'tie')   winner = 'Tie Game';

    //  if the game is in the last round display a last round message. If the next round is a tie
    //  continue to display the last round message.     
    if (actualGameCount === 4) { // actualGameCount gives a true real time count vs gameCnt which can lag.
        statusReport('<span>Last Point</span>!!: [<span>Who will it be?!</span>] ' );    
    } else if(actualGameCount === 5 && actualGameCount === 'Tie Game') {   
        statusReport('<span>Last Point...</span>: [<span>but it was a tie!</span>] ');     
    } else {
        statusReport('<span>WINNER</span>: [<span>'+ winner+ '</span>]');
    }    
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
    if (winner === 'tie') {
        gameCnt--;       
    } 

    //on game 5, report the results. 
    if (gameCnt === 5) {
        reportResults();    
        // give the user a second to see the last results before resetting.
        document.getElementById("play").disabled = true; 
        setTimeout(newGame, 1500);          
    }       
    
    return humanScore + puterScore;
}

// Final report after the race to 5.
const reportResults = () => {
    gameRounds++;
    if (humanScore > puterScore) {
        roundWinner = "Player";
        humanScore_running++;
    }
    else {
        roundWinner = 'Computer';
        puterScore_running++;
    }    
    let textContent = '<span>Round ' + gameRounds + '</span>:  [<span>' + humanScore + '</span>] [<span>' + puterScore + '</span>] '+ roundWinner + ' wins.';
    
    appendResults(textContent);       
    showMatchResults();
    
}

const statusReport = (message) => {
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
    // auto scroll with the data
    resultContainer.scrollTop = resultContainer.scrollHeight;
}

/**
 * if gameRounds is divisible by 3 see what the scores are and make a report. 
 */
const showMatchResults = () => {    
    let message = '';
    let modifier = '';


     if (gameRounds % 3 === 0)  {
        if (puterScore_running > humanScore_running) {
            if (puterScore_running > (humanScore_running+1)) {
               modifier = 's';
            }

             message = '<span>The computer has you by</span> ' + ((puterScore_running - humanScore_running)) + ' <span>game' +modifier +'</span>.';   
             statusReport(message);
        } else if (humanScore_running > puterScore_running){
            message ='<span>Your\'e in the lead! </span> ' + ((humanScore_running - puterScore_running)) + ' <span>game' +modifier +'</span>.';
            statusReport(message);
        }else if (humanScore_running === puterScore_running){
            message = '<span>The Match is tied up </span> [<span>' + humanScore_running+ '</span>] <span>to</span> [<span>' + puterScore_running +'</span>]!';
            statusReport(message);
        }
     }    

     appendResults(message);
}

let trueGameCount = () => {

}