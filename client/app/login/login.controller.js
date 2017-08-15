(function () {
    angular
        .module('MyApp')
        .controller('LoginC', LoginC);

    LoginC.$inject = ["$scope", "passportService", "$state", "bookmarkService"];

    function LoginC($scope, passportService, $state, bookmarkService) {
        var con = this;

        con.isLoggedIn = null;
        con.bookmarkCnt = 0;

        // init with watchers
        $scope.$watch(function () {
            return passportService.isLoggedIn;
        }, function (newValue, oldValue) {
            if (newValue === true) {
                con.isLoggedIn = true;
                return;
            }
            con.isLoggedIn = false;
        });

        $scope.$watch(function () {
            return bookmarkService.userBookmarks.length;
        }, function (newValue, oldValue) {
            con.bookmarkCnt = newValue;
        });

        con.logout = function () {
            passportService.logout();
        }


    }// close controller

})();

