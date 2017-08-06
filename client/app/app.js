(function () {
    angular
        .module("MyApp", ["ui.router", "duScroll"])
        .run(init);

    init.$inject = ['$transitions', '$state', 'passportService', "bookmarkService"];

    function init($transitions, $state, passportService, bookmarkService) {
        $transitions.onStart({ to: '**' },
            function (trans) {
                var nextState = trans.to(); // is this pass by reference?
                // check if user is logged in; they will have accessToken
                if (nextState.authenticate) {
                    return passportService.getAccessToken()
                        .then(function (token) {
                            return bookmarkService.findAll();
                        })
                        .catch(function (err) {
                            if (nextState.authenticate === "home") {
                                return; // allow default to go through still
                            }
                            $state.transitionTo("login");
                            event.preventDefault();
                        });
                }
            });
    }



    // create MyApp and dependencies


})();