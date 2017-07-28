(function () {
    angular
        .module("MyApp")
        .service("PrepMapSvc", PrepMapSvc);

    function PrepMapSvc() {
        var svc = this;

        svc.initMap = function (mapName) {
            var mapOptions = {
                zoom: 5,
                center: { lat: 0.2000285, lng: 118.015776 }
            }
            svc.map = new google.maps.Map(document.getElementById(mapName), mapOptions);
            return svc.map;
        }

        svc.createMarker = function (info) {
            var marker = new google.maps.Marker({
                map: svc.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                title: info.name
            });
            var infoWindow = new google.maps.InfoWindow();
            marker.content = '<div class="infoWindowContent"> diveoperator_id:&nbsp' + info.id + '&nbsp(FB_id:&nbsp' + info.fb_id + ')<br/>' + 'lat:' + info.latitude + '&nbsp;' + 'lng:' + info.longitude;
            google.maps.event.addListener(marker, "click", function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + '<br/>' + marker.content);
                infoWindow.open(svc.map, marker);
            });
        };

        var svcPolyPath = [];
        svc.createPolyPath = function () {
            google.maps.event.addListener(svc.map, "click", function (e) {
                console.log("createPolyPath function");
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeColor: "green",
                        scale: 3
                    }
                });
                console.log(marker);
                marker.setMap(svc.map);
                var markerLatLng = marker.getPosition();
                console.log(markerLatLng.lat());
                console.log(markerLatLng.lng());
                var onePointInPoly = {
                    lat: markerLatLng.lat(),
                    lng: markerLatLng.lng(),
                };
                svcPolyPath.push(onePointInPoly);
                console.log(svcPolyPath);
            });
        }

        svc.retrivePolyPath = function () {
            console.log("retrievePolyPath:", svcPolyPath);
            return svcPolyPath;
        }

        svc.createPoly = function (polyPath) {
            var polygon = new google.maps.Polygon({
                paths: polyPath,
                strokeColor: "#A0769A",
                strokeOpactity: 0.8,
                strokeWeight: 3,
                fillColor: "#F8B0B7",
                fillOpacity: 0.35,
            });
            polygon.setMap(svc.map);
        };

        svc.resetPolyPath = function () {
            console.log("svcPolyPath reset");
            svcPolyPath = [];
        }

    }//End of PrepMapSvc
})();//End of IIFE