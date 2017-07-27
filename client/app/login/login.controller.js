(function() {
  angular
    .module('MyApp')
    .controller('LoginC', LoginC);

  LoginC.$inject = [ 'passportService', '$state' ];

  function LoginC(passportService, $state) {
    var con = this;

    // con.user = {
    //   username: '',
    //   password: '',
    // }
    // con.msg = '';

    // con.login = login;

    // function login() {
    //   passportService.login(con.user)
    //     .then(function(result) {
    //       $state.go('home');
    //       return true;
    //     })
    //     .catch(function(err) {
    //       con.msg = 'Invalid Username or Password!';
    //       con.user.username = con.user.password = '';
    //       return false;
    //     });
    // }

  }// close controller

})();