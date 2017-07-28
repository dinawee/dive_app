(function () {
    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "dbRouteService", "$stateParams"];

    function ShowC($scope, dbRouteService, $stateParams) {
        var con = this;

        // fb definition
        con.object = {
            name: "",
            phone: "",
            cover: { source: "" },
        };

        con.initialize = function () {
            con.object = dbRouteService.object;
        };
        
        con.initialize();

        // Legacy Code - using change in $state and $stateParams
        // if ($stateParams) {
        //     dbRouteService.pingFb()
        //         .then(function (result) {
        //             con.object = dbRouteService.object;
        //         })
        //         .catch(function (err) {
        //             console.log(err);
        //         });
        // }


    }; // end controller

})();