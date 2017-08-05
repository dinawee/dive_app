(function () {
    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "fbService", "$stateParams", "mailService", "bookmarkService"];

    function ShowC($scope, fbService, $stateParams, mailService, bookmarkService) {
        var con = this;

        // fb definition - next time define the whole thing here
        con.object = {
            id: "",
            name: "",
            phone: "",
            cover: { source: "" },
        };

        /* when you init bookmarks controller the show value should be some default

        */
        
        $scope.$watch( function () {
            return fbService.object;
        }, function (newValue, oldValue) {
            console.log('The old value is' + oldValue);
            console.log('The new value is' + newValue);
           con.object = fbService.object;
        }, true);


        // temp email
        con.sendEmail = function () {
            mailService.sendEmail();
        };

        con.bookmark = function() {
            bookmarkService.createOne(con.object.id);
        };


    }; // end controller

})();