(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl)
        .value('duScrollDuration', 1200);

    RegionCtrl.$inject = ["$scope", "$document", "MapSvc", "MapdbRouteSvc", "fbService", "passportService"];

    function RegionCtrl($scope, $document, MapSvc, MapdbRouteSvc, fbService, passportService) {
        var ctrl = this;

         



        function init () {
            // Toggle display - hide of injected show view 
            // toggled by watching from fbService, see below
            ctrl.toggleShow = false; 
        }
        init();


        // Scroll Functions // 
        ctrl.toPlace = function(place){
            var offset = -300; // scroll 300 px lower than element to be safe
            $document.scrollToElementAnimated(place, offset); // provided by duScroll library
        }

        ctrl.toShowMap = function(){
            $document.scrollTopAnimated(0); // provided by duScroll library
            // the offset is how many pixels from window top
        }


       // Watcher for toggle display //
        $scope.$watch(function () {
            // watch any change in value of the success state in fbService
            // when a new pin data is returned the value changes
            return fbService.success;
        }, function (newValue, oldValue) {
            // equality prevents it from firing when init
            if (newValue === oldValue) {
                return;
            }
            console.log('Calling toggle');
            ctrl.toggleShow = true;
            var showresult = angular.element(document.getElementById('showresult')); 
            ctrl.toPlace(showresult);
        });


        // Map Functions, called on init //
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