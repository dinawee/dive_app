(function () {
    angular
        .module("MyApp")
        .config(uiRouteConfig)

    uiRouteConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

    function uiRouteConfig($stateProvider, $urlRouterProvider) {
        // .state takes 2 params - state name string & object
        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    'map': {
                        templateUrl: '/app/home/map.html',
                        controller: 'MapCtrl as ctrl'
                    },
                    'select': {
                        templateUrl: '/app/home/select.html',
                        controller: 'SelectC as con'
                    },
                    'show': {
                        templateUrl: '/app/home/show.html',
                        controller: 'ShowC as con'
                    }
                }
            })
            .state('show', {
                url: '/show',
                views: {
                    'show': {
                        templateUrl: '/app/home/show.html',
                        controller: 'ShowC as con'
                    }
                }
            })
            .state("prepmap", {
                url: "/map",
                views: {
                    "prepmap": {
                        templateUrl: "app/prep/prepmap.html",
                        controller: "PrepMapCtrl as ctrl"
                    }
                }
            });

        // set catchall URL
        $urlRouterProvider
            .otherwise('/home');

    }// close uiRouteConfig 


})();