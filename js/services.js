'use strict';

var apServices = angular.module('apServices', []);

apServices.factory('dbAPI', ['$http', function ($http) {
	
	var _getRecords = function (tablename, transform, filter){
		var ending = '';

		if(transform){
			ending = '?transform=1';
			if(filter != '') ending += '&filter=' + filter;
		}
		else{
			if(filter != '') ending = '?filter=' + filter;
		}

		return $http.get('http://localhost/php/api.php/' + tablename + ending);
	}
	var _addRecord = function (tablename, body){
		return $http.post('http://localhost/php/api.php/' + tablename, body);
	}
	var _deleteRecord = function (tablename, id){
		return $http.delete('http://localhost/php/api.php/' + tablename + '/' + id);
	}
	var _updateRecord = function (tablename, id, body){
		return $http.put('http://localhost/php/api.php/' + tablename + '/' + id, body);
	}
	var _relations = function (tables){
		return mysql_crud_api_transform(tables);
	}

	return {
		getRecords: _getRecords,
		addRecord: _addRecord,
		deleteRecord: _deleteRecord,
		updateRecord: _updateRecord,
		relations: _relations
	};
}]);

apServices.factory('Timestamp', [function () {
	var _getTimeStamp = function (){
		return Date.now();
	}

	return {
		getTimeStamp: _getTimeStamp
	};
}])