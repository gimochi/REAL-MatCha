var map; 
var geocoder;
var center;
var icon = {
    url: "img/marker.png", // url
    scaledSize: new google.maps.Size(29, 35), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(15, 35) // anchor
};
var latArray = [];
var lngArray = [];

window.onload = function(){
	var i = 0;
	console.log("스탈트");
	initMap();

	$("#curBtn").click(function(){
		getLocation(geocoder, center);
	});
}

function initMap(){
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"));
	curMyLocation();
}

function curMyLocation(){
	var infoWindow  = new google.maps.InfoWindow({map: map});
	if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = {
        		lat: position.coords.latitude,
        		lng: position.coords.longitude
      		};

      		center = pos;
      		setCenter(pos);
    		},
    		function() {
      			handleLocationError(true, infoWindow, map.getCenter());
    	});
 	} 
 	else {
    	handleLocationError(false, infoWindow, map.getCenter());
 	}

}

function setCenter(pos){
	map.setCenter(pos);
    map.setZoom(18);

    makeMarker(pos);
}

function makeMarker(pos){
	var marker = new google.maps.Marker({
    			position: pos,
    			map: map,
    			draggable:true,
   				animation: google.maps.Animation.DROP,

    			icon: icon
  			});

	marker.addListener("position_changed")
}

function getLocation(geocoder, pos) {
  geocoder.geocode({'location': pos}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
    	var address = results[0].formatted_address;
    	$("#address").val(address);
    	$("#pos").val("lat:"+pos.lat+",lng:"+pos.lng);
	} 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}