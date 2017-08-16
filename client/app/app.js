(function () {
    angular
        .module("MyApp", ["ui.router", "angularModalService", "pageslide-directive", "ngAnimate"])
        .run(init);

    init.$inject = ['$transitions', '$state', 'passportService', "bookmarkService"];

    function init($transitions, $state, passportService, bookmarkService) {
        $transitions.onStart({ to: '**' },
            function (trans) {
                var nextState = trans.to(); 
                // to optimise, check local then check global 
                // pass by ref? hackable?
                // at every state, check whether user logged in - to toggle nav bar
                return passportService.getAccessToken()
                        .then(function (token) {
                            return bookmarkService.findAll(); // fetch latest bookmarks
                        })
                        .catch(function (err) {
                            if (!(nextState.authenticate)) {
                                return; // for non-protected states, go through
                            }
                            $state.transitionTo("login");
                            event.preventDefault();
                        });
            });
    }



    // create MyApp and dependencies


})();