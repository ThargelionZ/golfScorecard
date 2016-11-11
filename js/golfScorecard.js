/**
 * Created by mylesparker on 10/24/16.
 */

/**
 * Created by mylesparker on 10/27/16.
 */


/*-------------------------------------------
*   Pulling in Golf JSON Object
-------------------------------------------*/

var lon, lat;
var closeCourses;
var selectedCourse;
var numberOfHoles;
var options = {
    enableHighAccuracy: true
};

// Getting the original simplified course data for course id

navigator.geolocation.getCurrentPosition(function(position) {

    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var userPosition = {
        latitude: lat,
        longitude: lon
    };

    $(document).ready(function () {
        $.post("http://golf-courses-api.herokuapp.com/courses/", userPosition, function(data, status){
            closeCourses = JSON.parse(data);
            for(i in closeCourses.courses){
                $("#courseSelect").append("<option value='" + closeCourses.courses[i].id + "'>" + closeCourses.courses[i].name + "</option>");
            }
        });
    });
}, error, options);

function error() {
    console.log("Failure...");
}

// Getting the full course data for all courses specific to the id

var courseValue = $("#courseSelect").find(":selected").text();

function loadCourse(theid) {
    $.get("http://golf-courses-api.herokuapp.com/courses/" + theid, function(data, status){
        resetCard();
        teeValue = "-";
        courseValue = $("#courseSelect").find(":selected").text();
        if(courseValue == "-"){
            $("#courseTitle").html("Choose Your Location");
        }
        $(".teeOptions").remove();
        $(".holeOptions").remove();
        selectedCourse = JSON.parse(data);
        $("#courseTitle").html(selectedCourse.course.name);
        numberOfHoles = selectedCourse.course.hole_count;
        for(var i = 0; i < selectedCourse.course.holes[0].tee_boxes.length - 1; i++){
            $("#teeTypes").append("<option class='teeOptions' value='"+ i + "'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type +"</option>");
        }
        if(numberOfHoles == 18){
            $("#holeAmount").append("<option class='holeOptions'>9 Holes</option>" + "<option class='holeOptions'>18 Holes</option>");
        } else {
            $("#holeAmount").append("<option>9 Holes</option>");
        }
    });
}

// Have the page react based on the amount of holes

var holeValue;

function loadHole() {
    resetCard();
    holeValue = $("#holeAmount").find(":selected").val();
    if(holeValue == "9 Holes"){
        numberOfHoles = 9;
    }
    else if(holeValue == "18 Holes") {
        numberOfHoles = 18;
    }
}

// Have the yardage, par, and handicap react to the teeValue

var teeValue = $("#teeTypes").find(":selected").text();

function loadTee() {
    resetCard();
    teeValue = $("#teeTypes").find(":selected").text();
}

/*-------------------------------------------
 *   Create a way to add players
 -------------------------------------------*/

var playerNumber = 0;
var playerAmount = 0;
var itemNumber = 0;
var leftCard;
var errMaxPlayers = false;
var init = false;
$("#rightCard").css("display", "none");
$("#leftCardHeadings").css("display", "none");

function addPlayer(){
    if(courseValue == "-" || teeValue == "-"){
        resetCard();
        $("#rightCard").css("display", "none");
        $("#leftCardHeadings").css("display", "none");
        $("#cardContainer").append("<p id='selectCourseError' style='color: red;'>*Must select a Course and a Tee Type before adding a player!</p>");
    } else {
        $("#addPlayerButton").text("Add a Player");
        $("#rightCard").css("display", "block");
        $("#leftCardHeadings").css("display", "block");
        $("#selectCourseError").remove();
        if (!init) {
            // Create hole titles

            for (var i = 0; i < numberOfHoles; i++) {
                $("#holes").append("<td class='tableHeader'><strong>Hole " + (i + 1) + "</strong></td>");
                if (i == 8) {
                    $("#holes").append("<td class='tableHeader'><strong>Total (Out)</strong></td>");
                }
                else if (i == 17) {
                    $("#holes").append("<td class='tableHeader'><strong>Total (In)</strong></td>");
                    $("#holes").append("<td class='tableHeader'><strong>Grand Total</strong></td>");
                }
            }

            var columns;

            if(numberOfHoles == 9){
                columns = numberOfHoles + 1;
            } else {
                columns = numberOfHoles + 3;
            }
            // Create yardage values

            var yardage,
                yardageIn = 0,
                yardageOut = 0,
                yardageGrand = 0;

            for (var i = 0; i < columns; i++) {
                if(i < 9) {
                    yardage = selectedCourse.course.holes[i].tee_boxes[$("#teeTypes").val()].yards;
                }
                else if(i > 9 && i < 19) {
                    yardage = selectedCourse.course.holes[i - 1].tee_boxes[0].yards;
                }

                if(i < 9){
                    yardageOut += yardage;
                }
                else if (i > 9 && i < 19) {
                    yardageIn += yardage;
                }

                if(i == 9) {
                    $("#yardage").append("<td id='yardageId" + i + "' class='tableHeader'>" + yardageOut + "</td>");
                }
                else if(i == 19) {
                    $("#yardage").append("<td id='yardageId" + i + "' class='tableHeader'>" + yardageIn + "</td>");
                }
                else if(i == 20) {
                    yardageGrand = yardageIn + yardageOut;
                    $("#yardage").append("<td id='yardageId" + i + "' class='tableHeader'>" + yardageGrand + "</td>");
                }
                else {
                    $("#yardage").append("<td id='yardageId" + i + "' class='tableHeader'>" + yardage + "</td>");
                }
            }

            // Create par values

            var par,
                parIn = 0,
                parOut = 0,
                parGrand = 0;

            for (var i = 0; i < columns; i++) {
                if(i < 9) {
                    par = selectedCourse.course.holes[i].tee_boxes[0].par;
                }
                else if(i > 9 && i < 19) {
                    par = selectedCourse.course.holes[i - 1].tee_boxes[0].par;
                }

                if(i < 9){
                    parOut += par;
                }
                else if (i > 9 && i < 19) {
                    parIn += par;
                }

                if(i == 9) {
                    $("#par").append("<td id='parId" + i + "' class='tableHeader'>" + parOut + "</td>");
                }
                else if(i == 19) {
                    $("#par").append("<td id='parId" + i + "' class='tableHeader'>" + parIn + "</td>");
                }
                else if(i == 20) {
                    parGrand = parIn + parOut;
                    $("#par").append("<td id='parId" + i + "' class='tableHeader'>" + parGrand + "</td>");
                }
                else {
                    $("#par").append("<td id='parId" + i + "' class='tableHeader'>" + par + "</td>");
                }
            }

            // Create handicap values

            var handicap,
                handicapIn = 0,
                handicapOut = 0,
                handicapGrand = 0;

            for (var i = 0; i < columns; i++) {
                if(i < 9) {
                    handicap = selectedCourse.course.holes[i].tee_boxes[0].hcp;
                }
                else if(i > 9 && i < 19) {
                    handicap = selectedCourse.course.holes[i - 1].tee_boxes[0].hcp;
                }

                if(i < 9){
                    handicapOut += handicap;
                }
                else if (i > 9 && i < 19) {
                    handicapIn += handicap;
                }

                if(i == 9) {
                    $("#handicap").append("<td id='handicapId" + i + "' class='tableHeader'>" + handicapOut + "</td>");
                }
                else if(i == 19) {
                    $("#handicap").append("<td id='handicapId" + i + "' class='tableHeader'>" + handicapIn + "</td>");
                }
                else if(i == 20) {
                    handicapGrand = handicapIn + handicapOut;
                    $("#handicap").append("<td id=handicapId" + i + "' class='tableHeader'>" + handicapGrand + "</td>");
                }
                else {
                    $("#handicap").append("<td id='handicapId" + i + "' class='tableHeader'>" + handicap + "</td>");
                }
            }


            init = true;
        }
        if (playerAmount > 5) {
            if (!errMaxPlayers) {
                $("#cardContainer").append("<p id='errorMessage' style='color: red;'>* Cannot add more than 6 players.</p>");
                errMaxPlayers = true;
            }
        } else {

            //Create the players themselves

            leftCard = $("#leftCard").html();
            if (leftCard == "Click \"Add a Player\" to add players.") {
                playerNumber = 0;
            }
            if (playerNumber == 0) {
                $("#leftCard").html("");
            }
            $("#leftCard").append("<div class='player' id='playerLabel" + playerNumber + "'><p data-editable class='name' id='name" + playerNumber + "' onclick='changeName(this)'>Player " + (playerNumber + 1) + "</p><span class='glyphicon glyphicon-minus-sign' onclick='removePlayer(" + playerNumber + ")'></span></div>");

            // Create the rows associated with those players

            $("#input").append("<tr id='row" + playerNumber + "'></tr>");

            // Create 9 holes if number of holes equals 9

            if (numberOfHoles == 9) {
                $("#leftCard").css("margin", "203px 0 0 30px");
                $("#leftCardHeadings").css("margin-bottom", "-203px");
                $(".tableHeadings:first-child").css("margin-bottom", "24px");
                for (var i = 0; i < numberOfHoles + 1; i++) {
                    if(i < 9){
                        $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                            "<input onkeyup='validateInput(this.value, this)' maxlength='2' class='input' id='input" + itemNumber + "'>" +
                            "</td>");
                    }
                    else if(i == 9){
                        $("#row" + playerNumber).append("<td class='totals' id='totalOut" + playerNumber + "' style='height: 39px; width: 145px; vertical-align: middle;'>0</td>");
                    }
                    itemNumber++;
                }
                // Create 18 holes if number of holes equals anything other than 9.
            } else {
                $("#leftCard").css("margin", "220px 0 0 30px");
                $("#leftCardHeadings").css("margin-bottom", "-220px");
                $(".tableHeadings:first-child").css("margin-bottom", "32px");

                for (var i = 0; i < numberOfHoles + 3; i++) {
                    if(i < 9 || i > 9 && i < 19){
                        $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                            "<input onkeyup='validateInput(this.value, this)' maxlength='2' class='input' id='input" + itemNumber + "'>" +
                            "</td>");
                    }
                    else if(i == 9) {
                        $("#row" + playerNumber).append("<td class='totals' id='totalOut" + playerNumber + "' style='height: 39px; width: 65px; vertical-align: middle;'>0</td>");
                    }
                    else if(i == 19) {
                        $("#row" + playerNumber).append("<td class='totals' id='totalIn" + playerNumber + "' style='height: 39px; width: 65px; vertical-align: middle;'>0</td>");
                    }
                    else if(i == 20)  {
                        $("#row" + playerNumber).append("<td class='totals' id='totalGrand" + playerNumber + "' style='height: 39px; width: 65px; vertical-align: middle;'>0</td>");
                    }
                    itemNumber++;
                }
            }
            playerNumber++;
            playerAmount++;
        }
    }
}

