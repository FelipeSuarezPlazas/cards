




// ------------------------------------------------------------------------ START MENU.

let menu = {
  menu: document.getElementById('menu'),
  title: document.getElementById('title'),
  start_button: document.getElementById('start-button'),
  timeout: null,

  setup: function() {
    this.start_button.onclick = this.__handleStartButtonClick.bind(this);
    this.restart()
  },
  restart: function(msgs) {
    /*
    this.title.innerHTML = msgs.title_msg;
    this.start_button.innerHTML = msgs.start_button_msg;*/

    this.title.innerHTML = 'MEMORISE';
    this.start_button.innerHTML = 'START';

    this.menu.style.zIndex = 10;
    this.menu.style.opacity = '1';
    this.start_button.disabled = false;

  },
  __handleStartButtonClick: function() {
    console.log('start button clicked');

    this.start_button.disabled = true;
    this.menu.style.opacity = '0';

    this.timeout = setTimeout(() => {

      this.menu.style.zIndex = -10;
      control.startGame();

    }, 1000);
  },
}


// ------------------------------------------------------------------------ INSTRUCTIONS.

let instructions = {
  instructions: document.getElementById('instructions'),
  texts: {
    timer_simbol: '*',
    timer: '',
    selection: 'SELECT ALL THE PAIRS',
  },

  start_time: 3000,
  timer_time: 5000,
  timer_time_steps: 20,

  timeout: null,
  interval: null,
  interval_counter: 0,

  setup: function() {
    let text = '';
    for (var i = 0; i < this.timer_time_steps*2; i++) {
      text += this.texts.timer_simbol;
    }
    this.texts.timer = text;
    this.restart();

  },
  restart: function() {
    this.instructions.innerHTML = this.texts.timer;

    //control.send(control.go.uncover_cards);
  },
  startTimer: function() {
    console.log('HELO??');
    this.interval_counter = 0;
    this.interval = setInterval(this.__changeTimerText.bind(this), 
      (this.timer_time/this.timer_time_steps));

  },
  __changeTimerText: function() {
    console.log('SHOW ME SOMETHING...')
    let text = this.instructions.innerHTML;
    text = text.slice(0, text.length-2);
    this.instructions.innerHTML = text;

    this.interval_counter += 1;

    if (this.interval_counter == this.timer_time_steps) {
      // cover the cards again.
      clearInterval(this.interval);
      this.__selection();
      control.coverCards();
    }
  },
  __selection: function() {
    this.instructions.innerHTML = this.texts.selection;
  }
}


// ------------------------------------------------------------------------ CARDS.

