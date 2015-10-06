'use strict';

var apControllers = angular.module('apControllers', []);

// AppCtrl
apControllers.controller('AppCtrl', ['$scope', '$location', function ($scope, $location){
	$scope.navigateMe = function (where, params){
		switch(where){
			case 'projects':
				$location.url('/projects' + params);
				break;
			case 'clients':
				$location.url('/clients' + params);
				break;
			case 'contacts':
				$location.url('/contacts' + params);
				break;
			default: break;
		}
	}
	$scope.currentProject = '';
}]);

// HomeCtrl
apControllers.controller('HomeCtrl', ['$scope', function ($scope){
	
}]);

// ProjectsCtrl
apControllers.controller('ProjectsCtrl', ['$scope', '$location', '$log', '$mdDialog', 'dbAPI', 
	function ($scope, $location, $log, $mdDialog, dbAPI){
	$scope.projects = {};

	$scope.getProjects = function(){
		dbAPI.getRecords('projects,clients', false).then(
			function (success){ 
				//$scope.projects = success.data;
				$scope.projects = dbAPI.relations(success.data);
				//$log.log(dbAPI.relations(success.data)); 
			}, 
			function (error){ $log.log(error); }
		);
	}

	$scope.openProject = function (p){
		//$log.log(p.id);
		$scope.$parent.currentProject = p.name;
		$location.url('/projects/' + p.id);
	}

	$scope.addProject = function (){
		$mdDialog.show({
			controller: 'projectDialogCtrl',
			templateUrl: '/templates/add-new-project.html'
		}).then(
			function (success){
				$scope.getProjects();
			},
			function (error){
				// Dialog canceled
			}
		);
			
	}

	$scope.editProject = function (project){
		$mdDialog.show({
			controller: 'projectDialogCtrl',
			templateUrl: '/templates/add-new-project.html',
			locals:{
				'projectObj':project
			},
			bindToController:true
		}).then(
			function (){
				$scope.getProjects();
			},
			function (){
				//cancel dialog
			}
		);
	}

	$scope.deleteProject = function (id){
		
		$mdDialog.show(
			$mdDialog.confirm()
				.title('Biztosan törlöd?')
				.content('A művelet nem visszavonható')
				.ok('Törlés')
				.cancel('Mégse')
			).then(
				function(){
					//Yes, delete
					dbAPI.deleteRecord('projects', id).then(
						function (success){ 
							$scope.getProjects();
						}, 
						function (error){ $log.log(error); }
					);
				},
				function(){
					$log.log('cancel');
				}
			)
	}

	// get clients
	$scope.getProjects();
}]);

// ProjectdetailsCtrl
apControllers.controller('ProjectdetailsCtrl', ['$scope', '$location', '$window', '$mdDialog', '$routeParams', '$log', 'dbAPI', 
	function ($scope, $location, $window, $mdDialog, $routeParams, $log, dbAPI) {
	$scope.project = {};
	$scope.jobs = {};
	$scope.tasks = {};
	$scope.clickedJob = -1;

	// Back button
	$scope.back = function (){
		$window.history.back();
	}

	// Jobs
	$scope.getJobs = function (){
		dbAPI.getRecords('jobs', true, 'parent_id,eq,' + $routeParams.id).then(
			function (success){
				$scope.project.name = $scope.$parent.currentProject;
				$scope.jobs = success.data.jobs;
			},
			function (error){
				$log.log(error);
			}
		);
	}

	$scope.addJob = function(){
		$mdDialog.show({
			controller: 'jobDialogCtrl',
			templateUrl: '/templates/add-new-job.html',
			locals:{
				'is_new': true,
				'parent_id':$routeParams.id
			},
			bindToController:true
		}).then(
			function (success){
				$scope.getJobs();
			},
			function (error){
				// Dialog canceled
			}
		);
	}
	$scope.editJob = function(job){
		$mdDialog.show({
			controller: 'jobDialogCtrl',
			templateUrl: '/templates/add-new-job.html',
			locals:{
				'is_new': false,
				'jobObj':job
			},
			bindToController:true
		}).then(
			function (success){
				$scope.getJobs();
			},
			function (error){
				// Dialog canceled
			}
		);
	}

	// Tasks
	$scope.getTasks = function (parent_id){
		$scope.clickedJob = parent_id;
		//$location.search('job', parent_id);
		dbAPI.getRecords('tasks', true, 'parent_id,eq,' + parent_id).then(
			function (success){
				$scope.tasks = success.data.tasks;
				$log.log($scope.tasks);
			},
			function (error){
				$log.log(error);
			}
		);
	}
	$scope.addTask = function(){
		$mdDialog.show({
			controller: 'taskDialogCtrl',
			templateUrl: '/templates/add-new-task.html',
			locals:{
				'is_new': true,
				'parent_id':$scope.clickedJob
			},
			bindToController:true
		}).then(
			function (success){
				$scope.getTasks($scope.clickedJob);
			},
			function (error){
				// Dialog canceled
			}
		);
	}

	//init
	$scope.getJobs();
}]);

