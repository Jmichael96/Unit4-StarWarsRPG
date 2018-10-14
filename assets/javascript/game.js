$(document).ready(function() {
    var characters = {
        "Darth Vader": {
          name: "Darth Vader",
          health: 130,
          attack: 5,
          imageUrl: "assets/images/DarthVader.jpg",
          enemyAttackBack: 14
        },
        "Darth Maul": {
          name: "Darth Maul",
          health: 90,
          attack: 9,
          imageUrl: "assets/images/darthmaul.jpg",
          enemyAttackBack: 16
        },
        "Yoda": {
          name: "Yoda",
          health: 90,
          attack: 10,
          imageUrl: "assets/images/yoda.jpg",
          enemyAttackBack: 12
        },
        "Boba Fett": {
          name: "Boba Fett",
          health: 133,
          attack: 5,
          imageUrl: "assets/images/bobafett.jpg",
          enemyAttackBack: 13
        }
      };

      // Whatever character the player chooses becomes this variable
      var attacker;
      // An array that holds the rest of the characters.
      var combatants = [];
      // Whatever character the player chooses to fight becomes this variable
      var defender;
      // Will keep track of turns during combat. Used to calculate player damage.
      var turnCounter = 1;
      // Tracks number of defeated opponents.
      var killCount = 0;
    
      var losingSound = new Audio("./assets/sound/lost.mp3");
      var victorySound = new Audio("./assets/sound/emperial.mp3");
      var clickAttack = new Audio("./assets/sound/Light-Saber.mp3");

      // This function will render a character card to the page.
      // The character rendered and the area they are rendered to. their status is determined by the arguments.
      var renderCharacter = function (character, renderArea) {
        // This block of code builds the character card, and renders it to the page.
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
      };
    
      // this function will load all the characters into the character section to be selected
      var initializeGame = function () {
        // Loop through the characters object and call the renderCharacter function on each character to render their card.
        for (var key in characters) {
          renderCharacter(characters[key], "#characters-section");
        };
      };
    
      // remember to run the function here
      initializeGame();
    
      // This function handles updating the selected player or the current defender. If there is no selected player or defender this
      // function will also place the character based on the areaRender chosen
      var updateCharacter = function (charObj, areaRender) {
        // empties the area so that we can re-render the new object
        $(areaRender).empty();
        renderCharacter(charObj, areaRender);
      };
    
      // This function will render the available-to-attack enemies. it will be run once after a character has been selected
      var renderEnemies = function (enemyArr) {
        for (var i = 0; i < enemyArr.length; i++) {
          renderCharacter(enemyArr[i], "#available-to-attack-section");
          console.log("enemies to attack " + enemyArr);
        };
      };
    
      // Function to handle rendering game messages.
      var renderMessage = function (message) {
        // Builds the message and appends it to the page.
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
      };
    
      // Function which handles restarting the game after victory or defeat.
      var restartGame = function (resultMessage) {
        // When the Restart button is clicked it reloads the whole page
        var restart = $("<button>Restart</button>").click(function (){
        location.reload();
        });
    
        // Build div that will display the victory or defeat message.
        var gameState = $("<div>").text(resultMessage);
    
        // Render the restart button and victory or defeat message to the page.
        $("body").append(gameState);
        $("body").append(restart);
        $("button").css({"font-size": "50px"});
        $("body").css({"color": "white", "font-size": "25px",});
        $("button").css({"width": "230px", "border-radius": "10px",})
      };
    
      // Function to clear the game message section
      var clearMessage = function () {
      var gameMessage = $("#game-message");
          gameMessage.text("");
      };
    
      // On click event for selecting our character.
      $("#characters-section").on("click", ".character", function () {
        // Saving the clicked characters name.
        var name = $(this).attr("data-name");
        console.log("You chose " + name + " as your ally");
        // If a player character has not yet been chosen...
        if (!attacker) {
          // populate attacker with the selected characters information.
          attacker = characters[name];
          // loop through the remaining characters and push them to the combatants array.
          for (var key in characters) {
            if (key !== name) {
              combatants.push(characters[key]);
            };
          };
    
          // Hide the character select div.
          $("#characters-section").hide();
    
          // Then render our selected character and our combatants.
          updateCharacter(attacker, "#selected-character");
          renderEnemies(combatants);
        };
      });
    
      // Creates an on click event for each enemy.
      $("#available-to-attack-section").on("click", ".character", function () {
        // Saving the opponent's name.
        var name = $(this).attr("data-name");
        console.log("You chose " + name + " as your enemy")
        // If there is no defender, the clicked enemy will become the defender.
        if ($("#defender").children().length === 0) {
          defender = characters[name];
          updateCharacter(defender, "#defender");
    
          // remove element as it will now be a new defender
          $(this).remove();
          clearMessage();
        };
      });
    
      // When you click the attack button, run the following game logic...
      $("#attack-button").on("click", function () {
        clickAttack.play();
        // If there is a defender, combat will occur.
        if ($("#defender").children().length !== 0) {
          // Creates messages for our attack and our opponents counter attack.
          var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
          var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
          clearMessage();
          console.log(attackMessage + counterAttackMessage);
          // Reduce defender's health by your attack value.
          defender.health -= attacker.attack * turnCounter;
    
          // If the enemy still has health..
          if (defender.health > 0) {
            // Render the enemy's updated character card.
            updateCharacter(defender, "#defender");
    
            // Render the combat messages.
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            // Reduce your health by the opponent's attack value.
            attacker.health -= defender.enemyAttackBack;
            
            // Render the player's updated character card.
            updateCharacter(attacker, "#selected-character");
    
            // If you have less than zero health the game ends.
            // We call the restartGame function to allow the user to restart the game and play again.
            if (attacker.health <= 0) {
              clearMessage();
              restartGame("You have been defeated...GAME OVER!");
              $("#attack-button").off("click");
              console.log(attacker.health + " You died! Restart")
              losingSound.play();
            }
          }
          else {
            // If the enemy has less than zero health they are defeated.
            // Remove your opponent's character card.
            $("#defender").empty();
    
            var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
            renderMessage(gameStateMessage);
    
            // Increment your kill count.
            killCount++;
            console.log("You have defeated " + defender.name + " with a kill number of " + killCount);
            // If you have killed all of your opponents you win.
            // Call the restartGame function to allow the user to restart the game and play again.
            if (killCount >= combatants.length) {
              clearMessage();
              $("#attack-button").off("click");
              restartGame("You Won! GAME OVER!");
              victorySound.play();
            }
          }
          // Increment turn counter. This is used for determining how much damage the player does.
          turnCounter++;
        }
        else {
          // If there is no defender, render an error message.
          clearMessage();
          renderMessage("No enemy here.");
        };
      });
    });
