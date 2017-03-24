  var map;

  markers = [];


  // var tribeca = {lat: locations()[0].lat, lng: locations()[0].long}
  // var marker = new google.maps.Marker({
  //   position: tribeca,
  //   map: map,
  //   title: 'First Marker!'
  // });

  // var infoWindow = new google.maps.InfoWindow({
  //   content: locations()[0].description
  // });

  // marker.addListener('click', function(){
  //   infoWindow.open(map, marker);
  // });
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 31.408952, lng: 30.420470},
      zoom: 16
    });

    var largeInfowindow = new google.maps.InfoWindow;
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < geoLocations.length; i++) {
      // position = ;
      // title = ;
      marker = new google.maps.Marker({
        position: geoLocations[i].location,
        map: map,
        title: geoLocations[i].title,
        animation: google.maps.Animation.DROP,
      });

      markers.push(marker);

      bounds.extend(marker.position)

      marker.addListener('click', function(){
        populateInfoWindow(this, largeInfowindow);
      });

    }
    map.fitBounds(bounds);
  }


  function populateInfoWindow(marker, infowindow){
    // if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent(marker.title);
    map.panTo(marker.getPosition());
    infowindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        marker.setAnimation(null);
    }, 2100); // current maps duration of one bounce (v3.13)

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
    if (search()) {

      // filtered_arr.removeAll();
      filtered_arr = ko.observableArray();
      for (var i = 0; i < locations().length; i++) {
        console.log(i);
        if (exists(search(), locations()[i].title))
          filtered_arr.push(locations()[i]);
      }
      return filtered_arr();
    }
    // if search textbox is empty
    return locations();
  };

  listItemClicked = function(){
    alert(this.title)
  };

}


ko.applyBindings(viewModel);