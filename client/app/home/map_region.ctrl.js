(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl)
        .controller("ModalInstanceCtrl", ModalInstanceCtrl)
        .value('duScrollDuration', 1200);

    RegionCtrl.$inject = ["$scope", "$document", "MapSvc", "MapdbRouteSvc", "MapStyleSvc", "$rootScope", "ModalService", "$state", "FlickrSvc", "fbService", "passportService"];

    function RegionCtrl($scope, $document, MapSvc, MapdbRouteSvc, MapStyleSvc, $rootScope, ModalService, $state, FlickrSvc, fbService, passportService) {
        var vm = this;

        function loadMapStyle() {
            vm.mapStyle = MapStyleSvc.loadMapStyle();
        }
        loadMapStyle();


/*        
        function init() {
            // Toggle display - hide of injected show view 
            // toggled by watching from fbService, see below
            vm.toggleShow = false;
        }
        init();

        // Scroll Functions // 
        vm.toPlace = function (place) {
            var offset = -300; // scroll 300 px lower than element to be safe
            $document.duScrollToElementAnimated(place, offset); // provided by duScroll library
        }

        vm.toShowMap = function () {
            $document.duScrollTopAnimated(0); // provided by duScroll library
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
            vm.toggleShow = true;
            var showresult = angular.element(document.getElementById('showresult'));
            // vm.toPlace(showresult);
        });

*/

        // Map Functions, called on init //
        var plotOnMap = function (retrievedResults) {
            for (var i in retrievedResults) {
                MapSvc
                    .createPoly(retrievedResults[i]);
            }
        };

        var displayDivespots = function (clickedPolygon) {
            MapdbRouteSvc
                .displayDivespots(clickedPolygon.polyObj.region_id)
                .then(function (results) {
                    vm.clickedPolygon = null;
                    vm.retrievedDivespots = results.data;
                    plotOnMap(vm.retrievedDivespots);
                })
                .catch(function (err) {
                    console.log("Error from RegionCtrl : displayDivespots: \n", err);
                });
        }

        retrieveClickedPolygon();
        function retrieveClickedPolygon() {
            var clickedPolygon = MapSvc.clickedPolygon;
            if (!clickedPolygon) {
                $state.go("home");
            } else {
                //Setting up Map variables
                var mapName = "selectedregion";
                var mapOptions = {
                    zoom: 8,
                    center: clickedPolygon.polyBoundsCenter,
                    bounds: clickedPolygon.rectangle.getBounds(),
                    scrollwheel: false,
                    styles: vm.mapStyle,
                }
            }
            var map = MapSvc.initMap(mapName, mapOptions);
            displayDivespots(clickedPolygon);
        };

        retrieveDiveOperators();
        function retrieveDiveOperators() {
            MapdbRouteSvc
                .retrieveDiveOperators()
                .then(function (results) {
                    MapSvc.retrieveDiveOperators(results);
                })
                .catch(function (err) {
                    console.log("Error from RegionCtrl : retrieveDiveOperators: \n", err);
                })
        };

        $rootScope.$on("polygon clicked", function (event, data) {
            var flickrFeed = [];
            var tag = data.polyObj.divespot_name;
            //Convert to array

            console.log("tag: \n", tag);

            FlickrSvc
                .getFlickr(tag)
                .then(function (result) {
                    // console.log("Result from FlickrSvc.getFlickr: \n", result.data.photo);
                    flickrFeed = result.data.photo;
                    console.log(flickrFeed);
                    loadModal(flickrFeed);
                })
                .catch(function (err) {
                    console.log("Error from FlickrSvc.getFlickr: \n", err);
                });

            function loadModal(flickrFeed) {
                console.log(ModalService.showModal);
                ModalService
                    .showModal({
                        templateUrl: "ctry-modal-template.html",
                        controller: "ModalInstanceCtrl",
                        inputs: {
                            FlickrFeed: flickrFeed,
                            polyObj: data.polyObj,
                            polygon: data.polygon,
                            rectangle: data.rectangle,
                        },
                    })
                    .then(function (modal) {
                        modal.element.modal();
                        console.log(modal);
                        modal.close.then(function (result) {
                            console.log("Result from ModalService.showModal: \n", result);
                        });
                    })
                    .catch(function (err) {
                        console.log("Error from ModalService.showModal: \n", err);
                    });
            };

        });

    };//End RegionCtrl

    /*ModalInstanceCtrl*/

    function ModalInstanceCtrl($scope, FlickrFeed, polyObj, polygon, rectangle, close, MapSvc) {
        var vm = $scope;

        vm.divespotDetails = polyObj;
        vm.flickrFeed = FlickrFeed;
        console.log(FlickrFeed);

        vm.closeModal = function (result) {
            close(result, 500);
        };

        vm.explore = function () {
            MapSvc.exploreMe(polygon, rectangle);
        }

    }; //ModalInstanceCtrl

})();//End of IIFE