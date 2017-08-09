(function () {
    angular
        .module("MyApp")
        .service("MapSvc", MapSvc);

    MapSvc.$inject = ["dbRouteService", "passportService", "$state", "MapdbRouteSvc", "$rootScope"];

    function MapSvc(dbRouteService, passportService, $state, MapdbRouteSvc, $rootScope) {
        var svc = this;

        //Initialiding map
        svc.initMap = function (mapName, mapOptions) {
            svc.map = new google.maps.Map(document.getElementById(mapName), mapOptions);
            return svc.map;
        }

        var takemethere = function () {
            return passportService.getAccessToken()
                .then(function (aToken) {
                    return dbRouteService.pingFb(aToken)
                })
                .then(function (result) {
                    $state.go('show');
                })
        }

        //Retrieving dive operators from db
        svc.markersDiveOperators = [];

        svc.retrieveDiveOperators = function (results) {
            svc.DiveOperators = results.data;
            for (i in svc.DiveOperators) {
                createMarker(svc.DiveOperators[i]);
            }
        };

        //Create marker
        var createMarker = function (info) {
            var marker = new google.maps.Marker({
                map: svc.map,
                position: new google.maps.LatLng(info.latitude, info.longitude),
                title: info.name,
                visible: false,
                icon: "/app/images/orange_marker_min.png"
            });
            marker.content = '<div class="infoWindowContent"> diveoperator_id:&nbsp' + info.id + '&nbsp(FB_id:&nbsp' + info.fb_id + ')<br/>' + 'lat:' + info.latitude + '&nbsp;' + 'lng:' + info.longitude + '</div>';
            setMarkerBehaviour(marker, info);
            svc.markersDiveOperators.push(marker);
        };

        //Set marker behaviour
        var setMarkerBehaviour = function (marker, info) {
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, "click", function () {
                dbRouteService.getSelected(info.fb_id);
                console.log('The pin you selected has FB ID of: ' + dbRouteService.selected());
                alert('0. Need a pre-check \n1. Need to show/ hide login/ logout - how does Ken do it? \n 2. if not defined, will insert null values');
                //TO-DO: create DOM object for info-window
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
            return polyBoundsCenter;
        };

        //Set listener for polygon
        var setPolyListener = function (polygon, polyName, polyBoundsCenter) {
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(polygon, "mouseover", function () {
                infoWindow.setContent(polygon.get("polyName"));
                infoWindow.setPosition(polyBoundsCenter);
                infoWindow.open(svc.map);
            });
            google.maps.event.addListener(polygon, "mouseout", function () {
                infoWindow.close();
            });
        };

        svc.exploreMe = function (polygon, rectangle) {
            var rectangle = setPolyBounds(polygon);
            var polyBoundsCenter = setPolyBoundsCenter(rectangle);
            polygon.setOptions({ visible: false });
            svc.map.fitBounds(rectangle.getBounds());
            for (i in svc.markersDiveOperators) {
                if (google.maps.geometry.poly.containsLocation(svc.markersDiveOperators[i].getPosition(), polygon)) {
                    svc.markersDiveOperators[i].setMap(svc.map);
                    svc.markersDiveOperators[i].setOptions({ visible: true });
                } else {
                    console.log("marker not in polygon");
                };
            };
        };

        //Set divespot polygon behaviour
        var setDivespotPolyOptions = function (polygon, polyObj, rectangle, polyBoundsCenter) {
            var polyName = polyObj.divespot_name;
            polygon.set("polyName", polyName);
            // setPolyListener(polygon, polyName, polyBoundsCenter);
            google.maps.event.addListener(polygon, "click", function () {
                $rootScope.$emit("polygon clicked", { 
                    polyObj: polyObj,
                    polygon: polygon,
                    rectangle: rectangle, 
                });
            });
        };

        //Set dive region polygon behaviour
        var setDiveRegionPolyOptions = function (polygon, polyObj, rectangle, polyBoundsCenter) {
            var polyName = polyObj.region_name;
            polygon.set("polyName", polyName);
            setPolyListener(polygon, polyName, polyBoundsCenter);
            google.maps.event.addListener(polygon, "click", function () {
                svc.clickedPolygon = {
                    polyObj: polyObj,
                    rectangle: rectangle,
                    polyBoundsCenter: polyBoundsCenter,
                }
                $state.go("mapregion");
            });
        };

        //Create divespot polygon
        var createDivespotPoly = function (polyObj) {
            var DivespotPoly = new google.maps.Polygon({
                paths: JSON.parse(polyObj.divespot_array),
                strokeColor: "#CD661D",
                strokeOpactity: 0.8,
                strokeWeight: 3,
                fillColor: "#FF7D40",
                fillOpacity: 0.35,
                zIndex: 1,
            });
            DivespotPoly.setMap(svc.map);
            var rectangle = setPolyBounds(DivespotPoly);
            var polyBoundsCenter = setPolyBoundsCenter(rectangle);
            setDivespotPolyOptions(DivespotPoly, polyObj, rectangle, polyBoundsCenter);
        };

        //Create dive region polygon
        var createDiveRegionPoly = function (polyObj) {
            var DiveRegionPoly = new google.maps.Polygon({
                paths: JSON.parse(polyObj.region_array),
                strokeColor: "#CD661D",
                strokeOpactity: 0.8,
                strokeWeight: 3,
                fillColor: "#FF7D40",
                fillOpacity: 0.35,
                zIndex: 1,
            });
            DiveRegionPoly.setMap(svc.map);
            var rectangle = setPolyBounds(DiveRegionPoly);
            var polyBoundsCenter = setPolyBoundsCenter(rectangle);
            setDiveRegionPolyOptions(DiveRegionPoly, polyObj, rectangle, polyBoundsCenter);
        };

        svc.createPoly = function (polyObj) {
            if (polyObj.divespot_array) {
                createDivespotPoly(polyObj);
            } else {
                createDiveRegionPoly(polyObj);
            }
        };

    }//End MapSvc
})();
