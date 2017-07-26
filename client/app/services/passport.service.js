(function () {

    angular
        .module("MyApp")
        .service("passportService", passportService);

    passportService.$inject = ["$http"];

    function passportService($http) {
        var svc = this;

        // only the server knows if the user is logged in
        svc.isUserAuth = function () {
            return $http.get('/user/auth')
                .then(function (result) {
                    console.log('The auth result is ' + result.data);
                    return result.data
                })
                .catch(function (err) {
                    console.log(err);
                })
        }; // close isAuth 
        /*
        
            AKAN DATING 
    
        */

    } // close passportService




})();