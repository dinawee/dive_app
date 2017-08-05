(function () {

    angular
        .module("MyApp")
        .service("passportService", passportService);

    passportService.$inject = ["$http", "$state"];

    function passportService($http, $state) {
        var svc = this;

        // only the server knows if the user is logged in
        svc.getAccessToken = function () {
            return $http.get('/user/auth')
                .then(function (result) {
                    console.log('The access token is ' + result.data);
                    return result.data
                })
                .catch(function (err) {
                    alert('You are not logged in');
                    console.log("The passport service error is " + JSON.stringify(err));
                    $state.go('login');
                    throw 'You are not logged in' // no need catch, for caller to handle
                }) // returns the access_token, or if not "false"
        };

        /*
        
            AKAN DATING 
    
        */

    } // close passportService




})();