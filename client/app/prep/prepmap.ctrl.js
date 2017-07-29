(function () {
    angular
        .module("MyApp")
        .controller("PrepMapCtrl", PrepMapCtrl);

    PrepMapCtrl.$inject = ["dbRouteService", "PrepMapSvc", "PrepdbRouteSvc"];

    function PrepMapCtrl(dbRouteService, PrepMapSvc, PrepdbRouteSvc) {
        var vm = this;

        //On page load:
        // vm.displayDiveRegions(); //--> change vm to var in LIVE page


        function retrieveDiveOperators() {
            dbRouteService
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

        //---DIVESPOTS

        var plotOnMap = function (retrievedResults) {
            if (retrievedResults[0].divespot_name) {
                for (var i in retrievedResults) {
                    PrepMapSvc
                        .createPoly(retrievedResults[i]);
                }
            } else {
                for (var i in retrievedResults) {
                    PrepMapSvc
                        .createPoly(retrievedResults[i]);
                }
            }
        };

        vm.displayDivespots = function () {
            PrepdbRouteSvc
                .displayDivespots()
                .then(function (results) {
                    console.log("PrepMapCtrl --> displayDivespots successful");
                    vm.retrievedDivespots = results.data;
                    console.log(vm.retrievedDivespots[0].divespot_array);
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