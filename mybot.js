//08/07/12 - Noobot 0.4.5

// We should initialise some stuff at the start
//that we'll need to keep track of
var n_types_fruits; //how many fruits
var n_fruits = [], //how many of each fruit
my_fruits = [], //how many fruits of each type I have
opp_fruits = [], //how many fruits of each type the opp has
dead_fruit = []; //which fruit categories are out of the game

function new_game() {

    n_types_fruits = get_number_of_item_types();
    for (var i = 0; i<n_types_fruits; i++){
	n_fruits[i] = get_total_item_count(i+1);//number of each fruit
	dead_fruit[i] = false;
    }
}

function distance(xy1, xy2){
    var distance = Math.sqrt((xy1[0]-xy2[0])*(xy1[0]-xy2[0])+(xy1[1]-xy2[1])*(xy1[1]-xy2[1]));
    return distance;
}


function weight_map(f_map, my_pos, his_pos, remain, d_fruit) {
    var prox = 1, rare = 1.3, left = 1.3, winner = 1;
    //function will return coordinates with weight on that square
    //this will determine which square we want to move to
    for(var i = 0; i < f_map.length; i++){
	var f_number = f_map[i][2];
	var f_weight = rare/f_number;
	var remain_weight = left/remain[f_map[i][2]-1];//remain indexed from 0
	var dist = distance(my_pos, [f_map[i][0], f_map[i][1]]);
	if (dist != 0){
	    var d_weight = prox/dist;
	    //this goes to inf when on the fruit
	}
	else{
	    var d_weight = 1.;
	    //leave the dist weight at 1 if on the square
	}
	var tot_weight = f_weight+d_weight+remain_weight;
	f_map[i][2] = tot_weight;
    }
    return f_map;
}

function move_choice(map, me){
    var high_w = -1;
    var best = [];
    var best_ind = -1;
    for (var i = 0; i < map.length; i++){
	if (high_w < map[i][2]){
	    high_w = map[i][2];
	    best = map[i];
	}
	else{
	    continue;
	}
    }
    if (me[0] == best[0] && me[1] == best[1]){
	trace('Taking')
	return TAKE;
    }
    else if(me[0] > best[0]){
	trace('Going West')
	return WEST;
    }
    else if(me[0] < best[0]){
	trace('Going East')
	return EAST;
    }
    else if(me[1] < best[1]){
	trace('Going South')
	return SOUTH;
    }
    else if(me[1] > best[1]){
	trace('Going North')
	return NORTH;
    }    
}

function init_map(b, dead){
    var f_map = []
    for (var i=0; i<WIDTH; i++){
    	for(var j=0; j<HEIGHT; j++){
	    if(b[i][j] == 0){
		continue;
	    }
	    if(!dead_fruit[b[i][j]-1]){
    		f_map.push([i, j, b[i][j]]); //this keeps track of fruit positions on board
	    }
    	}
    }
    return f_map;
}

function make_move() {
    var board = get_board();
    var my_bot = [get_my_x(), get_my_y()];
    var opp_bot = [get_opponent_x(), get_opponent_y()];
    var fruit_map = [];
    var n_fruit_left = [];
    for (var fruit=0; fruit<n_types_fruits; fruit++){
	my_fruits[fruit] = get_my_item_count(fruit+1); // my fruits
	opp_fruits[fruit] = get_opponent_item_count(fruit+1); //opp fruits
	n_fruit_left[fruit] = n_fruits[fruit] - opp_fruits[fruit] - my_fruits[fruit];
	if(my_fruits[fruit] > n_fruits[fruit]/2 ||
	   opp_fruits[fruit] > n_fruits[fruit]/2){
	    dead_fruit[fruit] = true;
	}
    }

    fruit_map = init_map(board, dead_fruit);

    trace('Remaining fruits:');
    trace(n_fruit_left);
    trace('This is the fruit map');
    trace(fruit_map);
    //this is where the strat starts:
    //define a weighted distance map from my bot to the fruit
    //weight will be determined by rarity/desirability of fruit
    //nb not using the other bot pos info atm
    var w_map = weight_map(fruit_map, my_bot, opp_bot, n_fruit_left, dead_fruit);
    
    trace('These are the fruit types:');
    trace(n_types_fruits);
    trace('These are the numbers of each type:');
    trace(n_fruits);
    trace('These are my fruits:');
    trace(my_fruits);
    trace('These are his fruits:')
    trace(opp_fruits);
    trace('These are the dead fruits:');
    trace(dead_fruit);
    trace('This is my position:');
    trace(my_bot);
    trace('This is the weight map:');
    trace(w_map);
    
    return move_choice(w_map, my_bot);
}


// function default_board_number() {
//    return 67302;
// }