'use strict';

var app = angular.module("loginApp", []);

app.controller("loginController", function ($scope, $http, $window) {

  this.email = "admin@gmail.com";
  this.password = "snowsea";

  this.onLoad = function() {

  }

  this.signIn = function() {
    console.log("signin");
    const credentials = this.email + ":" + this.password;
    const basic = "Basic " + btoa(credentials);

    var data = $.param({
    });

    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
            'Authorization': basic
        }
    }

    $http.post("/api/users/login", data, config)
      .then(function(response) {

        var res = response.data;
        if (res.user.user_type == 2) {
          localStorage.setItem("id", res.user.email);
          localStorage.setItem("token", res.token);
          console.log(localStorage.getItem("id"));
          $window.location.href="/admin"
        } else {
          alert("Error...\nIt's not administrator!");
        }
      }, function myError(response) {
        alert("User name or Password is not correct!\nPlease try again!");
    });

  }
});
