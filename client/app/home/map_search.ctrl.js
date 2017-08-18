(function () {
    angular
        .module("MyApp")
        .controller("SearchCtrl", SearchCtrl)

    SearchCtrl.$inject = ["MapSvc", "MapStyleSvc", "$state"];

    function SearchCtrl(MapSvc, MapStyleSvc, $state) {
        var vm = this;

        vm.goMap = function () {
            console.log("Hello");
            $state.go("home");
        };
    }
})();