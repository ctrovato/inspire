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
.controller('UsersCtrl', function($scope) {})



// ============ Add Tasks Controller ===========
// =============================================
.controller('AddCtrl', function($scope, $ionicPopup) {

	$scope.currentDate = new Date();

	$scope.slots = [
      {epochTime: 12600, step: 15, format: 12},
      {epochTime: 54900, step: 1, format: 24}
 	];

 	
	// var url = 'https://appinspire.firebaseio.com/';
	// 	var ref = new Firebase(url);
	// 	var ref_tasks = new Firebase(url+"tasks/");  
	// 	var tasks = $firebase(ref_tasks);
	// 	$scope.tasks = tasks.$asArray();

	// 	$scope.authObj = $firebaseAuth(ref);

	// 	$scope.authObj.$onAuth(function(authData) {
	// 		if (authData) {
	// 			var userRef =  new Firebase( url + "users/" + authData.uid);
	// 			$scope.sync = $firebase(userRef);
	// 			$rootScope.currentUser = $scope.sync.$asObject();
				
	// 			console.log("logged in tasks ", $rootScope.currentUser); //logging $rootScope.currentUsers

	// 		} else {
	// 			$location.path("/login");
	// 		}
	// 	});

	// 	console.log($rootScope.currentUser);  //logging $rootScope.currentUsers

	// $scope.addTask = function(){

	// 	console.log($scope.tasks); //logging $scope.tasks
	// 	$scope.tasks.$add({
	// 		name: $rootScope.currentUser.name,
	// 		uid: $rootScope.currentUser.uid,
	// 		title: $scope.title,
	// 		date: Firebase.ServerValue.TIMESTAMP

	// 	}).then(function(){
	// 		$scope.title = '';
	// 		$scope.description = '';
	// 		$scope.content = '';
	// 		$scope.postForm.$setUntouched();
	// 	})

	// } //addPost

	// Time picker formatting


})

.controller('ListCtrl', function($scope, $ionicListDelegate) {})

.controller('BadgesCtrl', function($scope) {})




