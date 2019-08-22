$(document).ready(function async () {
  //const API_URL = 'http://192.168.1.29:3001'
  const API_URL = 'https://sura-ticket-manager.herokuapp.com'
  console.log('HELLO')


  var mapWaitCount = 0;
  var mapWaitMax = 5;
  prevInfoWindow = false;
  mapLoad()
  
  function mapLoad() { // if you need any param
      mapWaitCount++;
      // if api is loaded
      if(typeof google != 'undefined') {
          // your code here 
          sleep(1000)
          markersList()
      }
      // try again if until maximum allowed attempt
      else if(mapWaitCount < mapWaitMax) {
          console.log('Waiting attempt #' + mapWaitCount); // just log
          setTimeout(function() { mapLoad(); }, 1000);
      }
      // if failed after maximum attempt, not mandatory
      else if(mapWaitCount >= mapWaitMax) {
          console.log('Failed to load google api');
      }
  }




  // take focus away
  document.addEventListener('click', function(e) { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});


markersList = () => {

  var token = window.localStorage.getItem('token');

  $.ajax({
    //"url": 'https://sura-ticket-manager.herokuapp.com/venues',
    "url": `${API_URL}/gigs`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: function (gigs) {
      drop(gigs)
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}



  const myStyles =[
  {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
  }];

  const myOptions = {
      zoom: 15.5,
      center: {lat: 53.8670, lng: 10.687},
      styles: myStyles 
  };

  var markers = [];
  var map;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    

    
  }

  function drop(gigs) {
    clearMarkers();
    var i = 0
    gigs.forEach( (gig) => {
      console.log('ADDRESS', gig.venue.address)
      console.log('COORDS', gig.venue.coords)
      if (gig.venue.coords != null) {
        var lat = gig.venue.coords[0]
        var lng = gig.venue.coords[1]
        console.log('MARKER', lat, lng)
        var newLatLng = {lat: lat, lng: lng};
        var contentString = '<div id="content">' + `<p>House No. ${gig.houseNo}<p/>` +
                                                  `<p>"${gig.title}"<p/>` +
                                                  `<p>${gig.performer.name}<p/>` +
                                                  `<p>${gig.venue.address}<p/>` +
                                                  `<p>${(gig.startSeats - gig.soldSeats)} seat(s) available<p/>` +
        '</div>';
        var colorString = ''
        if (gig.startSeats - gig.soldSeats === 0) {
          colorString = '/images/redHouse.png'
        } else if ((gig.startSeats - gig.soldSeats)/gig.startSeats < 0.5) {
          colorString = '/images/yellowHouse.png'
        } else {
          colorString = '/images/greenHouse.png'
        }
        console.log('RATIO', (gig.startSeats - gig.soldSeats)/gig.startSeats)

        addMarkerWithTimeout(newLatLng, i * 200, `House No. ${gig.houseNo}`, contentString, colorString);
      }
    i++
  });
  }

  function addMarkerWithTimeout(position, timeout, title, contentString, colorString) {
    window.setTimeout(function() {

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      var marker = new google.maps.Marker({
        position: position,
        icon: colorString,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP
      });
      marker.addListener('click', function() {
        if(prevInfoWindow) {
          prevInfoWindow.close();
       }

       prevInfoWindow = infowindow;
        infowindow.open(map, marker);
      });
      markers.push(marker)
    }, timeout);
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

 
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

  
  

  