(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl);

    RegionCtrl.$inject = ["MapSvc", "MapdbRouteSvc"];

    function RegionCtrl(MapSvc, MapdbRouteSvc) {
        var vm = this;

        var plotOnMap = function (retrievedResults) {
            for (var i in retrievedResults) {
                console.log(retrievedResults[i]);
                MapSvc
                    .createPoly(retrievedResults[i]);
            }
        };

        var displayDivespots = function (clickedPolygon) {
            console.log(clickedPolygon.polyObj.region_id);
            MapdbRouteSvc
                .displayDivespots(clickedPolygon.polyObj.region_id)
                .then(function (results) {
                    console.log(results);
                    vm.clickedPolygon = null;
                    console.log("displayDivespots successful");
                    vm.retrievedDivespots = results.data;
                    plotOnMap(vm.retrievedDivespots);
                })
                .catch(function (err) {
                    console.log("Error: \n", err);
                });
        }

        retrieveClickedPolygon();
        function retrieveClickedPolygon() {
            var clickedPolygon = MapSvc.clickedPolygon;
            //Setting up Map variables
            var mapName = "selectedregion";
            var mapOptions = {
                zoom: 8,
                center: clickedPolygon.polyBoundsCenter,
                bounds: clickedPolygon.rectangle.getBounds(),
                scrollwheel: false,
            }
            var map = MapSvc.initMap(mapName, mapOptions);
            displayDivespots(clickedPolygon);
        };

        retrieveDiveOperators();
        function retrieveDiveOperators() {
            MapdbRouteSvc
                .retrieveDiveOperators()
                .then(function (results) {
                    console.log("map_region.ctrl --> retrieveDiveOperators successful");
                    MapSvc.retrieveDiveOperators(results);
                })
                .catch(function (err) {
                    console.log("Error: \n" + (err));
                })
        };
        

    };//End RegionCtrl
})();//End of IIFE