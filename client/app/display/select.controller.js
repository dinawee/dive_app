(function (){
    angular
        .module("MyApp")
        .controller("SelectC", SelectC);
    
    SelectC.$inject = ["$scope", "ListService"];

    function SelectC($scope, ListService) {
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
            ListService.reloadList()
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
            ListService.getSelected(con.selected);
            console.log('The new value in the Service is now' + ListService.selected());
        });


        // con.select = function () {
        //     ListService.getSelected(con.selected);
        // }

    
    }; // end controller

})();