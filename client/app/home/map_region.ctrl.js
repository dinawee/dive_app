(function () {
    angular
        .module("MyApp")
        .controller("RegionCtrl", RegionCtrl)
        .controller("ModalInstanceCtrl", ModalInstanceCtrl);

    RegionCtrl.$inject = ["MapSvc", "MapdbRouteSvc", "MapStyleSvc", "$rootScope", "ModalService", "$state", "FlickrSvc"];

    function RegionCtrl(MapSvc, MapdbRouteSvc, MapStyleSvc, $rootScope, ModalService, $state, FlickrSvc) {
        var vm = this;

        function loadMapStyle() {
            vm.mapStyle = MapStyleSvc.loadMapStyle();
        }
        loadMapStyle();

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
        console.log(FlickrFeed);

        vm.closeModal = function (result) {
            close(result, 500);
        };

        vm.explore = function () {
            MapSvc.exploreMe(polygon, rectangle);
        }

    }; //ModalInstanceCtrl

})();//End of IIFE