/*-------------------------------------------
 *   Create a way to change player names
 -------------------------------------------*/

var playerId = 0;

function changeName(theelement) {
    var $el = $(theelement);

    var $input = $("<input onkeyup='validatePlayer(this.value, this)' class='nameInput' type='text' maxlength='15' style='height: 24px; width: 100px;'/>").val( $el.text() );
    $el.replaceWith( $input );

    var save = function(){
        var $p = $("<p data-editable class='name' id='name" + playerNumber + "' onclick='changeName(this)'></p>").text( $input.val() );
        if($input.val() !== ""){
            $input.replaceWith( $p );
        } else {
            $("#playerValidationError").remove();
            $input.replaceWith($el);
        }
    };
    $input.one('blur', save).focus()
}

/*-------------------------------------------
 *   Validate the names of the players
 -------------------------------------------*/

function validatePlayer(thevalue, theelement) {
    $("#playerValidationError").remove();
    if(!isNaN(parseInt(thevalue))){
        $(theelement).val("");
        $("#cardContainer").append("<p id='playerValidationError' style='color: red;'>* Cannot use numbers as names unless a word comes first (Ex: Larry3).</p>");
    }
}


/*-------------------------------------------
 *   Create a way to remove players
 -------------------------------------------*/


function removePlayer(theid) {
    if(playerAmount <= 6){
        $("#errorMessage").remove();
        errMaxPlayers = false;
    }
    $("#playerLabel" + theid).remove();
    $("#row" + theid).remove();
    playerAmount--;
    if($("#leftCard").html() == ""){
        $("#leftCard").html("Click \"Add a Player\" to add players.");
        $("#addPlayerButton").text("Initialize Card");
        $("#rightCard").css("display", "none");
        $("#leftCardHeadings").css("display", "none");
        itemNumber = 0;
        $(".tableHeader").remove();
        init = false;
    }
}

