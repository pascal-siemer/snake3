const content = document.getElementById('content'); //"Kurywahl" HTML-Element mit id content
const canvas = document.querySelector('canvas');    //"Kurzwahl" HTML-Element canvas
const context = canvas.getContext('2d');            //Wir arbeiten in 2D

//Datum fuer expire-Wert der Cookies. Cookie soll in 3 Monaten auslaufen.
var cookieExpireDate = new Date();
cookieExpireDate.setMonth(cookieExpireDate.getMonth() + 3);     

var end = false;            //Spielabbruchsvariable
var input;                  //Eingabe, bsp: w,a,s und d
var direction;              //Speichern der aktuellen Bewegungsrichtung der Snake / des Players
var player;                 //variable fuer Objekt Snake
var food;                   //Variable fuer Objekt Food
var maxHighScores = 10;

var difficulty;             //aktueller Schwierigkeitsgrad
const modifyerEasy = 0.75;  //Modifzer fuer Schwierigkeitsgrad easy
const modifyerNormal = 1;   //Modifzer fuer Schwierigkeitsgrad normal
const modifyerHard = 1.25;  //Modifzer fuer Schwierigkeitsgrad hard

//Basis-Werte aus Ausgangswerte zur Kalkulation. Benoetigt ausgehend der Schwierigkeitsgrade
const canvasDimensionsBase = 32;
const widthBase = 20;
const heightBase = 20;
const tickRateBase = 500;
const tickModifyerBase = 10;

var canvasDimensions = 32;  //Gridmodifier in pixeln
var width = 20;             //anzahl Koordinaten in x-richtung
var height = 20;            //anzahl Koordinaten in y-Richtung
var tickRate;               //Tickrate in ms
var tickModifyer;           //Veraenderung der Tickrate nach Events in Prozent

var edgeSpawning = true;    //Gibt an, ob Food-Objekte auch am Rand des Spielfeldes positioniert werden durfen. edgeSpawning = false wird genutzt im Schwierigkeitsgrad easy


var query = new URLSearchParams(document.location.search);
difficulty = query.get('difficultyList');
if(difficulty != undefined && difficulty != null) {
    difficulty = difficulty.toLowerCase();
}
// hier muss noch getScores hin
init();     //Parameter werden auf Startwerte gesetzt, Objekte initialisiert.
loop();     //Game-Loop



//---EventHandler---------------------------------------------------------------------------------------------------------------------------------------------------------------

//aktuellste Eingabe wird gespeichert, damit sie spaeter in setInterval verwendet werden kann
document.addEventListener('keydown', function(event) {
    //Jeweils immer die erste Eingabe speichern. Input wird im Verlauf von loop() wieder auf undefined zurueckgesetzt werden, sodass wieder der neuste Input gelesen werden kann.
    if(input == undefined) {
        input = event.keyCode;

        //Eingabeverarbeitung basierend auf input. Ebenfalls: unterbindung, dass der Player rueckwaerts laeuft.
        if( (input == 87 || input == 38) && direction != "down"){
            direction = "up";
        } else if((input == 83 || input == 40) && direction != "up") {
            direction = "down";
        } else if((input == 65 || input == 37) && direction != "right") {
            direction = "left";
        } else if((input == 68 || input == 39) && direction != "left") {
           direction = "right";
        }
    } else {
        lastKey = event.keyCode;
    }
    if(event.keyCode == 32 && end) {    //Falls das Spiel beendet wurde: Spiel kann ueber LEER-Taste zurueckgesetzt werden, indem init() aufgerufen wird.
        init();
    }
});



//---Methoden------------------------------------------------------------------------------------------------------------------------------------------------------------------

