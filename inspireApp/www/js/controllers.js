angular.module('starter.controllers', ['firebase'])


// ================= Main  Controller =============
// ================================================
.controller('MainCtrl', function($scope, $firebaseAuth, $firebaseObject, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function(){
		$ionicSideMenuDelegate.toggleLeft()
	}
		var url = 'https://appinspire.firebaseio.com/'
		var ref = new Firebase(url); 

		$scope.authObj = $firebaseAuth(ref);

		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase(url + "users/" + authData.uid);

				$scope.currentUser = $firebaseObject(userRef);

				$scope.currentUser.$loaded().then(function(){
				
					// console.log("logged in", $scope.currentUser); //logging $scope.currentUser
				});

			} else {
				console.log("Logged out");   //logging logged out
			}
		});
})


// ============ Sign Up | Login Controller ===========
// ===================================================
.controller('SignupCtrl', function($scope, $rootScope, $location, $firebaseObject, $firebaseAuth) {

var url = 'https://appinspire.firebaseio.com/' 
		var ref = new Firebase(url); 
		var tasks = $firebaseObject(ref);

		$scope.authObj = $firebaseAuth(ref);

		var userRef =  new Firebase(url + "users/");

		$scope.newUser = tasks;

		$scope.user={};

		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase(url + "users/" + authData.uid);

			$scope.currentUser = $firebaseObject(userRef);

			$scope.currentUser.$loaded().then(function(){
			
				console.log("logged in", $scope.currentUser); //logging $scope.currentUser
			});

			} else {
				console.log("Logged out");   //logging logged out

			}
		});

	$scope.register = function(){

		console.log('password', $scope.user.password, 'email', $scope.user.email);

		$scope.authObj.$createUser({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(userData) {
			
			console.log("User " + userData.uid + " created successfully!");

			return $scope.authObj.$authWithPassword({
				email: $scope.user.email,
			    password: $scope.user.password
		  	});
		}).then(function(authData) {
			$scope.authData = authData;
			console.log("Logged in as:", authData.uid);
		}).catch(function(error) {
		  console.error("Error: ", error);
		})
		.then(function(authData){

			console.log($scope.authData,'authData');   //logging authData

			var userRef =  new Firebase(url + "users/" + $scope.authData.uid);

				userRef
				.set({
					uid: $scope.authData.uid,
					name: $scope.user.name,
					email: $scope.user.email
				});

				$scope.currentUser = authData
				$location.path('/dashboard');
		})
	}


	$scope.login = function(){

		console.log("working");

		$scope.authObj.$authWithPassword({
			email: $scope.user.email,
			password: $scope.user.password})
			//authentication for firebase if currentUser = authData will send to users Dashboard
			//catch if $scope.authError=error.message; will send to Login
			.then(function(authData) {
				$scope.currentUser = authData
				$location.path('/dashboard');
			}).catch(function(error) {
				console.log(error);  //logging authData
				$scope.authError=error.message;
				$location.path('/splashPage')
			});
	} 


	$scope.facebookLogin = function(){

		var ref = new Firebase("https://appinspire.firebaseio.com");
			ref.authWithOAuthPopup("facebook", function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
					$location.path('/splashPage')
				}else {
					console.log("Authenticated successfully with payload:", authData);
					$location.path('/dashboard')

					var  facebookAuth = JSON.stringify(authData)

					$rootScope.facebookUser = JSON.parse(facebookAuth);

					console.log("FacebookData" , $rootScope.facebookUser);

				}
		})
	}


	$scope.go = function (path) {
  		
  		$location.path( "/signup" );
}

})



// ============ User Controller ===========
// =========================================
.controller('UsersCtrl', function($scope, $location, $firebaseAuth, $rootScope, $firebaseObject){
		var url = 'https://appinspire.firebaseio.com/'
		var ref = new Firebase(url); 

		$scope.authObj = $firebaseAuth(ref);

		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase(url + "users/" + authData.uid);

				$scope.currentUser = $firebaseObject(userRef);

				$scope.currentUser.$loaded().then(function(){
				
					console.log("logged in", $scope.currentUser); //logging $scope.currentUser
				});

			} else {
				console.log("Logged out");   //logging logged out
				$location.path('/splashPage')
			}
		});
})



