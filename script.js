//game class
var game = {
  gameOn: false,
  pressedPlay: false,
  gameStarted: false,
  compMovesMade: [],
  playerMovesMade: [],
  possibleMoves: ["#top-left", "#top-right", "#bottom-left", "#bottom-right"],
  colorClasses: {
    "#top-left": "changeColorGreen",
    "#top-right": "changeColorRed",
    "#bottom-left": "changeColorYellow",
    "#bottom-right": "changeColorPurple"
  },
  sound: {
    "#top-left": new Audio(
      "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
    ),
    "#top-right": new Audio(
      "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
    ),
    "#bottom-left": new Audio(
      "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
    ),
    "#bottom-right": new Audio(
      "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    )
  }
};

//animations class
var animations = {
  deg: 90,
  animationInProgress: false,
  startGame: function() {
    var backgroundColors = ["#D1EFB5", "#E84855", "#FFFD82", "#593F62"];
    $("#on-button").text("Deactivate");
    $("#container").addClass("rotate-animation");
    for (i = 0; i < backgroundColors.length; i++) {
      $(game.possibleMoves[i]).animate(
        { backgroundColor: backgroundColors[i] },
        4000
      );
    }
    setTimeout(function() {
      $("#container").removeClass("rotate-animation");
    }, 5000);
  },
  resetColors: function(sections) {
    $("#container").addClass("rotate-animation");
    sections.forEach(section => {
      $(section).animate({ backgroundColor: "#DBFCFF" }, 4000);
    });
    setTimeout(function() {
      $("#container").removeClass("rotate-animation");
      $("#container").css("transform", "rotateY(0deg)");
    }, 5000);
  },
  animatePlayer: function(id) {
    game.sound[id].play();
    $(id).toggleClass(game.colorClasses[id]);
    $("#container").css("transform", "rotateZ(" + animations.deg + "deg)");
    setTimeout(function() {
      $(id).toggleClass(game.colorClasses[id]);
    }, 1000);
    animations.deg = animations.deg + 90;
  },
  animateComp: function() {
    var i = 0;
    $("#infoInner h1").html("Round " + game.compMovesMade.length);
    $("h1").addClass("slide-font");
    animations.animationInprogress = true;
    var animateMoves = setInterval(function() {
      animations.changeColor(game.compMovesMade[i]);
      i++;
      if (i >= game.compMovesMade.length) {
        clearInterval(animateMoves);
        animations.animationInprogress = false;
      }
    }, 1000);
    setTimeout(function() {
      $("#infoInner h1").html("");
      $("h1").removeClass("slide-font");
    }, 2000);
  },
  changeColor: function(m) {
    $(m).toggleClass(game.colorClasses[m]);
    game.sound[m].play();
    setTimeout(function() {
      $(m).toggleClass(game.colorClasses[m]);
    }, 500);
  }
};

//game

//UI Controls
$("#on-button").on("click", function() {
  game.gameOn = !game.gameOn;
  if (game.gameOn) {
    animations.startGame();
  } else {
    loseState();
  }
});

$("#start-button").on("click", function() {
  //initialize game
  if (game.gameOn && game.pressedPlay === false) {
    resetGame();
    game.pressedPlay = true;
    $("#ui").css("transform", "translateY(-100%)");
    generateMove();
  }
});

$("#container").on("click", function() {
  if (
    (event.target.id == "top-left" ||
      event.target.id == "top-right" ||
      event.target.id == "bottom-left" ||
      event.target.id == "bottom-right") &&
    game.pressedPlay &&
    animations.animationInProgress === false
  ) {
    var move = "#" + event.target.id;
    game.playerMovesMade.push(move);
    test(move);
  }
});

//Game Logic
var generateMove = function() {
  resetPlayer();
  game.compMovesMade.push(randomMove(game.possibleMoves));
  animations.animateComp();
};

var test = function(move) {
  animations.animatePlayer(move);
  if (move !== game.compMovesMade[game.playerMovesMade.length - 1]) {
    loseState();
    $("h1").html("Oops :(");
    $("h1").addClass("slide-font");
    setTimeout(function() {
      $("h1").html("");
      $("h1").removeClass("slide-font");
    }, 2000);
  } else if (game.playerMovesMade.length >= game.compMovesMade.length)
    generateMove();
};

var randomMove = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var loseState = function() {
  resetGame();
  animations.resetColors(game.possibleMoves);
  $("#on-button").text("Initialize");
  $("#ui").css("transform", "translateY(0%)");
};

var resetGame = function() {
  game.gameOn = false;
  game.pressedPlay = false;
  game.gameStarted = false;
  game.compMovesMade = [];
  resetPlayer();
};

var resetPlayer = function() {
  game.playerMovesMade = [];
};
