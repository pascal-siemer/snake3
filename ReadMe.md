Snake-Spiel zur Bewerbung als Anwendungsentwickler

Ein Webserver, der das Spiel hostet, kann aufgesetzt werden, indem serve.js über node.js ausgeführt wird. serve.js stellt die beiden anderen Dateien index.html und snake.js bereit. index.html ist über den <script>-Tag mit dem Code in Snake.js verknüpft. snake.js interagiert anschließend mit dem Canvas und dem Div der index.html.

PORT 1234, da ich nicht davon ausgehen kann, dass häufig verwendete Ports auf der Testmaschine frei sein werden.

Farben: Grün = Schlange/Snake/Player, Food wird durch eine PNG eines Apfels dargestellt. Diese skaliert sich ebenfalls nach den canvasDimensions, wie alles andere auch. Allerdings kann die Darstellung des Apfels einen kleinen Moment dauern, da ich diesen ueber eine URL eingebunden habe und dieser dann erst laden muss. Ich war mir nicht sicher wegen Urheberrechten, deshalb habe ich es nicht direkt als Datei gespeichert und eingebunden, sondern verlinke im Code auf die URL.

Steuerung: W,A,S und D oder Pfeilteasten. Das Spiel wird begonnen, indem eine dieser Tasten gedrückt wird. Neustart nach Ende des Spiels ueber Leertaste.

Man läuft nun auch nicht mehr in sich hinein, ich habe eine Richtungspruefung eingebaut, damit das Spiel nicht sofort zuende ist, wenn man eine falsche Taste drückt

Ich habe mir einige Snake-Implementationen angeschaut und habe erkannt, dass eigentlich immer die Steuerng nach meinem vorherigen Konzept umgesetzt wurde. Um nun doch etwas zu aendern, verarbeite ich hier nun nicht mehr die letzte Eingabe, sondern die erste Eingabe pro durchlauf. Fühlt sich beim Steuern auch besser an, also eine gute Idee, dort ein wenig zu ändern und auszuprobieren.

Pascal Siemer
