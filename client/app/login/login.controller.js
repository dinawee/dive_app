(function() {
  angular
    .module('MyApp')
    .controller('LoginC', LoginC);

  LoginC.$inject = [ 'passportService', '$state' ];

  function LoginC(passportService, $state) {
    var con = this;

  }// close controller

})();