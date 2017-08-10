(function () {
    angular
        .module("MyApp")
        .controller("BookmarkC", BookmarkC);

    BookmarkC.$inject = ["bookmarkService", "$scope", "passportService", "fbService"];

    function BookmarkC(bookmarkService, $scope, passportService, fbService) {
        var con = this;

        con.selectedBookmarks = [];
        con.toggleShow = null; // display-hide injected show view


        // Init 
        con.initialize = function () {
            bookmarkService.findAll()
                .then(function (result) {
                    con.selectedBookmarks = result;
                    con.toggleShow = false; // don't display 
                });
        };
        con.initialize(); // will not complete until the promise finishes


        // getOneBookMark invokes the fbService function 
        con.getOneBookmark = function (fb_id) {
            fbService.getSelected(fb_id);
            return passportService.getAccessToken()
                .then(function (aToken) {
                    return fbService.pingFb(aToken)
                })
                .then(function (result) {
                    con.toggleShow = true;
                    console.log('Showed bookmark');
                })
                .catch(function (err) {
                    alert('Takeme function says: You are not logged in');
                    $state.go('login');
                });
        }



        // $scope.$watch( function () {
        //     return bookmarkService.selectedBookmarks;
        // }, function (newValue, oldValue) {
        //     console.log('The old value is' + oldValue);
        //     console.log('The new value is' + newValue);
        //    con.selectedBookmarks = bookmarkService.selectedBookmarks;
        // });

    }; // end controller

})();