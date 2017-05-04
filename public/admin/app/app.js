'use strict';

var app = angular.module("admin", ["ngRoute"]);

app.run(function($rootScope, $location, $anchorScroll, $routeParams) {
	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		$location.hash($routeParams.scrollTo);
		$anchorScroll();
	});
});

app.directive("repeatEnd", function(){
            return {
                restrict: "A",
                link: function (scope, element, attrs) {
                    if (scope.$last) {
                        scope.$eval(attrs.repeatEnd);
                    }
                }
            };
        });


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
			templateUrl : "pages/courses/courses.html",
			controller : "coursesController"
    })
    .when("/dashboard", {
        templateUrl : "pages/dashboard/dashboard.html",
        controller : "dashboardController"
    })
    .when("/courses/courses", {
        templateUrl : "pages/courses/courses.html",
        controller : "coursesController"
    })
    .when("/courses/levels", {
        templateUrl : "pages/courses/levels.html",
        controller : "levelsController"
    })
    .when("/courses/subjects", {
        templateUrl : "pages/courses/subjects.html",
        controller : "subjectsController"
    })
    .when("/courses/chapters", {
        templateUrl : "pages/courses/chapters.html",
        controller : "chaptersController"
    })
    .when("/users/administrators", {
        templateUrl : "pages/users/admin.html",
        controller : "administratorsController"
    })
    .when("/users/lecturers", {
        templateUrl : "pages/users/lecturers.html",
        controller : "lecturersController"
    })
    .when("/users/students", {
        templateUrl : "pages/users/students.html",
        controller : "studentsController"
    })
    .when("/contact/aboutus", {
        templateUrl : "pages/contact/aboutus.html",
        controller : "studentsController"
    });
});

app.service('dataService', function() {
    this.id = localStorage.getItem("id");
    this.token = localStorage.getItem("token");
    this.authHeader = {
        headers : {
            'id': this.id,
            'x-access-token': this.token
        }
    }
});

app.controller("adminController", function ($scope, dataService) {
  // redirect
  (function() {
    if (localStorage.getItem("token") == undefined) {
      window.location.href = "/admin/login/"
    }
  })();

  this.onLoadFinish = function() {

  }

	this.data = dataService;
});

app.controller("dashboardController", function ($scope) {
    $scope.chartOptions = {
      //Boolean - If we should show the scale at all
      showScale: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: false,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - Whether the line is curved between points
      bezierCurve: true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.3,
      //Boolean - Whether to show a dot for each point
      pointDot: false,
      //Number - Radius of each point dot in pixels
      pointDotRadius: 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius: 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke: true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth: 2,
      //Boolean - Whether to fill the dataset with a color
      datasetFill: true,
      //String - A legend template
      legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
      //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: true,
      //Boolean - whether to make the chart responsive to window resizing
      responsive: true
    };

    $scope.onLoad = function() {
      $scope.makeUsersChart();
      $scope.makeSalesChart();
    }

    $scope.makeUsersChart = function() {
        // Get context with jQuery - using jQuery's .get() method.
        var canvas = $("#usersChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var chart = new Chart(canvas);

        var chartData = {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: "Digital Goods",
              fillColor: "rgba(60,141,188,0.9)",
              strokeColor: "rgba(60,141,188,0.8)",
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: [28, 48, 40, 19, 86, 27, 90]
            }
          ]
        };

        //Create the line chart
        chart.Line(chartData, $scope.chartOptions);
    }

    $scope.makeSalesChart = function() {
      // Get context with jQuery - using jQuery's .get() method.
      var canvas = $("#salesChart").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var chart = new Chart(canvas);

      var chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Digital Goods",
            fillColor: "rgba(60,141,188,0.9)",
            strokeColor: "rgba(60,141,188,0.8)",
            pointColor: "#3b8bba",
            pointStrokeColor: "rgba(60,141,188,1)",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(60,141,188,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      };

      //Create the line chart
      chart.Line(chartData, $scope.chartOptions);
    }
});

