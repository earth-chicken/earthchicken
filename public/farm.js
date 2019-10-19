const URL_SERVICE = '/service/gameAction';
var g_user_assets=[];
var g_cur_location = "";

function get_cur_location(){
	
	return g_cur_location;
}

function set_cur_location(new_location){
	
	g_cur_location = new_location;
	return;
}


function evt_plant(plant_tp){
  console.log(arguments.callee.name +" farm.js");
	
	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_plant",
							lon:'120.8',
							lat:'23.3',
							p_type:'1'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
	return;
}

function evt_irrigate(){
  console.log(arguments.callee.name);
	
	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_irrigate",
							lon:'120.8',
							lat:'23.3'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
	return;
}

function evt_fertilize(fer_tp){
  console.log(arguments.callee.name +" farm.js");
	
	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_fertilize",
							lon:'120.8',
							lat:'23.3'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
	return;
}

function evt_debug(){
  console.log(arguments.callee.name);

	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_debug",
							lon:'120.8',
							lat:'23.3'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
	return;
}

function evt_greenhouse(){
  console.log(arguments.callee.name);

	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_greenhouse",
							lon:'120.8',
							lat:'23.3'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
  return;
}

function evt_harvest(){
  console.log(arguments.callee.name);

	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_harvest",
							lon:'120.8',
							lat:'23.3',
							/*p_type:'1'*/};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}
		
		//parse res and update web
		//res = jQuery.parseJSON(res);
		
	});
	
	return;
}


function evt_buyLand(){
	console.log(arguments.callee.name);

	var cur_loc = get_cur_location();
	//use cur_loc to fill data --- lon, lat
	var data = {event:"user_evt_buyLand",
		lon:'120.8',
		lat:'23.3'};

	$.post(URL_SERVICE, data, function(res){
		console.log(res);
		if(res.length<=0)
		{	console.log("post return nothing"); return;}

		//parse res and update web
		//res = jQuery.parseJSON(res);

	});

	return;
}
function evt_gameStart() {
	console.log(arguments.callee.name);
	var data = {event: "user_evt_gameStart"};

	$.post(URL_SERVICE, data, function (res) {
		console.log(res);
		if (res.length <= 0) {
			console.log("post return nothing");
			return;
		}

	});
}


function user_evt(obj_id){
	console.log(arguments.callee.name+" "+obj_id);
	
	switch (obj_id) {
		case "evt_gameStart":
			evt_gameStart();
			break;
		case "evt_buyLand":
			evt_buyLand();
			break;
		case "evt_plant":
			$('#plant_tp_panel').panel("open");
			break;
		case "evt_fertilize":
			$('#fer_tp_panel').panel("open");
			break;
		case "evt_plant_tmp":
			evt_plant();
			break;
		case "evt_fertilize_tmp":
			evt_fertilize();
			break;
		case "evt_irrigate":
			evt_irrigate();
			break;
		case "evt_debug":
			evt_debug();
			break;
		case "evt_greenhouse":
			evt_greenhouse();
			break;
		case "evt_harvest":
			evt_harvest();
			break;
	}
};

function sel_plant_tp(item_id){
  console.log(arguments.callee.name);
  $('#event_tp').val("plant");
  
  $('#plant_tp').val(item_id);
  console.log(item_id);
  
  //sel_tp_call_descr_panel
  $('#descr_panel').panel("open");
}

function sel_fer_tp(item_id){
  console.log(arguments.callee.name);
  $('#event_tp').val("fer");
  
  $('#fer_tp').val(item_id);
  console.log(item_id);
  
  //sel_tp_call_descr_panel
  $('#descr_panel').panel("open");
}


function confirm_form(){
  console.log(arguments.callee.name);


  var event_tp = document.getElementById("event_tp").value;
  var fer_tp = document.getElementById("fer_tp").value;
  var plant_tp = document.getElementById("plant_tp").value;

  console.log("event_tp "+event_tp);
  console.log("fer_tp "+fer_tp);
  console.log("plant_tp "+plant_tp);
  
  //post_2server
  
  if("plant" == event_tp)
  {
    evt_plant(plant_tp);
    
  }
  else if("fer" == event_tp)
  {
    //mapping plant_tp ?
    evt_fertilize(fer_tp);
    
  }
  else
  { console.log("event_tp not in expected ?");}
  
}