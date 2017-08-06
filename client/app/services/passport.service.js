(function () {

    angular
        .module("MyApp")
        .service("passportService", passportService);

    passportService.$inject = ["$http", "$state"];

    function passportService($http, $state) {
        var svc = this;

        svc.isLoggedIn = null;

        // tests whether person is logged in, sets user to true
        // every client side action that needs auth will check this (view protected state, callFb)
        svc.getAccessToken = function () {
            return $http.get('/user/auth')
                .then(function (result) {
                    svc.isLoggedIn = true;
                    return result.data // access_token
                })
                .catch(function (err) {
                    console.log("The passport service error is " + JSON.stringify(err));
                    svc.isLoggedIn = false;
                    throw 'You are not logged in' // throw back error to caller .catch
                }) // returns the access_token, or if not "false"
        };

        svc.logout = function () {
            return $http.get('/logout').then(function(result){
                svc.isLoggedIn = false;
                throw 'You have logged out';
                $state.go('home');
            }).catch(function(err){
                svc.isLoggedIn = false;
                throw 'You have logged out';
                $state.go('home');
            });
        };

        /*
        * Login service not used    
        * FB does not allow cross-origin requests posted from AJAX/XHR

        svc.login = function () {
            return $http.get('/oauth/facebook').then(function (result) {
                user = true;
                // fetch users bookmarks here
                $state.go('bookmark');
            }).catch(function(err){
                user = false;
                throw 'Some error logging in';
                alert('You did not manage to login, please try again');
                $state.go('login')
            });
        };

        */


    } // close passportService



})();