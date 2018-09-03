// import { Ending } from '../menus/ending';
// import { GameOver } from '../menus/game-over';
import { Rectangle } from '../gfx/shapes/rectangle';
import { GameOver } from '../menus/game-over';

export class Entity {
  constructor(handler, x, y) {
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;
    this.handler = handler;
    this.b = new Rectangle(0, 0, TILE_SIZE, TILE_SIZE);
    this.pacified = false;
    // this.moveThrough = false;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getCollisionBounds(xOffset, yOffset) {
    return new Rectangle(parseInt(this.x + this.b.x + xOffset),
      parseInt(this.y + this.b.y + yOffset),
      this.b.s, this.b.s);
  }

  checkEntityCollisions(xOffset, yOffset) {
    // console.log(this.x + this.b.x + xOffset, this.y + this.b.y + yOffset, this.b.s, this.b.s, this)
    let candidates =  this.handler.getWorld().getSpatialGrid().retrieve(new Rectangle(this.x + this.b.x, this.y + this.b.y, this.b.s, this.b.s), this);

    // console.log(candidates);
    for(let i = 0; i < candidates.length; i++) {
      let e = candidates[i];
        // console.log('HERE', this.type, this.noCollide, this.noCollide.find(ent => ent.type === e.type));

        // if the player is colliding with an entity of the type in his no collision list
        // if (this.type === 'p' && this.noCollide.find(type => type === e.type)) {
        //   return false;
        // }

        if (e.getCollisionBounds(0, 0).intersects(this.getCollisionBounds(xOffset, yOffset))) {
          this.checkForCollisionEvents(this, e);

          return true;
        }
    }
    return false;
  }

  checkForCollisionEvents(e1, e2) {
    if (e1.pacified) {
      this.endingEvents(e1, e2);
    } else {
      this.gameEvents(e1, e2);
    }
  }

  gameEvents(e1, e2) {
    // if two guards bump, ignore
    if (this.checkCollidingTypes(e1, e2, 'g', 'g')) return;

    let h = this.handler;
    let hG = h.getGame();
    let hW = h.getWorld();
    let player = e1.type === 'p' ? e1 : e2;

    // if player and guard bump
    if (this.checkCollidingTypes(e1, e2, 'p', 'g')) {
      player.state = 2; // 2 = dead
      player.b = { x: 0, y: 0, s: 0 };

      hW.playerDied = true;

      let guard = e1.type == 'g' ? e1 : e2;
      guard.state = 3; // hauling player away;
    }

    // if player and a key bump
    if (this.checkCollidingTypes(e1, e2, 'p', 'key')) {
      let item = e1.type === 'key' ? e1 : e2;
      if (player.item || item.locked) return;

      if (!item.prop) this.handler.getSoundManager().play('pickup');
      player.setItem(item);
      item.setTarget(player);
    }

    // if player and the machine bump
    if (this.checkCollidingTypes(e1, e2, 'p', 'm')) {
      if (!player.item) return;

      let machine = e1.type === 'm' ? e1 : e2;
      let item = player.item;

      this.handler.getSoundManager().play('place');
      item.setTarget(machine);
      item.locked = true;
      machine.addKey(item);
      player.dropItem(item);
    }
  }

  endingEvents(e1, e2) {
    let eM = this.handler.getWorld().getEntityManager();

    //guard and player bump
    if (this.checkCollidingTypes(e1, e2, 'p', 'g')) {
      let guard = e1.type == 'g' ? e1 : e2;

      let exists = !!(eM.findEntitiesByType('speech').find(s => s.entity == guard));
      if (exists) return;

      let player = e1.type == 'p' ? e1 : e2;
      let text = ['Guard: Thank you for saving us!']

      if (!player.item || player.item.type != 'siren') {
        text.push('Please take this siren hat.');
        text.push('To use it, just hit [spacebar]!');
        player.setItem({type: 'siren'});
      }

      eM.addSpeech(guard, text);
    }

      //guard and worker bump
      if (this.checkCollidingTypes(e1, e2, 'p', 'w')) {
        let worker = e1.type == 'w' ? e1 : e2;
  
        let exists = !!(eM.findEntitiesByType('speech').find(s => s.entity == worker));
        if (exists) return;
  
        let text = [worker.getRndSpeech()]
  
        eM.addSpeech(worker, text);
      }

      if (this.checkCollidingTypes(e1, e2, 'p', 'exit')) {
        let gameOver = new GameOver(this.handler, 'machine');
        this.handler.getGame().getGameState().setState(gameOver)
      }
  }

  checkCollidingTypes(e1, e2, type1, type2) {
    return ((e1.type === type1 && e2.type === type2) || (e1.type === type2 && e2.type === type1));
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }
}
