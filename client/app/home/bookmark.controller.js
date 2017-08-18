(function () {

    /* 
        Shows the entire listing of bookmarks 
        View only changes when the number of bookmarks change (array length) - create or destroy
        Cannot edit the title
    */


    angular
        .module("MyApp")
        .controller("BookmarkC", BookmarkC);

    BookmarkC.$inject = ["bookmarkService", "$scope", "passportService", "fbService", "$timeout"];

    function BookmarkC(bookmarkService, $scope, passportService, fbService, $timeout) {
        var con = this;

        con.userBookmarks = [];
        con.toggleShow = null; // display-hide injected show view


        // Init done by watcher, when fire the first time
        // Controller state always changes as triggered by bookmarkService
        // Is this a deep watcher?
        $scope.$watch(function () {
            return bookmarkService.userBookmarks.length;
        }, function (newValue, oldValue) {
            con.userBookmarks = bookmarkService.userBookmarks;
            con.toggleShow = false;
        });

        // getOneBookMark invokes the fbService function 
        con.getOneBookmark = function (fb_id) {
            fbService.getSelected(fb_id);
            return passportService.getAccessToken()
                .then(function (aToken) {
                    return fbService.pingFb(aToken);
                })
                .then(function (result) {
                    con.toggleShow = true;
                })
                .catch(function (err) {
                    alert('Bookmark controller: You are not logged in');
                    $state.go('login');
                });
        }
    }; // end controller

})();