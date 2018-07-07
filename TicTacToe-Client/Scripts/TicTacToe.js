$(document).ready(function () {
    //$('#btnTest').on('click', test);

    setupSquareClicks();

});

function test() {
}

function setupSquareClicks() {
    //var refSquareName = "#" + "square" + "_" + "0" + "_" + "0";

    //$(refSquareName).on('click', function () {
    //    var info = this.attributes["style"].value;
    //    info = "path = " + info;
    //    alert(info);
    //});

    // GameBoard is a 3x3 matrix
    var i = 0;
    var j = 0;

    // Rows
    for (i = 0; i < 3; i++) {
        // Columns
        for (j = 0; j < 3; j++) {
            var refSquareName = "#" + "square" + "_" + i + "_" + j;

            $(refSquareName).on('click', function () {
                var info = this.attributes["style"].value;
                info = "path = " + info;
                alert(info);
            });
}
    }
}
