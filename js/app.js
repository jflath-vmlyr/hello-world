
const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 33
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2e5d4"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5dac6"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5c6c6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e4d7c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fbfaf7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#acbcc9"
      }
    ]
  }
];


var placeSearch, autocomplete;

// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
      return entities[char];
    });
    result += strings[i];
  }
  return result;
}




function geolocate() {
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat : position.coords.latitude,
				lng : position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center : geolocation,
				radius : position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		});
	}
}

function initMap(address){
	
	if( address == null )
		address=document.getElementById('autocomplete').value;
	
	console.log( address );
	var varLat;
	var varLng;
	
	$.getJSON( "/rest/services/geocode/" + address, function(result){
		varLat = parseFloat( result.lat );
		varLng = parseFloat( result.lng );
	
		console.log("LAT == " + varLat);
		console.log("LNG == " + varLng);
		
	  // Create the map.
	  const map = new google.maps.Map(document.getElementsByClassName('google-map')[0], {
	    zoom: 15,
	    center: {lat: varLat, lng: varLng},
	    styles: mapStyle
	  });
	
	  var marker = new google.maps.Marker({
		    position: {lat: varLat, lng: varLng},
		    map: map,
		    title: 'VMLY&R NYC',
		  });
	 
		var locations='';
	    var checkboxes = document.getElementsByName("locationNames");  
	    var numberOfCheckedItems = 0;  
	    
	    for(var i = 0; i < checkboxes.length; i++)  
	    {  
	    	
	    	if(checkboxes[i].checked)  
	    		locations+=checkboxes[i].value+',';  
	    }  

	  if( locations == '' )
		  return;
	  
	  // Load the stores GeoJSON onto the map.
	  map.data.loadGeoJson('/rest/services/locations/' + varLat + '/' + varLng + "?locationNames="  + locations);
	
	  // Define the custom marker icons, using the store's "category".
	  map.data.setStyle(feature => {
	    return {
	      icon: {
	        url: `img/icon_${feature.getProperty('category')}.png`,
	        scaledSize: new google.maps.Size(34, 34)
	      }
	    };
	  });
	
	  const apiKey = 'AIzaSyBh5VBoj3kXxuxRniIq2A03xIjlKhiQvjg';
	  const infoWindow = new google.maps.InfoWindow();
	  infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
	
	  // Show the information for a store when its marker is clicked.
	  map.data.addListener('click', event => {
	
	    const category = event.feature.getProperty('category');
	    const name = event.feature.getProperty('name');
	    const position = event.feature.getGeometry().get();
	    const content = sanitizeHTML`
	      <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
	      <div style="margin-left:220px; margin-bottom:20px;">
	        <h2>${name}</h2>
	        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
	      </div>
	    `;
	
	    infoWindow.setContent(content);
	    infoWindow.setPosition(position);
	    infoWindow.open(map);
	  });
	});
}