/*-------------------------------------------
 *   Validate the input and add inputs
 -------------------------------------------*/

var totalOut0 = 0,
    totalOut1 = 0,
    totalOut2 = 0,
    totalOut3 = 0,
    totalOut4 = 0,
    totalOut5 = 0;

var totalIn0 = 0,
    totalIn1 = 0,
    totalIn2 = 0,
    totalIn3 = 0,
    totalIn4 = 0,
    totalIn5 = 0;

var totalGrand0 = 0,
    totalGrand1 = 0,
    totalGrand2 = 0,
    totalGrand3 = 0,
    totalGrand4 = 0,
    totalGrand5 = 0;

var parseVal;

function validateInput(thevalue, theid) {
    $("#inputValidationError").remove();
    if(isNaN(parseInt(thevalue)) && thevalue != "") {
        $(theid).val("");
        $("#cardContainer").append("<p id='inputValidationError' style='color: red;'>* Must only input numbers (0 - 99)</p>");
    } else {
        if(numberOfHoles == 9){
            totalOut0 = 0;
            totalOut1 = 0;
            totalOut2 = 0;
            totalOut3 = 0;
            totalOut4 = 0;
            totalOut5 = 0;

            for(var i = 0; i < 60; i++){
                parseVal = parseInt($("#input" + i).val());
                if (!isNaN(parseVal)) {
                    // R0W 0
                    if (i < 9) {
                        totalOut0 += parseVal;
                    }
                    // ROW 1
                    else if (i > 9 && i < 19) {
                        totalOut1 += parseVal;
                    }
                    // ROW 2
                    else if (i > 19 && i < 29) {
                        totalOut2 += parseVal;
                    }
                    // ROW 3
                    else if (i > 29 && i < 39) {
                        totalOut3 += parseVal;
                    }
                    // ROW 4
                    else if (i > 39 && i < 49) {
                        totalOut4 += parseVal;
                    }
                    // ROW 5
                    else if (i > 49 && i < 59) {
                        totalOut5 += parseVal;
                    }
                }
                // ROW 0
                if (i == 9) {
                    $("#totalOut0").text(totalOut0);
                }
                // ROW 1
                else if (i == 19) {
                    $("#totalOut1").text(totalOut1);
                }
                // ROW 2
                else if (i == 29) {
                    $("#totalOut2").text(totalOut2);
                }
                // ROW 3
                else if (i == 39) {
                    $("#totalOut3").text(totalOut3);
                }
                // ROW 4
                else if (i == 49) {
                    $("#totalOut4").text(totalOut4);
                }
                // ROW 5
                else if (i == 59) {
                    $("#totalOut5").text(totalOut5);
                }

            }
        } else {
            totalOut0 = 0;
            totalOut1 = 0;
            totalOut2 = 0;
            totalOut3 = 0;
            totalOut4 = 0;
            totalOut5 = 0;

            totalIn0 = 0;
            totalIn1 = 0;
            totalIn2 = 0;
            totalIn3 = 0;
            totalIn4 = 0;
            totalIn5 = 0;

            totalGrand0 = 0;
            totalGrand1 = 0;
            totalGrand2 = 0;
            totalGrand3 = 0;
            totalGrand4 = 0;
            totalGrand5 = 0;

            for(var i = 0; i < 126; i++) {
                parseVal = parseInt($("#input" + i).val());
                if (!isNaN(parseVal)) {
                    // ROW O
                    if (i < 9) {
                        totalOut0 += parseVal;
                    }
                    else if (i > 9 && i < 19) {
                        totalIn0 += parseVal;
                    }
                    // ROW 1
                    else if (i < 30) {
                        totalOut1 += parseVal;
                    }
                    else if (i > 30 && i < 40) {
                        totalIn1 += parseVal;
                    }
                    // ROW 2
                    else if (i < 51) {
                        totalOut2 += parseVal;
                    }
                    else if (i > 51 && i < 61) {
                        totalIn2 += parseVal;
                    }
                    // ROW 3
                    else if (i < 72) {
                        totalOut3 += parseVal;
                    }
                    else if (i > 72 && i < 82) {
                        totalIn3 += parseVal;
                    }
                    // ROW 4
                    else if (i < 93) {
                        totalOut4 += parseVal;
                    }
                    else if (i > 93 && i < 103) {
                        totalIn4 += parseVal;
                    }
                    // ROW 5
                    else if (i < 114) {
                        totalOut5 += parseVal;
                    }
                    else if (i > 114 && i < 124) {
                        totalIn5 += parseVal;
                    }
                }
                // ROW 0
                if (i == 9) {
                    $("#totalOut0").text(totalOut0);
                }
                else if (i == 19) {
                    $("#totalIn0").text(totalIn0);
                }
                else if (i == 20) {
                    totalGrand0 = totalOut0 + totalIn0;
                    $("#totalGrand0").text(totalGrand0);
                }
                // ROW 1
                else if (i == 30) {
                    $("#totalOut1").text(totalOut1);
                }
                else if (i == 40) {
                    $("#totalIn1").text(totalIn1);
                }
                else if (i == 41) {
                    totalGrand1 = totalOut1 + totalIn1;
                    $("#totalGrand1").text(totalGrand1);
                }
                // ROW 2
                else if (i == 51) {
                    $("#totalOut2").text(totalOut2);
                }
                else if (i == 61) {
                    $("#totalIn2").text(totalIn2);
                }
                else if (i == 62) {
                    totalGrand2 = totalOut2 + totalIn2;
                    $("#totalGrand2").text(totalGrand2);
                }
                // ROW 3
                else if (i == 72) {
                    $("#totalOut3").text(totalOut3);
                }
                else if (i == 82) {
                    $("#totalIn3").text(totalIn3);
                }
                else if (i == 83) {
                    totalGrand3 = totalOut3 + totalIn3;
                    $("#totalGrand3").text(totalGrand3);
                }
                // ROW 4
                else if (i == 93) {
                    $("#totalOut4").text(totalOut4);
                }
                else if (i == 103) {
                    $("#totalIn4").text(totalIn4);
                }
                else if (i == 104) {
                    totalGrand4 = totalOut4 + totalIn4;
                    $("#totalGrand4").text(totalGrand4);
                }
                // ROW 5
                else if (i == 114) {
                    $("#totalOut5").text(totalOut5);
                }
                else if (i == 124) {
                    $("#totalIn5").text(totalIn5);
                }
                else if (i == 125) {
                    totalGrand5 = totalOut5 + totalIn5;
                    $("#totalGrand5").text(totalGrand5);
                }
            }
        }
    }
}

/*-------------------------------------------
 *   Reset Card function
 -------------------------------------------*/

function resetCard() {
    $("#rightCard").css("display", "none");
    $("#leftCardHeadings").css("display", "none");
    $(".tableHeader").remove();
    $(".player").remove();
    $(".dataItem").remove();
    $(".totals").remove();
    playerAmount = 0;
    playerNumber = 0;
    itemNumber = 0;
    init = false;
    errMaxPlayers = false;
    $("#selectCourseError").remove();
    $("#errorMessage").remove();
    $("#leftCard").html("Click \"Add a Player\" to add players.");
    $("#addPlayerButton").text("Initialize Card");
}

/*-------------------------------------------
 *   Reset Card function
 -------------------------------------------*/

function clearCard() {
    $(".totals").text("0");
    $(".input").val("");
}


