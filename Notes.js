
///////////////////////////////////////////////////////////////////////////////
///                                 Notes                                   ///
///////////////////////////////////////////////////////////////////////////////

// JavaScript source code

// Create a radial line from the center of a tile to the bottom-right corner of the tile.


// Calculations performed outside function...

// Get the radial distance from the center of a tile to it's bottom-right corner.
radius = getRadialArmLength(this.centerX, this.centerY, this.centerX + this.width / 2, this.centerY + this.height / 2);

// Get the angle from the center of a tile to it's bottom-right corner.
angle = radiansToDegrees(Math.atan(this.height / this.width));


// Calculations performed inside function...

// Set XY values of original position (in this case, center of tile).
originalPositionX = this.centerX;
originalPositionY = this.centerY;

// Get XY position of radial endpoint.
positionX = getPolarX(radius, angle);
positionY = getPolarY(radius, angle);

// Get XY distances from center of tile to corner endpoint.
distanceX = positionX - originalPositionX;
distanceY = positionY - originalPositionY;

// Move to center of tile.
path = "m " + originalPositionX + " " + originalPositionY;

// Move to XY coordinates of radial endpoint.
path = "m " + positionX + " " + positionY;

// Create path to XY coordinates.
radialPath = "l " + distanceX + " " + distanceY;
