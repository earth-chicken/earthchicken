// const URL_SERVICE = '/service/gameAction';
var g_user_assets=[];
var g_cur_location = "";


var g_plant_detail=[
  ["Cedar", "cedar_incs.png", "cedar_incs.txt", "148148", "0.01"],
  ["Acacia", "acacia_tw.png", "acacia_tw.txt", "5083", "0.05"],
  ["Rice", "rice_jap.png", "rice_jap.txt", "200", "0.58"],
  ["Maize", "maize_tmpsbtr.png", "maize_tmpsbtr.txt", "125", "0.6"],
  ["Wheat", "wheat_subtr.png", "wheat_subtr.txt", "155", "0..45"],

]




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
	$.post('/service/gameAction', data, function(res){
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

function if_gameStart(callback) {
	console.log(arguments.callee.name);
	var data = {event: "user_if_gameStart"};

	$.post(URL_SERVICE, data, function (res) {
		console.log(res);

		const remain_time = res.remain_time;
		if (res.length <= 0) {
			console.log("post return nothing");
			return;
		}
		callback(res.status,remain_time);

	});
}


function user_evt(obj_id){
	console.log(arguments.callee.name+" "+obj_id);


	switch (obj_id) {
		case "if_gameStart":
			if_gameStart();
			break;
		case "evt_gameStart":
			evt_gameStart();
			$('#pop_start').popup("close");
			setTimeout(function () {
				window.location.href = "/service/conclude";
			},900000);

			break;
		case "evt_plant":
      document.getElementById('plant_1').innerHTML = g_plant_detail[0][0];
      document.getElementById('plant_2').innerHTML = g_plant_detail[1][0];
      document.getElementById('plant_3').innerHTML = g_plant_detail[2][0];
      document.getElementById('plant_4').innerHTML = g_plant_detail[3][0];
      document.getElementById('plant_5').innerHTML = g_plant_detail[4][0];
    
			$('#plant_tp_panel').panel("open");
			break;
		case "evt_fertilize":
			//$('#fer_tp_panel').panel("open");
      evt_fertilize();
			break;
		case "evt_buyLand":
			evt_buyLand();
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
  
  var idx = parseInt(item_id.substring(6, item_id.length));
  
  //sel_tp_call_descr_panel
  console.log("idx = " + idx);
  console.log("type = " + g_plant_detail[idx][0]);
  
  document.getElementById('descr_panel_img').src = "images/"+g_plant_detail[idx][1];
  document.getElementById('descr_panel_title').innerHTML = g_plant_detail[idx][0];
  document.getElementById('descr_panel_detail').innerHTML = g_plant_detail[idx][2];
  document.getElementById('benefit').innerHTML = "$: "+g_plant_detail[idx][3];
  document.getElementById('cobon_cost').innerHTML = g_plant_detail[idx][4];
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
    evt_fertilize(fer_tp);
  }
  else
  { console.log("event_tp not in expected ?");}

  $('#descr_panel').panel("close");
}

function cancel_form(){
  $('#descr_panel').panel("close");
}

function hover_farmEvtImg(obj){
  console.log(arguments.callee.name + " " + obj.src);
  
  var str = obj.src;
  str = str.substring(22, str.length-4);
  //console.log(str);
  str = str.concat("b.png");
  //console.log(str);
  obj.src = str;
}


function unhover_farmEvtImg(obj){
  console.log(arguments.callee.name + " " + obj.src);
  
  var str = obj.src;
  str = str.substring(22, str.length-5);
  //console.log(str);
  str = str.concat(".png");
  //console.log(str);
  obj.src = str;
  
}



