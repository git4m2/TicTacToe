
// #region HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////
///                            HELPER FUNCTIONS                             ///
///////////////////////////////////////////////////////////////////////////////

function getRowNumber(tileName) {
    // Get [row][column] info for the referenced tile
    var objectNameArray = tileName.split("_");
    var row = objectNameArray[1];
    return row;
}

function getColumnNumber(tileName) {
    // Get [row][column] info for the referenced tile
    var objectNameArray = tileName.split("_");
    var column = objectNameArray[2];
    return column;
}

function getTileWidth(tileName) {
    // Get width of the referenced tile
    var tileWidth = $("#" + tileName)[0].getBBox().width;
    return tileWidth;
}

function getTileHeight(tileName) {
    // Get height of the referenced tile
    var tileHeight = $("#" + tileName)[0].getBBox().height;
    return tileHeight;
}

function radiansToDegrees(radians) {
    var degrees = radians * 180 / Math.PI;
    degrees = Math.round(degrees * 100) / 100;
    return degrees;
}

function degreesToRadians(degrees) {
    var radians = degrees * Math.PI / 180;
    radians = Math.round(radians * 100) / 100;
    return radians;
}

function getPolarX(polarRadius, polarAngle) {
    // polarAngle passed in degrees, theta calculated in radians
    var angleTheta = degreesToRadians(polarAngle);
    var polarDistanceX = polarRadius * Math.cos(angleTheta);
    polarDistanceX = Math.round(polarDistanceX * 100) / 100;
    return polarDistanceX;
}

function getPolarY(polarRadius, polarAngle) {
    // polarAngle passed in degrees, theta calculated in radians
    var angleTheta = degreesToRadians(polarAngle);
    var polarDistanceY = polarRadius * Math.sin(angleTheta);
    polarDistanceY = Math.round(polarDistanceY * 100) / 100;
    return polarDistanceY;
}

function getRadialArmLength(startX, startY, endX, endY) {
    var deltaX = 0;
    var deltaY = 0;
    var squaredDeltaX = 0;
    var squaredDeltaY = 0;
    var radialArmLength = 0;

    deltaX = startX - endX;
    deltaY = startY - endY;

    squaredDeltaX = Math.pow(deltaX, 2);
    squaredDeltaY = Math.pow(deltaY, 2);

    radialArmLength = Math.sqrt(squaredDeltaX + squaredDeltaY); // Pythagorean theorem
    radialArmLength = Math.round(radialArmLength);

    return radialArmLength;
}
// #endregion

