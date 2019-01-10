
// #region IMPORTANT NOTES
///////////////////////////////////////////////////////////////////////////////
///                               IMPORTANT                                 ///
/// IE11 does not recognize this syntax for classes because ES6 spec:       ///
/// https://kangax.github.io/compat-table/es6/                              ///
///                                                                         ///
/// Try using Microsoft Edge or Chrome to test the code.                    ///
///                                                                         ///
/// Alternatively, try using Babel to translate classes for IE11:           ///
/// https://babeljs.io/                                                     ///
///////////////////////////////////////////////////////////////////////////////

//class SvgDrawingObject {
//    constructor() {
//        // place code here...
//    }
//}

//function _classCallCheck(Instance, Constructor) {
//    var SvgDrawingObject = function SvgDrawingObject() {
//        _classCallCheck(this, SvgDrawingObject);
//    };

//    this.type = "square";
//}


///////////////////////////////////////////////////////////////////////////////
///                                  NOTES                                  ///
/// The 'getRowNumber' and the 'getColumnNumber' functions return TEXT      ///
/// results. Consequently, these values must be converted into NUMBER       ///
/// types or dependent calculations may generate unexpected results.        ///
///////////////////////////////////////////////////////////////////////////////
// #endregion


// #region DRAWING CLASSES
///////////////////////////////////////////////////////////////////////////////
///                            DRAWING CLASSES                              ///
///////////////////////////////////////////////////////////////////////////////

class SvgGameBoard {
    constructor() {
        this.id = "svgGameBoard";
        //this.centerX = 0;
        //this.centerY = 0;
        this.width = 300;
        this.height = 300;
        this.strokeWidth = 5;
        this.stroke = "black";
        this.fill = "transparent";
        this.opacity = 1.0;
        //this.location = "";
        this.target = "divSVG";
    }

    draw() {
        // Style
        var styleInfo = "stroke-width:" + this.strokeWidth + ";stroke:" + this.stroke + ";fill:" + this.fill + ";opacity:" + this.opacity + ";";

        // SVG Object
        this.image = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        // Attributes
        this.image.setAttribute("id", this.id);
        this.image.setAttribute("width", this.width);
        this.image.setAttribute("height", this.height);
        this.image.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.image.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.image.setAttribute("viewBox", "-5 -5 310 310");
        this.image.setAttribute("style", styleInfo);

        $("#" + this.target).append(this.image);
    }
}

class SvgSquare {
    constructor() {
        this.id = "";
        this.centerX = 0;
        this.centerY = 0;
        this.width = 0;
        this.height = 0;
        this.strokeWidth = 5;
        this.stroke = "limegreen";
        this.fill = "none";
        this.opacity = 1.0;
        this.location = "";
        this.target = "";
    }

    draw() {
        // Initializations
        var path = "";

        // Determine if this is a tile or a square.
        if (this.location !== "") {
            var row = Number(getRowNumber(this.location));
            var column = Number(getColumnNumber(this.location));

            // Resolve center of object
            this.centerX = getTileWidth(this.location) * (column + 0.5);
            this.centerY = getTileHeight(this.location) * (row + 0.5);

            // Generate object identifier
            this.id = "square" + "_" + row + "_" + column;
        }

        // Move to center of tile
        path += "m ";
        path += (this.centerX - this.width / 2).toString();
        path += " " + (this.centerY - this.height / 2).toString();

        // Create path to each corner of tile
        path += " l ";
        path += this.width.toString() + " " + (0).toString();
        path += " " + (0).toString() + " " + this.height.toString();
        path += " " + (-1 * this.width).toString() + " " + (0).toString();

        // Create path back to origin
        path += " z";

        // Style
        var styleInfo = "stroke-width:" + this.strokeWidth + ";stroke:" + this.stroke + ";fill:" + this.fill + ";opacity:" + this.opacity + ";";

        // SVG Object
        this.image = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Attributes
        this.image.setAttribute("d", path);

        // Attributes
        this.image.setAttribute("id", this.id);
        this.image.setAttribute("style", styleInfo);

        $("#" + this.target).append(this.image);
    }
}

class SvgCircle {
    constructor() {
        this.id = "";
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.strokeWidth = 5;
        this.stroke = "limegreen";
        this.fill = "none";
        this.opacity = 1.0;
        this.location = "";
        this.target = "";
    }

    draw() {
        // Initializations
        var row = Number(getRowNumber(this.location));
        var column = Number(getColumnNumber(this.location));

        // Resolve center of object
        this.centerX = getTileWidth(this.location) * (column + 0.5);
        this.centerY = getTileHeight(this.location) * (row + 0.5);

        // Generate object identifier
        this.id = "circle" + "_" + row + "_" + column;

        // Style
        var styleInfo = "stroke-width:" + this.strokeWidth + ";stroke:" + this.stroke + ";fill:" + this.fill + ";opacity:" + this.opacity + ";";

        // SVG Object
        this.image = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        // Attributes
        this.image.setAttribute("cx", this.centerX);
        this.image.setAttribute("cy", this.centerY);
        this.image.setAttribute("r", this.radius);

        // Attributes
        this.image.setAttribute("id", this.id);
        this.image.setAttribute("style", styleInfo);

        $("#" + this.target).append(this.image);
    }
}

