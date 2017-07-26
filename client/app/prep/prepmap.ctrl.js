(function () {
    angular
        .module("MyApp")
        .controller("PrepMapCtrl", PrepMapCtrl);

    PrepMapCtrl.$inject = ["dbRouteService", "PrepMapSvc", "MapSvc"];

    function PrepMapCtrl(dbRouteService, PrepMapSvc, MapSvc) {
        var vm = this;

        function retrieveDiveOperators() {
            dbRouteService
                .retrieveDiveOperators()
                .then(function (results) {
                    vm.results = results;
                    console.log("PrepMapCtrl --> retrieveDiveOperators successful");
                    console.log(JSON.stringify(results[0]));
                    createMarker();
                })
                .catch(function (err) {
                    console.log("Error: \n" + (err));
                })
        };
        retrieveDiveOperators();

        //Setting up Map variables
        var mapName = "prepmap";
        const map = PrepMapSvc.initMap(mapName);

        var createMarker = function () {
            for (var i in vm.results) {
                PrepMapSvc
                    .createMarker(vm.results[i]);
            };
        }

        PrepMapSvc.createPolyPath();

        vm.createPoly = function () {
            polyPath = PrepMapSvc.retrivePolyPath();
            PrepMapSvc
                .createPoly(polyPath);
        }

        //Creating divespot in divespots table

        vm.region_array = [];

        var polyPath = [];
        vm.divespot = {};

        var setDivespotValue = function () {
            polyPath = PrepMapSvc.retrivePolyPath();
            vm.divespot.divespot_array = polyPath;
        };

        vm.createDivespot = function () {
            setDivespotValue();
            vm.region_array.push(vm.divespot.divespot_array);
            console.log(JSON.stringify(vm.region_array));
            dbRouteService
                .createDivespot(vm.divespot)
                .then(function (results) {
                    console.log("PrepMapCtrl --> createDivespot successful");
                    PrepMapSvc.resetPolyPath();
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                    PrepMapSvc.resetPolyPath();
                });
        };

        //Retrieving divespots (polygons)

        var plotDivespotsOnMap = function () {
            for (var i in vm.retrievedDivespots) {
                PrepMapSvc
                    .createPoly(vm.retrievedDivespots[i].divespot_array);
            }
        };

        vm.displayDivespots = function () {
            dbRouteService
                .displayDivespots()
                .then(function (results) {
                    console.log("PrepMapCtrl --> displayDivespots successful");
                    vm.retrievedDivespots = results.data;
                    plotDivespotsOnMap();
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }

        //Creating region in region table

        vm.region = {
            region_name: null,
            region_array: vm.region_array
        }

        var createRegion = function () {
            console.log(vm.region);
            dbRouteService
                .createRegion(vm.region)
                .then(function (results) {
                    console.log("PrepMapCtrl --> Result of createRegion " + results);
                })
                .catch(function (err) {
                    console.log("Error: \n" + err);
                });
        };

    };//End PrepMapCtrl

})();

        //Clickable buttons that bring up infoWindow on marker
        /*--
        vm.clickedCity = clickedCity;
        function clickedCity(e, marker) {
            console.log(marker);
            google.maps.event.trigger(marker, 'click');
        };
        --*/

                //Creating a collection of polygons (aka region)
        /* var createRegion = function () {
             console.log(vm.polyPath);
             polyPathCol.push(vm.polyPath);
             console.log("polyPathCol: ", polyPathCol);
         };*/