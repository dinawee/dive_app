(function () {
    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "dbRouteService", "$stateParams"];

    function ShowC($scope, dbRouteService, $stateParams) {
        var con = this;

        // fb definition
        con.object = {
            name: "initial",
            phone: "initial",
            cover: { source: "initial" },
        };


        // $watch - auto watch it for automatic pinging of FB
        $scope.$watch(function(){
            return dbRouteService.id;
        }
        , function(newValue, oldValue){
            dbRouteService.pingFb()
                .then(function (result) {
                    con.object = dbRouteService.object;
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        /* Steps 
        Debate on the best method - $watch, $emit etc - they didnt include $transitions
        http://www.codelord.net/2015/05/04/angularjs-notifying-about-changes-from-services-to-controllers/
        
        1. Create dynamic ui-sref link for each POINT or NG-REPEAT 
        // $watch on the selector side - must use $scope 
        You must inject it into your $inject array: https://stackoverflow.com/questions/22898927/injecting-scope-into-an-angular-service-function
        Here's how to use it:
        https://www.bennadel.com/blog/2852-understanding-how-to-use-scope-watch-with-controller-as-in-angularjs.htm
        As per above link, it's safer to $watch a function's value
        https://coderwall.com/p/dhgljg/angularjs-watch-for-changes-in-a-service
        

        1A. Pass the ID param over to the service 
        1B. You can right run service.pingFb()

        2. Reload the 'show' controller 
        // Listener on the display side
        Old method - $stateChangeSuccess
        https://stackoverflow.com/questions/31741275/angularjs-listen-to-state-change-event
        New method - $transitions


        // optional - run service.pingFb() here

        */


        /* 
        1) You can nest states - dont inherit scope properties
        // define a new state with 'dot' notation
        // when a state is active all the parent states are implicitly active too
        .state('shows.detail', {
            url: '/detail/:id',
            templateUrl: '/show-details.html',
            controller: 'ShowDetailC as con'
        })

        // in the HTML reflect the nesting in parent page with a new 
        // <div ui-view="shows.detail">

            
        2) You can nest views - inherit scope properties
        // one state can have mutliple Views
        // within the params object, define a VIEWS property, which is an object
        // when you define this object, the states templateUrl etc. will be ignored
        // define each one within the view 



        Revision 

        // view 
        // <a ui-sref="show({ id: '123' })"> ID 123 </a>

        // notice the ui-sref points to shows.detail, ie the nested route '/detail/:id'
        // the fake route is called by the Service and can pass the ID along as bodyParams
    
        // <li ui-sref-active="selected" ng-repeat = "eachShow in con.shows">
        //      <a ui-sref"shows.detail ({ id: eachShow.id } )"> {{ eachShow.name }} </a>
        // </li>

        // ui-sref-active adds CSS classes to the selected element in ng-repeat

        */



        // Legacy Code - using change in $state and $stateParams
        if ($stateParams) {
            console.log("The state params is now >>>>> " + JSON.stringify($stateParams));
            dbRouteService.pingFb()
                .then(function (result) {
                    con.object = dbRouteService.object;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }


        // how does the control here KNOW that the service is updated
        // without a change of state OMG 


    }; // end controller

})();