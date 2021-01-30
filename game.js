const game = {
  level: 1,
  nextLevelScore: 180,
  frame: false,
  running: false,
  context: undefined,
  player: new Entity(0,0,50,50,25,"rgba(0,255,0,0)"),
  playerColor: "black",
  
  interface: {
    canvas: document.getElementById("canvas"),
    gameMenu: document.getElementById("gameMenu"),
    selectCarMenu: document.getElementById("selectCarMenu"),
    carShowcase: document.getElementById("carShowcase"),
    loseScreen: document.getElementById("loseScreen"),
    
    buttonControl: document.getElementsByClassName("buttonControl"),
    bestScoreText: document.getElementById("bestScore"),
    scoreText: document.getElementById("score"),
    levelText: document.getElementById("level"),
    finalScoreText: document.getElementById("finalScore"),
    finalScoreMessage: document.getElementById("finalScoreMessage"),
    
    canvasLoaded: false,
    eventsLoaded: false,
    
    actualizeScoreAndLevel() {
      this.scoreText.innerHTML = `Score: ${game.player.score}`;
      this.levelText.innerHTML = `Level: ${game.level}`;
    },
    
    actualizeBestScore() {
      if(localStorage.bestScore) {
        this.bestScoreText.innerHTML = `Best Score: ${localStorage.bestScore}`;
      }
    },
    
    actualizeactFinalScore() {
      let message = "Your score was:";
      let score = game.player.score;
      
      if(score <= 0) message = "Your are noob hahaha";
      if(score > Number(localStorage.bestScore)) message = "Nice your score was:";
      
      this.finalScoreText.innerHTML = score;
      this.finalScoreMessage.innerHTML = message;
    },
    
    loadCanvas() {
      if(!this.canvasLoaded) {
        this.canvas.width = 350;
        this.canvas.height = 450;
        
        this.canvasLoaded = true;
        game.context = this.canvas.getContext("2d");
      }
    },
    
    loadEvents() {
      if(!this.eventsLoaded) {
        for(let pos = 0; pos < this.buttonControl.length; pos++) {
          this.buttonControl[pos].addEventListener("click", () => {
            game.player.move(pos);
          });
        }
        
        this.eventsLoaded = true;
      }
    },
    
    images: [],
    backgroundFrame: 0,
    
    loadBackgroundImages() {
      this.images[0] = new Entity(0,0,350,450);
      this.images[1] = new Entity(175,0,350,450);
      this.images[2] = new Entity(0,225,350,450);
      this.images[3] = new Entity(175,225,350,450);
      
      this.images[0].setSprite("assets/effects/road-1.png");
      this.images[1].setSprite("assets/effects/road-2.png");
      this.images[2].setSprite("assets/effects/road-3.png");
      this.images[3].setSprite("assets/effects/road-4.png");
      
      this.renderBackground();
    },
    
    setBackgroundCoords() {
      this.backgroundFrame++;
      
      if(this.backgroundFrame <= 10) {
        this.images[0].setCoords(0,225);
        this.images[1].setCoords(175,225);
        this.images[2].setCoords(0,0);
        this.images[3].setCoords(175,0);
      }
      else if(this.backgroundFrame <= 20) {
        this.images[0].setCoords(0,0);
        this.images[1].setCoords(175,0);
        this.images[2].setCoords(0,225);
        this.images[3].setCoords(175,225);
      }
      
      (this.backgroundFrame > 20)? this.backgroundFrame = 0 : this.backgroundFrame;
    },
    
    renderBackground() {
      this.setBackgroundCoords();
      
      this.images[0].render();
      this.images[1].render();
      this.images[2].render();
      this.images[3].render();
    },
    
    showScreen(screenName) {
      (screenName === "canvas")? this.canvas.style.display = "block" : this.canvas.style.display = "none";
      (screenName === "menu")? this.gameMenu.style.display = "block" : this.gameMenu.style.display = "none";
      (screenName === "selectCar")? this.selectCarMenu.style.display = "block" : this.selectCarMenu.style.display= "none";
      (screenName === "lose")? this.loseScreen.style.display= "block" : this.loseScreen.style.display = "none";
    },
    
    renderCarShowcase() {
      let colorNames = game.opponent.color;
      
      this.carShowcase.innerHTML = ``;
      this.carShowcase.innerHTML = `<h1>Select your car</h1>`;
      
      for(let pos = 0; pos < colorNames.length; pos++) {
        this.carShowcase.innerHTML += `
          <div onclick="game.choiceCar(${pos})" class="carIcon">
            <img src="assets/car-${colorNames[pos]}-down.png" alt="car-${colorNames[pos]}">
          </div>
        `;
      }
      
      this.carShowcase.innerHTML += `
        <div>
          <button onclick="game.interface.showScreen('menu')" class="menuButton">Back</button>
        </div>
      `;
    },
  },
  
  audio: {
    song: {
      raceMusic: new Audio(),
      explosion: new Audio(),
    },
    
    audioLoaded: false,
    
    loadAudio() {
      if(!this.audioLoaded) {
        this.song.raceMusic.src = "assets/audio/jeremy-blake-powerup.mp3";
        this.song.explosion.src = "assets/audio/explosion.mp3";
        
        this.audioLoaded = true;
      }
    },
    
    play(audioName) {
      switch(audioName) {
        case "raceMusic":
          this.song.raceMusic.loop = true;
          this.song.raceMusic.play();
          break;
        case "explosion":
          this.song.explosion.play();
          break;
        default: console.error("Nome de áudio não encontrado");
      }
    },
    
    stop() {
      this.song.raceMusic.pause();
      this.song.raceMusic.currentTime = 0;
    }
  },
  
  opponent: {
    car: [],
    road: [0,50,100,150,200,250,300],
    color: ["black","blue","pink","yellow"],
    
    carLimit: 4,
    speed: 3,
    speedIncrement: 1,
    
    control() {
      if(this.car.length < this.carLimit) {
        this.create();
      }
    },
    
    create() {
      const newCar = new Entity(0,0,50,50,0,"rgba(0,255,0,0)");
      
      this.setInitialStats(newCar);
      this.car.push(newCar);
    },
    
    setInitialStats(car) {
      let color = Math.floor(Math.random() * this.car.length);
      let index = Math.floor(Math.random() * this.road.length);
      let speed = Math.floor(Math.random() * this.speed) + this.speedIncrement;
      
      car.x = this.road[index];
      car.y = -100;
      car.speed = speed;
      car.setSprite(`assets/car-${this.color[color]}-down.png`);
      
      this.road.splice(index,1);
    },
    
    restartCars() {
      for(let car of this.car) {
        car.y = -100;
        car.speed = Math.floor(Math.random() * this.speed) + this.speedIncrement;
        car.render();
      }
    },
    
    restartOptions() {
      this.carLimit = 4;
      this.speed = 3;
      this.speedIncrement = 1;
    }
  },
  
  animation: {
    fire: new Entity(0,0,60,60,0),
    
    explosion(frameValue) {
      game.animation.fire.x = game.player.x;
      game.animation.fire.y = game.player.y;
      game.animation.fire.setSprite(`assets/effects/explosion-${++frameValue}.png`);
      game.animation.fire.render();
      
      if(frameValue < 9) {
        setTimeout(() => game.animation.explosion(frameValue),70);
        
      } else {
        game.context.clearRect(game.animation.fire.x,game.animation.fire.y,game.animation.fire.width,game.animation.fire.height);
        
        game.interface.actualizeactFinalScore();
        game.interface.showScreen("lose");
        game.saveBestScore();
        game.unlockPoliceCar();
        
        game.context.clearRect(0,0,350,450);
      }
    },
  },
  
  unlockPoliceCar() {
    if(!this.opponent.color.includes("cop")) {
      if(localStorage.bestScore >= 1000) {
        this.opponent.color.push("cop");
        this.interface.renderCarShowcase();
      }
    }
  },
  
  choiceCar(number) {
    this.playerColor = this.opponent.color[number];
  },
  
  saveBestScore() {
    if(localStorage.bestScore) {
      if(this.player.score > localStorage.bestScore) {
        localStorage.bestScore = this.player.score;
      }
    } else {
      localStorage.bestScore = this.player.score;
    }
    this.interface.actualizeBestScore();
  },
  
  //Controla a troca de níveis e a mudança da velocidade do jogo
  controlLevel(score) {
    if(score >= this.nextLevelScore) {
      this.level++;
      this.opponent.speed++;
      this.nextLevelScore += 180;
      
      if(this.level.toString().includes("0")) this.opponent.speedIncrement++;
    }
  },
  
  getPoints() {
    if(this.level <= 2) return 3;
    if(this.level <= 5) return 5;
    if(this.level <= 10) return 9;
    if(this.level <= 14) return 11;
    if(this.level <= 18) return 14;
    if(this.level <= 21) return 17;
  },
  
  spawPlayer() {
    this.player.x = 150;
    this.player.y = 400;
    this.player.setSprite(`assets/car-${this.playerColor}-top.png`);
    
    this.player.render();
  },
  
  //Responsável por atualizar todas as entidades na tela
  update() {
    this.interface.renderBackground();
    this.player.render();
    
    if(this.opponent.car.length > 0) {
      for(let car of this.opponent.car) {
        car.render();
        car.collision(game.player);
        
        car.npcMove("bottom");
        car.restart();
      }
    }
  },
  
  //Loop principal
  render() {
    game.interface.actualizeScoreAndLevel();
    game.context.clearRect(0,0,350,450);
    
    game.opponent.control();
    game.update();
    
    if(game.running) game.frame = window.requestAnimationFrame(game.render, game.interface.canvas);
  },
  
  //Pre carregamento da tela e áudios
  preload() {
    this.interface.showScreen("menu");
    this.interface.actualizeBestScore();
    
    this.interface.loadCanvas();
    this.interface.loadEvents();
    
    this.interface.loadBackgroundImages();
    this.interface.renderCarShowcase();
    
    this.unlockPoliceCar();
    this.audio.loadAudio();
  },
  
  start() {
    if(!this.running) {
      //Definindo que o game está rodando e setando configurações
      this.running = true;
      this.level = 1;
      this.player.score = 0;
      this.nextLevelScore = 180;
      this.interface.backgroundFrame = 0;
      
      this.interface.actualizeScoreAndLevel();
      this.interface.showScreen("canvas");
      
      //Spawnando player e dando inicio ao loop principal
      this.spawPlayer();
      this.audio.play("raceMusic");
      this.render();
    }
  },
  
  end() {
    //Parando o jogo e o animation frame
    this.running = false;
    window.cancelAnimationFrame(this.frame);
    
    //Rodando animação de explosão
    this.audio.play("explosion");
    this.animation.explosion(0);
    
    //Restartando configurações dos carros oponentes
    this.opponent.restartOptions();
    this.opponent.restartCars();
    
    //Parando todos os áudios
    this.audio.stop();
  }
};