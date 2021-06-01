// create a black jack kind of a game with graphical interface (be creative)
// try to include animations, custom fonts. Make game look as actual casino online black jack
// GAME LOGICK
// player plays against computer
// beefore the game player can choose sum of money to bid
// when game begins pc and player each gets two cards
// player can ask dealer for more cards if his total points is less than 21
// after player makes moves, computer also gets his own cards (if needed)
// after pc and player makes moves results are compared
// the one whose score is bigger wins the price pot (money)
// it also can be draw if pc and player has same amount of points
// there is also posibility to loose when drawing cards if total sum of points is bigger than 21
// when game is over deck of cards are shuffled and prepared for new game

// use https://deckofcardsapi.com/ fot getting cards and shuffling the deck
// also add event log, which will show every move and stats

let button = document.getElementById("anotherCard")
button.addEventListener("click", takeAnotherCard)
let button1 = document.getElementById("shuffle")
button1.addEventListener("click", shuffleAgain)
let button2 = document.getElementById("enough")
button2.addEventListener("click", takeAnotherCardC)
let a=document.getElementById("scoreC")
let b=document.getElementById("scoreP")


let startingDeck=""
let promise;
let computerAces=0
let playerAces=0
let computerScore=0;
let playerScore=0;

let str = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

veryBegining(str)

function veryBegining(str) {

    promise =  getFetch(str)
        .then(deck => { //paima  52 kortas
            console.log(deck)
            startingDeck = deck.deck_id;
            return gameStart(2)
        })
        .then(deck => { //paima kompiuterio 2
            console.log(deck)
            createCardOnTable(true, deck.cards[0])
            createCardOnTable(true, deck.cards[1])
            scoreC(deck.cards[0].value)
            scoreC(deck.cards[1].value)

            return gameStart(2)
        })
        .then(deck => { //paima zaidejo 2 kortas
            console.log(deck)
            createCardOnTable(false, deck.cards[0])
            createCardOnTable(false, deck.cards[1])

            scoreP(deck.cards[0].value)
            scoreP(deck.cards[1].value)
            //return gameStart() //kita korta grazinama funkcijoje takeAnother card
        })//.then(deck => console.log(deck))
}

function takeAnotherCard(){ //player
     promise.then(deck=> {
         return gameStart()
     }).then(data=> {
         createCardOnTable( false, data.cards[0])
         scoreP(data.cards[0].value)
         checkScoreP()
})
}

function takeAnotherCardC(){ //computer
    promise.then(deck=> {
        return gameStart()
    }).then(data=> {
        createCardOnTable( true, data.cards[0])
        console.log(data)
        scoreC(data.cards[0].value)
        checkScoreC()
    })
}

function shuffleAgain(){
    str=`https://deckofcardsapi.com/api/deck/${startingDeck}/shuffle/`
    resetAll()
    return new Promise( (resolve)=>{
        let cards=document.getElementsByClassName("playerSide")
        for (let i = 0; i < cards.length ; i++) {
           cards[i].innerHTML=""
        }
       resolve(setTimeout(()=>veryBegining(str), 1000))
    })
}

function gameStart(cardNumber=1) {
    let str=`https://deckofcardsapi.com/api/deck/${startingDeck}/draw/?count=${cardNumber}`
    return getFetch(str)
}

function getFetch(url){
    return fetch(url)
        .then(response=> {
            //console.log(response)
            return response.json()
        })
}

 function createCardOnTable(computerSide, cardNumber){
    let playersSide=document.getElementsByClassName("playerSide")

    let img=document.createElement("img")
    img.classList.add( "card")
    img.src=cardNumber.image
    computerSide ? setTimeout(()=>playersSide[0].appendChild(img),0)
        : setTimeout(()=> playersSide[1].appendChild(img),0)

}

function checkScoreC(){
    if(playerScore>21 && playerAces>0){
        computerScore-=10;
        computerAces--;
        a.innerText=`SCORE: ${computerScore}`
        checkScoreC()
    } else if(computerScore>21 && computerAces===0) {
        winsP()
    } else if(computerScore===21) {
        winsC()
    }
}
function checkScoreP(){
    if(playerScore>21 && playerAces>0){
        playerScore-=10;
        playerAces--;
        b.innerText=`SCORE: ${playerScore}`
        checkScoreP();
    } else if(playerScore>21 && playerAces===0) {
        winsC()
    } else if(playerScore===21) {
        winsP()
    }
}
function winsC(){
    console.log("Player is looser! Computer wins")
    button.disabled=true;
    button2.disabled=true;
}
function winsP(){
    console.log("Computer is looser! Player wins")
    button.disabled = true;
    button2.disabled = true;
}

function scoreC(str){ //computer score
    computerScore+=cardIsAceC(str)
    a.innerText=`SCORE: ${computerScore}`
}
function scoreP(str){ //player score
    playerScore+=cardIsAceP(str)
    b.innerText=`SCORE: ${playerScore}`
}
function cardIsAceC(str){ //computer Ace score
    if(str==="ACE"){
        computerAces++
        return 11
    } else {
        return cardValue(str)
    }
}
function cardIsAceP(str){ //player Ace score
    if(str==="ACE"){
        playerAces++
        return 11
    } else {
        return cardValue(str)
    }
}
function cardValue(str){
    return (str==="QUEEN" || str==="KING" || str==="JACK") ? 10 : +str
}
function resetAll(){
    computerAces=0
    playerAces=0
    computerScore=0;
    playerScore=0;
    a.innerText=`SCORE: ${computerScore}`
    b.innerText=`SCORE: ${playerScore}`
    button.disabled=false;
    button2.disabled=false;
}