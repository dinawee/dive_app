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
            marker.content = '<div class="infoWindowContent"> diveoperator_id:&nbsp' + info.id + '&nbsp(FB_id:&nbsp' + info.fb_id + ')<br/>' + 'lat:' + info.latitude + '&nbsp;' + 'lng:' + info.longitude;
            var infoWindow = new google.maps.InfoWindow();
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



        svc.createPoly = function (polyObj) {
            console.log(polyObj)
            var path;
            if (polyObj.divespot_array) {
                path = JSON.parse(polyObj.divespot_array);
            } else {
                path = JSON.parse(polyObj.region_array);
            }
            var polygon = new google.maps.Polygon({
                paths: path,
                strokeColor: "#A0769A",
                strokeOpactity: 0.8,
                strokeWeight: 3,
                fillColor: "#F8B0B7",
                fillOpacity: 0.35,
            });
            polygon.setMap(svc.map);
            setPolyOptions(polygon, polyObj);
        };

        var setPolyOptions = function (polygon, polyObj) {
            var polyName = polyObj.divespot_name || polyObj.region_name;
            polygon.set("polyName", polyName);
            var infoWindowPosition = JSON.parse(polyObj.divespot_array || polyObj.region_array);
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(polygon, "mouseover", function () {
                infoWindow.setContent(polygon.get("polyName"));
                infoWindow.setPosition(infoWindowPosition[3]);
                infoWindow.open(svc.map);
            });
            google.maps.event.addListener(polygon, "mouseout", function () {
                infoWindow.close();
            });

            //Creating zoom for polygon
            // function getBoundsForPoly() {
            //     var bounds = new google.maps.LatLngBounds;
            //     polygon.getPath().forEach(function (latLng) {
            //         bounds.extend(latLng);
            //     });
            //     return bounds;
            // }

            bounds = getBoundsForPoly(zone1)

            // Add a listener for the click event
            google.maps.event.addListener(zone1, 'click', function () {
                map.fitBounds(bounds);
            });


            google.maps.event.addListener(polygon, "click", function () {
                var bounds = new google.maps.LatLngBounds();
                var points = [];
            });
        };

        svc.resetPolyPath = function () {
            console.log("svcPolyPath reset");
            svcPolyPath = [];
        }


    }//End of PrepMapSvc
})();//End of IIFE