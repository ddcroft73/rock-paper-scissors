/*
Simple RPS game in JS

BUG Every now and the the game count will go berzerk and the game is ended prematurely.
I'd fix it but moving on. A problem due to poor program design. 
 

*/ 

const profiles = {
    "userWins": ["rock scissors", "scissors paper", "paper rock"]
};

( () => {
    console.log(
`execute once... but why? think of a reason to 
have a start up function... 
I  had one. I did not know you could
break up a string loike this when using 
back ticks... shit, no line break or nothing`);
})();

let gameRounds = 0;
let gameCnt = 0;
let humanScore = 0;
let computerScore = 0;
let humanScore_running = 0;
let computerScore_running = 0;
let roundWinner = null;

const rock = document.querySelector('#rock');
const paper = document.querySelector('#paper');
const scissors = document.querySelector('#scissors');
const play =  document.querySelector('#play');
//const clear = document.querySelector('#clear');
const human_score = document.querySelector('#human-score');
const computer_score = document.querySelector('#puter-score');


rock.addEventListener('click', (e) => setUserChoice(e.target.id));
paper.addEventListener('click', (e) =>  setUserChoice(e.target.id));
scissors.addEventListener('click', (e) => setUserChoice(e.target.id));
play.addEventListener('click', () => throwHands());
//clear.addEventListener('click', () => history.go(0));

    
let queryUserChoice = () => {
    const img = document.querySelector("#human-choice");
    return img.src.split('/').slice(-2).join('/');
}

const setUserChoice = (choice) => {
    clearComputerChoice()
    choice = 'image/' + choice + '.png';
    const img = document.querySelector("#human-choice");
    img.src = choice;
}

const clearComputerChoice = () => {
    choice = 'image/puter.png';
    const img = document.querySelector("#puter-choice");
    img.src = choice;
}

let getComputerChoice = (choice) => {         
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
    gameCnt++;  
    
    let userChoice = queryUserChoice();    
    if (userChoice === 'image/user.png') {
        statusReport("Please <span>select a weapon</span>.");
        return;
    }
    // highlight player for effect.
    highLightPlayerIcon("div.h-choice", "#human-choice", 30);

    // didnt overthink the AI on this. 
    let selection = Math.floor(Math.random() * 3) + 1;                
    let computerChoice = getComputerChoice(selection);
    let winner = getWinner(userChoice, computerChoice);      
    let trueGameCount = updateScore(winner); 
    updateStatus(winner, trueGameCount); 
}   

const newGame = () => {

    gameCnt = 0;
    humanScore = 0;
    computerScore = 0;

    // let the user play again.
    document.getElementById("play").disabled = false; 

    const imgHuman = document.querySelector("#human-choice");
    imgHuman.src = 'image/user.png';
    human_score.textContent  = '0';

    const imgPuter = document.querySelector("#puter-choice");        
    imgPuter.src = 'image/puter.png';
    computer_score.textContent = '0';

    statusReport('<span>NEW GAME</span>?');
}

// defined an object with any profile where the user will win. Compare that to the current
// profile of user vs puter. If the user didn't win and there was not a tie. Computer won.
const getWinner = (user, computer) => {
    let getFileNameOnly = (path) => {
        path = path.split('.')[0];            
        return path.split('/').slice(-1);
    }
    let curWinner = 'puter';    
    const profile = getFileNameOnly(user) + ' ' + getFileNameOnly(computer);
    
    for (var i = 0, l = profiles.userWins.length; i < l; i++) {
        let win = profiles.userWins[i];

        if (user === computer) {           
            curWinner = 'tie';
            break;
        } 
        if (profile === win ) {
            curWinner = 'user';           
            break;                  
        }  
    }
    return curWinner;
}

const updateStatus = (winner, actualGameCount) => {    
    //  display the current results on the last game played.
    if (winner === 'puter') winner = 'Computer';
    if (winner === 'user')  winner = 'Player';
    if (winner === 'tie')   winner = 'Tie Game';

console.log(humanScore + ', ' + computerScore);
    if (actualGameCount === 4) { 
        // whomever is a head the most gets a poke.
        // see whose ahead, and lean towards the winner.
        
        if (computerScore > humanScore) {
            statusReport('<span>Last Point</span>!!: [<span>The computer has you!</span>] ' );
        }  else if (humanScore > computerScore) {
            statusReport('<span>Last Point</span>!!: [<span>You got this!</span>] ' );
        } else {
            statusReport('<span>Last Point</span>!!: [<span>Who will it be?!</span>] ' );  
        }        
    } else if(actualGameCount === 5 && actualGameCount === 'Tie Game') {   
        statusReport('<span>Last Point...</span>: [<span>but it was a tie!</span>] ');     
    } else {
        statusReport('<span>WINNER</span>: [<span>'+ winner+ '</span>]');
        if (computerScore === (computerScore + humanScore) && (computerScore + humanScore) === 3 ) {
            statusReport('<span>Geez man... Not even one game out of 3? </span>');
        }
    }    
}