function init() {
    //Setzen der Parameter auf ihre Startwerte fuer die jeweilige Schwierigkeit
    if(difficulty == 'easy') {
        width = Math.round(widthBase / modifyerEasy);           //Anzahl Koordinaten anpassem
        height = Math.round(heightBase / modifyerEasy);
        canvasDimensions = canvasDimensionsBase * modifyerEasy; //Spielfeldskalierung anpassen
        canvas.height = width * canvasDimensions;               //Fenstergroesse des Canvas setzen
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;                     //breite des HTML-Objektes mit id "content" auf breite des Canvas setzen, damit Website "zentrierter" ist.
        tickRate = tickRateBase / modifyerEasy;                 //Anpassen der Spielgeschwindigkeit
        tickModifyer = tickModifyerBase * modifyerEasy;         //Anpassen der Spielbeschleunigung
        edgeSpawning = false;                                   //Verhindert, dass Food-Objekte an den Rand des Spielfeldes gesetzt werden. Mach das Spiel einfacher
        canvas.style.display = "block";                         //Macht das Canvas sichtbar.
    } else if(difficulty == 'normal') {             //Siehe "if(difficulty == 'easy')". EdgeSpawning hier aktiviert, macht Spiel schwieriger.
        width = Math.round(widthBase / modifyerNormal);
        height = Math.round(heightBase / modifyerNormal);
        canvasDimensions = canvasDimensionsBase;
        canvas.height = width * canvasDimensions;
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;
        tickRate = tickRateBase / modifyerNormal;
        tickModifyer = tickModifyerBase * modifyerNormal;
        edgeSpawning = true;
        canvas.style.display = "block";
    } else if(difficulty == 'hard') {               //Siehe "if(difficulty == 'easy')". EdgeSpawning hier aktiviert, macht Spiel schwieriger.
        width = Math.round(widthBase / modifyerHard);
        height = Math.round(heightBase / modifyerHard);
        canvasDimensions = canvasDimensionsBase;
        canvas.height = width * canvasDimensions;
        canvas.width = height * canvasDimensions;
        content.style.width = canvas.width;
        tickRate = tickRateBase / modifyerHard;
        tickModifyer = tickModifyerBase * modifyerHard;
        edgeSpawning = true;
        canvas.style.display = "block";
    } else {
        canvas.style.display = "none";              //Wenn keine Schwierigkeit angegeben: mache das Spiel unsichtbar
    }

    //Schwierigkeitsunabhaengige Parameter setzen
    end = false;
    input = undefined;
    direction = undefined;
    
    //zufällige Positionen für Snake und Food
    let startX = random(width);
    let startY = random(height);
    player = new Snake(startX, startY);   //Instanz der Snake.
    if(!edgeSpawning) {     //Solange edgeSpawning durch den Easy-Mode deaktiviert ist
        do {
            startX = random(width - 2) + 1;      // -2, da zwei Koordinaten rausgerechnet werden muessen und +1, damit der Zahlenbereich entsprechend verschoben wird, damit die aeussersten Koordinaten nicht errechnet werden koennen.
            startY = random(height  - 2) + 1;
        } while(player.checkPosition(startX, startY));
    } else {
        do {
            startX = random(width);
            startY = random(height);
        } while(player.checkPosition(startX, startY));
    }
    food = new Food(startX, startY);  //Instanz des Foods

    //Neue Positionen anzeigen
    drawGame();
    //HighScores anzeigen
    displayHighScores();
}

//"Clock", welche pro Tick run() aufruft, solange die Snake sich nicht selbst gefressen hat (true/False in Variable end).
function loop() {
    setTimeout(function() {     //Uber das Rekursive aufrufen einer Funktion, welche setTimeout beinhaltet, kann die Spielgeschwindigkeit veraendert werden. setIntervall() bietet diese Moeglichkeit nicht
        if(!end && difficulty != undefined) {
            run();
            input = undefined;      //Zuruecksetzen von input, damit der EventHandler die naechste Eingabe speichern kann.   
        }
        loop();     //Rekursives Aufrufen der loop() setzt das Spiel fort. Eine Taktung ist durch setTimeout() gegeben. 

    }, tickRate);
}