// ============ Add Tasks Controller ===========
// =============================================
.controller('AddCtrl', function($scope, $rootScope, $stateParams, $location, $firebaseObject, $ionicPopup, $firebaseArray, $firebaseAuth) {

		var url = 'https://appinspire.firebaseio.com/'
		var ref = new Firebase(url); 

		$scope.authObj = $firebaseAuth(ref);

		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase(url + "users/" + authData.uid);

				$scope.currentUser = $firebaseObject(userRef);

				$scope.currentUser.$loaded().then(function(){
				
				});

			} else {
				console.log("Logged out");   //logging logged out
				$location.path('/splashPage')
			}
		}); 

		// console.log($stateParams);

		$scope.task = {}

		// ____ Time Picker _____
		var prependZero = function(param) {
	        
	        if (String(param).length < 2) {
	        	return "0" + String(param);
	        }
	        	return param;
	    }

      	
      	var epochParser = function(val) {
	        
	        if (val === null) {
	         	return "00:00";
	        } else {
	        	var meridian = ['AM', 'PM'];
	        	var hours = parseInt(val / 3600);
            	var minutes = (val / 60) % 60;
            	var hoursRes = hours > 12 ? (hours - 12) : hours;

            	var currentMeridian = meridian[parseInt(hours / 12)];

            	return(prependZero(hoursRes) +  ":" + prependZero(minutes) + " " +  currentMeridian);
            }
        }	

		$scope.epochTime = 18000

		$scope.slots = {epochTime: 18000 , format: 12, step: 30};

		$scope.timePickerCallback = function (val) {
			if (typeof (val) === 'undefined') {
				console.log('Time not selected');
			} else {
				$scope.task.time = epochParser(val)
				console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
			}
		};


		// ____ Date Picker _____
		$scope.currentDate = new Date();
		
		$scope.datePickerCallback = function (val) {
			console.log(val);
			if(typeof(val)==='undefined'){		
				console.log('Date not selected');
			}else{
			  	console.log('Selected date is : ', val);
			}
		};

			var url = 'https://appinspire.firebaseio.com/';
			var ref = new Firebase(url);  

	    	$scope.authObj = $firebaseAuth(ref);
		
			$scope.authObj.$onAuth(function(authData) {
				if (authData) {
					var userRef =  new Firebase( url + "users/" + authData.uid);
					var taskRef =  new Firebase( url + "users/" + authData.uid + "/tasks/");
					$scope.user = $firebaseObject(userRef);
					$scope.tasks = $firebaseArray(taskRef);
					console.log("logged in:", $scope.user); //logging $rootScope.currentUsers
					console.log(taskRef);

				} else {
					$location.path("/splashPage");
				}
			});

		$scope.addTask = function(task, date){
			console.log('DATE:', date)
						
			console.log("title", task.title, "user", date); //logging $scope.tasks

			// var currentTime = Math.round(new Date().getTime()/1000.0);
			// console.log(currentTime);

			// var endTime = currentTime + (task.days*86400);
			// // console.log(endTime);


			$scope.tasks.$add({
				name: $scope.user.name,
				uid: $scope.user.$id,
				title: task.title,
				dateFirebase: Firebase.ServerValue.TIMESTAMP,
				expire: date,
				deadlineTime: $scope.task.time,
				statusIncomplete: "incommplete",
				statusComplete: "complete"
			}).then(function(){
				// $scope.task = {};
				task.title = '';
			})

	} //addTask
})


// ============ List Controller ===========
// =============================================
.controller('ListCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject, $ionicListDelegate) {

	var url = 'https://appinspire.firebaseio.com/';
	var ref = new Firebase(url);  

    	$scope.authObj = $firebaseAuth(ref);
 	
		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase( url + "users/" + authData.uid);
				var taskRef =  new Firebase( url + "users/" + authData.uid + "/tasks/");
				$scope.user = $firebaseObject(userRef);
				$scope.tasks = $firebaseArray(taskRef);
				// console.log("logged in:", $scope.user); //logging $rootScope.currentUsers

			} else {
				$location.path("/splashPage");
			}
		});
})

// ============ View Task Controller ===========
// =============================================
.controller('ViewTaskCtrl', function($scope, $stateParams, $firebaseAuth, $firebaseArray, $firebaseObject, $ionicListDelegate) {

	var url = 'https://appinspire.firebaseio.com/';
	var ref = new Firebase(url);  

    	$scope.authObj = $firebaseAuth(ref);
 	
		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase( url + "users/" + authData.uid);
				var taskRef =  new Firebase( url + "users/" + authData.uid + "/tasks/" + $stateParams.task);
				$scope.user = $firebaseObject(userRef);
				$scope.task = $firebaseObject(taskRef);
					$scope.task.$loaded().then(function(data){
						$scope.task = data;
						var countdownTime = $scope.task.deadlineTime;
						var currentTime = 0;

					}).catch(function(error){
						console.log(error);
					})
				// console.log("logged in:", $scope.user); //logging $rootScope.currentUsers

			} else {
				$location.path("/splashPage");
			}
		});




// Deadline Counter

		

		$scope.checkDeadline = function(){
			if (currentTime === $scope.task.deadlineTime){
				$scope.task == expire
			}else{
				countdownTime - 1000
			}
		} 




  //       $scope.counter = function() {
  //         if ($scope.task.deadlineTime){
  //         }

  //         deadline = $interval(function() {
  //           if (date > 0 && $expire > 0) {
  //           } else {
  //             $scope.stopFight();
  //           }
  //         }, 100);
  //       };

  //        $scope.expire = function() {
  //         if (angular.isDefined(deadline)) {
  //           $interval.cancel(deadline);
  //           deadline = undefined;
  //         }
  //       };



		// $scope.completeTask = function(){
		// 	if ()



		// 	} //completeTask







})

// ============ Badges Controller ===========
// =============================================
.controller('BadgesCtrl', function($scope) {

})




