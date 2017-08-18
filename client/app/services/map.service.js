(function () {
    angular
        .module("MyApp")
        .service("MapSvc", MapSvc);

    MapSvc.$inject = ["fbService", "passportService", "$state", "MapdbRouteSvc", "$rootScope", "ModalService"];

    function MapSvc(fbService, passportService, $state, MapdbRouteSvc, $rootScope, ModalService) {

        var svc = this;

        //Initialiding map
        svc.initMap = function (mapName, mapOptions) {
            svc.map = new google.maps.Map(document.getElementById(mapName), mapOptions);
            return svc.map;
        }


        var showModalOptions = {
            templateUrl: '/app/home/show-modal.html',
            controller:  'ShowC',
            controllerAs: 'con',
            // bodyClass: 'show-modal', // use show-modal styles
        }

        var takemethere = function () {
            return passportService.getAccessToken()
                .then(function(aToken){
                    return fbService.pingFb(aToken);
                })
                .then(function(result){
                   console.log('Taken me there');
                })
                .catch(function(err) {
                    alert('Please login to access divespot information from Facebook :)');
                    $state.go('login');
                });
        }

        /* Version with modal service 
        var takemethere = function () {
            return passportService.getAccessToken()
                .then(function (aToken) {
                    return fbService.pingFb(aToken)
                })
                .then(function(result){
                   console.log('Taken me there');
                   return ModalService.showModal(showModalOptions).catch(function(err){
                       console.log('The error is ' + err);
                   });
                })
                .then(function(modal){
                    modal.close.then(function(result){
                        console.log('Modal closed');
                    });
                })
                .catch(function (err) {
                    alert('Takeme function says: You are not logged in');
                    $state.go('login');
                });
        }
        */
            

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
                // title: info.name,
                visible: false,
            });
            setMarkerBehaviour(marker, info);
            svc.markersDiveOperators.push(marker);
        };

        //Set marker behaviour
        var setMarkerBehaviour = function (marker, info) {
            var infoWindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, "click", function () {

                fbService.getSelected(info.fb_id);
                console.log('The pin you selected has FB ID of: ' + fbService.selected());

                var infoBubbleDiv = document.createElement('info-div');
                infoBubbleDiv.setAttribute("class", "center-align");
                var content =
                    '<h3>' + info.name + '</h3>' +
                    '<h3 style="color:black;font-size:1.3rem">' + 'Coordinates: [' + info.longitude + ', ' + info.latitude + '] </h3> </br>';
                infoBubbleDiv.innerHTML = content;

                infoBubble = new InfoBubble({
                    minWidth: 500,
                    minHeight: 200,
                    content: infoBubbleDiv,
                    shadowStyle: 1,
                });


                var buttonDiv = infoBubbleDiv.appendChild(document.createElement('div'));
                buttonDiv.setAttribute("class", "center-align");

                var button = buttonDiv.appendChild(document.createElement('input'));
                button.type = 'button';
                button.id = 'takeMeThere';
                button.value = 'Take Me There';
                // button.class = 'waves-effect waves-light btn';
                button.setAttribute("class", "waves-effect waves-light btn");
                button.addEventListener('click', takemethere.bind());

                infoBubble.open(svc.map, marker);

                google.maps.event.addListener(svc.map, 'click', function () {
                    infoBubble.close();
                });

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
            
            var polygonName = polygon.get("polyName");
            var infoBubbleDiv = document.createElement('info-div');
            var content = '<span style="font-family:Lato;font-size:1.3em;text-align:center">' + polygonName + '</span>';
            infoBubbleDiv.innerHTML = content;

            var infoBubble = new InfoBubble({
                minHeight: 40,
                content: infoBubbleDiv,
                position: polyBoundsCenter,
                shadowStyle: 1,
                disableAutoPan: true,
                hideCloseButton: true,
            });
            google.maps.event.addListener(polygon, "mouseover", function () {
                infoBubble.open(svc.map);
            });
            google.maps.event.addListener(polygon, "mouseout", function () {
                infoBubble.close();
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
                // strokeColor: "#CD661D",
                strokeOpactity: 0.5,
                strokeWeight: 0,
                fillColor: "#FF7D40",
                fillOpacity: 0.5,
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
                // strokeColor: "#CD661D",
                strokeOpactity: 0.5,
                strokeWeight: 0,
                fillColor: "#FF7D40",
                fillOpacity: 0.5,
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
