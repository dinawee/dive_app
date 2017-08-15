(function () {

    angular
        .module("MyApp")
        .service("bookmarkService", bookmarkService);

    bookmarkService.$inject = ["$http", "$state"];

    function bookmarkService($http, $state) {
        var svc = this;

        svc.selectedBookmarks;

        svc.userBookmarks = [];

        svc.createOne = function (fb_id) {
            body = { fb_id: fb_id };
            return $http.post('/api/bookmarks', body)
                .then(function(newRecord){
                    alert('You have created a new bookmark' + JSON.stringify(newRecord));
                })
                .then(function(){
                    return svc.findAll();
                })
                .catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err)); // terminate any calling promise
                });
        }

        svc.destroyOne = function (fb_id) {
            console.log('Client side fb_id to remove is' + fb_id);
            return $http.delete('/api/bookmarks/' + fb_id)
                .then(function(res){
                    console.log('Result JS is' + JSON.stringify(res));
                    alert('You have destroyed the bookmark');
                }).
                then(function(){
                    return svc.findAll();
                })
                .catch(function (err) {
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
                    svc.userBookmarks = result.data;
                    return result.data
                }).catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err));
                })
        }
    } // close bookmarkService

})();