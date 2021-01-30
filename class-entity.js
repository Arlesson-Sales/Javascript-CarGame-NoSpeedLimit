class Entity {
  constructor(x,y,width,height,speed,color) {
    this.sprite = new Image();
    this.spriteReady = false;
    this.score = 0;
    
    this.width = width;
    this.height = height;
    
    this.moveTop = true;
    this.moveLeft = true;
    this.moveRight = true;
    this.moveBottom = true;
    
    this.x = x;
    this.y = y;
    this.speed = (speed)? speed : 10;
    this.rectColor = (color)? color : "rgba(0,0,0,0)";
  }
  
  setCoords(x,y) {
    this.x = x;
    this.y = y;
  }
  
  setSprite(imageURL) {
    this.sprite.src = imageURL;
  }
  
  //Faz o carregamento da imagem da sprite
  loadSprite() {
    this.sprite.onload = () => {
      this.spriteReady = true;
      game.context.drawImage(this.sprite,this.x,this.y);
    }
  }
  
  //Atualiza a sprite na posição da entidade
  updateSprite() {
    if(this.spriteReady) {
      game.context.drawImage(this.sprite,this.x,this.y);
      
    } else {
      this.loadSprite();
    }
  }
  
  //Atualiza a entidade de acordo com sua posição x e y
  updateRect() {
    game.context.fillStyle = this.rectColor;
    game.context.fillRect(this.x,this.y,this.width,this.height);
  }
  
  //Função principal de Renderizar toda entidade
  render() {
    this.updateRect();
    this.updateSprite();
  }
  
  collision(rect) {
    //Colisão esquerda
    if((rect.x + rect.width) > this.x && rect.x < this.x && rect.y < (this.y + this.height) && (rect.y + rect.height) >= (this.y + this.height)) {
      game.end();
    }
    
    //Colisão direita
    if(rect.x < (this.x + this.width) && (rect.x + rect.width) > (this.x + this.width) && rect.y < (this.y + this.height) && (rect.y + rect.height) >= (this.y + this.height)) {
      game.end();
    }
    
    //Colisão do top
    if((rect.y + rect.height) > this.y && (rect.y + rect.width) < (this.y + this.height) && rect.x >= this.x && (rect.x + rect.width) <= (this.x + this.width)) {
      game.end();
    }
    
    //Colisão da base
    if(rect.y < (this.y + this.height) && (rect.y + rect.height) > (this.y + this.height) && rect.x >= this.x && (rect.x + rect.width) <= (this.x + this.width)) {
      game.end();
    }
  }
  
  //Reseta o carro assim que ele ultrapassar a base do canvas
  restart() {
    if(this.y > 450) {
      game.opponent.road.push(this.x);
      game.opponent.setInitialStats(this);
      game.player.score += game.getPoints();
      game.controlLevel(game.player.score);
    }
  }
  
  npcMove(directionName) {
    switch(directionName) {
      case "bottom":
        this.y += (this.speed * 1);
        break;
    }
  }
  
  move(direction) {
    switch(direction) {
      case 0://top
        if(this.moveTop && this.y > 0 && game.running) {
          this.y += (this.speed * -1);
        }
        break;
      case 1://left
        if(this.moveLeft && this.x > 0 && game.running) {
          this.x += (this.speed * -1);
        }
        break;
      case 2://right
        if(this.moveRight && this.x < 300 && game.running) {
          this.x += (this.speed * 1);
        }
        break;
      case 3://bottom
        if(this.moveBottom && this.y < 400 && game.running) {
          this.y += (this.speed * 1);
        }
        break;
      default: console.error("Valor de direção inválido");
    }
  }
}