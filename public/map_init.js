
var map;
var geojson;
var info;

initmap();
map2();
map3();







function initmap() {
    // set up the map
    map = new L.Map('map');

 	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.satellite'
	}).addTo(map);
}

function map2(){
  
  map.addEventListener('mouseup', function(ev) {
    var lat, lng;
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
    var data = {lon: lng, lat: lat };
    
    $.post('/service/get_poly', data, function (res) {
      console.log(res);
      if (res.length <= 0) {
        console.log("post return nothing");
        return;
      }	
      var grid1 = {"type":"FeatureCollection","features":[
        {"type":"Feature","id":"0054","properties":{"name":"Station:0054<img src='./img/0054_spectrum.jpg'  height=2 width=4 >"},"geometry":{"type":"Polygon","coordinates":[[[121.625000,25.375000],[121.375000,25.375000],[121.375000,25.125000],[121.825000,25.125000],[121.625000,25.375000]]]}},
      ]};
      
      map.removeLayer(geojson);
      geojson = L.geoJson(grid1, {
                style: style,
                onEachFeature: onEachFeature
          }).addTo(map);
    //  	 	marker =  L.marker(ev.latlng).addTo(map)  
    //                       .bindPopup('<a href="http://www.yahoo.com.tw/">Yahoo</a>').openPopup();    
    });
  });
  
  
}

function map3(){

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);
  map.locate({setView: true, maxZoom: 8});

  // control that shows state info on hover
  var info = L.control({position: 'bottomleft'});

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML =  (props ?
        props.name  
    : 'Hover over a area' ); 
  };

  info.addTo(map);


  geojson = L.geoJson(statesData , {  //skip default polygon
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);    
}

function onLocationFound(e) {
//                var radius = e.accuracy / 2;
                  L.marker(e.latlng).addTo(map);    
//                       .bindPopup('<a href="http://www.yahoo.com.tw/">Yahoo</a>');    
//                      .bindPopup('<a href="http://www.yahoo.com.tw/">Yahoo</a>').openPopup();    
} 

function onLocationError(e) {
  alert(e.message);
}


function getColor(d) {
  return d > 1000 ? '#800026' :
      d > 500  ? '#BD0026' :
      d > 200  ? '#E31A1C' :
      d > 100  ? '#FC4E2A' :
      d > 50   ? '#FD8D3C' :
      d > 20   ? '#FEB24C' :
      d > 10   ? '#FED976' :
            '#FFEDA0';
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.4,
    fillColor: getColor(feature.properties.density)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 3,
    color: '#F00',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}


function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
    function clickHyperlink(e) { 
       window.open('http://www.yahoo.com');
}
        

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
          click: clickHyperlink
  });
}


  
  