// ClientSettingsCtrl
apControllers.controller('ClientSettingsCtrl', ['$scope', '$location', '$log', '$mdDialog', 'dbAPI', 
	function ($scope, $location, $log, $mdDialog, dbAPI){
	$scope.clients = {};
	$scope.contacts = {};

	$scope.getClients = function(){
		dbAPI.getRecords('clients,contacts', false).then(
			function (success){ 
				//$scope.clients = success.data.clients;
				$scope.clients = dbAPI.relations(success.data);
				//$log.log(dbAPI.relations(success.data));
				//$scope.getContacts();
				//$log.log(success.data); 
			}, 
			function (error){ $log.log(error); }
		);
	}

	$scope.addClient = function (){
		$mdDialog.show({
			controller: 'clientDialogCtrl',
			scope: $scope,
			preserveScope: true,
			templateUrl: '/templates/add-new-client.html'
		}).then(
			function (){
				$scope.getClients();
			},
			function (){
				// cancel dialog
			}
		);
			
	}

	$scope.editClient = function (client){
		$mdDialog.show({
			controller: 'clientDialogCtrl',
			templateUrl: '/templates/add-new-client.html',
			locals:{
				'clientObj':client
			},
			bindToController:true
		}).then(
			function (){
				$scope.getClients();
			},
			function (){
				// cancel dialog
			}
		);
	}

	$scope.deleteClient = function (id){
		
		$mdDialog.show(
			$mdDialog.confirm()
				.title('Biztosan törlöd?')
				.content('A művelet nem visszavonható')
				.ok('Törlés')
				.cancel('Mégse')
			).then(
				function(){
					//Yes, delete
					dbAPI.deleteRecord('clients', id).then(
						function (success){ 
							$scope.getClients();
							//$log.log(success.data); 
						}, 
						function (error){ $log.log(error); }
					);
				},
				function(){
					$log.log('cancel');
				}
			)
	}

	$scope.addContact = function (client_id){
		$mdDialog.show({
			controller: 'contactDialogCtrl',
			templateUrl: '/templates/add-new-contact.html',
			locals:{
				is_new:true,
				client_id: client_id
			},
			bindToController:true
		}).then(
			function (){
				$scope.getClients();
				//getContacts
			},
			function (){
				// cancel dialog
			}
		);
	}

	$scope.openContacts = function (clientname){
		$scope.$parent.navigateMe('contacts','?filter=' + clientname);
	}

	// get clients
	$scope.getClients();
}]);

