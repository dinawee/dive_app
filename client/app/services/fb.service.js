(function () {
    angular
        .module("MyApp")
        .service("fbService", fbService);

    fbService.$inject = ["$http"];

    function fbService($http) {
        var service = this;

        service.object = {};
        service.success = null;
        service.id;
        

        // setter method - getSelected
        service.getSelected = function (fb_id) {
            service.id = fb_id;
        }

        // getter method - selected 
        service.selected = function () {
            return service.id;
        }

        service.pingFb = function (userToken) {
            var id = service.id;
            console.log(`Now pinging https://graph.facebook.com/v2.9/${id} `);

            return $http({
                method: 'GET',
                url: `https://graph.facebook.com/v2.9/${id}`,
                params: {
                    access_token: userToken,
                    type: 'page',
                    fields: 'id, name, phone, cover, about'
                }
            }
            )// result NOT returned as string, unlike server side call
                .then(function (result) {
                    console.log(`Query was successful to ${id}`);
                    service.object = result.data;
                    console.log('The return from FB is ' + JSON.stringify(service.object));
                    service.success = service.id;
                })
                .catch(function (err) {
                    console.log("The error for calling FB is " + err);
                });
        }; // end pingFb



    }// end fbService 

})();