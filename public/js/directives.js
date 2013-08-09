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
        var studies = $filter('orderBy')($.parseJSON(attrs.studies), 'year');
        if(studies.length == 0){
           elm.html("");
           return;
        }
        var active_filter = attrs.activeFilter;
        var incidences = [];
        var popover = "";
        if(active_filter){
          var pathology = $.parseJSON(attrs.pathology);
          var denom = pathology.outcomes[active_filter].denom;
          var filtered_list = $filter('filter')(pathology.outcomes[active_filter].options, {checked:true});
          var selected_option = null;
          if(filtered_list.length){
            selected_option = filtered_list[0].name;
          }
          popover += "<div class='popover-studies'><table><tr><th>Estudio</th><th>Año</th><th>N</th></tr>"
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
            popover += "<tr><td>" + studies[i].Estudio + "</td><td>" + studies[i].year + "</td><td>" + participants + "</td></tr>"
          }
          var coef = content['xw']/content['w'];
          var ll = coef - (1.96 * Math.sqrt(1.0/content['w']));
          var ul = coef + (1.96 * Math.sqrt(1.0/content['w']));
          content['ci_l'] = 100.0 * Math.pow(Math.sin(ll/2.0), 2);
          content['ci_u'] = 100.0 * Math.pow(Math.sin(ul/2.0), 2);
          content['incidence'] = 100.0 * Math.pow(Math.sin(coef/2.0), 2);
          content['count'] = studies.length;
          content['median'] = incidences.sort(function(a,b){return a-b})[Math.floor(incidences.length/2)];
          popover += "<th>Total</th><th></th><th>" + content['participants'] + " (" + studies.length + ")</th></table></div>"
        }
        var prevalence = denom=='median'?content['median']:$filter('number')(content['incidence'], 2)
        // elm.html("<table><tr>"+
        //             "<td>" + content['participants'] + "</td>" +
        //             "<td class='prevalence'>" + prevalence + "</td></tr>" +
        //           "<tr>" +
        //             "<td>(" + content['count'] + ")</td>" +
        //             "<td>" + $filter('number')(content['ci_l'], 2) + ' - ' + $filter('number')(content['ci_u'],2) +"</td></tr></table>");
        elm.html("<ul class='unstyled'><li class=\"prevalence\">"
                  + prevalence + "</li>"
                  + "<li class='ic'>(" + $filter('number')(content['ci_l'], 2) + ' - ' + $filter('number')(content['ci_u'],2) +")</li>"
                  + "</ul>");
        // $(elm).attr('data-content')
        $(elm).popover({container: 'body', placement: 'left', content: popover, html: true, trigger: 'manual'});
        $(elm).mouseup(function(){$(this).popover('show')});
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
                    range(['lightgrey', '#B2DFEE', '#50A6C2', '#00688B']);
          var colorMap = function(){
            var countries = scope.data.country;
            $('path').css('fill', '#838B8B');
            if($filter('filter')(scope.pathology.outcomes[scope.active_filter].options, {checked:true}).length){
              countries = $filter('filter')(countries, {checked: true});
              angular.forEach(countries, function(country){
                country.prevalence = parseFloat($(".total." + country.code + " .prevalence").text());
              });
              var prevalences = $filter('extractField')(countries, 'prevalence');
              var prevalences_ = [];
              for(var i in prevalences){
                if(!isNaN(prevalences[i])){
                  prevalences_.push(prevalences[i]);
                }
              }
              prevalences_.sort(function(a,b){return a-b});
              console.log(prevalences_);
              var domain = [];
              for(var i=1;i<=4;i++)
                domain.push(i*prevalences_[prevalences_.length-1]/4);
              domain[3]+=1;
              console.log(domain);
              color.domain(domain);
              angular.forEach(countries, function(country){
                console.log(country)
                if(country.studies.length){
                  var selector = '.' + country.code + ' path, path.' + country.code;
                  if(!isNaN(country.prevalence))
                    $(selector).css('fill', color(country.prevalence));
                }  
              });
            }
          }
          scope.$watch('data', colorMap, true);
      }
    }
  }).
  directive('triStateCheckbox', function() {
  return {
    replace: true,
    restrict: 'E',
    scope: { checkboxes: '=' },
    template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
    controller: function($scope, $element) {
      $scope.masterChange = function() {
        if($scope.master) {
          angular.forEach($scope.checkboxes, function(cb, index){
            cb.checked = true;
          });
        } else {
          angular.forEach($scope.checkboxes, function(cb, index){
            cb.checked = false;
          });
        }
      };
      $scope.$watch('checkboxes', function() {
        var allSet = true, allClear = true;
        angular.forEach($scope.checkboxes, function(cb, index){
          if(cb.checked) {
            allClear = false;
          } else {
            allSet = false;
          }
        });
        if(allSet)        { 
          $scope.master = true; 
          $element.prop('indeterminate', false);
        }
        else if(allClear) { 
          $scope.master = false; 
          $element.prop('indeterminate', false);
        }
        else { 
          $scope.master = false;
          $element.prop('indeterminate', true);
        }
      }, true);
    }
  };
});
