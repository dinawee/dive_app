(function () {

    /* 
        Show the current active divespot from Facebook as con.object
        + Shows bookmark actions - after every bookmark action, sync con.object
    */

    angular
        .module("MyApp")
        .controller("ShowC", ShowC);

    ShowC.$inject = ["$scope", "fbService", "$stateParams", "mailService", "bookmarkService"];

    function ShowC($scope, fbService, $stateParams, mailService, bookmarkService) {
        var con = this;

        // init composite object 
        function init() {
            con.object = {
                // from fbService
                id: "", // this is fb_id
                name: "",
                phone: "",
                cover: { source: "" },
                // from bookmarkService
                user_dive_operator_id: "",
                comment: "",
                is_visited: ""
            };
        }

        // init and toggle object when fbService returns
        $scope.$watch(function () {
            return fbService.object;
        }, function (newValue, oldValue) {
            init();
            syncObject();
        });

        // comment editing code
        con.isEditing = false;
        var commentUntouched = null;

        con.toggleEdit = function() {
            con.isEditing = !con.isEditing;
        }

        con.openEdit = function() {
            commentUntouched = con.object.comment;
            con.toggleEdit();
        }

        con.cancelEdit = function(){
            con.object.comment = commentUntouched;
            con.toggleEdit();
        }


        // after every action - call sync object
        function syncObject() {
            con.isAdded = false; // hide display first
            for (var index in bookmarkService.userBookmarks) {
                var bookmark = bookmarkService.userBookmarks[index];
                if (bookmark["dive_operator"]["fb_id"] === fbService.object.id) {
                    con.object["user_dive_operator_id"] = bookmark["user_dive_operator_id"];
                    con.object["comment"] = bookmark["comment"];
                    con.object["is_visited"] = bookmark["is_visited"]; // now undefined
                    con.isAdded = true;
                    break;
                }
            }
            // copy over fbService
            for (var key in fbService.object) {
                con.object[key] = fbService.object[key];
            }
            console.log('--->My con.object is now' + JSON.stringify(con.object));
        }

        con.create = function () {
            bookmarkService
                .createOne(con.object.id) // only one that uses fbId
                .then(function (res) {
                    syncObject();
                });
        };


        con.updateComment = function () {
            var commentObject = {
                comment: String(con.object.comment),
            }
            bookmarkService
                .updateOne(con.object.user_dive_operator_id, commentObject)
                .then(function (res) {
                    alert('You have updated your comment.');
                    syncObject();
                    con.toggleEdit();
                });
        };

        con.updateVisited = function () {
            var visitedObject = {
                is_visited: con.object.is_visited,
            }
            bookmarkService
                .updateOne(con.object.user_dive_operator_id, visitedObject)
                .then(function (res) {
                    syncObject();
                });
        };

        con.destroy = function () {
            bookmarkService
                .destroyOne(con.object.user_dive_operator_id)
                .then(function (res) {
                    syncObject();
                });
        }


        // temp email
        con.sendEmail = function () {
            mailService.sendEmail();
        };

    }; // end controller

})();