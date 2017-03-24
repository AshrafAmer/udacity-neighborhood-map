var map;

markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 31.408952, lng: 30.420470},
    zoom: 16
  });

  var largeInfowindow = new google.maps.InfoWindow;

  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < filtered_arr().length; i++) {
    marker = new google.maps.Marker({
      position: filtered_arr()[i].location,
      map: map,
      title: filtered_arr()[i].title,
      description: filtered_arr()[i].description
    });

    markers.push(marker);

    bounds.extend(marker.position)

    marker.addListener('click', function(){
      populateInfoWindow(this, largeInfowindow);
    });

  } //endfor

  map.fitBounds(bounds);

}// end initMap


    function populateInfoWindow(marker, infowindow){
      infowindow.marker = marker;

      $.ajax({
          url: "http://api.openweathermap.org/data/2.5/weather?lat="+ marker.getPosition().lat() +"&lon="+ marker.getPosition().lng() +"&appid=f5507d4ec960f3e5213b79be8e6fd620&units=metric",
          success: function(result){
            renderInfowindow = "<h3>"+marker.title+"<h3><p>"+marker.description+"</p>";
            renderInfowindow += "<h4>Weather<h4><p><b>Temprature : </b> "+result.main.temp+" °C  <b> &nbsp;&nbsp;&nbsp; Description: </b> "+result.weather[0].description+"</p>";
            infowindow.setContent(window.renderInfowindow);
          },
          error: function(xhr,status,error){
            renderInfowindow = "<h3>"+marker.title+"<h3><p>"+marker.description+"</p>";
            renderInfowindow += "<h4>Weather<h4><p>Error : Unable to view weather status, please try again later.</p>";
            infowindow.setContent(window.renderInfowindow);
          }

      });

//

      map.panTo(marker.getPosition());
      infowindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {marker.setAnimation(null); }, 2100);
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker(null);
      });
    }

//check if sub_str exsists in a string
function exists(sub_str, str){
  if (str.toLowerCase().indexOf(sub_str.toLowerCase()) !== -1)
    return true;
  return false;
}

var viewModel = function() {

  locations = ko.observableArray(geoLocations);
  search = ko.observable();

  // Filter Locations list by search textBox
  locationsFilter = function(){
    // if search textbox is not empty
    filtered_arr = ko.observableArray();
    if (search()) {

      filtered_arr.removeAll();
      for (var i = 0; i < locations().length; i++) {
        console.log(i);
        if (exists(search(), locations()[i].title))
          filtered_arr.push(locations()[i]);
      }
      //drawMarkers();
      initMap();
      return filtered_arr();
    }

    // if search textbox is empty
    filtered_arr(locations());
    try {initMap();} catch(err) {console.log(err)}
    return filtered_arr();
  };

  listItemClicked = function(){
    search(this.title);
  };

  clearSearchBox = function(){
    search("");
  }

  //expand search textBox if is not empty
  setFocus = ko.pureComputed(function() {
    // expand search textBox
    if( search() ) return "is-focused";
  });

}


ko.applyBindings(viewModel);