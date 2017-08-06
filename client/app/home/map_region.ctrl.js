(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl)
        .value('duScrollOffset', 30);

    RegionCtrl.$inject = ["$scope", "$document", "$anchorScroll", "MapSvc", "MapdbRouteSvc", "fbService"];

    function RegionCtrl($scope, $document, $anchorScroll, MapSvc, MapdbRouteSvc, fbService) {
        var ctrl = this;

        ctrl.toggleShow = false; //controls the show-hide of show view

        ctrl.toPlace = function(place){
            $document.scrollToElementAnimated(place); // provided by duScroll library
        }

        ctrl.toShowMap = function(){
            $document.scrollTopAnimated(0); // provided by duScroll library
            // the offset is how many pixels from window top
        }

        // Init the watcher
        $scope.$watch(function () {
            // watch any change in value of the success state in fbService
            // when a new pin data is returned the value changes
            return fbService.success;
        }, function (newValue, oldValue) {
            if (newValue === null) {
                return;
            }
            console.log('>>>>> Calling show now');
            ctrl.toggleShow = true;
            var showresult = angular.element(document.getElementById('showresult')); 
            ctrl.toPlace(showresult);
        });

        // Map Functions //
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
                    ctrl.clickedPolygon = null;
                    console.log("displayDivespots successful");
                    ctrl.retrievedDivespots = results.data;
                    plotOnMap(ctrl.retrievedDivespots);
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