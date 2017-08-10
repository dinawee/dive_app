(function () {
    angular
        .module("MyApp")
        .controller("SelectC", SelectC);

    SelectC.$inject = ["$scope", "fbService", "$state", "passportService"];

    function SelectC($scope, fbService, $state, passportService) {
        var con = this;

        con.list; // initialize below
        con.id = "None";

        // don't change con.object def - ties with FB object
        con.object = {
            name: "initial",
            phone: "initial",
            cover: { source: "initial" },
        };

        // init
        con.initialize = function () {
            fbService.retrieveDiveOperators()
                .then(function (result) {
                    con.list = result;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        con.initialize();

        /* 
            LEGACY FUNCTIONS
            NOW CALLED BY MAP SERVICE 
            **************************
        
        */
        
        con.select = function () {
            fbService.getSelected(con.id);
            console.log('The pin you selected has FB ID of: ' + fbService.selected());
        };

        con.gothere = function () {
            alert('0. Need a pre-check \n1. Need to show/ hide login/ logout - how does Ken do it? \n 2. if not defined, will insert null values' );
            con.select();
            
            passportService.getAccessToken()
                .then(function(aToken){
                    return fbService.pingFb(aToken)
                })
                .then(function(result){
                    $state.go('show'); 
                })
                .catch(function(err){
                    alert('Please log in')
                    console.log('The err is ' + JSON.stringify(err));
                    $state.go('login');
                });
        }// close gothere()


    }; // end controller

})();


// $watch
// $scope.$watch('con.selected', function(newValue, oldValue){
//     console.log('The new value is' + newValue);
//     fbService.getSelected(con.selected);
//     console.log('The new value in the Service is now' + fbService.selected());
// });