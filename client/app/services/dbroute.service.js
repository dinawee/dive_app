(function () {
    angular
        .module("MyApp")
        .service("dbRouteService", dbRouteService);

    dbRouteService.$inject = ["$http"];

    function dbRouteService($http) {
        var service = this;

        service.aToken = "EAACEdEose0cBAL2tGZCReQCpzpCwFdwGPemK7HvdyqAsfInPHCCCY4t9MCgjrhlZCq7ZBemZAbuxx98u5kMTTqZAeGJx4bPNlV5Iz5k4zZC2eJEAfHWwKRPxclMqMvDLYLZCo9CE2tbdi7pnDyr2QqcUcCxZAoxwcZB8wCuqIEKlZBpXZCj8DfLgOqr2zOWtYQYXosZD";

        service.object = {};
        service.id;

        // endpoint is GET '/list' 
        service.retrieveDiveOperators = function () {
            console.log('Now retrieving latest list from server');
            return $http.get('/api/diveoperators')
                .then(function (result) {
                    console.log("Result.data returns >>>>");
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


        service.pingFb = function () {
            var id = service.id;
            console.log(`Now pinging https://graph.facebook.com/v2.9/${id} `);

            return $http({
                method: 'GET',
                url: `https://graph.facebook.com/v2.9/${id}`,
                params: {
                    access_token: service.aToken,
                    type: 'page',
                    fields: 'id, name, phone, cover, about'
                }
            }
            )// result NOT returned as string, unlike server side call
                .then(function (result) {
                    console.log(`Query was successful to ${id}`);
                    service.object = result.data;
                    console.log(JSON.stringify(service.object));
                    if (!service.object.cover) {
                        service.object.cover = { source: "initial" };
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }; // end pingFb



    }// end dbRouteService 

})();