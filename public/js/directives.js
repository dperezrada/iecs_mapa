'use strict';

/* Directives */

angular.module('mapa.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  // }).
  // directive('filterYear', function () {
  // 	return function (scope, elem, attrs){
  // 		elem.bind("ngChange", function (){
  // 			if(!attrs.checked){
  // 				for(var i in scope.years[attrs.value]){
  // 					for(var j in scope.countries){
  // 						scope.countries[j].remove(scope.years[attrs.value][i])
  // 					}
  // 				}
  // 			}
  // 		});
  // 	}
  }).
  directive('cellContent', function ($filter){
    return function(scope, elm, attrs) {
      var cell = function (){
        var content = {'participants': 0, 'incidence': 0, 'w': 0, 'xw': 0, 'count': 0, 'ci_l': 0, 'ci_u': 0};
        var active_filter = attrs.activeFilter;
        var incidences = [];
        if(active_filter){
          var pathology = $.parseJSON(attrs.pathology);
          var studies = $.parseJSON(attrs.studies);
          var denom = pathology.outcomes[active_filter].denom;
          var filtered_list = $filter('filter')(pathology.outcomes[active_filter].options, {checked:true});
          var selected_option = null;
          if(filtered_list.length){
            selected_option = filtered_list[0].name;
          }
          for(var i in studies){
            var participants = studies[i];
            angular.forEach(denom.split('.'), function(key){
              participants = participants[key];
            });
            participants = parseInt(participants);
            var incidence = parseInt(studies[i]['Outcomes'][active_filter][selected_option]);
            if(!isNaN(participants)) content['participants'] += participants;
            else participants = 0;
            if(!isNaN(incidence)){
              incidences.push(incidence);
              content['incidence'] += incidence;
            } 
            else incidence = 0;
            var x = Math.asin(Math.sqrt(incidence/(participants + 1.0))) + Math.asin(Math.sqrt((incidence + 1.0)/(participants + 1.0)));
            var se = Math.sqrt(1.0/(participants + 1.0));
            var w = 1.0/(se*se);
            var xw = x*w;
            content['xw'] += xw;
            content['w'] += w;
          }
          var coef = content['xw']/content['w'];
          var ll = coef - (1.96 * Math.sqrt(1.0/content['w']));
          var ul = coef + (1.96 * Math.sqrt(1.0/content['w']));
          content['ci_l'] = 100.0 * Math.pow(Math.sin(ll/2.0), 2);
          content['ci_u'] = 100.0 * Math.pow(Math.sin(ul/2.0), 2);
          content['incidence'] = 100.0 * Math.pow(Math.sin(coef/2.0), 2);
          content['count'] = studies.length;
          content['median'] = incidences.sort()[Math.floor(incidences/2 - 1)];
        }
        elm.html("<table><tr>"+
                    "<td>" + content['participants'] + "</td>" +
                    "<td class='prevalence'>" + $filter('number')(content['incidence'], 2) + "</td></tr>" +
                  "<tr>" +
                    "<td>(" + content['count'] + ")</td>" +
                    "<td>" + $filter('number')(content['ci_l'], 2) + ' - ' + $filter('number')(content['ci_u'],2) +"</td></tr></table>");
        scope.data.randN = Math.random();
      }
      attrs.$observe('studies', cell);
      attrs.$observe('pathology', cell);
      attrs.$observe('activeFilter', cell);
    }
  }).
  directive('mapa', function($filter){
    return {
      restrict: 'A',
      link: function(scope, elm, attrs){
          var color = d3.scale.threshold().
                    domain([25,50,75,100]).
                    range(['lightgrey', '#B2DFEE', '#50A6C2', '#00688B']);
          var colorMap = function(){
            var countries = $filter('filter')(scope.data.country);
            $('path').css('fill', '#838B8B');
            angular.forEach(countries, function(country){
              if(country.checked){
                var prevalence = $(".total." + country.code + " td.prevalence").text();
                var selector = '.' + country.code + ' path, path.' + country.code;
                $(selector).css('fill', color(prevalence));
              }  
            })
          }
          scope.$watch('data', colorMap, true);
      }
    }
  })
  ;
