let blackJack = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardMap' : {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7':7,'8': 8,'9': 9,'10': 10,'K': 10,'J': 10,'Q': 10,'A': [1, 11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnsOver' : false,
}

let playerName = prompt("ENTER YOUR NAME")

const YOU = blackJack['you']
const DEALER = blackJack['dealer']
const hitSound = new Audio('sounds/swish.m4a')
const winSound = new Audio('sounds/cash.mp3')
const lossSound = new Audio('sounds/aww.mp3')
const hitBtn = document.querySelector("#hit-btn")
const dealBtn = document.querySelector('#deal-btn')
const standBtn = document.querySelector('#stand-btn')
const dealerName = document.querySelector("#dealer-name")
const yourName = document.querySelector("#your-name")

yourName.textContent = playerName

hitBtn.addEventListener('click',blackJackHit)
dealBtn.addEventListener('click',blackJackDeal)
standBtn.addEventListener('click', dealerLogic)


function blackJackHit() {
    if(blackJack['isStand'] === false){
        let card = randomcard()
        showCard(YOU, card)
        updateScore(YOU, card)
        showScore(YOU)
    }
}

function showCard(activePlayer, card){
    if(activePlayer['score'] <= 21){
        let cardImg = document.createElement('img')
        cardImg.src = `images/${card}.png`
        document.querySelector(activePlayer['div']).appendChild(cardImg)
        hitSound.play()
    }
} 

function blackJackDeal(){
    if(blackJack['turnsOver'] === true){
        blackJack['isStand'] = false

        let yourImg = document.querySelector('#your-box').querySelectorAll('img')
        let dealerImg = document.querySelector('#dealer-box').querySelectorAll('img')
        
        for(let i=0; i < yourImg.length; i++){
            yourImg[i].remove()
        }

        for(let i=0; i < dealerImg.length; i++){
            dealerImg[i].remove()
        }

        YOU['score'] = 0
        DEALER['score'] = 0
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#blackjack-result').textContent = "Play Again";
        document.querySelector('#blackjack-result').style.color = "black"

        blackJack['turnsOver'] = true
    }
    
}

function randomcard(){
    let randomIndex = Math.floor(Math.random() * 13)
    return blackJack['cards'][randomIndex]
}

function updateScore(activePlayer,card){
    if(card === 'A'){
        if(activePlayer['score'] + blackJack['cardMap'][card][1] <= 21){
            activePlayer['score'] += blackJack['cardMap'][card][1]
        }else{
            activePlayer['score'] += blackJack['cardMap'][card][0]
        }
    }else{
        activePlayer['score'] += blackJack['cardMap'][card] 
    }
    
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!!!'
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red'
    }else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
    }
    
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic(){
    blackJack['isStand'] = true

    while(DEALER['score'] < 16 && blackJack['isStand'] === true){
        let card = randomcard()
        showCard(DEALER, card)
        updateScore(DEALER, card)
        showScore(DEALER)
        await sleep(1000)
    }
    
        blackJack['turnsOver'] = true
        let winner = computeWinner()
        showResult(winner)
}

function computeWinner(){
    let winner;

    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackJack['wins']++
            winner = YOU
        }else if(YOU['score'] < DEALER['score']){
            blackJack['losses']++
            winner = DEALER
        }else if(YOU['score'] === DEALER['score']){
            blackJack['draws']++
        }
    }else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        blackJack['losses']++
        winner = DEALER
    }else if(YOU['score'] > 21 && DEALER['score'] > 21){
        blackJack['draws']++
    }
    return winner
}

function showResult(winner){
    let message, messageColor

    if(blackJack['turnsOver'] === true){
        if(winner === YOU){
            document.querySelector('#win').textContent = blackJack['wins']
            message = 'YOU WON!!!'
            messageColor = 'green'
            winSound.play()
        }else if(winner === DEALER){
            document.querySelector('#lost').textContent = blackJack['losses']
            message = 'YOU LOST!!!'
            messageColor = 'red'
            lossSound.play()
        }else{
            document.querySelector('#tie').textContent = blackJack['draws']
            message = 'TIE'
            messageColor = 'black'
        }
    
        document.querySelector('#blackjack-result').textContent = message
        document.querySelector('#blackjack-result').style.color = messageColor
    }

}

const url = `https://randomuser.me/api/?results=1`
fetch(url).then(res => res.json())
.then(data => {
    let authors = data.results
    console.log(authors)
    for(i = 0; i< authors.length; i++){
        document.querySelector('.randomImg').src = authors[i].picture.large
        dealerName.textContent = `${authors[i].name.first} ${authors[i].name.last}`
    }
})