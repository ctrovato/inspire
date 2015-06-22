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
				
					console.log("logged in", $scope.currentUser); //logging $scope.currentUser
				});

			} else {
				console.log("Logged out");   //logging logged out
			}
		});
})


// ============ Sign Up | Login Controller ===========
// ===================================================
.controller('SignupCtrl', function($scope, $location, $firebaseObject, $firebaseAuth) {

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
.controller('AddCtrl', function($scope, $rootScope, $location, $firebaseObject, $ionicPopup, $firebaseArray, $firebaseAuth) {

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


	$scope.epochTime = -18000

	$scope.slots = {epochTime: -18000 , format: 12, step: 30};

	$scope.timePickerCallback = function (val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	    console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
	  }
	};

$scope.currentDate = new Date();
$scope.datePickerCallback = function (val) {
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

			} else {
				$location.path("/splashPage");
			}
		});

	$scope.addTask = function(task){

		// console.log(typeof $scope.user.tasks);
					
		console.log("title", task.title, "user", $scope.user); //logging $scope.tasks


		var currentTime = Math.round(new Date().getTime()/1000.0);
		console.log(currentTime);

		var endTime = currentTime + (task.days*86400);
		console.log(endTime);


		$scope.tasks.$add({
			name: $scope.user.name,
			uid: $scope.user.$id,
			title: task.title,
			date: Firebase.ServerValue.TIMESTAMP,
			expire: endTime,
			status: "incommplete"


		}).then(function(){
			// $scope.task = {};
			task.title = '';
		})

// Deadline Counter
		// var deadline;
  //       $scope.time = function() {
  //         // Don't start a new fight if we are already fighting
  //         if ( angular.isDefined(stop) ) return;

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


	} //addTask
})

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
				console.log("logged in:", $scope.user); //logging $rootScope.currentUsers

			} else {
				$location.path("/splashPage");
			}
		});

})

.controller('BadgesCtrl', function($scope) {})




