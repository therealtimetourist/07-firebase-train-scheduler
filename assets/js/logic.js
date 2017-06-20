// Initialize Firebase db config
var config = {
	apiKey: "AIzaSyBjQ0gzNloXIfTtfgtuMkIl8mY33LK8jDY",
	authDomain: "trainschedule-c6f2e.firebaseapp.com",
	databaseURL: "https://trainschedule-c6f2e.firebaseio.com",
	projectId: "trainschedule-c6f2e",
	storageBucket: "",
	messagingSenderId: "1077136984732"
};

// firebase db init
firebase.initializeApp(config);
// variable to reference Firebase db
var database = firebase.database();
// create global variables
var train_name;
var train_destination;
var train_time_first;
var train_time_first_converted;
var train_frequency;
var currTime;
var train_time_diff;
var timeMod;
var train_minutes_away;
var nextTrain;
var train_next_arrival;

// Train insert to schedule
database.ref().on('child_added', function(childSnapshot, prevChildKey){
	train_name         = childSnapshot.val().train_name;
	train_destination  = childSnapshot.val().train_destination;
	train_time_first   = childSnapshot.val().train_time_first;
	train_time_first_converted = moment(train_time_first, "HH:mm").subtract(1, "years");
	train_frequency    = childSnapshot.val().train_frequency;
	currTime           = moment(currTime).format("HH:mm");
	train_time_diff    = moment().diff(moment(train_time_first_converted), "minutes");
	timeMod = train_time_diff % train_frequency;
	train_minutes_away = train_frequency - timeMod;
	nextTrain = moment().add(train_minutes_away, "minutes");
    train_next_arrival = moment(nextTrain).format("hh:mm A");
	
	// append new train to schedule
	var train_row  = "<tr><td>" + train_name + "</td>";
		train_row += "<td>" + train_destination + "</td>";
		train_row += "<td>" + train_frequency + "</td>";
		train_row += "<td>" + train_next_arrival + "</td>";
		train_row += "<td>" + train_minutes_away + "</td></tr>";
		
	$('#tbl_trains > tbody').append(train_row);
}), function(errorObject) {		// error check
	console.log("The read failed: " + errorObject.code)};

// =================================================
// add new train to schedule
$('.btn').on('click', function(event){
	// prevent default behavior
	event.preventDefault();
	// Get the input values
	var new_train_name        = $('#train_name').val().trim();
	var new_train_destination = $('#train_destination').val().trim();
	var new_train_time_first  = $('#train_time_first').val().trim();
	var new_train_frequency   = parseInt($('#train_frequency').val().trim());
	
	// gather user input into an object
	// Creates local "temporary" object for holding employee data
	var newTrain = {
		train_name: new_train_name,
		train_destination: new_train_destination,
		train_time_first: new_train_time_first,
		train_frequency: new_train_frequency
	};
	
	// save new train schedule to Firebase db
	database.ref().push(newTrain);
	
	// clear all form fields
	$('#train_addNew')[0].reset();
});
