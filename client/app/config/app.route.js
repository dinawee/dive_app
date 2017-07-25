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
                'select': {
                    templateUrl: '/app/display/select.html',
                    controller: 'SelectC as con'
                },
                'show': {
                    templateUrl: '/app/display/show.html',
                    controller: 'ShowC as con'
                }
            }
        });
        
        // set catchall URL
        $urlRouterProvider
            .otherwise('/home');

    }// close uiRouteConfig 


})();