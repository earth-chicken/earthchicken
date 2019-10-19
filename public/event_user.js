const g_plant_tp = [
	"rice",
	"corn",
  "potato",
  "oliver",
  "soybean"
];

const g_fertilize_tp = [
	"f_01",
	"f_02",
	"f_03",
	"f_04",

];

const g_warning_evt = [
	"typhone",
	"fire",
  "big rain",
  "earthquake",
  "drought"
];

const g_user_assets_title = [
	"Location",
	//"Location",
	"Valid",
	"Plant",
	"Warning",
	"Temp",
	"W%",
	"P%",
	"G%",
	"X%",
	"X"
];

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



function evt_enterLocation(){
	console.log(arguments.callee.name);
	
	var new_location="";
	
	//jump to playing page
	set_cur_location(new_location);
	return;
}




function add_imgArray_2target(ary, target_id){
	
	for(var i=0;i<ary.length;i++)
	{
		add_img_2target("images/unknown-513.png", target_id);
	}
}

function click_plant(){
	console.log(arguments.callee.name);
	//item_showOrHide("event_set");
	var _item = document.getElementById("select_bar");
	_item.style.display = "block";
	
	add_imgArray_2target(g_plant_tp, "select_bar");
}

function click_fertilize(){
	console.log(arguments.callee.name);

	add_imgArray_2target(g_fertilize_tp, "select_bar");
	
}


function json_2array(json, json_len){

	var user_assets=[];
	
	for(var i=0;i<json_len;i++)
	{
		var _ary = [];
		//for(var key in json[i])
		//{
			//console.log("key , value = "+key+" , "+json[i][key]);
		//	_ary.push(json[i][key]);
		//}
		
    _ary.push(json[i]["lon"].concat(":", json[i]["lat"]));
    _ary.push(json[i]["valid"]);
    _ary.push( g_plant_tp[parseInt(json[i]["plant_tp"])] );
    _ary.push( g_warning_evt[parseInt(json[i]["warning_evt"])] );
    _ary.push(json[i]["temp"]);
    _ary.push(json[i]["WWW"]); _ary.push(json[i]["PPP"]);
    _ary.push(json[i]["GGG"]); _ary.push(json[i]["X_rate"]);
    _ary.push(json[i]["XXX"]);
    
		user_assets.push(_ary);
	}
	
	return user_assets;
}

function get_user_assets_all(){
  console.log(arguments.callee.name);
  var user_assets;
  var json = [
    {lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:0, warning_evt:1, WWW: 20, PPP: 40, GGG:20, X_rate:20, XXX:200},
    {lon:"W.120", lat:"N.30", temp:38, valid:1, plant_tp:2, warning_evt:0, WWW: 30, PPP: 33, GGG:30, X_rate:88, XXX:300},
    {lon:"W.120", lat:"N.30", temp:18, valid:1, plant_tp:3, warning_evt:0, WWW: 20, PPP: 20, GGG:20, X_rate:20, XXX:200},
    {lon:"W.120", lat:"N.30", temp:08, valid:1, plant_tp:4, warning_evt:2, WWW: 25, PPP: 40, GGG:40, X_rate:66, XXX:400},
    {lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:2, warning_evt:3, WWW: 30, PPP: 45, GGG:10, X_rate:30, XXX:250},
		{lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:3, warning_evt:3, WWW: 30, PPP: 55, GGG:12, X_rate:77, XXX:250},
    {lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:1, warning_evt:3, WWW: 30, PPP: 30, GGG:30, X_rate:30, XXX:250},
  ];


	//data = {event:'get_user_assets_all'};
	//
	//$.post(URL_SERVICE, data, function(res){
	//		console.log(res);
	//		json = jQuery.parseJSON(res);
	//		console.log(json);
	//});
	

  var length = Object.keys(json).length;
	console.log("length = " + length);
	
  g_user_assets = json_2array(json, length);
	return length;
};


function set_barGraph_color(){
  var div_set;
  var item_idx;
  var lv = [];
  
  for (var i = 0; i < arguments.length; i++) {
    if(0==i)
    { div_set = arguments[i];}
    else if(1==i)
    { item_idx = arguments[i];}
    else
    { lv.push(arguments[i]);}
  }
  
  if(4 == (arguments.length-2))
  {
    div_set.style("background", function(d,i){
      if(d[item_idx]<=lv[0] || d[item_idx]>lv[3])
      { return "red";}
      else if((lv[0]<d[item_idx] && d[item_idx]<=lv[1]) || (lv[2]<d[item_idx] && d[item_idx]<=lv[3]))
      { return "#33cc33";}
      else
      { return "#ffcc00";}
    });
  }
}

function show_usrAssets_asBarGraph(class_tp, item_idx){

  var div_data_bind = d3.select(class_tp).selectAll("div").data(g_user_assets);
  
  var div_set = div_data_bind.enter().append("div");
  //div_data_bind.exit().remove();
  div_set.text(function(d,i) {
    return d[item_idx];
  });

  div_set.style("width", function(d,i) {
    return (d[item_idx] * 1)+"px";
  });

  div_set.style("margin", "6px");
  div_set.style("height", "26px");
  set_barGraph_color(div_set, item_idx, 20, 40, 60, 80);
}



