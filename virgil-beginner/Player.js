class Space {
  constructor(explored) {
      this.explored = explored;
  }
}

function pos_str(pos) {
    return '(' + pos[0] + ',' + pos[1] + ')';
}

class Player {
  constructor() {
      this.state = 'exploring'; // current state can be: exploring, fighting, recovering
      this.prevHealth = 20;
      this.directions = ['backward', 'forward', 'left', 'right'];

      this.explored = new Set();
      this.explored.add('(0,0)');
      this.x = 0;
      this.y = 0;
  }


  playTurn(warrior) {
      // Cool code goes here

      if (this.state == 'exploring') {
          this.explore(warrior);
      } else if (this.state == 'fighting') {
          this.fight(warrior);
      } else if (this.state == 'recovering') {
          this.recover(warrior);
      }

      this.prevHealth = warrior.health();
  }

  explore(warrior) {
      // Move to any space that is empty, TODO: check whether that space has been visited already
      for (let dir of this.directions) {
          if (warrior.feel(dir).isCaptive()) {
              warrior.rescue(dir);
              return;
          } else if (warrior.feel(dir).isEnemy()) {
              this.state = 'fighting';
              this.fight(warrior);
              return;
          }

          let other_pos = this.get_pos(dir);
          // console.log("pos: " + this.x + ", " + this.y);
          // console.log("other pos: " + other_pos[0] + ", " + other_pos[1]);
          // console.log("is it explored? " + (this.is_explored(other_pos) ? "yes" : 'no'));

          if (!this.is_explored(other_pos) && warrior.feel(dir).isEmpty()) {
              this.move(warrior, dir);
              return;
          }
      }
      // nothing unexplored found
      this.move(warrior, 'forward');
  }

  fight(warrior) {
      if (!warrior.feel().isEmpty()) {
          warrior.attack();
      } else {
          this.state = 'recovering';
          this.recover(warrior);
      }
  }

  recover(warrior) {
      if (this.prevHealth > warrior.health()) { // policy: charge enemies
          // this.state = 'exploring';
          // this.explore(warrior);
          this.move(warrior, 'backward');
      } else if (warrior.health() <= 15) { // rest until having over 15 hp
          warrior.rest();
      } else {
          this.state = 'exploring';
          this.explore(warrior);
      }
  }

  move(warrior, direction) { // move the warrior in a given direction, registering relevant information
      let new_pos = this.get_pos(direction);
      this.x = new_pos[0];
      this.y = new_pos[1];
      this.explored.add(pos_str(new_pos));
      // console.log("Pos " + this.x + " " + this.y + " is explored now.");
      // for (let it of this.explored) {
      // console.log(it);
      // }
      warrior.walk(direction);
  }

  is_explored(pos) {
      return this.explored.has(pos_str(pos));
  }

  get_pos(direction) {
      var new_x = this.x,
          new_y = this.y;

      switch (direction) { // assumption: the warrior does not rotate TODO: guess what - the warrior has to rotate
          case 'backward':
              new_x -= 1;
              break;
          case 'forward':
              new_x += 1;
              break;
          case 'left':
              new_y += 1;
              break;
          case 'right':
              new_y -= 1;
              break;
          default:
              break;
      }

      return [new_x, new_y];
  }
}

global.Player = Player;
