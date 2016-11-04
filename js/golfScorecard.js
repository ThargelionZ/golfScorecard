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
        for(p in closeCourses.courses){
            $("#courseSelect").append("<option value='" + closeCourses.courses[p].id + "'>" + closeCourses.courses[p].name + "</option>");
        }
    });
});

function loadCourse(theid) {
    $.get("http://golf-courses-api.herokuapp.com/courses/" + theid, function(data, status){
        $(".teeOptions").remove();
        selectedCourse = JSON.parse(data);
        $("#courseTitle").html(selectedCourse.course.name);
        numberOfHoles = selectedCourse.course.hole_count;
        for(var i = 0; i < selectedCourse.course.holes[0].tee_boxes.length - 1; i++){
            $("#teeTypes").append("<option class='teeOptions' value='" + i + "'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type +"</option>");
        }
    });
}

/*-------------------------------------------
 *   Create a way to add players
 -------------------------------------------*/

var playerNumber = 0;
var playerAmount = 0;
var itemNumber = 0;
var leftCard;
var errBool = false;
var init = false;

function addPlayer(){
    if(!init){

        // Create column titles

        for(var i = 0; i < numberOfHoles; i++){
            $("#holes").append("<td class='tableHeader'><strong>Hole " + (i + 1) + "</strong></td>");
            if(i == 8){
                $("#holes").append("<td class='tableHeader'><strong>Total (Out)</strong></td>");
            }
            else if(i == 17){
                $("#holes").append("<td class='tableHeader'><strong>Total (In)</strong></td>");
                $("#holes").append("<td class='tableHeader'><strong>Grand Total</strong></td>");
            }
        }
        init = true;
    }
    if(playerAmount > 5){
        if(!errBool){
            $("#cardContainer").append("<p id='errorMessage' style='color: red;'>* Cannot add more than 6 players.</p>");
            errBool = true;
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
        if(numberOfHoles == 9){
            for (var i = 0 ; i <= numberOfHoles; i++) {
                $("#row" + playerNumber).append("<td class='dataItem' id='dataItem" + itemNumber + "'>" +
                    "<input class='input' id='input" + i + "'>" +
                    "</td>");
                itemNumber++;
            }
        } else {
            for (var i = 0 ; i <= numberOfHoles + 2; i++) {
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

$(".player").on('click', function () {
    console.log("this is working");
    var playerName = $(this).val();
    $(this).append("<input type='text' value='"+ playerName +"'>");
    $(this).remove();
});

/*-------------------------------------------
 *   Create a way to remove players
 -------------------------------------------*/


function removePlayer(theid) {
    if(playerAmount <= 6){
        $("#errorMessage").remove();
        errBool = false;
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

