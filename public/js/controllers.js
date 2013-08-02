'use strict';

/* Controllers */

angular.module('mapa.controllers', []).
  controller('header', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/pathologies'
    }).
    success(function (data, status, headers, config) {
      $scope.pathologies = data.pathologies;
    }).
    error(function (data, status, headers, config) {
      $scope.pathologies = 'Error!'
    });

  }).
  controller('Pathology', function ($scope, $http, $routeParams) {
    this.years = {};
    this.countries = {};
    this.age_ranges = {}
    this.studies = [];
    var self = this;
    $scope.data = {'year': [], 'country': [], 'age_range': []};
    $scope.table = {'column': 'year', 'row': 'country', 'filter': []};
    $scope.positions = {'year': 'column', 'country': 'row', 'age_range': 'filter'}
    $http({
      method: 'GET',
      url: '/api/pathology/' + $routeParams['pathology']
    }).
    success(function (data, status, headers, config){
      $scope.studies = data.studies;
      $scope.pathology = data.pathology;
      var COUNTRY_CODES = {'Argentina': 'ar', 'Brasil': 'br', 'Chile': 'cl', 'Colombia': 'co', 'Cuba': 'cu', 'Ecuador': 'ec', 'Guatemala': 'gt', 'México': 'mx', 'Panamá': 'pa', 'Paraguay': 'py', 'Perú': 'pe', 'Rep. Dominicana': 'do', 'Uruguay': 'uy', 'Venezuela': 've'};
      for(var study in data.studies){
        data.studies[study]['year'] in self.years? self.years[data.studies[study]['year']].push(study): self.years[data.studies[study]['year']] = [study];
        data.studies[study]['country'] in self.countries? self.countries[data.studies[study]['country']].push(study): self.countries[data.studies[study]['country']] = [study];
        data.studies[study]['Age Range'] in self.age_ranges? self.age_ranges[data.studies[study]['Age Range']].push(study): self.age_ranges[data.studies[study]['Age Range']] = [study];
      }
      for(var i in self.years){
        $scope.data.year.push({'name': i, 'studies': self.years[i], 'checked': true});
      }
      for(var i in self.countries){
        $scope.data.country.push({'name': i, 'studies': self.countries[i], 'code': COUNTRY_CODES[i]});
      }
      for(var i in self.age_ranges){
        $scope.data.age_range.push({'name': i, 'studies': self.age_ranges[i]});
      }
      $scope.age_range = "Age range";
      $scope.indicators = Object.keys(data.pathology.outcomes);
      $scope.filters = [];
    }).
    error(function (data, status, headers, config) {
      $scope.years = [];
    });
    $scope.changeYear = function (index){
      var years = angular.fromJson(angular.toJson($scope.data.year));
      for(var i in years[index].studies){
        if(!years[index].checked){
          for(var j in $scope.data.country){
            var ind = $scope.data.country[j].studies.indexOf(years[index].studies[i]);
            if(ind >= 0){
              $scope.data.country[j].studies.splice(ind, 1);
              if($scope.data.country[j].studies.length == 0){
                $scope.data.country[j].checked = false;
              }
            }
          }
        }
        else{
          var country = $scope.studies[years[index].studies[i]]['country'];
          for(var j in $scope.data.country){
            if($scope.data.country[j].name == country){
              if($scope.data.country[j].studies.indexOf(years[index].studies[i]) < 0){
                $scope.data.country[j].studies.push(years[index].studies[i]);
                break;
              }
            }
          }
        }
      }
    };
    $scope.selectRange = function (range){
      $scope.age_range = range.age_range;
    }
    $scope.selectFilter = function (selected_filter){
      $scope.selected_filter = selected_filter;
      $scope.getTableDocs();
    }
    $scope.objComperator = function(obj, searchObj){
      for(var i in searchObj){
        if(searchObj[i] != obj[i]) return false;
      }
      return true;
    }
    $scope.changeTable = function(field, pos){
      var prev_pos;
      angular.forEach($scope.table, function(val, key){
        if(val == field || val.indexOf(field) >= 0){
          prev_pos = key;
        }
      });

      if(pos != 'filter'){
        var prev = $scope.table[pos];
        if(prev_pos == 'filter'){
          $scope.table[prev_pos].splice(val.indexOf(field), 1);
          $scope.table[prev_pos].push(prev);
        }
        else{
          $scope.table[prev_pos] = prev;
        }
        $scope.table[pos] = field;
        if(prev) $scope.positions[prev] = prev_pos;
      }
      else{
        $scope.table['filter'].push(field);
        $scope.table[prev_pos] = '';
      }
    }

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
