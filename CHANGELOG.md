# TicTacToe

## Changelog

### [TODO]
- [ ] Update "TicTacToe Sockets Mind Map" (xml, html) workflow diagram.
- [ ] Update README and CHANGELOG files.
- [ ] ~~Generate GameBoard SVG code on server and push to client.~~
- [X] Refactor Draw SVG Circle.
- [X] Reset button to clear the GameBoard.
<br/><br/>

### v3.0.0
#### Date: 2019-01-09
#### Refactor using OOP principles.
* Refactor server-side *checkVictory* function to utilize new *drawSvgRadialLine* function on client-side.
* Refactor Draw SVG GameBoard, Circle, Square, Cross and RadialLine using OOP principles.
* Reset button to clear the GameBoard after a win.
* Group functionality into various files (similar to MVC).
<br/><br/>

### v2.3.4
#### Date: 2018-12-05
#### Refactor Registration of Square Click Events.
* Refactor Registration of Square Click Events to send message to server logic and then back to client.
* Refactor Draw SVG Square.
<br/><br/>

### v2.3.3
#### Date: 2018-11-30
#### Refactor GameBoard Squares from HTML to JavaScript.
* Refactor generation of GameBoard Squares from "index.html" to javascript code.
<br/><br/>

### v2.3.2
#### Date: 2018-11-30
#### Move checkVictory function to server.
* Utilize history (on server) versus gameArray (on client) for checkVictory function (on server).
<br/><br/>

### v2.3.1
#### Date: 2018-11-30
#### Refactor clickSquare function on server.
* Determine last gamepiece to move "circle" or "cross".
* Create Event Log (history) to maintain history of each move by each player.
<br/><br/>

### v2.3.0
#### Date: 2018-11-29
#### Move game logic to server.
* Added socket.on('squareSelected') function to client.
* Added socket.on('clickSquare') function to server.
* Modified 'clickSquare' function in client.
* Added "TicTacToe Sockets Mind Map" (xml, html) workflow diagram.
<br/><br/>

### v2.2.1
#### Date: 2018-11-29
#### Refactor code to swap username with gamepiece.
* Swapped username (ex. "Andy", "Bob") with gamepiece ("circle" or "cross") to facilitate easier array referencing.
* Added "TicTacToe Sockets Mind Map.xml" workflow diagram.
<br/><br/>

### v2.2.0
#### Date: 2018-11-02
#### First iteration of multiplayer code.
* First iteration of functional multiplayer code, albeit with multiple issues.
<br/><br/>

### v2.1.0
#### Date: 2018-11-02
#### Embed TicTacToe-Client project files within TicTacToe-Server project.
* Embed TicTacToe-Client project files within TicTacToe-Server project for file availability.
<br/><br/>

### v2.0.0
#### Date: 2018-11-02
#### Create Server for Multiplayer framework.
* Added TicTacToe-Server project to solution.
<br/><br/>

### v1.10.0
#### Date: 2018-07-20
#### Incorporate Get Bounding Box method.
* Use *Bounding Box* to obtain width of individual square on GameBoard.
* Removed *getSquareLineThickness* function and var *borderThickness* to simplify code.
* Refactor *default.html* to simplify code.
<br/><br/>

### v1.9.2
#### Date: 2018-07-16
#### Refactor victoryStrikeThrough function.
* Refactored *victoryStrikeThrough* function to use polar coordinates in calculating opposing radial lines.
<br/><br/>

### v1.9.1
#### Date: 2018-07-16
#### Refactor cross object.
* Refactored *addCross* function to use polar coordinates.
<br/><br/>

### v1.9.0
#### Date: 2018-07-13
#### Use Polar Coordinates for Victory strikethrough.
* Replace *victoryLine* with *victoryStrikeThrough* function which uses polar coordinates.
- [x] Create XY functions to calculate polar coordinate points.
<br/><br/>

### v1.8.1
#### Date: 2018-07-13
#### Refactor Victory.
* Refactored *victoryLine* function.
<br/><br/>

### v1.8.0
#### Date: 2018-07-11
#### Victory visualization.
* Added *victoryLine* function for cross-out victory image.
* Refactored "square line width", now available throughout the project.
- [x] Draw the cross-out line image for a victory.
<br/><br/>

### v1.7.0
#### Date: 2018-07-10
#### Refactor cross path.
* Modify *addCross* function with reuseable code for future *victoryCrossOut* function.
* Added *pathBackSlash* and *pathForwardSlash* code.
<br/><br/>

### v1.6.0
#### Date: 2018-07-09
#### Refactor square line width.
* Create *getSquareLineWidth* function necessary for future *victoryCrossOut* function.
<br/><br/>

### v1.5.1
#### Date: 2018-07-08
#### Modified Victory
* Simplified *checkVictory* function.
- [x] Update README and CHANGELOG files.
<br/><br/>

### v1.5.0
#### Date: 2018-07-08
#### Victory
* Added *checkVictory* function.
- [x] Check for victory (3 objects in a line).
- [x] Update README and CHANGELOG files.
<br/><br/>

### v1.4.0
#### Date: 2018-07-08
#### Create State array
* Changed heading "Unreleased" to "TODO".
- [x] Determine which player's turn it is (i.e. "X" vs "O").
- [x] Prevent duplicate "X" or "O" images on squares upon mouse click.
- [x] Create array to hold current state of the GameBoard.
<br/><br/>

### v1.3.1
#### Date: 2018-07-07
#### Modify README file
* Added notes regarding ability to reference individual squares via code.
- [x] Modify README file to reflect changes in code.
<br/><br/>

### v1.3.0
#### Date: 2018-07-07
#### Added "XO" images
* Added JavaScript code (on mouse click) to generate "X" and "O" images.
- [x] Create "X" and "O" SVG images via JavaScript (on mouse click).
<br/><br/>

### v1.2.0
#### Date: 2018-07-06
#### Added GitHub Pages
* Added GitHub Pages and link to README.md file for testing directly from GitHub.
<br/><br/>

### v1.0.0
#### Date: 2018-07-06
#### Baseline
* TicTacToe web-based app utilizing SVG images and "socket.io" library.
- [x] Add event handlers for mouse clicks on each of the 9 TicTacToe squares.
- [x] Create an SVG image map of TicTacToe board.
<br/><br/>