class SvgCross {
    constructor() {
        this.id = "";
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.strokeWidth = 5;
        this.stroke = "limegreen";
        this.strokeLinecap = "butt";
        this.fill = "none";
        this.opacity = 1.0;
        this.location = "";
        this.target = "";
    }

    draw() {
        // Initializations
        var path = "";
        var row = Number(getRowNumber(this.location));
        var column = Number(getColumnNumber(this.location));

        // Resolve center of object
        this.centerX = getTileWidth(this.location) * (column + 0.5);
        this.centerY = getTileHeight(this.location) * (row + 0.5);

        // Generate object identifier
        this.id = "cross" + "_" + row + "_" + column;

        // Move to center of tile
        path = "m " + this.centerX + " " + this.centerY;

        // Generate paths for 4 radial lines (from center)
        for (var counter = 0; counter < 4; counter++) {
            var angle = counter * 90 + 45;

            // Radial Distance
            var distanceX = getPolarX(this.radius, angle);
            var distanceY = getPolarY(this.radius, angle);

            // Radial Path
            var radialPath = "l " + distanceX + " " + distanceY;

            // Return to origin
            var pathOriginReturn = "m " + -1 * distanceX + " " + -1 * distanceY;

            // Cross
            path += " " + radialPath + " " + pathOriginReturn;
        }

        // Style
        var styleInfo = "stroke-width:" + this.strokeWidth + ";stroke:" + this.stroke + ";stroke-linecap:" + this.strokeLinecap + ";fill:" + this.fill + ";opacity:" + this.opacity + ";";

        // SVG Object
        this.image = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Attributes
        this.image.setAttribute("d", path);

        // Attributes
        this.image.setAttribute("id", this.id);
        this.image.setAttribute("style", styleInfo);

        $("#" + this.target).append(this.image);
    }
}

class SvgRadialLine {
    constructor() {
        this.id = "";
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.angle = 0;
        this.offsetAngle = 0;
        this.strokeWidth = 5;
        this.stroke = "limegreen";
        this.strokeLinecap = "butt";
        this.fill = "none";
        this.opacity = 1.0;
        this.location = "";
        this.endpoint = "";
        this.target = "";
    }

    draw() {
        // Initializations
        var path = "";
        var row = Number(getRowNumber(this.location));
        var column = Number(getColumnNumber(this.location));

        // Resolve center of object
        this.centerX = getTileWidth(this.location) * (column + 0.5);
        this.centerY = getTileHeight(this.location) * (row + 0.5);

        // Generate object identifier
        this.id = "radialLine" + "_" + row + "_" + column;

        // ENDPOINT
        var row2 = Number(getRowNumber(this.endpoint));
        var column2 = Number(getColumnNumber(this.endpoint));

        // Resolve center of object
        var centerX2 = getTileWidth(this.location) * (column2 + 0.5);
        var centerY2 = getTileHeight(this.location) * (row2 + 0.5);

        // Calculate radius
        this.radius += getRadialArmLength(this.centerX, this.centerY, centerX2, centerY2);

        // Distance between points
        var deltaX = centerX2 - this.centerX;
        var deltaY = centerY2 - this.centerY;

        // Watch for "divide by zero"
        if (deltaX === 0) {
            this.angle = 90;
        } else {
            this.angle = radiansToDegrees(Math.atan(deltaY / deltaX));
        }

        // Move to center of tile
        path = "m " + this.centerX + " " + this.centerY;

        // Generate paths for 2 radial lines (from center)
        for (var counter = 0; counter < 2; counter++) {
            var angle = counter * 180 + this.angle + this.offsetAngle;

            // Radial Distance
            var distanceX = getPolarX(this.radius, angle);
            var distanceY = getPolarY(this.radius, angle);

            // Radial Path
            var radialPath = "l " + distanceX + " " + distanceY;

            // Return to origin
            var pathOriginReturn = "m " + -1 * distanceX + " " + -1 * distanceY;

            // Cross
            path += " " + radialPath + " " + pathOriginReturn;
        }

        // Style
        var styleInfo = "stroke-width:" + this.strokeWidth + ";stroke:" + this.stroke + ";stroke-linecap:" + this.strokeLinecap + ";fill:" + this.fill + ";opacity:" + this.opacity + ";";

        // SVG Object
        this.image = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Attributes
        this.image.setAttribute("d", path);

        // Attributes
        this.image.setAttribute("id", this.id);
        this.image.setAttribute("style", styleInfo);

        $("#" + this.target).append(this.image);
    }
}
// #endregion

