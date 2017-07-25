(function (){
    angular
        .module("MyApp")
        .controller("SelectC", SelectC);
    
    SelectC.$inject = ["$scope", "dbRouteService"];

    function SelectC($scope, dbRouteService) {
        var con = this;

        //get object 
        con.list; // initialize below
        con.selected = "None";
        // fb definition
        con.object = {
            name: "initial",
            phone: "initial",
            cover: { source : "initial"},
        };

        // init
        con.initialize = function() {
            dbRouteService.retrieveDiveOperators()
                .then(function(result){
                    con.list = result;
                    console.log("Con.list is now >>>>");
                    console.log(JSON.stringify(result));
                    console.log('Type is ' + typeof result);
                })
                .catch(function(err){
                    console.log(err);
                });
        }
        con.initialize();

        // $watch
        $scope.$watch('con.selected', function(newValue, oldValue){
            console.log('The new value is' + newValue);
            dbRouteService.getSelected(con.selected);
            console.log('The new value in the Service is now' + dbRouteService.selected());
        });


        // con.select = function () {
        //     dbRouteService.getSelected(con.selected);
        // }

    
    }; // end controller

})();