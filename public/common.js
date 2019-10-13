function item_showOrHide(item_id){

  var _item = document.getElementById(item_id);

  if("block" == _item.style.display)
  {	_item.style.display="none";}
  else if("none" == _item.style.display)
  {	_item.style.display="block";}

};




