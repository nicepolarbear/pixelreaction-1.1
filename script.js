const image = {
    src: ["items/mud.png",
         "items/stick.png",
         "items/leather.png",
         "items/wood.png",
         "items/rock.png",
         "items/brick.png",
         "items/copper.png",
         "items/iron.png"
         ],
}

const sound1 = new Audio();
sound1.src = "sounds/click.mp3";

const sound2 = new Audio();
sound2.src = "sounds/bop.mp3";



let intervalId;

let reaction = 0;

let startTime = 0;

let coinAmount = 0;

let itemSpawnTimeout;

let clickedToofast = false;

let upgrade = 0;

let boost = 1;

let bestScore;

let pb = 0;

let attempts = 0;

let scoreSum = 0;

let avg = 0;



if (localStorage.getItem('upgrade') == null) {
    localStorage.setItem('upgrade', upgrade);
}
else {
    upgrade = localStorage.getItem('upgrade');
}


if (localStorage.getItem('coins') == null) {
    localStorage.setItem('coins', coinAmount);
}
else {
    coinAmount = localStorage.getItem('coins');
}


if (localStorage.getItem('pb') == null) {
    localStorage.setItem('pb', pb);
}
else {
    pb = localStorage.getItem('pb');
}


if (localStorage.getItem('attempts') == null) {
    localStorage.setItem('attempts', attempts);
}
else {
    attempts = localStorage.getItem('attempts');
}


if (localStorage.getItem('scoreSum') == null) {
    localStorage.setItem('scoreSum', scoreSum);
}
else {
    scoreSum = localStorage.getItem('scoreSum');
}

function setAvg() {
    avg = scoreSum / attempts;
    document.getElementById('avg').innerText = avg + " ms"
}

setBoost();

function setBoost() {
    if (upgrade == 1) {
        boost = 1.5;
    }
    if (upgrade == 2) {
        boost = 2;
    }
    if (upgrade == 3) {
        boost = 2.5;
    }
    if (upgrade == 4) {
        boost = 3;
    }
    if (upgrade == 5) {
        boost = 5;
    }
    if (upgrade == 6) {
        boost = 7.5;
    }
    if (upgrade == 7) {
        boost = 10;
    }
}

let item = document.createElement('img');
item.src = image.src[upgrade];
item.id = "itemImg";
document.getElementById('itemSpawn').appendChild(item);

document.getElementById('coinAmount').innerText = coinAmount;

document.getElementById('pb').innerText = pb + " ms";

function gameStart() {
    const gameTime = (Math.floor(Math.random() * 10000) + 1);

    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameStartButton2').style.display = "none";
    document.getElementById('timeDisplay').innerText = "0 ms";
    document.getElementById('gameplay').style.display = "block";
    document.getElementById('timeDisplay').style.display = "none";
    document.getElementById('coinsGained').style.display = "none";
    document.getElementById('clickedTooFast').style.display = "none";
    document.getElementById('header').style.display = "none";

    document.getElementById('countdown').innerText = "3";
    sound2.play();

    setTimeout(() => {
        document.getElementById('countdown').innerText = "2";
        sound2.play();
    }, 1000);

    setTimeout(() => {
        document.getElementById('countdown').innerText = "1";
        sound2.play();
    }, 2000);

    setTimeout(() => {
        document.getElementById('countdown').innerText = "start!";
        sound2.play();
    }, 3000);
    setTimeout(() => {
        document.getElementById('countdown').innerText = "";
        document.getElementById('tooFast').style.display = "block"
    }, 3100);

    itemSpawnTimeout = setTimeout(() => {
        document.getElementById('itemSpawn').style.display = "block";
        document.getElementById('timeDisplay').style.display = "block";
        document.getElementById('tooFast').style.display = "none"



        startTime = Date.now() - reaction;
        
        intervalId = setInterval(function(){
            const currentTime = Date.now();
            reaction = currentTime - startTime;
            document.getElementById('timeDisplay').innerText = reaction + " ms";
        }, 1)

    }, (3100 + gameTime));




}

