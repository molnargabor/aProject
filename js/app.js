'use strict';

var aProject = angular.module('aProject', [
	'ngRoute',
	'ngMaterial',
	'ngAnimate',
	'ngAria',
	'apControllers',
	'apServices'/*,
	'ngDreamFactory'*/
]);

/*************************/
/* Dreamfactory settings */
/*************************/

/*aProject
.constant('DSP_URL', 'https://dsp-aproject.cloud.dreamfactory.com')
.constant('DSP_API_KEY', 'aProject');

aProject.config(['$httpProvider', 'DSP_API_KEY', function($httpProvider, DSP_API_KEY) {
    $httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = DSP_API_KEY;
}]);*/

/**********/
/* Router */
/**********/

aProject.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	/*.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'HomeCtrl'
	})*/
	.when('/projects', {
		templateUrl: 'templates/projects.html',
		controller: 'ProjectsCtrl'
	})
	.when('/projects/:id', {
		templateUrl: 'templates/projectdetails.html',
		controller: 'ProjectdetailsCtrl'
	})
	.when('/clients', {
		templateUrl: 'templates/client-settings.html',
		controller: 'ClientSettingsCtrl'
	})
	.when('/contacts', {
		templateUrl: 'templates/contact-settings.html',
		controller: 'ContactSettingsCtrl'
	})
	.otherwise({ redirectTo: '/projects' });
}]);

/*****************/
/* Color palette */
/*****************/

aProject.config(function($mdThemingProvider) {
	var artworxxCyan = $mdThemingProvider.extendPalette('cyan', {
		'500':'6ec0c7'
	});
	$mdThemingProvider.definePalette('artw-cyan', artworxxCyan);
  	$mdThemingProvider.theme('default')
    .primaryPalette('artw-cyan', {'default':'500'})
    .accentPalette('red');
    //.primaryPalette('artworxxPalette');
});