const updateScore = (winner) => { 
    if (winner === 'user' ) {
        humanScore++;
        human_score.textContent = humanScore;
        highLightPlayerIcon("div.score", "#human-score", 30);
    }    
    if (winner === 'puter') {        
        computerScore++;
        computer_score.textContent = computerScore;
        highLightPlayerIcon("div.score", "#human-score", 30);
    }    
    if (winner === 'tie') {
        gameCnt--;       
    } 
    // game over
    if (gameCnt === 5) {
        reportResults();    
        // give the user a second to see the last results before resetting.
        document.getElementById("play").disabled = true; 
        setTimeout(newGame, 1500);          
    }           
    // actualGameCount gives a, well not as true as i thought  time count apparently vs gameCnt which can lag.
    // This still is not 100% I probably need to rethink how i track the games and where.
    // because I really should not need to do this.
    return (humanScore + computerScore);
}

const reportResults = () => {
    gameRounds++;
    if (humanScore > computerScore) {
        roundWinner = "Player";
        humanScore_running++;
    }
    else {
        roundWinner = 'Computer';
        computerScore_running++;
    }    
    let textContent = '<span>Round ' + gameRounds + '</span>:  [<span>' + humanScore + '</span>] [<span>' + computerScore + '</span>] '+ roundWinner + ' wins.';
    
    // Strobe the winner.
    strobeEffect(roundWinner, 1000, 100);
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

/*
 * if gameRounds is divisible by 3 see what the scores are and make a report.
 * if user or puter is ahead by more than 1 game, add an "s" the the end of game. 
 */
const showMatchResults = () => {    
    let message = '';
    let modifier = '';

     if (gameRounds % 3 === 0)  {
        if (computerScore_running > humanScore_running) {

            if (computerScore_running > (humanScore_running+1)) {
               modifier = 's';
            }
             message = '<span>The computer has you by</span> ' + ((computerScore_running - humanScore_running)) + ' <span>game' +modifier +'</span>.';   
             statusReport(message);
        } else if (humanScore_running > computerScore_running){
            if (humanScore_running > (computerScore_running+1)) {
                modifier = 's';
             } 
            message ='<span>Your\'e in the lead! </span> ' + ((humanScore_running - computerScore_running)) + ' <span>game' +modifier +'</span>.';
            statusReport(message);
        }else if (humanScore_running === computerScore_running){
            message = '<span>The Match is tied up </span> [<span>' + humanScore_running+ '</span>] <span>to</span> [<span>' + computerScore_running +'</span>]!';
            statusReport(message);
        }
     }    
     appendResults(message);
}

/*
 * highlights one of 2 seperate image div combos for a short time to enhace the click effect.
 */
const highLightPlayerIcon = (div, image, time) => {
    const changeBack = () => {
     document.querySelector(div).style.backgroundColor = 'rgb(159, 120, 98)';
     document.querySelector(image).style.backgroundColor = 'rgb(159, 120, 98)';
    }
    // Highlight
    document.querySelector(div).style.backgroundColor = 'rgb(209, 180, 163)';
    document.querySelector(image).style.backgroundColor = 'rgb(209, 180, 163)';
    //change back
    setTimeout(changeBack, time);
 }


 /*
  * A simple strobing effect to highlgiht thewinner.  When a player wins the round
  * the winning icon will blink rapidly. Duration and interval can be adjusted.
  */
 const strobeEffect =( winner, duration, strobe) => {
    //
    let div = '';
    let icon = '';

    const stop = () => {
        clearInterval(myInterval);
    }
    
    console.log(winner)
    if (winner === 'Player') {
       div = 'div.h-choice';
       icon ='#human-choice';
    } else {
        div = 'div.p-choice';
        icon ='#puter-choice';
    }
    const myInterval = setInterval(function () {highLightPlayerIcon(div, icon, 50)} , strobe)
    setTimeout(stop, duration);
            

 }