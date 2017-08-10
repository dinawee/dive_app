(function () {
    angular
        .module('MyApp')
        .controller('LoginC', LoginC);

    LoginC.$inject = ["$scope", "passportService", "$state", "bookmarkService"];

    function LoginC($scope, passportService, $state, bookmarkService) {
        var con = this;

        con.isLoggedIn = false;

        con.bookmarks = 0;

        con.logout = function () {
            passportService.logout();
        }

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
                console.log('The old v is %d', oldValue);
                console.log('The new v is %d', newValue);
                con.bookmarks = newValue;
        });

    }// close controller

})();

