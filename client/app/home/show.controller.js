(function () {
    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "dbRouteService", "$stateParams", "mailService", "bookmarkService"];

    function ShowC($scope, dbRouteService, $stateParams, mailService, bookmarkService) {
        var con = this;

        // fb definition - next time define the whole thing here
        con.object = {
            id: "",
            name: "",
            phone: "",
            cover: { source: "" },
        };

        con.initialize = function () {
            con.object = dbRouteService.object;
        };
        
        con.initialize();

        // temp email
        con.sendEmail = function () {
            mailService.sendEmail();
        };

        con.bookmark = function() {
            bookmarkService.createOne(con.object.id);
        };

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