app.controller("administratorsController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/users/users/2", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.adminUsers = res;
          $scope.adminUsers = dataService.adminUsers;

        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.adminUsers.length; i++) {
        if ($scope.adminUsers[i]._id == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			var info = $scope.adminUsers[$scope.selectedIndex];
			console.log(info);
			$scope.input.email = info.email;
			$scope.input.lastName = info.user_info.last_name;
			$scope.input.firstName = info.user_info.first_name;
			$scope.input.country = info.user_info.country;
			$scope.input.phoneNumber = info.user_info.phone_number;
			$scope.input.id = $scope.selectedID;
		}

    $scope.delete = function() {
      $http.get("/api/users/delete/" + $scope.selectedID, dataService.authHeader)
        .then(function(response) {
					$scope.adminUsers.splice($scope.selectedIndex, 1);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.input.id === undefined) {
        $scope.register();
      }
      else {
				$scope.update();
      }
    }

    $scope.newUser = function() {
      $scope.input = {
				id: undefined
			};
    }

		$scope.update = function() {

			var data = {
				id: $scope.input.id,
				email: $scope.input.email,
				first_name: $scope.input.firstName,
				last_name: $scope.input.lastName,
				country: $scope.input.country,
				phone_number: $scope.input.phoneNumber,
				password: $scope.input.password,
			};


			$http.post("/api/users/update", {user_info: data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.adminUsers[$scope.selectedIndex].email = $scope.input.email;
					$scope.adminUsers[$scope.selectedIndex].user_info.first_name = $scope.input.firstName;
					$scope.adminUsers[$scope.selectedIndex].user_info.last_name = $scope.input.lastName;
					$scope.adminUsers[$scope.selectedIndex].user_info.country = $scope.input.country;
					$scope.adminUsers[$scope.selectedIndex].user_info.phone_number = $scope.input.phoneNumber;

					alert("Operation has done successfully !");
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.register = function() {
      var data = {
        email: $scope.input.email,
        first_name: $scope.input.firstName,
        last_name: $scope.input.lastName,
        country: $scope.input.country,
        phone_number: $scope.input.phoneNumber,
        password: $scope.input.password,
        user_type: 2
      };

      $http.post("/api/users/register", data)
        .then(function(response) {
          var res = response.data;
          $scope.adminUsers.push(res.user);
          alert("Operation has done successfully !");
        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("chaptertsController", function ($scope) {
    $scope.onLoad = function() {

    }
});

app.controller("lecturersController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/users/users/1", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.lecturers = res;
          $scope.lecturers = dataService.lecturers;

        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.lecturers.length; i++) {
        if ($scope.lecturers[i]._id == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			var info = $scope.lecturers[$scope.selectedIndex];
			console.log(info);
			$scope.input.email = info.email;
			$scope.input.lastName = info.user_info.last_name;
			$scope.input.firstName = info.user_info.first_name;
			$scope.input.country = info.user_info.country;
			$scope.input.phoneNumber = info.user_info.phone_number;
			$scope.input.id = $scope.selectedID;
		}

    $scope.delete = function() {
      $http.get("/api/users/delete/" + $scope.selectedID, dataService.authHeader)
        .then(function(response) {
					$scope.lecturers.splice($scope.selectedIndex, 1);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.input.id === undefined) {
        $scope.register();
      }
      else {
				$scope.update();
      }
    }

    $scope.newUser = function() {
      $scope.input = {
				id: undefined
			};
    }

		$scope.update = function() {
			console.log("update");
			var data = {
				id: $scope.input.id,
				email: $scope.input.email,
				first_name: $scope.input.firstName,
				last_name: $scope.input.lastName,
				country: $scope.input.country,
				phone_number: $scope.input.phoneNumber,
				password: $scope.input.password,
			};


			$http.post("/api/users/update", {user_info: data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.lecturers[$scope.selectedIndex].email = $scope.input.email;
					$scope.lecturers[$scope.selectedIndex].user_info.first_name = $scope.input.firstName;
					$scope.lecturers[$scope.selectedIndex].user_info.last_name = $scope.input.lastName;
					$scope.lecturers[$scope.selectedIndex].user_info.country = $scope.input.country;
					$scope.lecturers[$scope.selectedIndex].user_info.phone_number = $scope.input.phoneNumber;

					alert("Operation has done successfully !");
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.register = function() {
      var data = {
        email: $scope.input.email,
        first_name: $scope.input.firstName,
        last_name: $scope.input.lastName,
        country: $scope.input.country,
        phone_number: $scope.input.phoneNumber,
        password: $scope.input.password,
        user_type: 1
      };

      $http.post("/api/users/register", data)
        .then(function(response) {
          var res = response.data;
          $scope.lecturers.push(res.user);
          alert("Operation has done successfully !");
        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("levelsController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/courses", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.courses = res;
          $scope.courses = dataService.courses;
					$scope.selectedCourseID = $scope.courses[0]._id;
					$scope.selectedCourseIndex = 0;
					$scope.levels = $scope.courses[0].levels;
        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.levels.length; i++) {
        if ($scope.levels[i].number == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			$scope.mode="update";
			var info = $scope.levels[$scope.selectedIndex];
			$scope.input.number = info.number;
			$scope.input.name = info.name;
		}

    $scope.delete = function() {
			var data = {
				course_id: $scope.selectedCourseID,
				number: $scope.selectedID
			};
      $http.post("/api/courses/levels/delete", {data: data}, dataService.authHeader)
        .then(function(response) {
					$scope.levels.splice($scope.selectedIndex, 1);
					console.log($scope.selectedIndex);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

		$scope.changeCourse = function() {
			for (var i = 0; i < $scope.courses.length; i++) {
				if ($scope.courses[i]._id == $scope.selectedCourseID) {
					$scope.selectedCourseIndex = i;
					$scope.levels = $scope.courses[i];
					break;
				}
			}
		}

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.mode == "add") {
        $scope.add();
      }
      else {
				$scope.update();
      }
    }

    $scope.newLevel = function() {
      $scope.input = {
				number: $scope.levels.length
			};
			$scope.mode = "add"
    }

		$scope.update = function() {
			console.log("update");
			var data = {
				course_id: $scope.selectedCourseID,
				old_number: $scope.selectedId,
				number: $scope.input.number,
				name: $scope.input.name
			};

			$http.post("/api/courses/levels/update", {data : data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.levels[$scope.selectedIndex].number = $scope.input.number;
					$scope.levels[$scope.selectedIndex].name = $scope.input.name;

					alert("Operation has done successfully !");
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.add = function() {

      var data = {
        course_id: $scope.selectedCourseID,
				number: $scope.input.number,
        name: $scope.input.name
  		};

      $http.post("/api/courses/levels/add", {data: data}, dataService.authHeader)
        .then(function(response) {
          var res = response.data;

          $scope.levels.push({
						number: $scope.input.number,
	          name: $scope.input.name});
					console.log(res.course);
          alert("Operation has done successfully !");

        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("coursesController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/courses", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.courses = res;
          $scope.courses = dataService.courses;

        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.courses.length; i++) {
        if ($scope.courses[i]._id == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			var info = $scope.courses[$scope.selectedIndex];
			console.log(info);
			$scope.input.number = info.number;
			$scope.input.name = info.name;
			$scope.input.isAvailable = info.is_available;
			console.log(info.is_available);
			$scope.input.id = $scope.selectedID;
		}

    $scope.delete = function() {
      $http.get("/api/courses/delete/" + $scope.selectedID, dataService.authHeader)
        .then(function(response) {
					$scope.courses.splice($scope.selectedIndex, 1);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.input.id === undefined) {
        $scope.add();
      }
      else {
				$scope.update();
      }
    }

    $scope.newCourse = function() {
      $scope.input = {
				id: undefined,
				isAvailable: true
			};
    }

		$scope.update = function() {
			console.log("update");
			var data = {
				id: $scope.input.id,
				number: $scope.input.number,
				name: $scope.input.name,
				is_available: $scope.input.isAvailable
			};

			$http.post("/api/courses/update", {data : data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.courses[$scope.selectedIndex].number = $scope.input.number;
					$scope.courses[$scope.selectedIndex].name = $scope.input.name;
					$scope.courses[$scope.selectedIndex].is_available = $scope.input.isAvailable;

					alert("Operation has done successfully !");
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.add = function() {
			console.log($scope.input.isAvailable);
      var data = {
        number: $scope.input.number,
        name: $scope.input.name,
        is_available: $scope.input.isAvailable,
  		};

      $http.post("/api/courses/add", {data: data}, dataService.authHeader)
        .then(function(response) {
          var res = response.data;

          $scope.courses.push(res.course);
					console.log(res.course);
          alert("Operation has done successfully !");

        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("subjectsController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/courses", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.courses = res;
          $scope.courses = dataService.courses;
					$scope.selectedCourseID = $scope.courses[0]._id;
					$scope.selectedCourseIndex = 0;

					$scope.levels = $scope.courses[0].levels;
					$scope.selectedLevelIndex = 0;
					$scope.selectedLevelNumber = $scope.levels[0].number.toString();

					$scope.changeLevel();

        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.subjects.length; i++) {
        if ($scope.subjects[i]._id == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			$scope.mode="update";
			var info = $scope.subjects[$scope.selectedIndex];
			$scope.input.number = info.number;
			$scope.input.name = info.name;
			$scope.input.price = info.price;
		}

    $scope.delete = function() {
			var data = {
				course_id: $scope.selectedCourseID,
				number: $scope.selectedID
			};

      $http.get("/api/courses/subjects/delete/" + $scope.selectedID, dataService.authHeader)
        .then(function(response) {

					$scope.subjects.splice($scope.selectedIndex, 1);
					console.log($scope.selectedIndex);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

		$scope.changeCourse = function() {
			for (var i = 0; i < $scope.courses.length; i++) {
				if ($scope.courses[i]._id == $scope.selectedCourseID) {
					$scope.selectedCourseIndex = i;
					$scope.levels = $scope.courses[i];
					break;
				}
			}
		}

		$scope.changeLevel = function() {
			for (var i = 0; i < $scope.levels.length; i++) {
				if ($scope.levels[i].number == $scope.selectedLevelNumber) {
					$scope.selectedLevelIndex = i;
					break;
				}
			}

			$http.get("/api/courses/" + $scope.courses[$scope.selectedCourseIndex].number + "/" + $scope.selectedLevelNumber + "/subjects", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          $scope.subjects = res;
        }, function myError(response) {
          alert(response.statusText);
      });
		}

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.mode == "add") {
        $scope.add();
      }
      else {
				$scope.update();
      }
    }

    $scope.newSubject = function() {
			$scope.input = {
				number: $scope.subjects.length
			};
			$scope.mode = "add"
    }

		$scope.update = function() {

			var data = {
				id: $scope.selectedID,
				course_number: $scope.courses[$scope.selectedCourseIndex].number,
        level_number: $scope.selectedLevelNumber,
				number: $scope.input.number,
        name: $scope.input.name,
				price: $scope.input.price,
  		};

			$http.post("/api/courses/subjects/update", {data : data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.subjects[$scope.selectedIndex].number = $scope.input.number;
					$scope.subjects[$scope.selectedIndex].name = $scope.input.name;
					$scope.subjects[$scope.selectedIndex].price = $scope.input.price;

					alert(res.message);
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.add = function() {

      var data = {
				course_number: $scope.courses[$scope.selectedCourseIndex].number,
        level_number: $scope.selectedLevelNumber,
				number: $scope.input.number,
        name: $scope.input.name,
				price: $scope.input.price,
  		};

      $http.post("/api/courses/subjects/add", {data: data}, dataService.authHeader)
        .then(function(response) {
          var res = response.data;

          $scope.subjects.push(res.subject);

          alert("Operation has done successfully !");

        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("chaptersController", function ($scope, $http, dataService) {

    $scope.onLoad = function() {
      $http.get("/api/courses", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          dataService.courses = res;
          $scope.courses = dataService.courses;
					$scope.selectedCourseID = $scope.courses[0]._id;
					$scope.selectedCourseIndex = 0;

					$scope.levels = $scope.courses[0].levels;
					$scope.selectedLevelIndex = 0;
					$scope.selectedLevelNumber = $scope.levels[0].number.toString();

					$scope.changeLevel();

        }, function myError(response) {
          alert(response.statusText);
      });
    }

    $scope.onSelect = function(id) {
      $scope.selectedID = id;
      $scope.selectedIndex = 0;
      for (var i = 0; i < $scope.subjects.length; i++) {
        if ($scope.subjects[i]._id == id) {
          $scope.selectedIndex = i;
          break;
        }
      }
    }

		$scope.onUpdate = function(id) {
			$scope.onSelect(id);
			$scope.mode="update";
			var info = $scope.chapters[$scope.selectedIndex];
			$scope.input.number = info.number;
			$scope.input.name = info.name;
			$scope.input.videoUrl = info.video_url;
			$scope.input.noteUrl = info.note_url;
		}

    $scope.delete = function() {
			var data = {
				subject_id: $scope.selectedSubjectID,
				number: $scope.selectedID
			};

      $http.post("/api/courses/chapters/delete", {data: data}, dataService.authHeader)
        .then(function(response) {

					$scope.chapters.splice($scope.selectedIndex, 1);
          var res = response.data;
          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });

    }

		$scope.changeCourse = function() {
			for (var i = 0; i < $scope.courses.length; i++) {
				if ($scope.courses[i]._id == $scope.selectedCourseID) {
					$scope.selectedCourseIndex = i;
					$scope.levels = $scope.courses[i];
					break;
				}
			}
		}

		$scope.changeLevel = function() {
			for (var i = 0; i < $scope.levels.length; i++) {
				if ($scope.levels[i].number == $scope.selectedLevelNumber) {
					$scope.selectedLevelIndex = i;
					break;
				}
			}

			$http.get("/api/courses/" + $scope.courses[$scope.selectedCourseIndex].number + "/" + $scope.selectedLevelNumber + "/subjects", dataService.authHeader)
        .then(function(response) {
          var res = response.data;
          $scope.subjects = res;
					$scope.selectedSubjectIndex = 0;
					$scope.selectedSubjectID = $scope.subjects[0]._id;
					$scope.chapters = $scope.subjects[0].chapters;
        }, function myError(response) {
          alert(response.statusText);
      });
		}

    $scope.input = {
    };

    $scope.save = function() {

      if ($scope.mode == "add") {
        $scope.add();
      }
      else {
				$scope.update();
      }
    }

    $scope.newChapter = function() {
      $scope.input = {
				number: $scope.subjects.length
			};
			$scope.mode = "add"
    }

		$scope.update = function() {

			var data = {
				subject_id: $scope.selectedSubjectID,
				old_number: $scope.chapters[$scope.selectedIndex].number,
				number: $scope.input.number,
				name: $scope.input.name,
				video_url: $scope.input.videoUrl,
				note_url: $scope.input.noteUrl
			};

			$http.post("/api/courses/chapters/update", {data : data}, dataService.authHeader)
				.then(function(response) {
					var res = response.data;
					$scope.chapters[$scope.selectedIndex].number = $scope.input.number;
					$scope.chapters[$scope.selectedIndex].name = $scope.input.name;
					$scope.chapters[$scope.selectedIndex].videoUrl = $scope.input.video_url;
					$scope.chapters[$scope.selectedIndex].noteUrl = $scope.input.note_url;

					alert(res.message);
				}, function myError(response) {
					alert(response.statusText);
			});
		}

    $scope.add = function() {

      var data = {
				subject_id: $scope.selectedSubjectID,
				number: $scope.input.number,
        name: $scope.input.name,
				video_url: $scope.input.videoUrl,
				note_url: $scope.input.noteUrl
  		};

      $http.post("/api/courses/chapters/add", {data: data}, dataService.authHeader)
        .then(function(response) {
          var res = response.data;

          $scope.chapters.push({
						number: data.number,
						name: data.name,
						video_url: data.video_url,
						note_url: data.note_url
					});

          alert(res.message);

        }, function myError(response) {
          alert(response.statusText);
      });
    }
});

app.controller("studentsController", function ($scope) {
    $scope.onLoad = function() {

    }
});