function tooFast() {
    clickedToofast = true;
    gameStop();
    clickedToofast = false;
    document.getElementById('tooFast').style.display = "none"
    document.getElementById('coinsGainedNumber').innerText = "coins gained: 0";

    document.getElementById('clickedTooFast').style.display = "block";

}

function gameStop() {
    
    sound1.play();

    clearTimeout(itemSpawnTimeout);

    document.getElementById('itemSpawn').style.display = "none";
    clearInterval(intervalId);
    document.getElementById('timeDisplay').innerText = "reaction time: " + reaction + " ms";

    if (reaction < pb || pb == 0) {
        pb = reaction;
        localStorage.setItem('pb', pb);
        document.getElementById('pb').innerText = pb + " ms";
    }

       

    document.getElementById('gameStartButton2').style.display = "block";
    document.getElementById('tooFast').style.display = "none"

    document.getElementById('header').style.display = "flex";

    let coinsGained = 0;

    if (clickedToofast == false) {
        if (reaction < 150) {
            coinsGained = ((500 - reaction) * 10) * boost;
        }
        
        else if (reaction < 200) {
            coinsGained = ((500 - reaction) * 5) * boost;
        }
        else if (reaction < 250) {
            coinsGained = ((500 - reaction) * 2) * boost;
        }
        else if (reaction < 500) {
            coinsGained = ((500 - reaction) * 1) * boost;
            }
        else if (reaction == 500 || reaction > 500) {
            coinsGained = 0;
        }

        console.log(coinsGained);

        console.log(boost);

        coinAmount = Number(coinAmount) + Number(coinsGained);

        console.log(coinAmount);
        localStorage.setItem('coins', coinAmount);
        document.getElementById('coinAmount').innerHTML = Number(coinAmount);

        
        document.getElementById('coinsGainedNumber').innerText = "coins gained: " + coinsGained; 

        attempts += 1;
        localStorage.setItem('attempts', attempts);

        scoreSum += reaction;
        localStorage.setItem('scoreSum', scoreSum);

        setAvg()
    }

    document.getElementById('coinsGained').style.display = "flex";

    reaction = 0;
    coinsGained = 0;
}


