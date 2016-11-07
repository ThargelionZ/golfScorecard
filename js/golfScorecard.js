/**
 * Created by mylesparker on 10/24/16.
 */

/**
 * Created by mylesparker on 10/27/16.
 */


/*-------------------------------------------
*   Pulling in Golf JSON Object
-------------------------------------------*/

var myLocation = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
var closeCourses;
var selectedCourse;
var numberOfHoles;

$(document).ready(function() {
    $.post("http://golf-courses-api.herokuapp.com/courses/", myLocation, function(data, status){
        closeCourses = JSON.parse(data);
        for(i in closeCourses.courses){
            $("#courseSelect").append("<option value='" + closeCourses.courses[i].id + "'>" + closeCourses.courses[i].name + "</option>");
        }
    });
});

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

var holeValue;

function loadHole() {
    holeValue = $("#holeAmount").find(":selected").val();
    if(holeValue == "9 Holes"){
        numberOfHoles = 9;
    }
    else if(holeValue == "18 Holes") {
        numberOfHoles = 18;
    }
    else {
        numberOfHoles = undefined;
    }
}

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

function addPlayer(){
    if(courseValue == "-"){
        resetCard();
        $("#cardContainer").append("<p class='selectCourseError' style='color: red;'>*Must select a Course before adding a player!</p>");
    } else {
        $(".selectCourseError").remove();
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
            $("#leftCard").append("<div class='player' id='playerLabel" + playerNumber + "'>Player " + (playerNumber + 1) + "<span class='glyphicon glyphicon-minus-sign' onclick='removePlayer(" + playerNumber + ")'></span></div>");

            // Create the rows associated with those players

            $("#input").append("<tr id='row" + playerNumber + "'></tr>");
            if (numberOfHoles == 9) {
                for (var i = 0; i <= numberOfHoles; i++) {
                    $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                        "<input class='input' id='input" + i + "'>" +
                        "</td>");
                    itemNumber++;
                }
            } else {
                for (var i = 0; i <= numberOfHoles + 2; i++) {
                    $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                        "<input class='input' id='input" + i + "'>" +
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

$('.player').on('click', '[data-editable]', function(){
    var $el = $(this);

    var $input = $('<input/>').val($el.text());
    $el.replaceWith( $input );

    var save = function(){
        var $p = $('<p data-editable />').text($input.val());
        $input.replaceWith( $p );
    };
    $input.one('blur', save).focus();
});



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
        itemNumber = 0;
        $(".tableHeader").remove();
        init = false;
    }
}

/*-------------------------------------------
 *   Reset Card function
 -------------------------------------------*/

function resetCard() {
    $(".tableHeader").remove();
    $(".player").remove();
    $(".dataItem").remove();
    playerAmount = 0;
    playerNumber = 0;
    itemNumber = 0;
    init = false;
    $(".selectCourseError").remove();
    $("#errorMessage").remove();
    $("#leftCard").html("Click \"Add a Player\" to add players.");
}


