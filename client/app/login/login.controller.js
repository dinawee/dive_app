(function () {
    angular
        .module('MyApp')
        .controller('LoginC', LoginC);

    LoginC.$inject = ["$scope", "passportService", "$state"];

    function LoginC($scope, passportService, $state) {
        var con = this;

        con.isLoggedIn = false;

        con.login = function () {
            console.log('Logging in now');
            passportService.login();
        }

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


    }// close controller

})();

