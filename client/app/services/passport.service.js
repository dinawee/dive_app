(function () {

    angular
        .module("MyApp")
        .service("passportService", passportService);

    passportService.$inject = ["$http"];

    function passportService($http) {
        var svc = this;

        // only the server knows if the user is logged in
        svc.getAccessToken = function () {
            return $http.get('/user/auth')
                .then(function (result) {
                    console.log('The access token is ' + result.data);
                    return result.data
                }) // returns the access_token, or if not "false"
        }; // close isAuth 
        /*
        
            AKAN DATING 
    
        */

    } // close passportService




})();