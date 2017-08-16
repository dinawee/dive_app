(function () {
    angular
        .module("MyApp")
        .config(uiRouteConfig)

    uiRouteConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function uiRouteConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        // .state takes 2 params - state name string & object

        $stateProvider
            .state('search', {
                url: '/',
                views: {
                    'mapsearch': {
                        templateUrl: '/app/home/map_search.html',
                        controller: 'SearchCtrl as ctrl'
                    }
                },
            })
            .state('login', {
                url: '/login',
                views: {
                    'login': {
                        templateUrl: '/app/login/login.html',
                        controller: 'LoginC as con'
                    }
                }
            })
            .state('bookmark', {
                url: '/user/bookmark',
                authenticate: true,
                views: {
                    'bookmark': {
                        templateUrl: 'app/home/bookmark.html',
                        controller: 'BookmarkC as con'
                    },
                    'show@bookmark': {
                        templateUrl: '/app/home/show.html',
                        controller: 'ShowC as con'
                    }
                }
            })
            .state('home', {
                url: '/home',
                views: {
                    'mapcountry': {
                        templateUrl: '/app/home/map_country.html',
                        controller: 'CountryCtrl as ctrl'
                    }
                },
            })
            .state("prepmap", {
                url: "/map",
                views: {
                    "prepmap": {
                        templateUrl: "app/prep/prepmap.html",
                        controller: "PrepMapCtrl as ctrl"
                    }
                }
            })
            .state("mapregion", {
                url: "/mapregion",
                views: {
                    "mapregion": {
                        templateUrl: "app/home/map_region.html",
                        controller: "RegionCtrl as vm"
                    },
                    'show@mapregion': {
                        templateUrl: '/app/home/show.html',
                        controller: 'ShowC as con'
                    }
                }
            });

        // set catchall URL - default URL 
        $urlRouterProvider.otherwise('/');

        // $locationProvider.html5Mode(true);

    }// close uiRouteConfig 


})();