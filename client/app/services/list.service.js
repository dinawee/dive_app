(function () {
    angular
        .module("MyApp")
        .service("ListService", ListService);

    ListService.$inject = ["$http"];

    function ListService($http) {
        var service = this;

        service.aToken = "EAACEdEose0cBAFKgqcDiYh7RKnZAgyPdQvVa05xwUwEKI6IG57krg4RteIKOfJdGjoYhR8IA4ycTIVrv9VvmBGNBZBQoVXVjxodv9HZAIdQiZAexvvgTyJjz3NFDAZAJ4QNEgyQlwdimUsQixvnSvV1ZA0ZCpQLpNqOO98TZBF77si6Xrs1ExyZBDE5BfDwV8sTUZD";

        service.object = {};
        service.id;

        // endpoint is GET '/list' 
        service.reloadList = function () {
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
        }; // end reloadlist
            
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



    }// end ListService 

})();