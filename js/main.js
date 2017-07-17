


///function on load - loads the game
//create a border line  - optional - can make full screen
//render snake - in center of screen

//on WASD move



//on WASD moves - activates animation - moves to that location as long key as down -with setInterval
//when keyup or another key clearinterval



//render food - snake need to eat the food
//every time he eats - he gets lonnger and obstacles on board
//if touches obstacles loses
//if touches border loses

var gLevel = 1;
var gSnake;
var gPoints = 0;
var gScore = 0;
var gLength;
var gObstacles = [];
var gFoodPieces = [];
var borderLine;
var lastDirection;

window.onload = init();

function init() {
    gScore = 0;
    document.querySelector('.score-count').innerText = gScore;
    gLevel = 1;
    gSnake = undefined;
    gPoints = undefined;
    gLength = undefined;
    gFoodPieces.forEach(function (foodPiece) {
        foodPiece.remove();
    });
    gFoodPieces = [];
    borderLine = undefined;
    gObstacles.forEach(function (obstacle) {
        obstacle.remove();
    });
    gObstacles = [];

    renderBorder();
    renderSnake();
    renderFood();
    renderObstacles();
}




function renderBorder() {
    borderLine = new Path();
    borderLine.strokeColor = 'black';
    borderLine.add(new Point(0, 0));
    borderLine.add(new Point(0, view.size.height - 0));
    borderLine.add(new Point(view.size.width - 0, view.size.height - 0));
    borderLine.add(new Point(view.size.width - 0, 0));
    borderLine.add(new Point(0, 0));
    console.log('border rendered');

}


function renderSnake() {

    // The amount of points in the path:
    gPoints = 20;

    // The distance between the points:
    gLength = 5;

    gSnake = new Path({
        strokeColor: '#E4141B',
        strokeWidth: 1,
        strokeCap: 'square'
    });
    var center = new Point(view.size.width - 100, view.size.height - 25);
    var start = center / [2, 2];


    for (var i = 0; i < gPoints; i++) {
        gSnake.add(start + new Point(i * gLength, 0));
    }

    console.log('snake rendered');

}



function renderFood() {
    gFoodPieces = [];
    for (var i = 0; i < gLevel; i++) {
        var foodPiece = new Path.Rectangle({
            position: new Point(view.size.width, view.size.height) * Point.random(),
            size: 25,
            radius: 10,
            fillColor: 'orange'
        });
        gFoodPieces.push(foodPiece);
    }

}

function getObstaclePosition() {
    var obstaclePosition = new Point(view.size.width, view.size.height) * Point.random();
    return obstaclePosition;
}

///deal with clashing obstacles with food or snake
function renderObstacles() {
    removeAllObstacles();
    for (var i = 0; i < gLevel*2; i++) {
        var obstaclePosition = getObstaclePosition();
        var isTooCloseToSnake = gSnake.segments.some(function (segment) {
            return obstaclePosition.isClose(segment.point, 100);
        });
        var isNearFood = gFoodPieces.some(function (foodPiece) {
            return obstaclePosition.isClose(foodPiece.position, 25);
        });

        while (isTooCloseToSnake || isNearFood) {
            console.log(isTooCloseToSnake, isNearFood, gLevel, i);
            var obstaclePosition = getObstaclePosition();


            var isTooCloseToSnake = gSnake.segments.some(function (segment) {
                return obstaclePosition.isClose(segment.point, 100);
            });
            var isNearFood = gFoodPieces.some(function (foodPiece) {
                return obstaclePosition.isClose(foodPiece.position, 25);
            });
        }
        var obstacle = new Path.Rectangle({
            position: obstaclePosition,
            size: 50,
            radius: 3,
            fillColor: 'red'
        });
        console.log(isTooCloseToSnake, isNearFood, gLevel, i);
        gObstacles.push(obstacle);

    }
}





