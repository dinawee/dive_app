(function () {

    angular
        .module("MyApp")
        .service("bookmarkService", bookmarkService);

    bookmarkService.$inject = ["$http", "$state"];

    function bookmarkService($http, $state) {
        var svc = this;

        svc.selectedBookmarks;

        svc.createOne = function (fb_id) {
            body = { fb_id: fb_id };
            $http.post('/api/bookmarks', body)
                .then(function(newRecord){
                    alert('You have created a new bookmark' + JSON.stringify(newRecord));
                }).catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err)); // terminate any calling promise
                });
        }

        svc.findAll = function() {
            // use return to return the promise so controller knows its async
            return $http.get('/api/bookmarks')
                .then(function(result){
                    // the array is result.data
                    console.log('Client service result is' + JSON.stringify(result.data));
                    return result.data
                }).catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err));
                })
        }
    } // close bookmarkService

})();