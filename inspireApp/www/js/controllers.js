angular.module('starter.controllers', ['firebase'])


// ================= Main  Controller =============
// ================================================
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function(){
		$ionicSideMenuDelegate.toggleLeft()
	}
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
				$location.path('/login');
			});
	}

	$scope.go = function (path) {
  		
  		$location.path( "/signup" );
}

})



// ============ User Controller ===========
// =========================================
// .controller('UsersCtrl', 

// 	function($scope, $location, $firebase, $firebaseAuth, $rootScope){
// 		var url = 'https://appinspire.firebaseio.com/'
// 		var ref = new Firebase(url); 
// 		var tasks = $firebase(ref);
// 		$scope.users = tasks.$asArray();


// 		$scope.authObj = $firebaseAuth(ref);

// 		$scope.authObj.$onAuth(function(authData) {
// 			if (authData) {
// 				var userRef =  new Firebase(url + "users/" + authData.uid);
// 				$scope.sync = $firebase(userRef);
// 				$rootScope.currentUser = $scope.sync.$asObject()

// 				$rootScope.currentUser.$loaded().then(function(){
// 					$scope.user = {};
// 					$scope.user.name = $rootScope.user.name;
// 					$scope.user.email = $rootScope.user.email;
				
// 					console.log("logged in", $scope.currentUser); //logging $scope.currentUser
// 				});

// 			} else {
// 				console.log("Logged out");   //logging logged out
// 			}
// 		});
// })



// ============ Add Tasks Controller ===========
// =============================================
.controller('AddCtrl', function($scope, $location, $firebaseObject, $ionicPopup, $firebaseArray, $firebaseAuth) {

	// $scope.epochTime = 12600;

	// $scope.slots = {epochTime: 12600, format: 12, step: 15};

	// $scope.timePickerCallback = function (val) {
	//   if (typeof (val) === 'undefined') {
	//     console.log('Time not selected');
	//   } else {
	//     console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
	//   }
	// };

// $scope.currentDate = new Date();
// $scope.datePickerCallback = function (val) {
//   if(typeof(val)==='undefined'){		
//       console.log('Date not selected');
//   }else{
//       console.log('Selected date is : ', val);
//   }
// };


	var url = 'https://appinspire.firebaseio.com/';
	var ref = new Firebase(url);  

    	$scope.authObj = $firebaseAuth(ref);


	var ref_tasks = new Firebase(url+ "tasks/");  
	
		$scope.tasks = $firebaseArray(ref_tasks);

		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				var userRef =  new Firebase( url + "users/" + authData.uid);
				$scope.user = $firebaseObject(userRef);
				
				console.log("logged in tasks ", $scope.user); //logging $rootScope.currentUsers

			} else {
				$location.path("/login");
			}
		});
		console.log($scope.user);  //logging $rootScope.currentUsers

	$scope.addTask = function(){

		$scope.task = {};

		console.log("title", $scope.task.title, "user", $scope.user); //logging $scope.tasks
		$scope.tasks.$add({
			name: $scope.user.name,
			uid: $scope.user.$id,
			title: $scope.task.title,
			date: Firebase.ServerValue.TIMESTAMP

		}).then(function(){
			$scope.task.title = '';

		})

	} //addTask

})

.controller('ListCtrl', function($scope, $ionicListDelegate) {})

.controller('BadgesCtrl', function($scope) {})




