


function collap(item_id){
	console.log(arguments.callee.name + item_id);

	var _item = document.getElementById(item_id);
	var content = _item.nextElementSibling;
	if (content.style.display == "none") {
		content.style.display = "block";
		_item.classList.remove("ui-icon-carat-d");
		_item.classList.add("ui-icon-carat-u");
	} else {
		content.style.display = "none";
		_item.classList.remove("ui-icon-carat-u");
		_item.classList.add("ui-icon-carat-d");		
	}
}

function item_showOrHide(item_id){
	console.log(arguments.callee.name);
  var _item = document.getElementById(item_id);

  if("block" == _item.style.display)
  {	_item.style.display="none"; return "hide";}
  else if("none" == _item.style.display)
  {	_item.style.display="block"; return "show";}
	else
	{	_item.style.display="none"; return "hide";}
};

function load_url_2target(url, target_id){

	var _item = document.getElementById(target_id);
	
	_item.load(url);

};

function add_img_2target(src, target_id){
	
	var style = "height:50px border-radius:50%";
	var elem = document.createElement("img");
	elem.type = "button";
	elem.setAttribute("src", src);
	//elem.setAttribute("height", "768");
	//elem.setAttribute("width", "1024");
	elem.setAttribute("alt", "Flower");
	elem.setAttribute("style",style);
	
	document.getElementById(target_id).appendChild(elem);
	
}


