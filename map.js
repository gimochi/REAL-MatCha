var map; 
var geocoder;
var icon = {
    url: "img/marker.png", // url
    scaledSize: new google.maps.Size(29, 35), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(15, 35) // anchor
};
var centerPose;
var radius;
var latArray = [];
var lngArray = [];

window.onload = function(){
	var i = 0;
	console.log("스탈트");
	initMap();

	$("#curBtn").click(function(){
		curMyLocation();
	});

	$("#markBtn").click(function(){
		showMarker();
	});

	$("#pushMark").click(function(){
		var pos = {
			lat : $("#lat").val()*1,
			lng : $("#lng").val()*1
		}
		makeMarker(pos);
	});

	google.maps.event.addListener(map, "click", function (event) {
    	var lat = event.latLng.lat();
    	var lng = event.latLng.lng();
    	latArray.push(lat);
    	lngArray.push(lng);
    	showMarker(i);
    	i++;
	});
}

function initMap(){
	console.log("init")
	var pos = {lat: -34.397, lng: 150.644};
	var map_option = {
		center: pos,
        zoom: 8
	};

	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById("map"), map_option);
	centerPos = pos;

	makeMarker(pos);
}

function curMyLocation(){
	var infoWindow  = new google.maps.InfoWindow({map: map});
	if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = {
        		lat: position.coords.latitude,
        		lng: position.coords.longitude
      		};

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

    var bound = map.getBounds();
    centerPos = pos;
    radius = Math.abs(bound.j.R - bound.j.j)/2;

    makeMarker(pos);
    //makeBound(bound, pos);
    console.log(bound, radius);
 	console.log(centerPos);
}

function makeMarker(pos){
	var marker = new google.maps.Marker({
    			position: pos,
    			map: map,
    			icon: icon
  			});

	marker.addListener("click", function(event){
		var pos = {
			lat : event.latLng.lat(),
			lng : event.latLng.lng(),
		};

		geocodeLocation(geocoder, pos);
	});
}

function makeBound(bound, pos){
	var lng1 = bound.j.R;
	var lng2 = bound.j.j;
	var boundpos1 = {
		lat: pos.lat,
		lng: lng1
	}
	var boundpos2 = {
		lat: pos.lat,
		lng: lng2
	}
	makeMarker(boundpos1);
	makeMarker(boundpos2);
}

function showMarker(i){
	var pos = {
		lat: latArray[i],
		lng: lngArray[i]
	}
	var dist = getDistance(centerPos ,pos); 
	console.log(dist,radius);
	if(dist<radius){
		console.log("나와랍");
		makeMarker(pos);
	}
}

function getDistance(pos1, pos2){
	var x = pos1.lng-pos2.lng;
	var y = pos1.lat-pos2.lat;
	x = Math.pow(x,2);
	y = Math.pow(y,2);
	var d = Math.sqrt(x+y);

	return d;
}

function geocodeLocation(geocoder, pos) {
  geocoder.geocode({'location': pos}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
    	var address = results[0].formatted_address;
		var html = "<div id='name'>가게명 : "+"아히후에"+"</div>"
					+"<div id='address'>주소 : "+address+"</div>"
					+"<div id='item'>판매물품 : "+"아히후에"+"</div>"
					+"<div id='price'>가격 : "+"비쌈"+"</div>";
		$("#popup").html(html);
    	console.log(address);
    } 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}