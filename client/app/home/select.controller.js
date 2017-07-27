(function () {
    angular
        .module("MyApp")
        .controller("SelectC", SelectC);

    SelectC.$inject = ["$scope", "dbRouteService", "$state", "user"];

    function SelectC($scope, dbRouteService, $state, user) {
        var con = this;

        con.list; // initialize below
        con.id = "None";
        con.user = user;

        // don't change con.object def - ties with FB object
        con.object = {
            name: "initial",
            phone: "initial",
            cover: { source: "initial" },
        };

        // init
        con.initialize = function () {
            dbRouteService.retrieveDiveOperators()
                .then(function (result) {
                    con.list = result;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        con.initialize();

        /*
            FUNCTIONS FOR DINA 
        */
        con.select = function () {
            dbRouteService.getSelected(con.id);
            console.log('The new value in the Service is now' + dbRouteService.selected());
        };

        con.gothere = function () {
            if (!user) {
                // nothing happens because it will return true all the time
            }
            alert('Function not protected by login now, con.user always exists because now passportService.isUserAuth() returns true all the time\n\n AKAN DATANG\n 1. pending redirect function in select.controller to login page. \n 2. auth.js - double check the FindOrCreate options, will it insert UNDEFINED values?');
            con.select();
            dbRouteService.pingFb()
                .then(function(result){
                    $state.go('show'); 
                })
                .catch(function(err){
                    console.log(err);
                });

        }


    }; // end controller

})();


// $watch
// $scope.$watch('con.selected', function(newValue, oldValue){
//     console.log('The new value is' + newValue);
//     dbRouteService.getSelected(con.selected);
//     console.log('The new value in the Service is now' + dbRouteService.selected());
// });