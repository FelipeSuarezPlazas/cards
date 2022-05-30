








// ------------------------------------------------------------------------ START MENU.

let cvt = document.getElementById('cards');

let game_wrapper = document.getElementById('game-wrapper');

let menu_container = document.getElementById('menu-container');
menu_container.addEventListener('transitionend', (element) => {
  menu_container.remove();
  start_button.disabled = true;
  console.log('menu container transitionend');

  /*
  
  Once this is done:
   - All the cover divs need to change their opacity to 0.
   - 

  */

  hearts.restart();
  cards.restart();

  cards.startTransition(); // **** make this possible.
  // start a timer that when finished it start the cover cards.
})

let start_button = document.getElementById('start-button');


// FIX THIS (put transition and assign position to menu_container) ***************************************
start_button.onclick = element => {
  menu_container.style.opacity = '0';
  console.log('start button clicked');
  //menu_container.remove();
  //start_button.disabled = true;
}



let menu = {
  restart: function() {
    game_wrapper.appendChild(menu_container);
    menu_container.style.opacity = '100%';
    start_button.disabled = false;
  }
}


// ------------------------------------------------------------------------ INSTRUCTIONS.

const INSTRUCTIONS_DIV = document.getElementById('instructions');

let instructions = {

}


// ------------------------------------------------------------------------ CARDS.

