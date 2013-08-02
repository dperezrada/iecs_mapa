'use strict';

/* Filters */

angular.module('mapa.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }).
  // filter('cell_content', function ($filter){
  // 	return function (studies, pathology, active_filter) {
  		
  // 	}
  // }).
  filter('measured', function(){
  	return function (studies, outcome, pathology){
  		var measured_studies = [];
      if(outcome){
    		for(var study in studies){
    			var measured = 0;
    			for(var option in studies[study]['Outcomes'][outcome]){
    				var value = parseInt(studies[study]['Outcomes'][outcome][option]);
            if(!isNaN(value))
              measured += value;
    			}
          var participants = studies[study];
          angular.forEach(pathology.outcomes[outcome]['denom'].split('.'), function(key){
            participants = participants[key];
          });
          participants = parseInt(participants);
    			if(measured && !isNaN(participants) && participants){
    				measured_studies.push(studies[study]);
    			}
    		}
      }
  		return measured_studies;
  	}
  }).
  filter('filterIn', function(){
    return function (list, field, accepted_values){
      var out = [];
      for(var i in list){
        if(accepted_values.indexOf('' + list[i][field]) >= 0){
          out.push(list[i]);
        }
      }
      return out;
    }
  }).
  filter('extractField', function(){
    return function (list, field) {
      var out = [];
      for(var i in list){
        out.push(list[i][field]);
      }
      return out;
    }
  }).
  filter('filterByField', function(){
    return function (list, key, value){
      var out = [];
      for(var index in list){
        if(list[index][key] == value){
          out.push(list[index]);
        }
      }
      return out;
    }
  }).
  filter('hasProperty', function(){
    return function(list, key){
      var out = [];
      angular.forEach(list, function(obj){
        if(obj[key] && obj[key].length){
          out.push(obj);
        }
      });
      return out;
    }
  })
  ;
