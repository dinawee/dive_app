(function () {
    angular
        .module("MyApp")
        .service("PrepMapSvc", PrepMapSvc);

    function PrepMapSvc() {
        var svc = this;

        svc.initMap = function (mapName, mapOptions) {
            svc.map = new google.maps.Map(document.getElementById(mapName), mapOptions);
            return svc.map;
        }

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
            console.log(polyPath);
            var polygon = new google.maps.Polygon({
                paths: polyPath,
                strokeColor: "#A0769A",
                strokeOpactity: 0.8,
                strokeWeight: 3,
                fillColor: "#F8B0B7",
                fillOpacity: 0.35,
                zIndex: 1,
            });
            polygon.setMap(svc.map);
        };


        svc.resetPolyPath = function () {
            console.log("svcPolyPath reset");
            svcPolyPath = [];
        }


    }//End of PrepMapSvc
})();//End of IIFE