$(document).ready(function() {
    // Set global variables
    var imageFolder = "assets/images/"
    var attackCount = 0;
    var reset = false;
    var winCount = 0;
    var attackerSelected = false;
    var defenderSlected = false;
    // Set attacker and defender initial health and attack
    var attackerHealth = 0;
    var attackerAttack = 0;
    var attackerNewAttack = 0;
    var defenderHealth = 0;
    var defenderAttack = 0;
    var defenderName = "";
    // Attacker and defender Box to update their health
    var attackerBox = ""
    var defenderBox = ""
    // Get the html elements needed to update
    var messageDiv = $("#message");
    var resetButton = $("#btnReset");
    var attackButton = $("#btnAttack");
    var attackerDiv = $("#attackerDiv");
    var defenderDiv = $("#defenderDiv");
    var playerDiv = $("#playerDiv");
    var playerMessage = $("#playerMessage");
    // Get the inner Divs
    var attackerInnerDiv = $("#attackerInnerDiv");
    var defenderInnerDiv = $("#defenderInnerDiv");
    var playerInnerDiv = $("#playerInnerDiv");

    // Hide Button and Divs
    resetButton.hide();
    attackButton.hide();
    attackerDiv.hide();
    defenderDiv.hide();
    messageDiv.hide();
    // Set the message
    playerMessage.text("Select your player");

    // Define Player function
    function Player(id, fullName, imageSrc, health, attack) {
        this.id = id;
        this.fullName = fullName;
        this.imageSrc = imageSrc;
        this.health = health;
        this.attack = attack;
    }

    // Set players initial values
    var lukeSkywalker = new Player("lukeSkywalker", "Luke Skywalker", imageFolder.concat('luke-skywalker.jpg'), 200, 20);
    var darthVader = new Player("darthVader", "Darth Vader", imageFolder.concat('darth-vader.jpeg'), 150, 15);
    var princessEleia = new Player("princessEleia", "Princess Eleia", imageFolder.concat('princess-eleia.jpg'), 250, 25);
    var Yoda = new Player("Yoda", "Yoda", imageFolder.concat('yoda.png'), 100, 10);

    // Create div for players and add event listeners
    function initialisePlayers(playerObj) {
        // Create a variable named "playerBox"
        var playerBox = $("<div>");

        // Give each "playerBox" a class "player-box"
        playerBox.addClass("player-box");


        //I was trying to use data attributes but ended up not using them.
        // // Give each "playerBox" a data-attribute called "data-health".
        // playerBox.attr("data-health", playerObj.health);
        //
        // // Give each "playerBox" a data-attribute called "data-attack".
        // playerBox.attr("data-attack", playerObj.attack);
        //
        // // Give each "playerBox" a data-attribute called "data-attack".
        // playerBox.attr("data-id", playerObj.id);

        // Set player id in html
        playerBox.attr("id", playerObj.id);

        // Add header Text
        var headerText = $("<h6>");
        headerText.text(playerObj.fullName);
        playerBox.append(headerText);

        // Add image
        var image = $("<img>");
        image.attr("src", playerObj.imageSrc);
        playerBox.append(image);

        // Add health
        var healthP = $("<h6>");
        healthP.attr("id", "health")
        healthP.text(playerObj.health);
        playerBox.append(healthP);

        // Append playerBox to the "#playerInnerDiv" on html
        playerInnerDiv.append(playerBox);
        // Create an "on-click" event attached to the playerBox
        playerBox.on("click", function() {
            // If there is no attacker
            if (!attackerSelected) {
                // Show attacker Div
                attackerDiv.show();
                // Change the header message
                playerMessage.text("Select a defender");
                // Remove the attacker from Players
                $(`#${playerObj.id}`).remove();
                // Add attacker to right place
                attackerInnerDiv.append(playerBox);
                // Set the attacker flag
                attackerSelected = true;
                // Add enemy css to rest of the players
                playerInnerDiv.children().addClass("enemy");
                //Set attackerHealth
                attackerHealth = playerObj.health;
                attackerAttack = playerObj.attack;
                // Set attacker box div
                attackerBox = $(`#${playerObj.id}`);
            }
            // There is attacker then set the defender
            else if (attackerSelected && !defenderSlected) {
                // Show defenderDiv and attack button
                attackButton.show();
                defenderDiv.show();
                // Change the header message
                playerMessage.text("Enemies waiting to attack");
                // Remove the defender from Players
                $(`#${playerObj.id}`).remove();
                // Add the defender class
                playerBox.addClass("defender");
                // Add defender to the right place
                defenderInnerDiv.append(playerBox);
                // Set the defender flag
                defenderSlected = true;
                // Set defenderHealth
                defenderHealth = playerObj.health;
                defenderAttack = playerObj.attack;
                defenderName = playerObj.fullName;
                // Empty the message
                messageDiv.hide();
                // Set defender box div
                defenderBox = $(`#${playerObj.id}`);
            }
            if (winCount == 2) {
                playerMessage.text("");
                playerDiv.hide();
            }
        });
    }

    // Add all the players on html page
    initialisePlayers(lukeSkywalker);
    initialisePlayers(darthVader);
    initialisePlayers(princessEleia);
    initialisePlayers(Yoda);

    // Attack function
    $("#btnAttack").on("click", function() {
        attackCount++;
        increaseAttack();
        calculateHealth();
        checkResult();
    });

    // Reset function
    $("#btnReset").on("click", function() {
        resetGame()

    });

    // Reset game
    function resetGame() {
        if (reset) {

            attackCount = 0;
            reset = false;
            winCount = 0;
            attackerSelected = false;
            defenderSlected = false;
            //Set attacker and defender initial health and attack
            attackerHealth = 0;
            attackerAttack = 0;
            attackerNewAttack = 0;
            defenderHealth = 0;
            defenderAttack = 0;
            defenderName = "";

            // Hide Button and Divs
            resetButton.hide();
            attackButton.hide();
            attackerDiv.hide();
            defenderDiv.hide();
            // Set the message
            playerMessage.text("Select your player");

            // Empty all div
            attackerInnerDiv.empty();
            defenderInnerDiv.empty();
            playerInnerDiv.empty();

            // Add all the players on html page
            initialisePlayers(lukeSkywalker);
            initialisePlayers(darthVader);
            initialisePlayers(princessEleia);
            initialisePlayers(Yoda);
            // Show player div
            playerDiv.show();
            // Remove the win message
            messageDiv.hide();
            // Set the reset flag
            reset = false;

        }
    }

    // Calculate health of fighting players
    var calculateHealth = function() {
        // Update new health
        attackerHealth -= defenderAttack;
        defenderHealth -= attackerNewAttack;
        // Update new health on html
        defenderBox.find("#health").text(defenderHealth);
        attackerBox.find("#health").text(attackerHealth);

    };

    // Check result after every attack
    var checkResult = function() {
        if (attackerHealth < 1) {
            // Show reset button
            resetButton.show();
            attackButton.hide();
            defenderDiv.hide();

            messageDiv.html("You been defeated.. <strong>GAME OVER!!</strong>");
            messageDiv.removeClass();
            messageDiv.addClass("alert alert-danger");
            messageDiv.show();
            // Hide player Div
            playerDiv.hide();
            // Set reset true
            reset = true;

        }
        // Defender Lost
        else if (defenderHealth < 1) {
            // Hide defender Div and buttons
            resetButton.hide();
            attackButton.hide();
            defenderDiv.hide();
            // Remove defeated player from html
            defenderInnerDiv.empty();
            // Attacker gets one more win added to winCount
            winCount++;
            //
            if (winCount == 3) {
                // Hide attack button
                attackButton.hide();
                // Show reset button
                resetButton.show();
                // Show defender div
                defenderDiv.hide();
                // Hide player Div
                playerDiv.hide();
                // Show message
                messageDiv.html("<strong>You WON!!</strong>");
                messageDiv.removeClass();
                messageDiv.addClass("alert alert-success");
                messageDiv.show();
                // Set reset true
                reset = true;

            } else {
                // Set the defender flag
                defenderSlected = false;
                //Show reset button
                messageDiv.text("You have defeated " + defenderName + ". Choose another enemy to fight!");
                messageDiv.removeClass();
                messageDiv.addClass("alert alert-success");
                messageDiv.show();
            }
        }
        // Attacker won the game
        else if (attackerHealth > 0 && winCount < 3) {
            messageDiv.html("You attacked " + defenderName + " for <strong>" + attackerNewAttack + "</strong> damage. ");
            messageDiv.append(defenderName + " attacked you for <strong>" + defenderAttack + "</strong> damage");
            messageDiv.removeClass();
            messageDiv.addClass("alert alert-info");
            messageDiv.show();

        }
    };

    // Increase attack power of attacking player
    var increaseAttack = function() {
        attackerNewAttack = attackerAttack * attackCount;
    };

});
