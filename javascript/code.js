
        // init global variables
        let numberOfMonsters = 5;
        let currentScore = 0;
        let highScore = 0;
        let counter = 0;
        let gameTimer;
        const monsterArray = ['AlienMonster.svg', 'AnnoyingMonster.svg', 'HappyMonster.svg', 'MonsterMascot.svg', 'MoshiMonster.svg'];

        // init buttons
        const startGameButton = document.getElementById('startGameButton');
        const resetGameButton = document.getElementById('resetGameButton');

        // audio
        const gameMusic = document.getElementById('game-music');
        const audioGroan = document.getElementById('audio-groan');
        const audioAdvance = document.getElementById('audio-advance');
        const audioConfirmation = document.getElementById('audio-confirmation');
        const audioGameOver = document.getElementById('audio-gameover');
        const audioNewHighScore = document.getElementById('audio-newhighscore');
        const audioTimeout = document.getElementById('audio-timeout');
        const audioReset = document.getElementById('audio-reset');

        // game and scoreboard
        const scoreBoard =  document.getElementsByClassName('score-board-left');
        const timerBoard =  document.getElementsByClassName('score-board-right');
        const timer = document.getElementsByClassName('timer');
        const score = document.getElementsByClassName('score');
        const high = document.getElementsByClassName('highscore');
        const gameLeft = document.getElementsByClassName('game-board-left');
        const gameRight =  document.getElementsByClassName('game-board-right');

        // init global event listeners
        startGameButton.addEventListener('click', startGame);
        resetGameButton.addEventListener('click', resetGame);

        // start game
        function startGame() {
            playConfirmation();
            startGameMusic();
            generateMonsters();
            startTimer();
            counter = 15;
            currentScore = 0;
            startGameButton.disabled = 'true';
            high[0].innerHTML = highScore;
        }

        // audio
        function startGameMusic() {
            setTimeout(function() {
                gameMusic.play();
            }, 750);
            gameMusic.volume = 0.4;
        }

        function playGroan(){
            audioGroan.play();
            audioGroan.volume = 1.0;
        }

        function playConfirmation(){
            audioConfirmation.play();
            audioConfirmation.volume = 0.8;
        }

        function playReset(){
            audioReset.play();
            audioReset.volume = 0.8;
        }

        function playAdvance(){
            setTimeout(function() {
                audioAdvance.play();
            }, 500);
            audioAdvance.volume = 0.9;
        }

        function playNewHighScore(){
            setTimeout(function() {
                audioNewHighScore.play();
            }, 1500);
            audioAdvance.volume = 0.3;
        }

        function playGameOver(){
            setTimeout(function() {
                audioGameOver.play();
            }, 0);
            audioAdvance.volume = 0.3;
        }

        function playTimeout(){
            setTimeout(function() {
                audioTimeout.play();
            }, 100);
            audioAdvance.volume = 0.3;
        }

        function resetGameMusic() {
            gameMusic.pause();
            gameMusic.currentTime = 0;
            gameMusic.volume = 0.4;
        }

        // calcualte current score
        function calcCurrentScore(){
            if (currentScore < 500) {
                currentScore = currentScore + 100;
            } else if(currentScore >= 500 || currentScore === 1250){
                currentScore = currentScore + 250;
            } else currentScore = currentScore + 500;
            return currentScore;
        }

        // next level reset
        function nextLevel(){

            while(gameLeft[0].firstChild){
                gameLeft[0].removeChild(gameLeft[0].firstChild);
            }

            while(gameRight[0].firstChild){
                gameRight[0].removeChild(gameRight[0].firstChild);
            }

            event.stopPropagation();
            numberOfMonsters += 5;
            counter += 15;
            generateMonsters();
            playAdvance();

            score[0].innerHTML = calcCurrentScore();
        }

        // new high score
        function getHighScore(){
            if (currentScore > highScore) {
                let oldScore = highScore;
                highScore = currentScore;
                newHighScore = document.getElementById('newHighScore');
                newHighScore.innerHTML = 'NEW HIGH SCORE!\n\n';
                showHighScore = document.getElementById('showHighScore');
                showHighScore.innerHTML = highScore + 'pts +' + '(' + (highScore - oldScore) + ')';
                playNewHighScore();
            } else {
                newHighScore = document.getElementById('newHighScore');
                newHighScore.innerHTML = ' ';
                showHighScore = document.getElementById('showHighScore');
                showHighScore.innerHTML = ' ';
                return highScore;
            }
        }

        // timer functions and countdown
        function startTimer(){
            gameTimer = setInterval(function(){
                timer[0].innerHTML = timeConverter(counter);
                console.log(counter);
                counter--;
                if (counter === 0){
                    clearInterval(gameTimer);
                    timer[0].innerHTML = '00:00';
                    gameTimeout();
                }
            }, 1000);
        }

        function stopTimer(){
            clearInterval(gameTimer);
        }


        function timeConverter(seconds){
            let minutes = Math.floor(seconds / 60);
            seconds = (seconds % 60);
            return `${(minutes < 10 ? "0" : "")}${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
        }
        
        function generateMonsters(){
            for(i = 0; i < numberOfMonsters; i++) {
                let randomMonster = Math.floor(Math.random() * monsterArray.length);
                let monster = document.createElement('img');
                monster.src = './images/' + monsterArray[randomMonster];
                monster.id = 'monsterImage';
                monster.addEventListener('click', gameOver);

                let randomY = Math.floor(Math.random() * 400 + 1);
                let randomX = Math.floor(Math.random() * 400 + 1);

                monster.style.top = randomY + 'px';
                monster.style.left = randomX + 'px';
                gameLeft[0].appendChild(monster);
            }

            const gameLeftImages = gameLeft[0].cloneNode(true);
            gameLeftImages.removeChild(gameLeftImages.lastChild);
            gameRight[0].appendChild(gameLeftImages);

            gameLeft[0].lastChild.removeEventListener('click', gameOver);
            gameLeft[0].lastChild.addEventListener('click', nextLevel);
            gameLeft[0].lastChild.addEventListener('click', playGroan);
            
        }

        // reset, gameover, and game timeout
        function resetGame(){
            while(gameLeft[0].firstChild){
                gameLeft[0].removeChild(gameLeft[0].firstChild);
            }

            while(gameRight[0].firstChild){
                gameRight[0].removeChild(gameRight[0].firstChild);
            }
            stopTimer();
            numberOfMonsters = 5;
            currentScore = 0;
            score[0].innerHTML = currentScore = 0;
            timer[0].innerHTML = '00:00';
            startGameButton.disabled = false;
            playReset();
            resetGameMusic();
        }

        function gameOver(){
            playGameOver();
            getHighScore();
            gameOverModal();
            resetGame();
        }

        function gameTimeout(){
            playTimeout();
            getHighScore();
            gameOverModal();
            resetGame();
        }
        
        // modal functions
        function gameOverModal(){
            modal.style.display = "block";
        }

        // create modals
        let modal = document.getElementById("gameOverModal");
        let tryBtn = document.getElementsByClassName("tryagain-button")[0];
        tryBtn.onclick = function() {
        startGame();
        modal.style.display = "none";
        }
        let span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
        modal.style.display = "none";
        }