function onKeyDown(event) {

    if (event.key == 'a' || event.key == 'w' || event.key == 'd' || event.key == 's') {

        if (event.key == 'w') {
            if (lastDirection === 's' && (Math.abs(gSnake.segments[0].point.x - gSnake.segments[gSnake.segments.length - 1].point.x)) < 20) {
                gSnake.reverse();

            }
            var newFirstXMod = 0;
            var newFirstYMod = -20;
            lastDirection = 'w';
        }
        if (event.key == 'a') {

            if (lastDirection === 'd' && (Math.abs(gSnake.segments[0].point.y - gSnake.segments[gSnake.segments.length - 1].point.y)) < 20) {
                gSnake.reverse();

            }
            var newFirstXMod = -20;
            var newFirstYMod = 0;
            lastDirection = 'a';
        }
        if (event.key == 's') {

            if (lastDirection === 'w' && (Math.abs(gSnake.segments[0].point.x - gSnake.segments[gSnake.segments.length - 1].point.x)) < 20) {
                gSnake.reverse();

            }
            var newFirstXMod = 0;
            var newFirstYMod = 20;
            lastDirection = 's';
        }
        if (event.key == 'd') {

            if (lastDirection === 'a' && (Math.abs(gSnake.segments[0].point.y - gSnake.segments[gSnake.segments.length - 1].point.y)) < 20) {
                gSnake.reverse();

            }
            var newFirstXMod = 20;
            var newFirstYMod = 0;
            lastDirection = 'd';
        }
        gSnake.segments[0].point.x = newFirstXMod + gSnake.segments[0].point.x;
        gSnake.segments[0].point.y = newFirstYMod + gSnake.segments[0].point.y;
        for (var i = 0; i < gPoints - 1; i++) {
            checkBorderIntrusion();
            var segment = gSnake.segments[i];
            var nextSegment = segment.next;
            var vector = segment.point - nextSegment.point;
            vector.length = gLength;
            nextSegment.point = segment.point - vector;
        }
        gSnake.smooth({ type: 'continuous' });
    }
    //console.log(gFoodPieces.length === 0);
    //console.log(gFoodPieces);
    gObstacles.forEach(function (obstacle) {
        if (gSnake.intersects(obstacle)) {
            gSnake.remove();
            init();
        }
    });
    gFoodPieces.forEach(function (foodPiece, index, foodPiecesArray) {
        if (gSnake.intersects(foodPiece)) {
            gScore++;
            document.querySelector('.score-count').innerText = (+document.querySelector('.score-count').innerText) + 1;
            foodPiece.remove();
            gLength = gLength + 0.8;
            //console.log(foodPiecesArray);
            gFoodPieces.splice(index, 1);
            //console.log(foodPiecesArray);

        }
    });
    if (gFoodPieces.length === 0) {

        gLevel++;
        renderFood();
        renderObstacles();
    }

}



function onMouseMove(event) {
    //console.log(gSnake);
    //console.log(event.point.getDistance(new Point(200,200)));
    gSnake.firstSegment.point = event.point;
    for (var i = 0; i < gPoints - 1; i++) {
        var segment = gSnake.segments[i];
        var nextSegment = segment.next;
        var vector = segment.point - nextSegment.point;
        vector.length = gLength;
        nextSegment.point = segment.point - vector;
    }
    gSnake.smooth({ type: 'continuous' });
    gObstacles.forEach(function (obstacle) {
        if (gSnake.intersects(obstacle)) {
            gSnake.remove();
            init();
        }
    });
    gFoodPieces.forEach(function (foodPiece, index, foodPiecesArray) {
        if (gSnake.intersects(foodPiece)) {
            gScore++;
            document.querySelector('.score-count').innerText = (+document.querySelector('.score-count').innerText) + 1;
            foodPiece.remove();
            gLength = gLength + 0.8;
            // console.log(foodPiecesArray);
            gFoodPieces.splice(index, 1);
            //console.log(foodPiecesArray);

        }
    });
    if (gFoodPieces.length === 0) {

        gLevel++;
        renderFood();
        renderObstacles();
    }
    checkBorderIntrusion();

}


function removeAllObstacles() {
    gObstacles.forEach(function (obstacle) {
        obstacle.remove();
    });
    gObstacles = [];
}


function checkBorderIntrusion() {
    if (gSnake.intersects(borderLine)) {
        gSnake.remove();
        init();
    }
}


