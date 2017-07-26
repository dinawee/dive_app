(function () {
    angular
        .module("MyApp")
        .service("dbRouteService", dbRouteService);

    dbRouteService.$inject = ["$http"];

    function dbRouteService($http) {
        var service = this;

        service.aToken = "EAACEdEose0cBAJQ9ftARTHFxPBljMsZCUxpMCK1KoeOnl9ZC6E0MKQUKaX2sjbwFTeaHMeGSTDRoa0cL11CS0K0PPOyWkW38MHgWZBFOhhsDRdNgaOJ3QKzGMoldtggQbO3dFAd1iHCN8ZAlUZAnXBt6dHgPyXVEJfPLfxBA3qHXcgEy1g8OmD0pqUJZAksQgZD";

        service.object = {};
        service.id;

        // endpoint is GET '/list' 
        service.retrieveDiveOperators = function () {
            console.log('Now retrieving latest list from server');
            return $http.get('/api/diveoperators')
                .then(function (result) {
                    console.log("Result.data is >>>>>");
                    console.log(JSON.stringify(result.data));
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
            )
                // result NOT returned as string, unlike server side call
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