(function () {
    angular
        .module("MyApp")
        .controller("PrepMapCtrl", PrepMapCtrl);

    PrepMapCtrl.$inject = ["fbService", "PrepMapSvc", "PrepdbRouteSvc"];

    function PrepMapCtrl(fbService, PrepMapSvc, PrepdbRouteSvc) {
        var vm = this;

        function retrieveDiveOperators() {
            fbService
                .retrieveDiveOperators()
                .then(function (results) {
                    vm.results = results;
                    console.log("PrepMapCtrl --> retrieveDiveOperators successful");
                    // console.log(JSON.stringify(results[0]));
                    createMarker();
                })
                .catch(function (err) {
                    console.log("Error: \n" + (err));
                })
        };
        // retrieveDiveOperators();

        //Setting up Map variables
        var mapName = "prepmap";
        var mapOptions = {
            zoom: 5,
            center: { lat: 0.2000285, lng: 118.015776 },
            scrollwheel: false,
        }
        var map = PrepMapSvc.initMap(mapName, mapOptions);

        PrepMapSvc.createPolyPath();

        vm.createPoly = function () {
            polyPath = PrepMapSvc.retrivePolyPath();
            console.log(polyPath);
            PrepMapSvc
                .createPoly(polyPath);
        }

//Creating records

        //---DIVESPOTS

        var polyPath = [];
        vm.divespot = {};

        var setPolygonArray = function (polygon) {
            polyPath = PrepMapSvc.retrivePolyPath();
            if (polygon.divespot_array) {
                polygon.divespot_array = polyPath;
            }
            else {
                polygon.region_array = polyPath;
            }
        };

        vm.createDivespot = function () {
            setPolygonArray(vm.divespot);
            console.log(vm.divespot);
            PrepdbRouteSvc
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

        //---REGIONS

        vm.region = {};

        vm.createDiveRegions = function () {
            setPolygonArray(vm.region);
            console.log(vm.region);
            PrepdbRouteSvc
                .createRegion(vm.region)
                .then(function (results) {
                    console.log("PrepMapCtrl --> Result of createDiveRegion " + results);
                    PrepMapSvc.resetPolyPath();
                })
                .catch(function (err) {
                    console.log("Error: \n" + err);
                    PrepMapSvc.resetPolyPath();
                });
        };

//Retrieving records

        var plotOnMap = function (retrievedResults) {
            if (retrievedResults[0].divespot_name) {
                for (var i in retrievedResults) {
                    PrepMapSvc
                        .createPoly(JSON.parse(retrievedResults[i].divespot_array));
                }
            } else {
                for (var i in retrievedResults) {
                    PrepMapSvc
                        .createPoly(JSON.parse(retrievedResults[i].region_array));
                }
            }
        };

        //---DIVESPOTS

        vm.displayDivespots = function () {
            PrepdbRouteSvc
                .displayDivespots()
                .then(function (results) {
                    console.log("PrepMapCtrl --> displayDivespots successful");
                    vm.retrievedDivespots = results.data;
                    console.log(vm.retrievedDivespots);
                    plotOnMap(vm.retrievedDivespots);
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }

        //---REGIONS

        vm.displayDiveRegions = function () {
            PrepdbRouteSvc
                .displayDiveRegions()
                .then(function (results) {
                    console.log("PrepMapCtrl --> displayDivespots successful");
                    vm.retrievedDiveRegions = results.data;
                    console.log(vm.retrievedDiveRegions[0].region_array);
                    plotOnMap(vm.retrievedDiveRegions);
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }

    };//End PrepMapCtrl
})();//End of IIFE