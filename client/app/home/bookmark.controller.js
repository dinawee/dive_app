(function () {
    angular
        .module("MyApp")
        .controller("BookmarkC", BookmarkC);

    BookmarkC.$inject = ["bookmarkService", "$scope"];

    function BookmarkC(bookmarkService, $scope) {
        var con = this;

        var selectedBookmarks = [];

        con.initialize = function () {
            bookmarkService.findAll()
                .then(function (result) {
                    con.selectedBookmarks = result;
                });
        };
        con.initialize(); // will not complete until the promise finishes

        // $scope.$watch( function () {
        //     return bookmarkService.selectedBookmarks;
        // }, function (newValue, oldValue) {
        //     console.log('The old value is' + oldValue);
        //     console.log('The new value is' + newValue);
        //    con.selectedBookmarks = bookmarkService.selectedBookmarks;
        // });

    }; // end controller

})();