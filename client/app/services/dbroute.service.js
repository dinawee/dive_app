(function () {
    angular
        .module("MyApp")
        .service("dbRouteService", dbRouteService);

    dbRouteService.$inject = ["$http"];

    function dbRouteService($http) {
        var service = this;

        service.object = {};
        service.id;

        // endpoint is GET '/list' 
        service.retrieveDiveOperators = function () {
            console.log('Now retrieving latest list from server');
            return $http.get('/api/diveoperators')
                .then(function (result) {
                    return result.data;
                })
                .catch(function (err) {
                    console.log(err);
                })
        }; // end retrieveDiveOperators
            
        
        /*
        $watch stuff  
        */
        // setter method - getSelected
        service.getSelected = function (id_param) {
            service.id = id_param;
        }

        // getter method - selected 
        service.selected = function () {
            return service.id;
        }


        service.pingFb = function (userToken) {
            if (userToken === "false"){
                throw 'You are not authenticated';
            }
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
                })
                .catch(function (err) {
                    console.log(err);
                });
        }; // end pingFb



    }// end dbRouteService 

})();