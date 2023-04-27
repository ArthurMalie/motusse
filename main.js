

let dictionary;
let alphabet;
let words;
let word;
let found;
const maxTries = 3;
let tries = 0;
const guesses = [];
const jInput = $('#guess_input');
const jCount = $('#guess_count');
const jMaxTries = $('#max_tries');
const jTries = $('#current_try');
const letters = {};

const readFile = (path) => {
    let rawFile = new XMLHttpRequest();
    let res;
    rawFile.open('GET', path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText;
            }
        }
    }
    rawFile.send(null);
    return res;
};

const makeGuess = (input) => {
    found = word.split('');
    // jInput.val(word[0]);
    jInput.val('');
    for (let i = 0; i < word.length; i++) {
        letters[input[i]].tried = true;
        $(`#guess_${tries}_${i}`).html(input[i]);
        if(input[i] === word[i]) {
            $(`#guess_${tries}_${i}`).addClass('red');
            found[i] = undefined;
            letters[input[i]].correct = true;
            $(`#letters_container span[data-letter=${word[i]}]`).addClass('red-text').removeClass('yellow-text');
        } else {
            $(`#guess_${tries}_${i}`).removeClass('red');
        }
    }
    for (let i = 0; i < word.length; i++) {
        const foundIndex = found.indexOf(input[i]);
        if(input[i] !== word[i]) {
            if(foundIndex !== -1) {
                found[foundIndex] = undefined;
                $(`#guess_${tries}_${i}`).addClass('yellow');
                if(!letters[input[i]].correct) {
                    $(`#letters_container span[data-letter=${input[i]}]`).addClass('yellow-text').removeClass('red-text');
                }
            }
            if(!word.includes(input[i])) {
                $(`#letters_container span[data-letter=${input[i]}]`).hide();
                $(`#tried_letters_container span[data-letter=${input[i]}]`).show();
            }
        }
    }
    
    $(`#count_${tries}>img.heart`).hide();
    $(`#count_${tries}>img.cross`).css('display','block');
    tries++;

    if(tries === maxTries) {
        if(input === word) {
            $('#won , #end_container').show();
        } else {
            $('#lost , #end_container').show();
            $('#soluce').html(word);
        }
        jInput.prop('disabled', true);
    } else {
        if(input === word) {
            $('#won , #end_container').show();
            jInput.prop('disabled', true);
        } else {
            const first = $(`#guess_${tries}_${0}`).addClass('red').html(word[0]);
            if(word[0] === input[0])
                first.addClass('red');
            for (let j = 1; j < word.length ; j++) {
                $(`#guess_${tries}_${j}`).html('_');
            }
        }
        jTries.html(tries + 1);
    }
};

const init = () => {
    dictionary = readFile('./assets/pli07.txt');
    words = dictionary.split('\n');
    word = words[Math.floor(Math.random() * words.length)];
    // jInput.val(word[0]);
    jInput.attr('placeholder', word[0] + '...');
    jInput.focus();
    jCount.html('1/' + word.length);
    jMaxTries.html(maxTries);
    jTries.html(1);

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    alphabet = alpha.map((x) => String.fromCharCode(x));
    alphabet.forEach(letter => { 
        letters[letter] = {
            // correct: word.includes(letter),
            correct: letter === word[0],
            tried: word[0] === letter
        };

        $('#letters_container,#tried_letters_container').append(`<span data-letter="${letter}">${letter}</span>`);
        $(`#letters_container span[data-letter=${word[0]}]`).addClass('red-text').removeClass('yellow-text');
    });
    

    console.log(word);
    console.log(letters);

    const guessesContainer = $('#guesses_container');
    guessesContainer.css('grid-template-columns', 'repeat(' + word.length + ', 1fr');

    for (let i = 0; i < maxTries; i++) {
        let dom = '';
        for (let j = 0; j < word.length ; j++) {
            dom += `<div id="guess_${i}_${j}" class="guess_letter${j === 0 && i === 0 ? ' red' : ''}"> ${j === 0 && i === 0 ? word[0] : i === 0 ? '_' : ' '}  </div>`
        }
        guessesContainer.append(dom);
    
        $('#count_container').append(`
            <div id="count_${i}" class="count_spot"></div>
        `);
        $('#count_container2').append(`
            <div id="count_${i}" class="count_spot2"><img class="cross" src="./assets/images/cross.svg" /><img class="heart" src="./assets/images/heart.svg" /></div>
        `);
    }
    
    // for (let j = 0; j < word.length ; j++) {
    //     dom += `<div id="guess_${maxTries}_${j}" class="guess_letter last"> ${j === 0 && i === 0 ? word[0] : i === 0 ? '_' : ' '}  </div>`
    // }

    $('body').not(jInput).on('keyup', (e) => {
        if(!jInput.is(':focus') && e.which >= 65 && e.which <= 90) {
            jInput.trigger('focus');
            jInput.val(jInput.val() + String.fromCharCode(e.which));
        }
    });
    
    jInput
    .attr('maxLength', word.length)
    .on('keyup', function (e) {
        // if(this.value.length === 0)
        // this.value = word[0];
        if(e.which === 13 && this.value.length === word.length)
        makeGuess(this.value.toUpperCase());
        // $(this).trigger('keyup');
        jCount.html(this.value.length + '/' + word.length);
    });
    
    
    // jInput.on('focusout', () => {
        //     jInput.trigger('focus');
        // });
};

init();