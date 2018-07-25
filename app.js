// /////////////////////////////////////
// Firebase Set Up
// /////////////////////////////////////

// Linking Firebase
    var config = {
        apiKey: "AIzaSyBvR-WY1MN4SGyBvo-r_v8UYdTYwDhbKHE",
        authDomain: "fir-train-schedule-7add1.firebaseapp.com",
        databaseURL: "https://fir-train-schedule-7add1.firebaseio.com",
        projectId: "fir-train-schedule-7add1",
        storageBucket: "",
        messagingSenderId: "908230209833"
    };

//Connecting to Firebase
    firebase.initializeApp(config);

// Variable for the database
    var database = firebase.database();

// /////////////////////////////////////
// The Click Event / The Form 
// /////////////////////////////////////

// Button for adding train data
    $("#submit-data-btn").on("click", function(event) {
        // Do not refresh the page
            event.preventDefault();

        // Grab user input
            var trainName = $("#name-input").val().trim();
            var tDestination = $("#destination-input").val().trim();
            var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
            var tFrequency = $("#freq-input").val().trim();

        // Create local temp object for holding train data
            var newTrain = {
                name: trainName,
                destination: tDestination,
                first: firstTrain,
                frequency: tFrequency
            };

        // Uploads train data to the database
            database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.first);
        console.log(newTrain.frequency);

        // Lets user know that train has been added
        alert("Train successfully added!");

        // Clears all of the text-boxes
            $("#name-input").val("");
            $("#destination-input").val("");
            $("#first-train-input").val("");
            $("#freq-input").val("");

    });

// /////////////////////////////////////
// Firebase Event / Time Calculations 
// /////////////////////////////////////

// The Firebase Event
    database.ref().on("child_added", function(childSnapshot) {
    
        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().first;
        var tFrequency = childSnapshot.val().frequency;
    
        // Hardcore Time Calculations 
            // Makes a moment.js object in seconds
            // 
            var originalTime = moment(firstTrain, "X");

            var firstTrainPretty = originalTime.subtract(1, "years");

            // Current Time
            // var currentTime = moment();

             // Difference between the first train time and the current time
            var timeDiff = moment().diff(moment(firstTrainPretty), "minutes");

            // Time apart (remainder)
            var tRemainder = timeDiff % tFrequency;

            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes"); 

        // Create the new row
        var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(tFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain),

        );
    
        // Append the new row to the table
        $(".table > tbody").append(newRow);
    });