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

        var setPolyBounds = function (polygon) {
            //Set bounds of polygon
            if (!google.maps.Polygon.prototype.getBounds)
                google.maps.Polygon.prototype.getBounds = function () {
                    var bounds = new google.maps.LatLngBounds();
                    var paths = this.getPaths();
                    for (var i = 0; i < paths.getLength(); i++) {
                        var path = paths.getAt(i);
                        for (var j = 0; j < path.getLength(); j++) {
                            bounds.extend(path.getAt(j));
                        }
                    }
                    return bounds;
                }
            //Construct rectangle with polygon bounds
            var rectangle = new google.maps.Rectangle({
                visible: false,
                map: svc.map,
                bounds: polygon.getBounds(),
                zIndex: 0,
            });
            return rectangle;
        };

        //Set center of polygon bounds
        var setPolyBoundsCenter = function (rectangle) {
            var polyBoundsCenter = rectangle.getBounds().getCenter();
            console.log(polyBoundsCenter);
            return polyBoundsCenter;
        };

        svc.createPoly = function (polyObj) {
            var path;
            var polyName;
            var polyId;
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
                zIndex: 1,
            });
            polygon.setMap(svc.map);
            var rectangle = setPolyBounds(polygon);
            var polyBoundsCenter = setPolyBoundsCenter(rectangle);
            setPolyOptions(polygon, polyObj, rectangle, polyBoundsCenter);
        };

        var setPolyOptions = function (polygon, polyObj, rectangle, polyBoundsCenter) {
            console.log("PolyObj ---->", polyObj);
            var polyName = polyObj.divespot_name || polyObj.region_name;
            var polyId = polyObj.divespot_id || polyObj.region_id;
            polygon.set("polyName", polyName);
            polygon.set("polyId", polyId);
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(polygon, "mouseover", function () {
                infoWindow.setContent(polygon.get("polyName"));
                infoWindow.setPosition(polyBoundsCenter);
                infoWindow.open(svc.map);
            });
            google.maps.event.addListener(polygon, "mouseout", function () {
                infoWindow.close();
            });
            google.maps.event.addListener(polygon, "click", function () {
                console.log(polyObj);
                console.log("polygon clicked");
                svc.map.fitBounds(rectangle.getBounds());
                svc.map.setOptions({ zoom: 7 });
            });
        };

        svc.resetPolyPath = function () {
            console.log("svcPolyPath reset");
            svcPolyPath = [];
        }


    }//End of PrepMapSvc
})();//End of IIFE