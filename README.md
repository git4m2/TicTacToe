# TicTacToe

## Description
This is a TicTacToe webapp with documented multiple development 
iterations. The first phase will produce a stand-alone game. The 
next phase will allow two individuals to play across the internet.
<br/><br/>

## Getting Started

### Step 1
Start with one of the options below.

#### Option 1
Open the solution in Visual Studio and 
press "F5" to run the webapp.

#### Option 2
Select the following GitHub Pages link.
https://git4m2.github.io/TicTacToe/TicTacToe-Client/default.html

You should see a TicTacToe game board with a 3x3 grid.
Simply click on one of the 9 squares to place your "X" or "O".
<br/><br/>

## The Journey
I wanted to publish my attempts at creating a simple visual 
game using JavaScript and network utilities. My hope is that 
this project will provide an opportunity for others to learn 
some basic ideas in coding.

### Creating the Game Board

#### First Attempt
I opted for Scalable Vector Graphics (SVG) to allow for resizing 
of the browser window. Initially, an image was produced using 
path statements which had a large square with intersecting lines 
(2 horizontal/2 vertical) and produced a 3x3 grid. I soon 
learned that this was not ideal for mapping the mouse click 
events to the individual squares on the grid.

#### Second Attempt
Next, I created 9 individual path statements for each square on 
the 3x3 grid. As each square was drawn with a line segment, the 
centers were effectively empty (no style attributes). Apparently, 
the onclick event would not fire unless each square had a style 
setting of "fill:transparent" ("fill:none" did not work).

## Authors
* ME
<br/><br/>

## References
<br/><br/>
