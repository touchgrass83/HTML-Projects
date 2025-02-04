
const GAME_PLAYER = [];
GAME_PLAYER[false] = "O";
GAME_PLAYER[true] = "X";

const WINNING_POSITIONS = ["123", "456", "789", "147", "258", "369", "159", "357"];

const BTNS = document.querySelectorAll(".btn");

const GAME = document.querySelector(".game");
const MAIN_MENU = document.querySelector(".main-menu");
const GAME_OVER = document.querySelector(".game-over");

const BTN_CLICK_SOUND = document.querySelector("#btn-click-sound");
const GAME_WON_SOUND = document.querySelector("#game-won-sound");
const GAME_DRAW_SOUND = document.querySelector("#game-draw-sound");
const GAME_END_SOUND = document.querySelector("#game-end-sound");
const BACKGROUND_MUSIC = document.querySelector("#background-music");


let WON_POSITION = "";

let player = false;

let won = false;

let played = [];

function start() {

    GAME_DRAW_SOUND.pause();
    GAME_WON_SOUND.pause();

    GAME_DRAW_SOUND.currentTime = 0;
    GAME_WON_SOUND.currentTime = 0;
    
    BACKGROUND_MUSIC.currentTime = 0;
    BACKGROUND_MUSIC.play();

    MAIN_MENU.style.display = "none";
    GAME_OVER.style.display = "none";

    GAME.style.display = "block";

    BTNS.forEach((btn) => {
        btn.innerText = "";
        btn.style.animation = "";
    });

    played[GAME_PLAYER[player]] = "";
    played[GAME_PLAYER[!player]] = "";

    won = false;

    WON_POSITION = "";
}

function update(e) {

    let target = e.target;

    target.innerText = GAME_PLAYER[player];

    played[GAME_PLAYER[player]] += target.id;

    WINNING_POSITIONS.forEach((position) => {
        if (!won) {
            won = true;
            for (let i = 0; i < 3; i++) {
                if (!played[GAME_PLAYER[player]].includes(position[i])) {
                    won = false;
                }
            }

            if(won) {
                WON_POSITION = position;
            }
        }
    });

    if (won) {

        for(let i = 0; i < 3; i++) {
            document.getElementById(`${WON_POSITION[i]}`).style.animation = "8s linear won";
        }

        BACKGROUND_MUSIC.pause();
        GAME_WON_SOUND.play();
        setTimeout(() => {
            GAME_END_SOUND.play();
            
            GAME.style.display = "none";

            GAME_OVER.style.display = "flex";
            GAME_OVER.style.animation = "3s forwards flash";
        }, 2000);

    }


    player = !player;

    if (played[GAME_PLAYER[player]].length + played[GAME_PLAYER[!player]].length == 9 && !won) {

        BACKGROUND_MUSIC.pause();
        GAME_DRAW_SOUND.play();

        BTNS.forEach((btn) => {
            btn.style.animation = "8s linear won";
        });
        
        setTimeout(() => {
            GAME_END_SOUND.play();

            GAME.style.display = "none";

            GAME_OVER.style.display = "flex";
            GAME_OVER.style.animation = "3s forwards flash";
        }, 2000);
    }
}

document.addEventListener('click', (e) => {

    if (e.target.className == 'btn' && !won && !played[GAME_PLAYER[player]].includes(e.target.id) && !played[GAME_PLAYER[!player]].includes(e.target.id)) {
        BTN_CLICK_SOUND.currentTime = 0; 
        BTN_CLICK_SOUND.play();
        update(e);
    }
});