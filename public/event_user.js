function evt_buy_land(){
  console.log(arguments.callee.name);

  url = '/service/gameAction';
  data = {event:'buy_land',
          lon:'120',
          lat:'23'};

  $.post(url,data,function(res){
    console.log(res);
    gamerStatus = jQuery.parseJSON(res);
  });
  
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