//run() ist die Spieldurchführung pro Tick, quasi "eine Runde".
function run() {

    //Mit x und y wird im folgenden kalkuliert. Diese müssen zunaechst auf die Werte x,y der ersten Player-Instanz Player ("Schlangenkopf") gesetzt werden, damit von da ausgehend Positionsveraenderungen berechnet werden koennen.
    var x = player.x;
    var y = player.y;
    
    //Positionsveränderungen an x, y ausgehend von direction
    if(direction == "up") {
        y--;
    } else if(direction == "down") {
        y++;
    } else if(direction == "left") {
        x--;
    } else if(direction == "right") {
        x++;
    }


    //Falls ausserhalb des Spielfelds: Tod
    if(x < 0 || x >= width || y < 0 || y >= height) {
        gameOver();   //aktuelles Spiel wird durch gameOver-Methode beendet.
        return undefined; //run-Methode abbrechen;
        
    }

    //Spielregeln ausführen
    if(x == player.x && y == player.y) {
        // do nothing
    } else if(!player.checkPosition(x,y))  {   //wenn die neue Position nicht zu player gehört
        if(food.checkPosition(x,y)) {   //Wenn player auf neuer Position frisst: player verlängern und auf neue Position bewegen.
            player.addNext(player.x, player.y);
            player.recursiveMove(x, y);

            //Neue Position für Food berechnen
            let a, b;
            if(!edgeSpawning) {     //Solange edgeSpawning durch den Easy-Mode deaktiviert ist
                do {
                    a = random(width - 2) + 1;      // -2, da zwei Koordinaten rausgerechnet werden muessen und +1, damit der Zahlenbereich entsprechend verschoben wird, damit die aeussersten Koordinaten nicht errechnet werden koennen.
                    b = random(height  - 2) + 1;
                } while(player.checkPosition(a, b));
            } else {
                do {
                    a = random(width);
                    b = random(height);
                } while(player.checkPosition(a, b));
            }
            food.relocate(a, b);

            // Tickrate anpassen und das Spiel beschleunigen
            tickRate = Math.round(tickRate - (tickRate * (tickModifyer / 100)));

        } else {    //Wenn neue Position leer: player auf Position bewegen
            player.recursiveMove(x, y);
        }
    } else {    //Wenn neue Position = Instanz des Players: Player frisst sich selbst und das Spiel wird beendet.
        gameOver();   //aktuelles Spiel wird durch gameOver-Methode beendet.
        return undefined;   //run-Methode abbrechen;
    }
    drawGame();     //aktuelles Spielfeld darstellen.
    setText("Score: " + player.getLength() + ", Tickrate: " + tickRate + ", Schwierigkeitsgrad: " + difficulty);    //Score anzeigen
    
}