let cards = {
  div: document.getElementById('cards'),
  values: '🐔 🦓 🐸 🐶 🐷 🐼 🦁 🐮 🐵 🐭 🐱 🐍'.split(' '),
  selected_values: [],
  amount: 12,
  limit_selectable: 2,
  selected_counter: 0,

  cards: [],
  covers: [],
  covers_by_id: {},
  values_by_cover_ids: {},
  selected_cover_ids: [],
  cards_by_cover_ids: {},

  startTransitionTimeout: null,
  start_transition_time: '3000', // miliseconds.

  wrongSelectionTimeout: null,
  wrong_selection_time: '1000', // miliseconds.

  setup: function() { // here all the cards and the covers are created.
    this.__randomTheValues();
    for (let i=0; i<this.amount; i++) {
      const CARD = document.createElement('div');
      CARD.setAttribute('class', 'card');

      // I need for 0 and 1 the same value
      // for 2 and 3. 4 and 5

      //const VALUE_INDEX = ((i+10)%2 != 0) ? i : i-1;

      const CARD_VALUE = this.selected_values[i];
      CARD.innerHTML = CARD_VALUE;
      this.div.appendChild(CARD);


      const COVER = document.createElement('div');
      COVER.innerHTML = '✋';
      COVER.setAttribute('class', 'card-cover');
      const COVER_ID = 'card-cover'+i;
      COVER.setAttribute('id', COVER_ID);
      // CARD.setAttribute('id', 'cover id'); ************** SET THIS ID.
      CARD.appendChild(COVER);

      this.cards.push(CARD);
      this.covers.push(COVER);
      this.covers_by_id[COVER_ID] = COVER;
      this.values_by_cover_ids[COVER_ID] = CARD_VALUE;
      this.cards_by_cover_ids[COVER_ID] = CARD;
    }
  },
  restart: function() {
    for (const CARD of this.cards) {
      CARD.style.background = 'white';
    }

    for (const COVER of this.covers) {
      COVER.setAttribute('class', 'card-cover');
    }
  },
  __randomTheValues: function() {
    let values_copy = this.values.slice();
    let selected_values = [];
    let final_values = [];
    let counter = 0;

    // lo primero es remover 6 valores aleatoreos que se van a usar en el juego

    while(counter < (this.amount/2)) {
      const INDEX = getRandomInt(0, values_copy.length);
      const VALUE = values_copy.splice(INDEX, 1)[0];
      selected_values.push(VALUE);
      counter += 1;
    }

    selected_values = selected_values.concat(selected_values);
    // ya teniendo esos 6 valores aleatoreos, lo que debo hacer ahora es duplicarlos
    // y organizarlos de forma aleatorea.

    for (const VALUE of selected_values) {
      console.log(VALUE, 'RANDOM VALUE');
    }

    while(selected_values.length > 0) {
      const INDEX = getRandomInt(0, selected_values.length);
      const VALUE = selected_values.splice(INDEX, 1)[0];
      final_values.push(VALUE);
    }

    console.log('   ');

    for (const VALUE of final_values) {
      console.log(VALUE, 'RANDOM VALUE');
    }

    this.selected_values = final_values.slice();
  },
  startTransition: function() {
    this.__uncoverAll();
    //this.__startTransition2.bind(cards);
    this.startTransitionTimeout = setTimeout(this.__startTransition2.bind(this), this.start_transition_time);
    console.log('********')
  },
  __startTransition2: function() {
    clearTimeout(this.startTransitionTimeout);
    console.log(this.start_transition_time, 'the time');
    this.__coverAll();
    this.__assignClickEvents();
  },
  __assignClickEvents: function() {
    for(const COVER of this.covers) {
      /*COVER.onclick = (element) => {
        console.log('YYEEAAHHHHHHH', element);

      }*/
      COVER.addEventListener('click', event => {
        this.__handleCoverClick(event);
      })
    }
  },
  __handleCoverClick: function(event) {
    console.log('cover click event');
    this.selected_counter += 1;

    if (this.selected_counter <= this.limit_selectable) {
      console.log('YYEEAAHHHHHHH', event.currentTarget.id, this.limit_selectable);
      const SELECTED_COVER_ID = event.currentTarget.id;

      if ((this.selected_counter == this.limit_selectable) && // the second is begin selected.
        (this.selected_cover_ids[0] == SELECTED_COVER_ID)) {
        // he is selecting the same card.

        this.selected_counter -= 1;
        return;
      };

      const SELECTED_COVER = document.getElementById(SELECTED_COVER_ID);
      SELECTED_COVER.style.opacity = '0';

      this.selected_cover_ids.push(SELECTED_COVER_ID);

      if (this.selected_cover_ids[0] == this.selected_cover_ids[1]) return;

      //console.log(this.values_by_cover_ids[this.selected_cover_ids[0]],this.values_by_cover_ids[this.selected_cover_ids[1]]);
      //console.log(this.values_by_cover_ids[this.selected_cover_ids[0]] == this.values_by_cover_ids[this.selected_cover_ids[1]]);
      const card_value1 = this.values_by_cover_ids[this.selected_cover_ids[0]];
      const card_value2 = this.values_by_cover_ids[this.selected_cover_ids[1]];

      // if right or wrong.
      if (this.selected_counter == this.limit_selectable) {
        if (card_value1 == card_value2) { this.__right();
        } else { this.__wrong(this.selected_cover_ids); }
        this.__restartValuesAfterSelection();
      }
    }
  },
  __restartValuesAfterSelection: function() {
    this.selected_counter = 0;
    this.selected_cover_ids = [];
  },
  __right: function() {
    // their values are equal.
    for (const COVER_ID of this.selected_cover_ids) {
      const CARD = this.cards_by_cover_ids[COVER_ID];
      CARD.style.background = 'blueviolet';

      const COVER = this.covers_by_id[COVER_ID];
      COVER.setAttribute('class', COVER.getAttribute('class') + ' card-cover-disabled')
      console.log(COVER.getAttribute('class'));
    }
    console.log('EQUAL C:');
  },
  __wrong: function(WRONG_COVER_IDS) {
    console.log('NOT EQUAL :C');

    this.wrongSelectionTimeout = setTimeout(() => 
      {this.__undoWrongSelection(WRONG_COVER_IDS)}, this.wrong_selection_time);

    hearts.decrease();
  },
  __undoWrongSelection: function(WRONG_COVER_IDS) {
    clearTimeout(this.wrongSelectionTimeout);
    for (const COVER_ID of WRONG_COVER_IDS) {
      const COVER = this.covers_by_id[COVER_ID];
      COVER.style.opacity = '100%';
    }
  },
  __uncoverAll: function() {
    for(const COVER of this.covers) {
      COVER.style.opacity = '0';
    }
  },
  __coverAll: function() {
    for(const COVER of this.covers) {
      COVER.style.opacity = '100%';
    }
  },
}



// ------------------------------------------------------------------------ LIVES


let hearts = {
  container: document.getElementById('hearts'),
  states: {alive: '❤️', dead: '🖤'}, // 🤍
  amount: 5,
  counter: null,
  hearts: [],

  setup: function() {
    this.counter = this.amount - 1;

    for (let i=0; i<this.amount; i++) {
      const HEART = document.createElement('div');
      HEART.innerHTML = this.states.alive;
      HEART.setAttribute('class', 'heart');
      this.container.appendChild(HEART);

      this.hearts.push(HEART);
    }
  },
  restart: function() {
    this.counter = this.amount - 1;

    for (const HEART of this.hearts) {
      HEART.innerHTML = this.states.alive;
    }
  },
  decrease: function() {
    // based on the counter change the innerHTML of the the las heart.

    const HEART = this.hearts[this.counter];
    HEART.innerHTML = this.states.dead;

    this.counter -= 1;
    if (this.counter < 0) {
      console.log('GAME OVER');

      menu.restart();
    }
  }
}



// ------------------------------------------------------------------------ FUNCTIONS



hearts.setup();
cards.setup();




function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}






/*


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
    
  /


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


*/


/*
function mousePressed() {
  fill('purple');
  rectMode(CENTER);
  rect(mouseX, mouseY, 100, 100)
}
*/