function fill_usrAssets_table(target_id, tr_cnt){
	var table = document.getElementById(target_id);
	var length = g_user_assets_title.length;
	
	console.log("tb = "+table.rows.length);
  console.log("length = "+length);
  
	if(table.rows.length>1)
		return;
	console.log("tr_cnt = "+tr_cnt);
	for(var i=0;i<tr_cnt;i++)
	{
		var tr = table.insertRow();
    tr.setAttribute('height', 24);
		
		for(var j=0;j<length;j++)
		{
			if(0 == i)
			{
				//console.log("i,j"+i+","+j);
				var cell = tr.insertCell();
				var div = document.createElement("div");
				
        if(0==j)
        {
          var btn = document.createElement('input');
          btn.type = "button";
          btn.value = g_user_assets[i][j];
          btn.style.height= "100%";
          btn.style.width= "100%";
          cell.appendChild(btn);
        }
        else if(length-6==j)
				{
					cell.appendChild(div);
					div.classList.add('T');
					cell.setAttribute('rowspan', tr_cnt);
				}
        else if(length-5==j)
				{
					cell.appendChild(div);
					div.classList.add('W');
					cell.setAttribute('rowspan', tr_cnt);
				}
				else if(length-4==j)
				{
					cell.appendChild(div);
					div.classList.add('P');
					cell.setAttribute('rowspan', tr_cnt);
				}
				else if(length-3==j)
				{
					cell.appendChild(div);
					div.classList.add('G');
					cell.setAttribute('rowspan', tr_cnt);
				}
				else if(length-2==j)
				{
					cell.appendChild(div);
					div.classList.add('X_rate');
					cell.setAttribute('rowspan', tr_cnt);
				}
        else
        {
          //console.log("111"+i+j);
          cell.innerHTML = g_user_assets[i][j];
        }
				//else if(length-1==j)
				//{
				//	cell.appendChild(div);
				//	cell.classList.add('X');
				//	cell.setAttribute('rowspan', '7');
				//}
			}
			else
			{
				if(j<length-5)
        {
          //console.log("222"+i+j);
          var cell = tr.insertCell();
          
          if(0==j)
          {
            var btn = document.createElement('input');
            btn.type = "button";
            btn.value = g_user_assets[i][j];
            btn.style.height= "100%";
            btn.style.width= "100%";
            cell.appendChild(btn);
          }
          else if(j==length-5-1)
          { cell.innerHTML = g_user_assets[i][length-1];}//1 for last X column
          else
          { cell.innerHTML = g_user_assets[i][j];}
        }
			}  
		}
	}
}





function click_assets(){
  console.log(arguments.callee.name);
	var obj = document.getElementById("showinfo");
	
  if("hide"	== item_showOrHide("bar_land"))
	{
		console.log("hide");
		obj.classList.remove("ui-icon-carat-d");
		obj.classList.add("ui-icon-carat-u");
		obj.classList.remove("ui-btn-icon-top");
		obj.classList.add("ui-btn-icon-left");
	}
	else
	{
		console.log("show");
		obj.classList.remove("ui-icon-carat-u");
		obj.classList.add("ui-icon-carat-d");
		//obj.classList.remove("ui-btn-icon-left");
		obj.classList.add("ui-btn-icon-top");
	}
	
  var length = get_user_assets_all();
  
	fill_usrAssets_table("tb_user_assets", length);
  
  show_usrAssets_asBarGraph(".T", 			4);
  show_usrAssets_asBarGraph(".W", 			5);
  show_usrAssets_asBarGraph(".P", 			6);
  show_usrAssets_asBarGraph(".G", 			7);
  show_usrAssets_asBarGraph(".X_rate", 	8);
  //show_usrAssets_asBarGraph(".X", 			10);
  
  return;
};

function game_start(){
  console.log(arguments.callee.name);

  //post server start game

  $('#pop_start').popup("close");
}

function buy_land(){
  console.log(arguments.callee.name);
  
  call_map();
}

function call_map(){
  console.log(arguments.callee.name);
	
	//item_showOrHide("main_pic");

	//var url = 'javascripts/test1.ejs';

	//$.ajax({
	//	type: 'GET',
	//	headers:{    
	//		'Accept': 'application/json',
	//		'Content-Type': 'application/json',
	//		'Access-Control-Allow-Origin': '*' 
	//	},
	//	dataType: 'json',
	//	success: function (data) {
	//			alert(JSON.stringify(data));
	//	}
	//});

	//$('#pagecontainer').load(url, 
	//	function(){console.log("call html");}
	//);
	
	load_body_2target('javascripts/test1.ejs', 'pagecontainer', 'main_pic');
	
	return;
}
