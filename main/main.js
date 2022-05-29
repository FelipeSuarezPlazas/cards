

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.


const TOP_MARGIN = 100;

const CARD_SIZE = createVector(100, 110);
const CARDS_GRID = createVector(4, 3);
const CARD_MARGINS = {
  left: 0,
  top: 0,
  right: 15,
  bottom: 15,
}

let CARDS_DIMENTIONS = {};
CARDS_DIMENTIONS.WIDTH = ((CARDS_GRID.x * CARD_SIZE.x) + ((CARDS_GRID.x - 1) * CARD_MARGINS.right));
CARDS_DIMENTIONS.HEIGHT = ((CARDS_GRID.y * CARD_SIZE.y) + ((CARDS_GRID.y - 1) * CARD_MARGINS.bottom));
CARDS_DIMENTIONS.TOP_LEFT_POS = createVector((windowWidth/2) - (CARDS_DIMENTIONS.WIDTH / 2), TOP_MARGIN);
CARDS_DIMENTIONS.TOP_RIGHT_POS = CARDS_DIMENTIONS.TOP_LEFT_POS.copy().add(CARDS_DIMENTIONS.WIDTH, 0);
CARDS_DIMENTIONS.BOTTOM_LEFT_POS = CARDS_DIMENTIONS.TOP_LEFT_POS.copy().add(0, CARDS_DIMENTIONS.HEIGHT);

console.log(CARDS_DIMENTIONS.HEIGHT, 'CARDS_DIMENTIONS.HEIGHT')
console.log(CARDS_DIMENTIONS.BOTTOM_LEFT_POS, 'CARDS_DIMENTIONS.BOTTOM_LEFT_POS')


// -------------------------------------------------------------- LIVES.


lives = {
  value: 'Lives: ',
  text: createP('Lives: '),

  amount: 5,
  counter: 0,

  //pos: p5.Vector.sub(CARDS_DIMENTIONS.TOP_LEFT_POS.copy(), createVector(0, 20)),
  //pos: createVector(0, 20),
  pos: CARDS_DIMENTIONS.TOP_LEFT_POS.copy().sub(0, 50),

  setup: function() {
    this.text.position(this.pos.x, this.pos.y);
    this.text.html(this.value + this.amount);
  }
}

// -------------------------------------------------------------- SENTENCE.


sentence = {
  value: 'SELECT THE PAIRS',
  text: createP('SELECT THE PAIRS'),

  amount: 5,
  counter: 0,

  //pos: p5.Vector.sub(CARDS_DIMENTIONS.TOP_LEFT_POS.copy(), createVector(0, 20)),
  //pos: createVector(0, 20),
  pos: createVector(CARDS_DIMENTIONS.TOP_LEFT_POS.x + CARD_SIZE.x + CARD_MARGINS.right + 20, CARDS_DIMENTIONS.TOP_LEFT_POS.y - 50),

  setup: function() {
    this.text.position(this.pos.x, this.pos.y);
    this.text.html(this.value);
  }
}


// -------------------------------------------------------------- CARDS.


function createCard(POS) {
  this.pos = POS;
  this.size = CARD_SIZE.copy();

  let ground = createDiv('');
  let cover = createDiv('');
  
  ground.position(this.pos.x, this.pos.y);
  cover.position(this.pos.x, this.pos.y);

  ground.size(this.size.x, this.size.y);
  cover.size(this.size.x, this.size.y);

  this.ground = ground;
  this.cover = cover;

  this.isCoverd = true;
}

class Card {
  constructor(POS) {
    this.pos = POS;
    this.size = CARD_SIZE.copy();

    let ground = createDiv('');
    let cover = createDiv('');
    
    ground.position(this.pos.x, this.pos.y);
    cover.position(this.pos.x, this.pos.y);

    ground.size(this.size.x, this.size.y);
    cover.size(this.size.x, this.size.y);

    this.ground = ground;
    this.cover = cover;

    this.isCoverd = true;
  }
}

cards = {
  // here goes all the cards.
  list: [],
  by_cover_ids: {},

  setup: function() {
    console.log('CARDS SETUP METHOD');
    // here all the cards are draw
    let card_counter = 0;
    for (let x = CARDS_DIMENTIONS.TOP_LEFT_POS.copy().x; 
      x < CARDS_DIMENTIONS.TOP_RIGHT_POS.x;
      x += (CARD_SIZE.x + CARD_MARGINS.right)) {

      console.log(CARDS_DIMENTIONS.TOP_LEFT_POS.copy().y, CARDS_DIMENTIONS.BOTTOM_LEFT_POS.y);

      for (let y = CARDS_DIMENTIONS.TOP_LEFT_POS.copy().y; 
        y < CARDS_DIMENTIONS.BOTTOM_LEFT_POS.y;
        y += (CARD_SIZE.y + CARD_MARGINS.bottom))
      {
        const CARD_POS = createVector(x, y);

        let card = new Card(CARD_POS);
        card.ground.class('card-ground');
        card.cover.class('card-cover');

        const cover_id = 'cover' + card_counter;

        card.cover.id(cover_id);

        this.by_cover_ids[cover_id] = card;
        this.list.push(card);

        card_counter += 1;
      }
    }
  },
  coverPressed: function() {
    
  }


    // for each card on the game, assign an onclick function.

    document.querySelectorAll('.card-cover').forEach(COVER => {
      COVER.onclick = (COVER) => {
        const CARD_ID = COVER.currentTarget.id;
        const SELECTED_CARD = this.by_cover_ids[CARD_ID];
        console.log(CARD_ID, 'IT WORKS');

        let color = '';
        SELECTED_CARD.isCoverd ? color = 'rgba(0,0,0,0)' : color = 'black';
        SELECTED_CARD.isCoverd = !SELECTED_CARD.isCoverd;

        const COVER_HTML = document.getElementById(CARD_ID);
        COVER_HTML.style.background = color;
        console.log(COVER_HTML);
        //COVER.style.background = 'yellow';
      }
    })
  }
}


// -------------------------------------------------------------- FUNCTIONS.


function setup() {
  let CNV = createCanvas(windowWidth, windowHeight);
  CNV.parent('canva-game');

  background('white');

  lives.setup();
  sentence.setup();
  cards.setup();

  restart();
}

function restart() {

}





/*
function mousePressed() {
  fill('purple');
  rectMode(CENTER);
  rect(mouseX, mouseY, 100, 100)
}
*/