// ContactSettingsCtrl
apControllers.controller('ContactSettingsCtrl', ['$scope', '$location', '$log', '$mdDialog', 'dbAPI', 
	function ($scope, $location, $log, $mdDialog, dbAPI){
	$scope.contacts = {};
	$scope.contactFilter = $location.search().filter;
	//$log.log();

	$scope.getContacts = function(){
		dbAPI.getRecords('contacts,clients', false).then(
			function (success){ 
				//$scope.contacts = success.data.contacts;
				$scope.contacts = dbAPI.relations(success.data);
				//$log.log($scope.contacts); 
			}, 
			function (error){ $log.log(error); }
		);
	}

	$scope.addContact = function (){
		$mdDialog.show({
			controller: 'contactDialogCtrl',
			templateUrl: '/templates/add-new-contact.html',
			locals:{
				is_new:true
			},
			bindToController:true
		}).then(
			function (){
				$scope.getContacts();
				//getContacts
			},
			function (){
				// cancel dialog
			}
		);
	}

	$scope.editContact = function (contact){
		$mdDialog.show({
			controller: 'contactDialogCtrl',
			templateUrl: '/templates/add-new-contact.html',
			locals:{
				is_new: false,
				contactObj:contact
			},
			bindToController:true
		}).then(
			function (){
				$scope.getContacts();
			},
			function (){
				// cancel dialog
			}
		);
	}

	$scope.deleteContact = function (id){
		
		$mdDialog.show(
			$mdDialog.confirm()
				.title('Biztosan törlöd?')
				.content('A művelet nem visszavonható')
				.ok('Törlés')
				.cancel('Mégse')
			).then(
				function(){
					//Yes, delete
					dbAPI.deleteRecord('contacts', id).then(
						function (success){ 
							$scope.getContacts();
							//$log.log(success.data); 
						}, 
						function (error){ $log.log(error); }
					);
				},
				function(){
					$log.log('cancel');
				}
			)
	}

	$scope.getContacts();
}]);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dialog controllers /////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// projectDialogCtrl
apControllers.controller('projectDialogCtrl', ['$scope', '$mdDialog', '$log', 'dbAPI', 
	function ($scope, $mdDialog, $log, dbAPI) {
	
	$scope.projectData = {};
	$scope.clients = {};
	var localvars = this.locals;

	//get clients
	dbAPI.getRecords('clients', true)
		.then(
			function (success){
				$scope.clients = success.data.clients;
				//$log.log($scope.clients);
			},
			function (error){
				$log.log(error);
			}
		);

	if(localvars){
		angular.forEach(localvars.projectObj, function(value, key){
			$scope.projectData[key] = value;
		});
		delete $scope.projectData.clients;
		delete $scope.projectData.created;
		delete $scope.projectData.last_modified;
	}

	$scope.saveProject = function (){
		if(!localvars){
			dbAPI.addRecord('projects', $scope.projectData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
		else{
			dbAPI.updateRecord('projects', $scope.projectData.id, $scope.projectData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
	}

	$scope.closeDialog = function (){
		$mdDialog.cancel();
	}
}]);

// clientDialogCtrl
apControllers.controller('clientDialogCtrl', ['$scope', '$mdDialog', '$log', 'dbAPI', function ($scope, $mdDialog, $log, dbAPI) {
	
	$scope.clientData = {};
	var localvars = this.locals;

	if(localvars){
		angular.forEach(localvars.clientObj, function(value, key){
			$scope.clientData[key] = value;
		});
	}
	$scope.saveClient = function (){
		if(!localvars){
			dbAPI.addRecord('clients', $scope.clientData)
				.then(
					function (success){
						//$scope.getClients();
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
		else{
			dbAPI.updateRecord('clients', $scope.clientData.id, $scope.clientData)
				.then(
					function (success){
						//$scope.getClients();
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
	}
	$scope.closeDialog = function (){
		$mdDialog.cancel();
	}
}]);

// contactDialogCtrl
apControllers.controller('contactDialogCtrl', ['$scope', '$mdDialog', '$log', 'dbAPI', function ($scope, $mdDialog, $log, dbAPI) {
	
	$scope.contactData = {};
	$scope.clients = {};
	var localvars = this.locals;

	if(!localvars.is_new){
		angular.forEach(localvars.contactObj, function(value, key){
			$scope.contactData[key] = value;
		});
	}
	else{
		$scope.contactData.client_id = localvars.client_id;
	}

	//get clients
	dbAPI.getRecords('clients', true)
		.then(
			function (success){
				$scope.clients = success.data.clients;
				//$log.log($scope.clients);
			},
			function (error){
				$log.log(error);
			}
		);

	$scope.saveContact = function (){
		if(localvars.is_new){
			dbAPI.addRecord('contacts', $scope.contactData)
				.then(
					function (success){
						//$scope.getClients();
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
		else{
			delete $scope.contactData.clients;
			dbAPI.updateRecord('contacts', $scope.contactData.id, $scope.contactData)
				.then(
					function (success){
						//$scope.getClients();
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
			$log.log($scope.contactData);
		}
	}
	$scope.closeDialog = function (){
		$mdDialog.cancel();
	}
}]);

apControllers.controller('jobDialogCtrl', ['$scope', '$mdDialog', '$log', 'dbAPI', function ($scope, $mdDialog, $log, dbAPI) {
	$scope.jobData = {};
	var localvars = this.locals;

	if(!localvars.is_new){
		angular.forEach(localvars.jobObj, function(value, key){
			$scope.jobData[key] = value;
		});
	}

	$scope.saveJob = function (){
		if(localvars.is_new){
			$scope.jobData.parent_id = localvars.parent_id;
			dbAPI.addRecord('jobs', $scope.jobData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
		else{
			dbAPI.updateRecord('jobs', $scope.jobData.id, $scope.jobData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
	}
	$scope.closeDialog = function (){
		$mdDialog.cancel();
	}
}]);

apControllers.controller('taskDialogCtrl', ['$scope', '$mdDialog', '$log', 'dbAPI', function ($scope, $mdDialog, $log, dbAPI) {
	$scope.taskData = {};
	var localvars = this.locals;

	if(!localvars.is_new){
		angular.forEach(localvars.jobObj, function(value, key){
			$scope.taskData[key] = value;
		});
	}

	$scope.saveTask = function (){
		if(localvars.is_new){
			$scope.taskData.parent_id = localvars.parent_id;
			dbAPI.addRecord('tasks', $scope.taskData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
		else{
			dbAPI.updateRecord('tasks', $scope.taskData.id, $scope.taskData)
				.then(
					function (success){
						$mdDialog.hide();
					}, 
					function (error){ $log.log(error); });
		}
	}
	$scope.closeDialog = function (){
		$mdDialog.cancel();
	}
}]);