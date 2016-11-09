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
            $("#teeTypes").append("<option class='teeOptions'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type +"</option>");
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

// Have the yardage, par, and hadicap react to the teeValue

var teeValue;

function loadTee() {
    teeValue = $("#teeTypes").find(":selected").val();
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

function addPlayer(){
    if(courseValue == "-"){
        resetCard();
        $("#rightCard").css("display", "none");
        $("#cardContainer").append("<p id='selectCourseError' style='color: red;'>*Must select a Course before adding a player!</p>");
    } else {
        $("#rightCard").css("display", "block");
        $("#selectCourseError").remove();
        if (!init) {

            // Create column titles

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
            if (numberOfHoles == 9) {
                $("#leftCard").css("margin", "0 0 0 30px");
                for (var i = 0; i <= numberOfHoles; i++) {
                    $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                        "<input class='input' id='input" + itemNumber + "'>" +
                        "</td>");
                    itemNumber++;
                }
            } else {
                $("#leftCard").css("margin", "17px 0 0 30px");
                for (var i = 0; i <= numberOfHoles + 2; i++) {
                    $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                        "<input class='input' id='input" + itemNumber + "'>" +
                        "</td>");
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

function changeName(theid) {

    var $el = $(theid);

    var $input = $("<input class='nameInput' type='text' maxlength='15' style='height: 24px; width: 100px;'/>").val( $el.text() );
    $el.replaceWith( $input );

    var save = function(){
        var $p = $("<p data-editable class='name' id='name" + playerNumber + "' onclick='changeName(this)'></p>").text( $input.val() );
        $input.replaceWith( $p );
    };

    $input.one('blur', save).focus()
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
        $("#rightCard").css("display", "none");
        itemNumber = 0;
        $(".tableHeader").remove();
        init = false;
    }
}

/*-------------------------------------------
 *   Reset Card function
 -------------------------------------------*/

function resetCard() {
    $("#rightCard").css("display", "none");
    $(".tableHeader").remove();
    $(".player").remove();
    $(".dataItem").remove();
    playerAmount = 0;
    playerNumber = 0;
    itemNumber = 0;
    init = false;
    errMaxPlayers = false;
    $("#selectCourseError").remove();
    $("#errorMessage").remove();
    $("#leftCard").html("Click \"Add a Player\" to add players.");
}


