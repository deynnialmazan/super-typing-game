'use strict';

class Score {
  #date;
  #points;
  #percentage;

  constructor(date, points, percentage) {
    this.#date = date;
    this.#points = points;
    this.#percentage = percentage;
  }

  get date() { return this.#date; }
  get points() { return this.#points; }
  get percentage() { return this.#percentage; }
};

const now = new Date();
const today = now.toDateString().slice(4);
//console.log(today);


const startBtn = document.querySelector('.startBtn');
const word = document.querySelector('.word');
const inputText = document.querySelector('.input-text');
const timeLeft = document.querySelector('#time');
const totalPoints = document.querySelector('#points');
const endGameBox = document.querySelector('.end-game');
const message = document.querySelector('#message');
const playAgainBtn = document.querySelector('.play-again-btn');
const pointsMessage = document.querySelector('.points-message');
const instruction = document.querySelector('.instruction');
const percentageMessage = document.querySelector('.percentage-message');
const results = document.querySelector('.results-container');
const startScreen = document.querySelector('.start-screen');
const scoreboard = document.querySelector('.scoreboard');

//Sounds
//Background sound
const startSound = new Audio('./assets/audio/taratata-6264.mp3')
startSound.type = 'audio/mp3';

// New point sound
const hitSound = new Audio('./assets/audio/hit-sound3.mp3') 
hitSound.type = 'audio/mp3';

// Game over sound
const gameOverSound = new Audio('./assets/audio/game-over.wav') 
gameOverSound.type = 'audio/wav';

// Tic-tac sound (last 5 seconds)
const ticTacSound = new Audio('./assets/audio/tic-tac.mp3') 
ticTacSound.type = 'audio/mp3';

//Setting variables
let randomWord = "";
let points = 0 ;
let time = 12;



// Setting array
const words = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
  'population','weather', 'bottle', 'history', 'dream', 'character', 
  'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection',
  'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon',
  'developer', 'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 
  'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 
  'canada', 'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 
  'technology', 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 
  'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 'perfumer', 
  'computer', 'management', 'discovery', 'ambition', 'music', 'eagle', 
  'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 
  'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 
  'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 
  'science', 'mystery', 'famous', 'league', 'memory', 'leather', 
  'planet', 'software', 'update', 'yellow', 'keyboard', 'window'
];


// Generate random word from 'words' array
function getRandomWord() {
  let wordSelected = words[Math.floor(Math.random() * words.length)];
  //console.log(wordSelected);

  //Delete word selected of the array
  const indexToRemove = words.indexOf(wordSelected);
    if (indexToRemove !== -1) {
    words.splice(indexToRemove, 1);
  }
  return wordSelected;
}

//Display random word in the screen
function displayRandomWord() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;
}

//Update points
function updatePoints() {
  hitSound.play();
  points++;
  totalPoints.innerHTML = `${points} points`;
  if (points === 90) {
    endGame();
  }
}

//Update time
function updateTime() {
  timeLeft.innerHTML = `${time}s`;
  
  if(time > 0){
    // decrement
    time--;
  } else if (time === 0) {
    endGame(); 
  //console.log(time);
  } lastSound();
}

//Tic-toc sound (last 5 seconds)
function lastSound() {
  if(time < 6 && time > 0 ) {
    ticTacSound.play();
    startSound.pause();
    startSound.currentTime = 0;
    startSound.loop = false;
  }
}


// End game
function endGame() {
  const finalPercentage = ((points/90) * 100).toFixed(0);
  // Create object with results using 'Score' class  
  const score = new Score (today, points, finalPercentage);
  
  //console.log(score);
  pointsMessage.innerHTML =`${score.points}`
  percentageMessage.innerHTML =`${score.percentage}%`
  endGameBox.style.display = 'grid';
  startScreen.style.display = 'none';
  playAgainBtn.style.display = 'block';
  message.innerHTML= "";
  scoreboard.style.display ='block';

  //Reproduce only game over sound 
  ticTacSound.pause();
  ticTacSound.currentTime = 0;
  ticTacSound.loop = false;
  gameOverSound.play();


  setTimeout(() => {
    gameOverSound.pause();
  }, 30000);

  saveScore(points);
  showHighScores()
  score = 0

};

  
window.addEventListener("load", (event) => {
  showHighScores()
});

function saveScore(score) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(points);
  localStorage.setItem("highScores", JSON.stringify(highScores));
};


function showHighScores() {

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  let scoresList = document.querySelector('.score-list');

  scoresList.innerHTML = "";
  highScores.sort((a, b) => b - a);

  highScores = highScores.slice(0, 9);
  
  for (let i = 0; i < highScores.length; i++) {
    let li = document.createElement("li");
    li.textContent = `#${i + 1}: ${highScores[i]} words`;
    scoresList.appendChild(li);
  }
};



//Even listeners
startBtn.addEventListener('click', () => {
  const timeInterval = setInterval(updateTime, 1000);
  setTimeout(() => {
    clearInterval(timeInterval);
  }, 14000);
  startBtn.style.visibility = 'hidden';
  instruction.style.visibility = 'visible';
  results.style.visibility = 'visible';
  message.style.visibility = 'visible';
  inputText.disabled = false;
  inputText.focus()
  startSound.play();
  startSound.loop = true;
  displayRandomWord();
  scoreboard.style.display='none';
});


// Compare word input with random word
inputText.addEventListener('input', e => {
  const insertedText = e.target.value;
  message.style.visibility = 'visible';

  if (insertedText === randomWord) {
    hitSound.play();
    message.innerHTML = 'Great!😎';
    displayRandomWord();
    updatePoints();
  } else {
   message.innerHTML = 'You can...😟';
  return false;
  }
  e.target.value = '';
});


playAgainBtn.addEventListener('click', () => {
  time = 12;
  points = 0;
  const timeInterval = setInterval(updateTime, 1000);
  setTimeout(() => {
    clearInterval(timeInterval);
  }, 14000);

  endGameBox.style.display = 'none';
  startScreen.style.display = 'block';
  totalPoints.innerHTML = `${points} points`;
  timeLeft.innerHTML = `${time}s`;
  randomWord = "";
  word.innerHTML = randomWord;
  inputText.value = "";
  inputText.disabled = false;
  inputText.focus()
  startSound.play();
  startSound.loop = true;
  displayRandomWord();
  startBtn.style.visibility = 'hidden';
  instruction.style.visibility = 'visible';
  results.style.visibility = 'visible';
  message.style.visibility = 'visible';
  scoreboard.style.display = 'none';

});
