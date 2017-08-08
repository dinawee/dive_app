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
                    console.log("map_region.ctrl --> retrieveDiveOperators successful");
                    MapSvc.retrieveDiveOperators(results);
                })
                .catch(function (err) {
                    console.log("Error: \n" + (err));
                })
        };

        vm.flickrFeed = [];

        $rootScope.$on("polygon clicked", function (event, data) {
            console.log(data.polyObj);
            console.log(data.polygon);
            console.log(data.rectangle);

            FlickrSvc
                .loadPictures()
                .then(function (result) {
                    vm.flickrFeed = result.data.photos.photo;
                    console.log(vm.flickrFeed);
                })
                .catch(function (err) {
                    console.log(err);
                });

            ModalService
                .showModal({
                    templateUrl: "ctry-modal-template.html",
                    controller: "ModalInstanceCtrl",
                    inputs: {
                        polyObj: data.polyObj,
                        polygon: data.polygon,
                        rectangle: data.rectangle,
                    },
                })
                .then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        console.log(result);
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        });

        var loadDivespotPics = function () {

        }
    };//End RegionCtrl

    /*ModalInstanceCtrl*/

    function ModalInstanceCtrl($scope, polyObj, polygon, rectangle, close, MapSvc) {
        var vm = $scope;

        console.log(polyObj);
        console.log(polygon);
        console.log(rectangle);

        vm.closeModal = function (result) {
            console.log(result);
            close(result, 500);
        };

        vm.explore = function () {
            console.log("Explore Me!!");
            MapSvc.exploreMe(polygon, rectangle);
        }

        vm.divespotDetails = polyObj;



    }; //ModalInstanceCtrl

})();//End of IIFE