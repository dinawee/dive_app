(function () {
    angular
        .module("MyApp", ["ui.router"])
        .run(init);
            
        init.$inject = ['$transitions', '$state', 'passportService'];

        function init ($transitions, $state, passportService) {
            $transitions.onStart( { to: '**' }, 
                function(trans){
                    var nextState = trans.to(); // is this pass by reference?
                    // check if state has authenticate property
                    if (nextState.authenticate) { 
                        return passportService.getAccessToken()
                        .then(function(token){
                            // do nothing
                        })
                        .catch(function(err){ // 401 will return .catch immediately
                            console.log('Not authorised');
                            $state.transitionTo("login");
                            event.preventDefault();
                        });
                    }
            });
        }
    // create MyApp and dependencies


})();