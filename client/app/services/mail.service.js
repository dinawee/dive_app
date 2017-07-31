(function () {

    angular
        .module("MyApp")
        .service("mailService", mailService);

    mailService.$inject = ["$http", "$state"];

    function mailService($http, $state) {
        var svc = this;

        svc.email = {
            to: '',
            from: '',
            subject: 'Welcome to DiveApp',
            html: '<p> Hello! Welcome to DiveApp </p>'
        }

        svc.sendEmail = function() {
            $http.post('/user/email', svc.email)
                .then(function(result){
                    console.log("The result is " + result);
                    console.log("The result is " + JSON.stringify(result));
                    console.log("We have sent the email");
                })
                .catch(function(err){
                    $state.go('login');
                    throw 'You are not logged in' // terminate any calling promise
                });
        }


    } // close mailService

})();