(function () {
    angular
        .module("MyApp")
        .config(uiRouteConfig)

    uiRouteConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

    function uiRouteConfig($stateProvider, $urlRouterProvider) {
        // .state takes 2 params - state name string & object
        $stateProvider
            .state('login',{
                url: '/login',
                views: {
                    'login' : {
                        templateUrl: '/app/login/login.html',
                        controller: 'LoginC as con'
                    }
                }
            })
            .state('bookmark',{
                url: '/user/bookmark',
                views: {
                    'bookmark' : {
                        templateUrl: 'app/home/bookmark.html',
                        controller: 'BookmarkC as con'
                    }
                }
            })
            .state('home', {
                url: '/home',
                views: {
                    'mapcountry': {
                        templateUrl: '/app/home/map_country.html',
                        controller: 'MapCtrl as ctrl'
                    },
                    // 'select': {
                    //     templateUrl: '/app/home/select.html',
                    //     controller: 'SelectC as con'
                    // },
                    'show': {
                        templateUrl: '/app/home/show.html',
                        controller: 'ShowC as con'
                    }
                }, 
                // resolve: {
                //     user : function(passportService) {
                //         return passportService.getAccessToken() 
                //         // this should hold onto resolve until getAccessToken() returns
                //     }
                // }
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
            })
            .state("mapregion", {
                url: "/mapregion",
                views: {
                    "mapregion": {
                        templateUrl: "app/home/map_region.html",
                        controller: "RegionCtrl as ctrl"
                    }
                }
            });

        // set catchall URL
        $urlRouterProvider
            .otherwise('/home');

    }// close uiRouteConfig 


})();