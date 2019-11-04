//optional improvements, create a database to hold scores of player's.
//Once a player has invoked gameOver(), then prompt the user for a name
//database could be displayed on the same page while the game is being played.
(function() {

	var canvas, context, interval_id;
	//array for snake body parts (X,Y)
	var snake_body_parts_X = [];
	var snake_body_parts_Y = [];
    snake_body_parts_X[0] = 40;
    snake_body_parts_Y[0] = 40;
    //snake dimensions
	var snake_size = 20;
	var snake_length = 1;
	//snake velocity
	var snake_v = 0;
	var snake_vx = snake_v; //x velocity is the same as the snake velocity
	var snake_vy = 0;
	//obstacle
	var fruit_x, fruit_y, fruit_size = 20;
    //score count
	var score = 0;
    //inital starting position
	
	document.addEventListener('DOMContentLoaded', init, false);

	function init(){
        canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');
		width = canvas.width;
		height = canvas.height;
		context.fillStyle = "black";
		newFruitPosition();//place the obstacle on the canvas, at a random location
		window.addEventListener('keydown', snake_Movement, false);
		interval_id = window.setInterval(gameloop, 33);
	}
	//the Main Loop of the game, this will control the flow of the game.
	function gameloop(){
		//check for collisions to end game
		if( snake_collision() || border_collision() ){
			window.clearInterval(interval_id);
			gameOver(); 
			window.alert('You got a score of : ' + score);
		}else{
        //invoke all other functions while game has not ended
			fruitCollision();
			updateSnakePosition();
			draw();
		}
	}

    function draw(){
        context.clearRect(0,0,width,height)
        context.fillStyle = "black";
        context.font = "20px times new roman";
        context.fillText("Score:" + score, 10, 20);
        context.fill();
                
                for(var i = 0; i < snake_body_parts_X.length; i++){
            /*for every fifth body part change the colour of the body part
              to make it look a little bit more like a snake*/
            if( i % 5 == 0 ){
                context.fillStyle = "#22313F";
                context.fillRect(snake_body_parts_X[i],snake_body_parts_Y[i], snake_size, snake_size);  
            }else{
                context.fillStyle = "#87D37C";
                context.fillRect(snake_body_parts_X[i],snake_body_parts_Y[i], snake_size, snake_size);
            }
        }
        //draw the obstacle image(#apple) with 'fruit_x, fruit_y'
        context.drawImage(apple,fruit_x,fruit_y);
    }   

	function updateSnakePosition(){
        //unshift (X,Y) : 
		snake_body_parts_X.unshift(snake_body_parts_X[0] + snake_vx);
		snake_body_parts_Y.unshift(snake_body_parts_Y[0] + snake_vy);
        //once a fruit has been eaten, start popping the end of the array
		if(snake_body_parts_X.length > snake_length){
			//remove last element, pop's the last body part while snake is moving
            snake_body_parts_X.pop();
			snake_body_parts_Y.pop();
		}
	}

	function border_collision(){
        //Checks whether the snake has moved beyond the barriers
		if( snake_body_parts_X[0] >= width - snake_size ||
			snake_body_parts_X[0] <= 0 || 
			snake_body_parts_Y[0] <= 0 || 
			snake_body_parts_Y[0] + snake_size >= height){
				return true;
			}
		return false;
	}

	function snake_collision(){
		for(var i = 3; i < snake_body_parts_Y.length; i++){
            // get absolute value
			if(Math.abs(snake_body_parts_X[0] - snake_body_parts_X[i]) < snake_size  && 
			   Math.abs(snake_body_parts_Y[0] - snake_body_parts_Y[i]) < snake_size ){
				return true;
			}
		}
		return false;
	}

	function fruitCollision(){
		if(Math.abs(snake_body_parts_X[0] - fruit_x) < snake_size/2 + fruit_size &&
		   Math.abs(snake_body_parts_Y[0] - fruit_y) < snake_size/2 + fruit_size ){
            snake_length ++;
		    if(snake_length % 15 == 0){//every 15 fruit collisions, add one to snake velocity
                snake_v ++; 
		    }
		    score ++;//add one to the score
		    newFruitPosition();//after collision, draw a new fruit
		}
	}
	//Get's random position for fruit on the canvas
	function newFruitPosition(){
		//fruit_y = Math.round(Math.random()*height);
		fruit_x = getRandomNumber(fruit_size,width - fruit_size);
		fruit_y = getRandomNumber(fruit_size,height - fruit_size);
	}
	
	function getRandomNumber(min, max) {
            return Math.round(Math.random() * (max - min));
    }

	function gameOver(){
		context.font = "50px times";
		context.fillStyle = "red";
		context.strokeText("Game Over", 200, 350);
		context.fillText("You scored : " + score, 170, 400);
		context.fill();
	}
       
    function snake_Movement(event){
        var KeyCode = event.keyCode
        if(KeyCode == 32 && snake_vx === 0 && snake_vy === 0){
            //press space to give the snake an inital velocity
            snake_v = 10;
            snake_vx = snake_v; //snake is now moving at initial velocity on x-axis
        }
        else if(KeyCode == 38 && snake_vy === 0){//up
            //move on the y-axis, cease  moving on the x-axis 
            snake_vy -= snake_v;
            snake_vx = 0;
        }
        else if(KeyCode == 40 && snake_vy === 0){//down
            //
            snake_vx = 0;
            snake_vy = snake_v;
        }
        else if(KeyCode == 37 && snake_vx === 0){//left
            snake_vy = 0;
            snake_vx -= snake_v;
        }
        else if(KeyCode == 39 && snake_vx === 0 ){//right
            snake_vy = 0;
            snake_vx = snake_v;
        }
    }
})();