let cards = {
  container: document.getElementById('cards'),
  dictionary: {
    '🐔': 'chicken',
    '🦓': 'zebra',
    '🐸': 'frog',
    '🐶': 'dog',
    '🐷': 'pig',
    '🦁': 'lion',
    '🐼': 'panda bear',
    '🐮': 'cow',
    '🐵': 'monkey',
    '🐭': 'mouse',
    '🐱': 'cat',
    '🐍': 'snake',

  },
  values: [],
  selected_values: [],
  //colors: ['aqua', 'plum', 'aquamarine', 'salmon', 'lawngreen', 'blueviolet', 'aqua', 'plum', 'aquamarine', 'salmon', 'lawngreen', 'blueviolet'],
  colors: ['#ff956d', '#d7ff6d', '#956dff', '#6dd7ff', '#6dff95', '#ff8be0'],
  amount: 12,
  limit_selectable: 2,
  selected_counter: 0,
  hover_class: 'card-cover-hover',
  wrong_animation_class: 'card-wrong-animation',

  cards: [],
  card_contents: [],
  card_words: [],
  covers: [],
  covers_by_id: {},
  cards_by_cover_ids: {},

  values_by_cover_ids: {},
  selected_cover_ids: [],

  already_right_cover_ids: [],

  startTransitionTimeout: null,
  start_transition_time: '3000', // miliseconds.

  wrongSelectionTimeout: null,
  wrong_selection_time: '400', // miliseconds.

  setup: function() { // here all the cards and the covers are created.
    this.values = Object.keys(this.dictionary);

    for (let i=0; i<this.amount; i++) {
      const WRAPPER = document.createElement('div');
      WRAPPER.setAttribute('class', 'wrapper');
      this.container.appendChild(WRAPPER);

      const CARD = document.createElement('div');
      CARD.setAttribute('class', 'card');
      WRAPPER.appendChild(CARD);

      const CARD_CONTENT = document.createElement('p');
      CARD_CONTENT.setAttribute('class', 'card-emoji');
      CARD.appendChild(CARD_CONTENT);
      this.card_contents.push(CARD_CONTENT);

      const CARD_WORD = document.createElement('p');
      CARD_WORD.setAttribute('class', 'card-word');
      CARD_WORD.innerHTML = 'MONKEY';
      CARD.appendChild(CARD_WORD);
      this.card_words.push(CARD_WORD);


      const COVER = document.createElement('div');
      COVER.addEventListener('click', this.__handleCoverClick.bind(this));
      COVER.innerHTML = '✋';
      COVER.setAttribute('class', 'card-cover');

      const COVER_ID = 'card-cover'+i;
      COVER.setAttribute('id', COVER_ID);
      WRAPPER.appendChild(COVER);

      this.cards.push(CARD);
      this.covers.push(COVER);
      this.covers_by_id[COVER_ID] = COVER;
      this.cards_by_cover_ids[COVER_ID] = CARD;
    }

    this.restart();
  },
  restart: function() {
    console.log('RESTART THE VALUES OF THE SETUP');
    for (const COVER_ID of this.already_right_cover_ids) {
      const CARD = this.cards_by_cover_ids[COVER_ID];
      CARD.style.background = 'white';
    }

    for (const COVER of this.covers) {
      //COVER.setAttribute('class', 'card-cover');
      console.log(COVER.getAttribute('class'), 'cover classes');
    }
    

    this.values_by_cover_ids = {};
    this.selected_cover_ids = [];
    this.already_right_cover_ids = [];



    this.__randomTheValues();

    // asignar valores aleatoreos a todos los contenidos de las cartas.
    for (var i = 0; i < this.cards.length; i++) {
      const CARD = this.cards[i];
      const COVER = this.covers[i];
      const CARD_VALUE = this.selected_values[i];
      
      const CARD_CONTENT = this.card_contents[i];
      CARD_CONTENT.textContent = CARD_VALUE;

      const CARD_WORD = this.card_words[i]
      CARD_WORD.innerHTML = this.dictionary[CARD_VALUE].toUpperCase();
      console.log(CARD_VALUE, 'VALUE OF THE CARD');

      
      this.values_by_cover_ids[COVER.getAttribute('id')] = CARD_VALUE;
      
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
  __HandleClickAllowed: function(COVER_ID) {
    if (!document.getElementById(COVER_ID).classList.contains(this.hover_class)) return false;
    
    // --- the user is selecting an already right card.
    if (this.already_right_cover_ids.includes(COVER_ID)) {
      console.log('ALREADY RIGHT COVER');
      return false;
    }

    // ----- If the user is selecting the same card again. (doesnt matter if selected ids is empty)
    if (this.selected_cover_ids[0] == COVER_ID) {
      console.log('***SELECTING THE SAME CARD***');
      return false;
    }

    return true;
  },
  __handleCoverClick: function(event) {
    const SELECTED_COVER_ID = event.currentTarget.id;
    if (!this.__HandleClickAllowed(SELECTED_COVER_ID)) return;


    
    if (this.selected_cover_ids.length < this.limit_selectable) {
      // ----- This cover must be in the list of selected ones (2 cards*)
      this.selected_cover_ids.push(SELECTED_COVER_ID);

      // ----- The cover.
      const SELECTED_COVER = document.getElementById(SELECTED_COVER_ID);
      SELECTED_COVER.style.opacity = '0';

      console.log('VALUE SELECTED: ', 
        this.values_by_cover_ids[this.selected_cover_ids[this.selected_cover_ids.length-1]],
        this.values_by_cover_ids[SELECTED_COVER_ID]);

      // ----- The second value.
      if (this.selected_cover_ids.length == 2) {
        this.switchInputAvailability('remove');
        this.__calculateScore();
      }
    }
  },
  __calculateScore: function() {
    // ----- Compare the two selected card values.
    const card_value1 = this.values_by_cover_ids[this.selected_cover_ids[0]];
    const card_value2 = this.values_by_cover_ids[this.selected_cover_ids[1]];

    console.log(card_value1 + ' == ' + card_value2);

    if (card_value1 == card_value2) {
      console.log('GOOD');
      this.__right();
    } else { 
      console.log('BAD');
      this.__wrong(); 
    }

    // aqui es donde calculo si se ha perdido o se ha ganado
    // lo primero es tomar el valor de hearts.
  },
  __right: function() {
    const COLOR = this.colors[this.already_right_cover_ids.length/2];

    for (const COVER_ID of this.selected_cover_ids) {
      const CARD = this.cards_by_cover_ids[COVER_ID];
      CARD.style.background = COLOR;

      const COVER = this.covers_by_id[COVER_ID];
      COVER.setAttribute('class', COVER.getAttribute('class') + ' card-cover-disabled');

      this.already_right_cover_ids.push(COVER_ID)
      console.log(COVER.getAttribute('class'));
    }

    if (this.already_right_cover_ids.length == this.amount) {
      control.finish();
    }

    this.__restartValuesAfterSelection();
  },
  __wrong: function() {
    let wrong_animation_done = false;
    this.wrongSelectionTimeout = setTimeout(() => {
      clearTimeout(this.wrongSelectionTimeout);
      for (const COVER_ID of this.selected_cover_ids) {
        const CARD = this.cards_by_cover_ids[COVER_ID];
        CARD.classList.add(this.wrong_animation_class);
        CARD.addEventListener('animationend', () => {
          CARD.classList.remove(this.wrong_animation_class);


          if (wrong_animation_done) { return;
          } else { wrong_animation_done = true; }

          for (const COVER_ID of this.selected_cover_ids) {
            const COVER = this.covers_by_id[COVER_ID];
            COVER.style.opacity = '100%';
          }

          this.__restartValuesAfterSelection();
          control.wrongSelection();
        })
      }
    }, this.wrong_selection_time);
  },
  __restartValuesAfterSelection: function() {
    this.selected_cover_ids = [];
    this.switchInputAvailability('add');
  },
  uncoverAll: function() {
    for(const COVER of this.covers) {
      COVER.style.opacity = '0';
    }

  },
  coverAll: function() {
    for(const COVER of this.covers) {
      COVER.style.opacity = '1';
    }

  },
  switchInputAvailability: function(option) {
    if (option == 'add') {
      for (const COVER of this.covers) {
        COVER.classList.add(this.hover_class);
      }
    } else if (option == 'remove') {
      for (const COVER of this.covers) {
        COVER.classList.remove(this.hover_class);
      }
    } else {
      for (const COVER of this.covers) {
        COVER.classList.toggle(this.hover_class);
      }
    }
  },
}


// ------------------------------------------------------------------------ LIVES

let hearts = {
  container: document.getElementById('hearts'),
  text: '❤️',
  amount: 5,
  counter: null,
  hearts: [],
  decrease_animation_class: 'heart-decrease-animation',

  setup: function() {
    for (let i=0; i<this.amount; i++) {
      const HEART = document.createElement('div');
      HEART.innerHTML = this.text;
      HEART.setAttribute('class', 'heart');
      this.container.appendChild(HEART);

      this.hearts.push(HEART);
    }

    this.restart();
  },
  restart: function() {
    this.counter = this.amount - 1;

    for (const HEART of this.hearts) {
      HEART.style.opacity = 1;
      HEART.style.transform = 'translateX(0)';
    }
  },
  decrease: function() {
    const HEART = this.hearts[this.counter];
    
    HEART.classList.add(this.decrease_animation_class);
    HEART.addEventListener('animationend', () => {
      HEART.style.opacity = 0;
      HEART.classList.remove(this.decrease_animation_class);

    })

    this.counter -= 1;
    if (this.counter < 0) { control.finish(); }
  }
}


// ------------------------------------------------------------------------ CONTROL


let control = {
  timeout: null,

  setup: function() {
    menu.setup();
    instructions.setup();
    cards.setup();
    hearts.setup();
  },
  startGame: function() {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout)
      cards.uncoverAll();

      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout)
        instructions.startTimer();

      }, 500);
    }, 1000);
  },
  coverCards: function() {
    cards.coverAll();
    this.timeout = setTimeout(() => {
      cards.switchInputAvailability('add');
    }, 500);
  },
  wrongSelection() {
    hearts.decrease();
  },
  finish: function() {
    cards.switchInputAvailability('remove');

    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      menu.restart( {title_text: 'GAME OVER', start_button_text: 'TRY AGAIN'} );

      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        cards.coverAll();

        hearts.restart();
        cards.restart();
        instructions.restart();

      }, 500);

    }, 1400);

  }
}

control.setup();


// ------------------------------------------------------------------------ FUNCTIONS







function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

