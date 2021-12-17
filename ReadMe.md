Snake-Spiel zur Bewerbung als Anwendungsentwickler

Ein Webserver, der das Spiel hostet, kann aufgesetzt werden, indem serve.js über node.js ausgeführt wird. serve.js stellt die beiden anderen Dateien index.html und snake.js bereit. index.html ist über den <script>-Tag mit dem Code in Snake.js verknüpft. snake.js interagiert anschließend mit dem Canvas und dem Div der index.html.

PORT 1234, da ich nicht davon ausgehen kann, dass häufig verwendete Ports auf der Testmaschine frei sein werden.

Farben: Grün = Schlange/Snake/Player, Food wird durch eine PNG eines Apfels dargestellt. Diese skaliert sich ebenfalls nach den canvasDimensions, wie alles andere auch. Da die PNG des Apfels manchmal verzögert kam oder nicht angefordert werden konnte, habe ich diese nun etwas vom Aussehen her angepasst und lokal eingebunden. Ich habe die serve.js entsprechend angepasst, sodass diese den Request an die PNG nun verarbeiten und diese Datei bereitstellen kann.

Steuerung: W,A,S und D oder Pfeilteasten. Das Spiel wird begonnen, indem eine dieser Tasten gedrückt wird. Neustart nach Ende des Spiels über Leertaste.

Wie bei der letzten Version bleiben das "in sich hineinsteuern" deaktiviert sowie die Steuerung gleich.

Ich habe nun die Schwierigkeitsgrade easy, normal und hard hinzugefügt, welche diverse Parameter beeinflussen, wie die Spielfeldgröße, Spielgeschwindugkeit usw.
Dazu habe ich einen Parameter eingebaut, welcher auf dem Schwierigkeitsgrad easy dafür sorgt, dass das Essen nicht mehr an den Rand positioniert wird. Das macht das Spielen einfachher, da keine riskanten Manöver am Rand des Spielfelds gebraucht werden.
Die Schwierigkeit wird über eine HTML-Form angegeben und wird über die entsprechend angepasste URL von Snake.js erkannt. (Parameter über URL).

Dazu habe ich nun ein Score-System eingebaut, welches die eigenen Leistungen anhand von Cookies pro Schwierigkeitsgrad abspeichert.
Das bedeutet, es gibt pro Schwierigkeitsgrad einen Cookie mit dem Scoreboard. Diese laufen nach 3 Monaten ab.
Ich habe die Anzahl der gespeicherten HighScores auf 10 pro Cookie/Schwierigkeitsgrad beschränkt. (siehe variable maxHighScores).
Dazu werden die HighScores in absteigender Reihenfolge abgespeichert. Ich habe doppelte HighScores erlaubt.


Pascal Siemer