//Darstellung des Spielst auf HTML-Element Canvas
function drawGame() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < width; y++) {
        for(let x = 0; x < width; x++) {
            if(player.x == x && player.y == y) {    //Wenn erste Instanz von Player ("Schlangenkopf") an Position x,y
                context.fillStyle = 'lightgreen';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(player.checkPosition(x, y)) { //Wenn weitere Instanzen von Player an Position x,y an Position x,y
                context.fillStyle = 'green';
                context.fillRect( (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            } else if(food.checkPosition(x,y)) {    //Wenn Instanz von Food an Position x,y
                //Bild statt farbiges Rect anzeigen.
                context.drawImage(food.img, (x * canvasDimensions), (y * canvasDimensions), canvasDimensions, canvasDimensions);
            }
        }
    }
}

function random(n) {
    return Math.floor(Math.random() * n);
}

//Funktion beendet das Spiel, speichert den Score und aktualisiert das UI
function gameOver() {
    end = true;
    setText("Ende! Druecke LEER fuer eine neue Runde. Score: " + player.getLength());
    saveScore(player.getLength());
    displayHighScores();
}

//Funktion zum ausgeben von Text unterhalb des Canvas
function setText(text) {
    document.getElementById('output').innerHTML = text;
}


//funktion verarbeitet neue HighScores. "value" ist der HighScore, der gespeichert werden soll
function saveScore(value) {
    var scores = getScores();   //bereits gespeicherte HighScores ueber getScores() werde eingelesen und in Variable scores gespeichert. getScores() uebergibt ein Array. HighScores sind in Cookies gespeichert.
    if(scores == undefined || scores == [] || scores == [NaN]) {    //ungewollte Werte behandeln
        scores = [value];       //ungewollte Werte bereinigen, neuen score "value" in scores speichern.
    } else {
        scores.push(value);     //Falls keine ungewollten Werte: neuen HighScore an score hinzufuegen.
    }
    scores = sortValues(scores);    //HighScores absteigend sortieren.

    //Wenn mehr als maxHighScores (zB. 10) HighScores gespeichert werden: Anzahl auf maxHighScores reduzieren
    if(scores.length > maxHighScores) {     
        var newScores = [];
        for(var i = 0; i < maxHighScores; i++) {
            newScores.push(scores[i]);
        }
        scores = newScores;
    }

    //Array scores zu String umbauen, damit dieser als Cookie gespeichert werden kann. Eintraege werden per Komme separiert
    var valueString;
    for(var i = 0; i < scores.length; i++) {
        if(i == 0) {
            valueString = scores[i];
        } else {
            valueString += ',' + scores[i];
        }
    }
    //Speichern der HighScores in schweirigkeitsspezifische Cookies, damit der HighScore pro Schwierigkeit getrackt werden kann.
    if(difficulty == 'easy') {
        document.cookie = 'easyScores=' + valueString + '; expires=' + cookieExpireDate.toGMTString() + '; path=/';
    } else if(difficulty == 'normal') {
        document.cookie = 'normalScores=' + valueString + '; expires=' + cookieExpireDate.toGMTString() + '; path=/';
    } else if(difficulty == 'hard') {
        document.cookie = 'hardScores=' + valueString + '; expires=' + cookieExpireDate.toGMTString() + '; path=/';
    }
}

//HighScores aus den Cookies auslesen und als Array aus Zahlen bereitstellen
function getScores() {
    var scores = document.cookie.split(';');        //Cookies aufsplitten, ein Eintrag je Schwierigkeitsgrad in resultierendem Array

    //Cookie fuer entsprechenden Schwierigkeitsgrad bestimmen und Inhalt von String zu einem Array aus Zahlen konvertieren via stringToValues-Methode
    for(var i = 0; i < scores.length; i++) {
        if(difficulty == 'easy' && scores[i].includes('easy')) {
            return stringToValues(scores[i]);   //scores[i] beinhaltet die Daten des Cookies fuer Schwierigkeitsgrad easy
        } else if(difficulty == 'normal' && scores[i].includes('normal')) {
            return stringToValues(scores[i]);   //siehe ^^
        } else if(difficulty == 'hard' && scores[i].includes('hard')) {
            return stringToValues(scores[i]);   //siehe ^^
        }
    }
    return [];  //Falls kein schwierigkeitsgrad bestimmt werden konnte: leeres Array uebergeben;

}

//Baut String nach Art 'name=value, value, value' in Array [value, value, value] um
function stringToValues(string) {
    string = string.split('=');     //Teilt String in vor und nach dem Gleichzeichen
    var values = string[1];         //values uebernimmt den String nach dem Gleichzeichen
    if(values != undefined) {       //wenn Werte vergeben: Werte in separate Eintraege spalten
        values = values.split(',');
        var numbers = [];
        for(var i = 0; i < values.length; i++) {    //Eintraege aus values nun als Zahlen in neuem Array abspeichern
            numbers.push(parseInt(values[i]));
        }
        if(numbers.includes(NaN)){                  //Falls ein Eintrag nicht zu einer Zahl konvertiert werden kann: Eintrag herausfiltern
            numbers.filter(function(n)  {
                return n != NaN;
            })
        }
        return numbers;     //Ausgabe neues Array aus Zahlen
    } else {
        return [];          //Falls values == undefined: Gueltiges leeres Array uebergeben
    }
}


//Bestimmung der hoechsten Zahl in array, wird benoetigt fuer sortValues()
function hightestValueOfArray(array) {
    var highestValue;
    for(var i = 0; i < array.length; i++) {
        if(i == 0) {
            highestValue = array[i];
        } else if(array[i] > highestValue) {
            highestValue = array[i];
        }

    }
    console.log('highestValue: '+highestValue);
    return highestValue;
}

//Sortiert Zahlen im Array values in absteigender Reihenfolge
function sortValues(values) {
    var output = [];
    for(var i = hightestValueOfArray(values); i >= 0; i--) {    //For-Schleife absteigend ausgehend vom hoechsten Wert in values

        //Es wird vom Hoechsten Wert des Arrays heruntergezaehlt. Wenn Zahl i im zu sortierenden Array enthalten ist: Wert wird in neuem Array abgespeichert
        while(values.includes(i)) {                         //Hier while, da mehrere gleiche Werte nich uebersehen werden durfen. IF wuerde dopplung aufheben
            values.splice(values.indexOf(i), 1);
            output.push(i);
        }
    }
    return output;  //sortiertes Array ausgeben
}

//String aus getScores() bauen, damit das Array als String auf der Website dargestellt werden kann.
function formatScores() {
    var scores = getScores();
    var text = '';
    for(var i = 0; i < scores.length; i++) {
        if(i == 0) {
            text = scores[i];
        } else {
            text += '<br>' + scores[i];
        }
    }
    return text;
}

//HTML-Elemente aktualisieren: HighScores darstellen
function displayHighScores() {
    document.getElementById('highScoreHeadline').innerHTML = "Highscores (" + difficulty + "):";
    document.getElementById('highScore').innerHTML = formatScores();
}




//---Definitionen der Objekte Snake für die Schlange und Food---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Beinhaltet Koordinaten x,y und es kann eine Instanz von sich selbst an sich anhängen (Variable next).
function Snake(x, y) {
    this.x = x;
    this.y = y;
    var next;
    this.move = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.addNext = function(a, b) { //Instanz Snake an letze Instanz von Snake anhaengen ueber Variable next.
        if(this.next === undefined) {
            this.next = new Snake(a, b);
        } else {
            this.next.addNext(a, b);
        }
    }
    this.checkPosition = function(a, b) {   //true oder false. Prueft, ob sich an angegebener Position a,b eine Instanz von Snake befindet
        var occupied = (this.x == a && this.y == b);
        if(occupied) {
            return true
        } else if((this.next !== undefined)){
            return this.next.checkPosition(a, b);
        } else {
            return false;
        }
    }
    this.recursiveMove = function(a, b) {   //Bewegt alle Instanzen der Snake. Die erste Instanz wird an die neue Position a,b bewegt, die anderen Instanzen werden auf die Position ihres "vorgaengers" bewegt.
        if(this.next !== undefined) {
            this.next.recursiveMove(this.x, this.y);
        }
        this.x = a;
        this.y = b;
    }
    this.getLength = function() {
        if(this.next === undefined) {
            return 1;
        } else {
            return this.next.getLength() + 1;
        }
    }
}

//Beinhaltet Koordinaten x,y
function Food(x, y) {   
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = './apple.png'     //Speicherort des "Aussehens" (Das anzuzeigende Bild)
    this.relocate = function(a, b) {
        this.x = a;
        this.y = b;
    }
    this.checkPosition = function(a,b) {
        if(this.x == a && this.y == b) {
            return true;
        } else {
            return false;
        }
    }

}