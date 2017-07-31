(function () {
    angular
        .module("MyApp")
        .service("MapSvc", MapSvc);

    MapSvc.$inject = ["dbRouteService", "passportService", "$state"]

    function MapSvc(dbRouteService, passportService, $state) {
        var svc = this;

        svc.initMap = function (mapName) {
            var mapOptions = {
                zoom: 5,
                center: { lat: 0.2000285, lng: 118.015776 }
            }
            svc.map = new google.maps.Map(document.getElementById(mapName), mapOptions);
            return svc.map;
        }


        var takemethere = function () {
            return passportService.getAccessToken()
                .then(function(aToken){
                    return dbRouteService.pingFb(aToken)
                })
                .then(function(result){
                    $state.go('show'); 
                })
                .catch(function(err){
                    alert('Please log in')
                    console.log('The err is ' + JSON.stringify(err));
                    $state.go('login');
                });
        }

        svc.createMarker = function (info) {
            // console.log("map is -->", svc.map);
            var marker = new google.maps.Marker({
                map: svc.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                title: info.name
            });
            var infoWindow = new google.maps.InfoWindow();
            marker.content = '<div class="infoWindowContent"> diveoperator_id:&nbsp' + info.id + '&nbsp(FB_id:&nbsp' + info.fb_id + ')<br/>' + 'lat:' + info.latitude + '&nbsp;' + 'lng:' + info.longitude + '</div>';
            
            google.maps.event.addListener(infoWindow, "domready", function () {
                dbRouteService.getSelected(info.fb_id);
                console.log('The pin you selected has FB ID of: ' + dbRouteService.selected());
                alert('0. Need a pre-check \n1. Need to show/ hide login/ logout - how does Ken do it? \n 2. if not defined, will insert null values' );
            });

            google.maps.event.addListener(marker, "click", function () {
                var origContent = '<h2>' + marker.title + '</h2>' + '<br/>' + marker.content;
                var infoWindowContent = document.createElement('div');
                infoWindowContent.innerHTML = origContent;
                var button = infoWindowContent.appendChild(document.createElement('input'));
                button.type = 'button';
                button.id = 'takeMeThere';
                button.value = 'Take Me There';
                button.addEventListener('click', takemethere.bind());
                infoWindow.setContent(infoWindowContent);
                infoWindow.open(svc.map, marker);
            });

        };

    }//End MapSvc
})();

// var content = document.createElement('div');
// content.innerHTML = (origContent);
// var button = content.appendChild(document.createElement('input'));
// button.type = 'button';
// button.id = 'showMoreButton';
// button.value = 'show more';
// button.addEventListener('click', this.request.bind(this, resultsOneUser));