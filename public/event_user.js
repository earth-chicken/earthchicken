function post_msg_2server(){
  console.log(arguments.callee.name);
  var ret_data="";
  
  return ret_data;
}

function evt_buy_land(){
  console.log(arguments.callee.name);
  
};

function evt_plant(){
  console.log(arguments.callee.name);
  
};

function evt_irrigate(){
  console.log(arguments.callee.name);
  
};

function evt_fertilize(){
  console.log(arguments.callee.name);
  
};

function evt_debug(){
  console.log(arguments.callee.name);
  
};

function evt_greenhouse(){
  console.log(arguments.callee.name);
  
};

function evt_harvest(){
  console.log(arguments.callee.name);
  
};

function user_evt(obj_id){
  
  switch (obj_id) {
    case "evt_buy_land":
      evt_buy_land();
      break;
    case "evt_plant":
      evt_plant();
      break;
    case "evt_irrigate":
      evt_irrigate();
      break;
    case "evt_fertilize":
      evt_fertilize();
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


var g_user_assets;

function json_2array(json, json_len){

	var user_assets=[];
	
	for(var i=0;i<json_len;i++)
	{
		var _ary = [];
		for(var key in json[i])
		{
			//console.log("key , value = "+key+" , "+json[i][key]);
			_ary.push(json[i][key]);
		}
		
		user_assets.push(_ary);
	}
	
	return user_assets;
}

function get_user_assets(){
  console.log(arguments.callee.name);
  var user_assets;
  var json = [
    {lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:1, warning_evt:1, WWW: 20, PPP: 20, GGG:20, X_rate:20, XXX:200},
    {lon:"W.120", lat:"N.30", temp:38, valid:1, plant_tp:2, warning_evt:0, WWW: 30, PPP: 30, GGG:30, X_rate:30, XXX:300},
    {lon:"W.120", lat:"N.30", temp:18, valid:1, plant_tp:3, warning_evt:0, WWW: 20, PPP: 20, GGG:20, X_rate:20, XXX:200},
    {lon:"W.120", lat:"N.30", temp:08, valid:1, plant_tp:4, warning_evt:2, WWW: 40, PPP: 40, GGG:40, X_rate:40, XXX:400},
    {lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:5, warning_evt:3, WWW: 30, PPP: 30, GGG:30, X_rate:30, XXX:250},
		{lon:"W.120", lat:"N.30", temp:28, valid:1, plant_tp:5, warning_evt:3, WWW: 30, PPP: 30, GGG:30, X_rate:30, XXX:250},
  ];
  
  //user_assets = [['台中',25, 55],['台北',16,66],['高雄',30,77],['汐止',20,88],['板僑',40,99]];
	
  var length = Object.keys(json).length;
	console.log("length = " + length);
	
  g_user_assets = json_2array(json, length);
	return length;
};


function set_barGraph_color(){
  var div_set;
  var item_idx;
  var lv = [];
  
  console.log("arguments.length = "+arguments.length);
  
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
  div_data_bind.exit().remove();
  div_set.text(function(d,i) {
    return d[item_idx];
  });

  div_set.style("width", function(d,i) {
    
    return (d[item_idx] * 2)+"px";
  });

  div_set.style("margin", "5px");
  set_barGraph_color(div_set, item_idx, 20, 40, 60, 80);
}

var g_user_assets_title = [
	"Location",
	"Location",
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

function adding_usrAssets_table(target_id, tr_cnt){
	var table = document.getElementById(target_id);
	var length = g_user_assets_title.length;
	
	console.log("tb = "+table.rows.length);
	if(table.rows.length>2)
		return;
	
	for(var i=0;i<tr_cnt;i++)
	{
		var tr = table.insertRow();
		
		for(var j=0;j<length;j++)
		{
			if(0 == i)
			{
				console.log("i,j"+i+","+j);
				var cell = tr.insertCell();
				var div = document.createElement("div");
				if(length-5==j)
				{
					cell.appendChild(div);
					cell.classList.add('W');
					cell.setAttribute('rowspan', '7');
				}
				else if(length-4==j)
				{
					cell.appendChild(div);
					cell.classList.add('P');
					cell.setAttribute('rowspan', '7');
				}
				else if(length-3==j)
				{
					cell.appendChild(div);
					cell.classList.add('G');
					cell.setAttribute('rowspan', '7');
				}
				else if(length-2==j)
				{
					cell.appendChild(div);
					cell.classList.add('X_rate');
					cell.setAttribute('rowspan', '7');
				}
				else if(length-1==j)
				{
					cell.appendChild(div);
					cell.classList.add('X');
					cell.setAttribute('rowspan', '7');
				}
			}
			else
			{
				if(j<length-5)
					tr.insertCell();
			}
		}
	}
}





function click_assets(){
  console.log(arguments.callee.name);

  item_showOrHide("bar_land");
  var length = get_user_assets();
  
	adding_usrAssets_table("tb_user_assets", length);
	
  show_usrAssets_asBarGraph(".W", 			6);
  show_usrAssets_asBarGraph(".P", 			7);
  show_usrAssets_asBarGraph(".G", 			8);
  show_usrAssets_asBarGraph(".X_rate", 	9);
  show_usrAssets_asBarGraph(".X", 			10);
  
  return;
};