function shopOpen() {
    document.getElementById('shopIcon').style.display = "none";
    document.getElementById('closeShopIcon').style.display = "block";
    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameplay').style.display = "none";
    document.getElementById('shop').style.display = "flex";

    if (coinAmount >= 10000) {
        document.getElementById('cantAfford1').style.display = "none"
        document.getElementById('buyButton1').style.display = "block"
    }
    else if (upgrade == 0){
        document.getElementById('cantAfford1').style.display = "block"
        document.getElementById('buyButton1').style.display = "none"
    }

    if (coinAmount >= 25000) {
        document.getElementById('cantAfford2').style.display = "none"
        document.getElementById('buyButton2').style.display = "block"
    }
    else if (upgrade >= 1){
        document.getElementById('cantAfford2').style.display = "block"
        document.getElementById('buyButton2').style.display = "none"
    }

    if (coinAmount >= 50000) {
        document.getElementById('cantAfford3').style.display = "none"
        document.getElementById('buyButton3').style.display = "block"
    }
    else if (upgrade >= 2){
        document.getElementById('cantAfford3').style.display = "block"
        document.getElementById('buyButton3').style.display = "none"
    }

    if (coinAmount >= 100000) {
        document.getElementById('cantAfford4').style.display = "none"
        document.getElementById('buyButton4').style.display = "block"
    }
    else if (upgrade >= 3){
        document.getElementById('cantAfford4').style.display = "block"
        document.getElementById('buyButton4').style.display = "none"
    }

    if (coinAmount >= 250000) {
        document.getElementById('cantAfford5').style.display = "none"
        document.getElementById('buyButton5').style.display = "block"
    }
    else if (upgrade >= 4){
        document.getElementById('cantAfford5').style.display = "block"
        document.getElementById('buyButton5').style.display = "none"
    }

    if (coinAmount >= 500000) {
        document.getElementById('cantAfford6').style.display = "none"
        document.getElementById('buyButton6').style.display = "block"
    }
    else if (upgrade >= 5){
        document.getElementById('cantAfford6').style.display = "block"
        document.getElementById('buyButton6').style.display = "none"
    }

    if (coinAmount >= 1000000) {
        document.getElementById('cantAfford7').style.display = "none"
        document.getElementById('buyButton7').style.display = "block"
    }
    else if (upgrade >= 6){
        document.getElementById('cantAfford7').style.display = "block"
        document.getElementById('buyButton7').style.display = "none"
    }



    if (upgrade >= 1) {
        document.getElementById('cantAfford1').style.display = "none"
        document.getElementById('buyButton1').style.display = "none"
        document.getElementById('boughtButton1').style.display = "block"
    }
    if (upgrade >= 2) {
        document.getElementById('cantAfford2').style.display = "none"
        document.getElementById('buyButton2').style.display = "none"
        document.getElementById('boughtButton2').style.display = "block"
    }
    if (upgrade >= 3) {
        document.getElementById('cantAfford3').style.display = "none"
        document.getElementById('buyButton3').style.display = "none"
        document.getElementById('boughtButton3').style.display = "block"
    }
    if (upgrade >= 4) {
        document.getElementById('cantAfford4').style.display = "none"
        document.getElementById('buyButton4').style.display = "none"
        document.getElementById('boughtButton4').style.display = "block"
    }
    if (upgrade >= 5) {
        document.getElementById('cantAfford5').style.display = "none"
        document.getElementById('buyButton5').style.display = "none"
        document.getElementById('boughtButton5').style.display = "block"
    }
    if (upgrade >= 6) {
        document.getElementById('cantAfford6').style.display = "none"
        document.getElementById('buyButton6').style.display = "none"
        document.getElementById('boughtButton6').style.display = "block"
    }
    if (upgrade >= 7) {
        document.getElementById('cantAfford7').style.display = "none"
        document.getElementById('buyButton7').style.display = "none"
        document.getElementById('boughtButton7').style.display = "block"
    }

    sound1.play();

}

function shopClose() {
    document.getElementById('shopIcon').style.display = "block";
    document.getElementById('closeShopIcon').style.display = "none";
    document.getElementById('gameStartMenu').style.display = "block";
    document.getElementById('shop').style.display = "none";

    sound1.play();
}


function buyUpgrade(actualUpgrade, price) {
    if (upgrade == actualUpgrade) {
        upgrade = actualUpgrade + 1;
        localStorage.setItem('upgrade', upgrade);
        setBoost();

        coinAmount -= price;
        localStorage.setItem('coins', coinAmount);

        document.getElementById('coinAmount').innerText = coinAmount;

        shopOpen();
        item.src = image.src[upgrade];
    }

    sound1.play();
}

function statsOpen() {
    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameplay').style.display = "none";
    document.getElementById('closeShopIcon').style.display = "none";
    document.getElementById('shop').style.display = "none";
    document.getElementById('shopThings').style.display = "none";
    document.getElementById('statsIcon').style.display = "none";

    document.getElementById('closeStatsIcon').style.display = "block";
    document.getElementById('stats').style.display = "block";


    sound1.play();


}

function statsClose() {
    document.getElementById('shopThings').style.display = "flex";
    document.getElementById('gameStartMenu').style.display = "block";
    document.getElementById('statsIcon').style.display = "block";

    document.getElementById('closeStatsIcon').style.display = "none";
    document.getElementById('stats').style.display = "none";

    sound1.play();
}