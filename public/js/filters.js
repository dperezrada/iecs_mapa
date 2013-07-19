'use strict';

/* Filters */

angular.module('mapa.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }).
  filter('cell_content', function ($filter){
  	return function (studies, pathology, active_filter) {
  		var content = {'participants': 0, 'incidence': 0};
  		if(active_filter){
	  		var denom = pathology.outcomes[active_filter].denom;
	  		var filtered_list = $filter('filter')(pathology.outcomes[active_filter].options, {checked:true});
	  		var selected_option = null;
	  		if(filtered_list.length){
	  			selected_option = filtered_list[0].name;
	  		}
	  		console.log(selected_option)
	  		for(var i in studies){
	  			if(!isNaN(parseInt(studies[i][denom])))
	  				content['participants'] += parseInt(studies[i][denom]);
	  			if(!isNaN(parseInt(studies[i]['Outcomes'][active_filter][selected_option])))
	  				content['incidence'] += parseInt(studies[i]['Outcomes'][active_filter][selected_option]);
	  		}
	  		content['incidence'] *= 100.0;
	  		content['incidence'] /= content['participants'];
	  	}
	  	return content;
  	}
  }).
  filter('measured', function(){
  	return function (studies, outcome){
  		var measured_studies = [];
  		for(var study in studies){
  			var measured = 0;
  			for(var option in studies[study]['Outcomes'][outcome]){
  				measured += studies[study]['Outcomes'][outcome];
  			}
  			if(measured){
  				measured_studies.push(studies[study]);
  			}
  		}
  		return measured_studies;
  	}
  })
  ;
