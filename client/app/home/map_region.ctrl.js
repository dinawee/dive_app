(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl)
        .controller("ModalInstanceCtrl", ModalInstanceCtrl);

    RegionCtrl.$inject = ["$scope", "$state", "$rootScope", "MapSvc", "MapdbRouteSvc", "MapStyleSvc", "ModalService", "FlickrSvc", "fbService", "passportService", "$timeout"];

    function RegionCtrl($scope, $state, $rootScope, MapSvc, MapdbRouteSvc, MapStyleSvc, ModalService, FlickrSvc, fbService, passportService, $timeout) {
        var vm = this;

        function loadMapStyle() {
            vm.mapStyle = MapStyleSvc.loadMapStyle();
        }
        loadMapStyle();

        /* For page-slider */
        $scope.checked = null; // toggled by watcher

        vm.closeSlider = function () {
            $scope.checked = false;
        }

        // Watcher for toggle display //
        $scope.$watch(function () {
            // watch any change in value of the success state in fbService
            // when a new pin data is returned the value changes
            return fbService.success;
        }, function (newValue, oldValue) {
            // don't fire on init
            if (newValue === oldValue) {
                return;
            }
            $scope.checked = true;
        });




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
                    styles: vm.mapStyle,
                    scrollwheel: false,
                    disableDefaultUI: true,
                    zoomControl: true,
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

        // vm.isLoading = false;

        var togglePreloader = function () {
            vm.isLoading = !vm.isLoading;
        }

        $rootScope.$on("polygon clicked", function (event, data) {
            //toggle preloader
            togglePreloader();
            $timeout(togglePreloader, 85000);


            var flickrFeed = [];
            var tag = data.polyObj.divespot_name;
            //Convert to array

            console.log("tag: \n", tag);

            FlickrSvc
                .getFlickr(tag)
                .then(function (result) {
                    // console.log("Result from FlickrSvc.getFlickr: \n", result.data.photo);
                    flickrFeed = result.data.photo;
                    // console.log(flickrFeed);
                    loadModal(flickrFeed);
                })
                .catch(function (err) {
                    console.log("Error from FlickrSvc.getFlickr: \n", err);
                });

            function loadModal(flickrFeed) {
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
        console.log(polyObj);

        vm.closeModal = function (result) {
            close(result, 500);
        };

        vm.explore = function () {
            MapSvc.exploreMe(polygon, rectangle);
        }

    }; //ModalInstanceCtrl

})();//End of IIFE