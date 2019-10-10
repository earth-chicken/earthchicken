function click_assets(){
	console.log("click_assets");
	
	var land = document.getElementById("dash_assets__land");
	var money = document.getElementById("dash_assets__money");
	var dollarC = document.getElementById("dash_assets__dollarC");
	
	if("block" == land.style.display)
	{	land.style.display="none";}
	else if("none" == land.style.display)
	{	land.style.display="block";}

	if("block" == money.style.display)
	{	money.style.display="none";}
	else if("none" == money.style.display)
	{	money.style.display="block";}

	if("block" == dollarC.style.display)
	{	dollarC.style.display="none";}
	else if("none" == dollarC.style.display)
	{	dollarC.style.display="block";}

};

