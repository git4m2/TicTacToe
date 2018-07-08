# TicTacToe

## Description
This is a TicTacToe webapp with documented multiple development 
iterations. The first phase will produce a stand-alone game. The 
next phase will allow two individuals to play across the internet.

## Getting Started

### Step 1
Start with one of the options below.

#### Option 1
Open the solution in Visual Studio and 
press "F5" to run the webapp.

#### Option 2
Select the following GitHub Pages link.
https://git4m2.github.io/TicTacToe/TicTacToe-Client/default.html

You should see a TicTacToe GameBoard with a 3x3 grid.
Simply click on one of the 9 squares to place your "X" or "O".

## The Journey
I wanted to publish my attempts at creating a simple visual 
game using JavaScript and network utilities. My hope is that 
this project will provide an opportunity for others to learn 
some basic ideas in coding.

### Creating the GameBoard

#### First Attempt
I opted for Scalable Vector Graphics (SVG) to allow for resizing 
of the browser window. Initially, an image was produced using 
path statements which had a large square with intersecting lines 
(2 horizontal/2 vertical) and produced a 3x3 grid. I soon 
learned that this was not ideal for mapping the mouse click 
events to the individual squares on the grid.

#### Second Attempt
Next, I created 9 individual &lt;path/&gt; statements for each 
square on the 3x3 grid. As each square was drawn with a line 
segment, the centers were effectively empty (no style attributes). 
Apparently, the *onclick* event would not fire unless each square 
had a style setting of "fill:transparent" ("fill:none" did not work).

The &lt;svg/&gt; element was used to host a *viewbox* with style 
information applied. Each &lt;path/&gt; *id* used a naming convention 
of "square\_&lt;row&gt;\_&lt;column&gt;" for later code referencing. 
For example, the bottom-right square would have an id equal to the 
name "square" and the row (2) and the column (2). The resulting name 
would be "square\_2\_2". Note: rows and columns use a zero-based index.

### Event Handler Hookup
Within JavaScript, you register an event handler prior to the event 
actually occurring. In the *registerSquareClickEvents* function, 
nested loops run through each of the rows (3) and columns (3). This 
registers an *onclick* (mouse click) event with each of the 9 GameBoard 
squares. A *squareClick* function is then called to handle actions for 
each square. 

In order to correctly hookup each square with an *onclick* event, the 
"this" reference must be passed to the function. The "this" reference 
represents the current *instance* of the object. If you pass the actual 
current named object in the loop (ex. "circle_2_1") then every future 
click of the mouse will attempt to place an object (i.e. "circle_2_1" 
or "cross_2_1") in that particular GameBoard square.

#### Clicking on a GameBoard Square
The *squareClick* function accepts a reference (keyword "this") to the 
current instance of a GameBoard square object (i.e. "circle_2_1"). 

##### Square width
The *style* attribute of the square is then retrieved. This attribute 
is needed in order to get the thickness of the line used in the SVG 
*path* statement. The line thickness is then subtracted from the 
*scrollWidth* of the square (passed into the function via the "this" 
reference). This *squareWidth* value then represents the actual width 
of our SVG square and will be used later for sizing our "circle" and 
"cross" objects.

##### Game array
We need to keep track of the GameBoard both logically as well as 
visually. Logical reference is accomplished with a 3x3 JavaScript 
array known as the *gameArray*. 

##### Existing objects
Upon a player clicking a square with the mouse, the *gameArray* is 
checked for existing objects within this array (ex. duplicates). If an 
object is not found within that particular GameBoard square then the 
object name (i.e "circle" or "cross") is entered into the array. 

##### Player actions
Depending upon the current player, either the "addCircle" or "addCross" 
function is called, thereby visually adding that object to the 
GameBoard. The current player is then switched ("circle" to "cross" or 
vice-versa). 

##### Add Circle or Cross
The *addCircle* function accepts the row, colum and side length of the 
currently selected square as passed-in parameters. The center x-value 
is determined by multiplying the column, of the GameBoard, by the 
*squareWidth* plus 50% of the *squareWidth*. The center y-value is 
calculated in a similar fashion, using row instead of column. The 
radius is set at 40% of the *squareWidth*. Next, a reference name is 
assigned to the *id* attribute of the object. The *style* attributes 
are then set, followed by appending the object to the visual GameBoard. 

The *addCross* function is identical with the exception of the 
calculations for SVG *path* statements. The "cross" is generated at 60% 
of the *squareWidth* and maintained at 20% distance from the edges of 
the square. 

## Authors
* ME
<br/><br/>

## References
<br/><br/>
