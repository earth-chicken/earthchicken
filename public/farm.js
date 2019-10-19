// const URL_SERVICE = '/service/gameAction';
var g_user_assets=[];
var g_cur_location = "";

var plant_txt0 = "Taiwan Acasia belongs to Acasia genus, which is a type of hardwood species with round evergreen leaves. Its tree shape is short and round. Due to its hard timber texture, it is less profitable with laborious process. It prefers to grow under warm and dry condition and also under low altitude of mountainous area. The Acasia sp. grows fast but with high carbon content that had been widely used for charcoal and now is deemed as one of the major species for carbon sequestration";
var plant_txt1 = "Cedar is a type of softwood with needle leaves that can withstand water deficit under cold environment. Its tree shape is thin and tall with high timber texture. Of all the above quality mentioned above, cedar trees are valuable timber for architecture and furniture. It prefers to grow under cold and humid climate and can also survive in high altitude area of low latitude region.";
var plant_txt2 = "Rice is the most important staple food of the world. It has a long history in cultivation and food use. Its total amount of production is in the top two food sources of the world. Currently at least half of the world population relies on rice as their major food source. Rice grows under high temperature and high rainfall areas, of which monsoon influence is the most suitable weather system for rice. Nowadays rice fields can be found in Asia, south Europe, South America, and part of Africa.";
var plant_txt3 = "Maize was found in Americas, and then was distributed worldwide during the Age of discovery. It is now the top food source of the world. In Asia, maize is often consumed by human while in the north America, it is used as fodder. Maize is a very adaptive crop for it has low requirement for nutrients. Maize can be found in many places around world including Asia, North America, and Europe.";
var plant_txt4 = "Wheat is the major source of humankind: mostly made for flour and all kinds of processed food. It does not require high nutritious condition to grow and especially for water making it tolerance to drought. It is adaptive to temperate regions in which the major production areas are plains of Europe, big grassland of the north America, and Pampa of Argentina, part of East Asia, and South Asia.";

var g_plant_detail=[
  ["Cedar", "plant0_cedar.png", plant_txt0, "148148", "0.01"],
  ["Acacia", "plant1_acasia.png", plant_txt1, "5083", "0.05"],
  ["Rice", "plant2_rice.png", plant_txt2, "200", "0.58"],
  ["Maize", "plant3_maize.png", plant_txt3, "125", "0.6"],
  ["Wheat", "plant4_wheat.png", plant_txt4, "155", "0.45"],

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
      document.getElementById('plant_0').innerHTML = g_plant_detail[0][0];
      document.getElementById('plant_1').innerHTML = g_plant_detail[1][0];
      document.getElementById('plant_2').innerHTML = g_plant_detail[2][0];
      document.getElementById('plant_3').innerHTML = g_plant_detail[3][0];
      document.getElementById('plant_4').innerHTML = g_plant_detail[4][0];
    
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
  document.getElementById('benefit').innerHTML = "$"+g_plant_detail[idx][3];
  document.getElementById('cobon_cost').innerHTML = g_plant_detail[idx][4]+"C (kg/km^2)";
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
  
  var host = window.location.hostname;
  var port = window.location.port;
  var beg_idx = 8+host.length+port.length+1-1;
  // 8: "https://" , +1: ":" , -1: start 0 
  
  var str = obj.src;
  str = str.substring(beg_idx, str.length-4);
  console.log(str);
  str = str.concat("b.png");
  console.log(str);
  obj.src = str;
}


function unhover_farmEvtImg(obj){
  console.log(arguments.callee.name + " " + obj.src);
  var host = window.location.hostname;
  var port = window.location.port;
  var beg_idx = 8+host.length+port.length+1-1;
  // 8: "https://" , +1: ":" , -1: start 0 
  
  var str = obj.src;
  str = str.substring(beg_idx, str.length-5);
  //console.log(str);
  str = str.concat(".png");
  //console.log(str);
  obj.src = str;
  
}



