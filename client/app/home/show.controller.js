(function () {
    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "fbService", "$stateParams", "mailService", "bookmarkService"];

    function ShowC($scope, fbService, $stateParams, mailService, bookmarkService) {
        var con = this;

        // // close property injected due to ModalService
        // con.close = close;
        
        // fb definition - next time define the whole thing here
        con.object = {
            id: "", // this is fb_id
            name: "",
            phone: "",
            cover: { source: "" },
        };

        con.isAdded = false;
        /* when you init bookmarks controller the show value should be some default

        */
        
        $scope.$watch( function () {
            return fbService.object;
        }, function (newValue, oldValue) {
            // performance problem... pls refactor
            con.isAdded = false;
            for (var index in bookmarkService.userBookmarks) {
                if (bookmarkService.userBookmarks[index]["dive_operator"]["fb_id"] === fbService.object.id){
                    con.isAdded = true;
                    break;
                }
            }
            con.object = fbService.object;
        });


        // temp email
        con.sendEmail = function () {
            mailService.sendEmail();
        };

        con.create = function() {
            bookmarkService.createOne(con.object.id);
        };

        con.destroy = function() {
            bookmarkService
                .destroyOne(con.object.id)
                .then(function(res){
                        // not sure why this doesn't update
                        con.isAdded = false;
                });
        }


    }; // end controller

})();