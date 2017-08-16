(function () {

    /*
        Holds master copy of user bookmarks
        After every action, get latest userBookmarks
    */

    angular
        .module("MyApp")
        .service("bookmarkService", bookmarkService);

    bookmarkService.$inject = ["$http", "$state"];

    function bookmarkService($http, $state) {
        var svc = this;

        svc.userBookmarks = [];

        svc.createOne = function (fb_id) {
            body = { fb_id: fb_id };
            return $http.post('/api/bookmarks', body)
                .then(function(res){
                    console.log('You have created' + res.data);
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


        svc.updateOne = function(id, changeObject) {
            return $http.put('api/bookmarks/' + id, changeObject)
                .then(function (res) {
                    console.log('Update Result is' + res.data);
                })
                .then(function () {
                    return svc.findAll()
                })
                .catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err)); // terminate any calling promise
                })
        }

        svc.destroyOne = function (id) {
            return $http.delete('/api/bookmarks/' + id)
                .then(function(res){
                    console.log('Destroy result is' + JSON.stringify(res));
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

        svc.findAll = function() {
            return $http.get('/api/bookmarks')
                .then(function(result){
                    console.log('Client service result is' + JSON.stringify(result.data));
                    svc.userBookmarks = result.data;
                    return result.data
                })
                .catch(function (err) {
                    alert('You are not logged in');
                    $state.go('login');
                    throw (JSON.stringify(err));
                })
        }
    } // close bookmarkService

})();