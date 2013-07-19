'use strict';

/* Controllers */

angular.module('mapa.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!'
    });

  }).
  controller('Pathology', function ($scope, $http, $routeParams) {
    this.years = {};
    this.countries = {};
    this.age_ranges = {}
    this.studies = [];
    var self = this;
    $scope.years = [];
    $scope.countries = [];
    $scope.age_ranges = [];
    $scope.show_studies = [];
    $scope.table_content = [];
    $scope.table = {'column': 'year', 'row': 'country'};
    $http({
      method: 'GET',
      url: '/api/pathology/' + $routeParams['pathology']
    }).
    success(function (data, status, headers, config){
      self.studies = data.studies;
      $scope.studies = self.studies;
      $scope.pathology = data.pathology;
      for(var study in data.studies){
        data.studies[study]['Año'] in self.years? self.years[data.studies[study]['Año']].push(study): self.years[data.studies[study]['Año']] = [study];
        data.studies[study]['Country'] in self.countries? self.countries[data.studies[study]['Country']].push(study): self.countries[data.studies[study]['Country']] = [study];
        data.studies[study]['Age Range'] in self.age_ranges? self.age_ranges[data.studies[study]['Age Range']].push(study): self.age_ranges[data.studies[study]['Age Range']] = [study];
      }
      for(var i in self.years){
        $scope.years.push({'year': i, 'studies': self.years[i], 'checked': true})
      }
      for(var i in self.countries){
        $scope.countries.push({'country': i, 'studies': self.countries[i]})
      }
      for(var i in self.age_ranges){
        $scope.age_ranges.push({'age_range': i, 'studies': self.countries[i]})
      }
      $scope.age_range = "Age range";
      $scope.indicators = Object.keys(data.pathology.outcomes);
      $scope.filters = [];
    }).
    error(function (data, status, headers, config) {
      $scope.years = [];
    });
    $scope.changeYear = function (index){
      var years = angular.fromJson(angular.toJson($scope.years));
      for(var i in years[index].studies){
        if(!years[index].checked){
          for(var j in $scope.countries){
            var ind = $scope.countries[j].studies.indexOf(years[index].studies[i]);
            if(ind >= 0){
              $scope.countries[j].studies.splice(ind, 1);
            }
          }
        }
        else{
          var country = self.studies[years[index].studies[i]]['Country'];
          for(var j in $scope.countries){
            if($scope.countries[j].country == country){
              if($scope.countries[j].studies.indexOf(years[index].studies[i]) < 0){
                $scope.countries[j].studies.push(years[index].studies[i]);
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
    $scope.getTableDocs = function (){
      var years = angular.fromJson(angular.toJson($scope.years));
      var countries = angular.fromJson(angular.toJson($scope.countries));
      for(var y in $scope.years){
        if($scope.years[y].checked){
          $scope.show_studies[$scope.years[y].year] = [];
          $scope.table_content[$scope.years[y].year] = [];
          for(var c in $scope.countries){
            if($scope.countries[c].checked){
              var selector = jlinq.from(self.studies).equals('Country', $scope.countries[c].country).equals('Año', parseInt($scope.years[y].year)).equals('Age Range', $scope.age_range);
              // for(var qwr in $scope.pathology.indicator[active_filter]){
              //   selector = selector.or().greater('Outcomes.' + active_filter + '.' + qwr, 0);
              // }
              $scope.show_studies[$scope.years[y].year][$scope.countries[c].country] = selector.select();
              $scope.table_content[$scope.years[y].year][$scope.countries[c].country] = {count:0};
              for(var study in $scope.show_studies[$scope.years[y].year][$scope.countries[c].country]){
                if(!isNaN(parseInt($scope.show_studies[$scope.years[y].year][$scope.countries[c].country][study]['Outcomes'][$scope.active_filter][$scope.selected_filter]))){
                  $scope.table_content[$scope.years[y].year][$scope.countries[c].country].count +=  parseInt($scope.show_studies[$scope.years[y].year][$scope.countries[c].country][study]['Outcomes'][$scope.active_filter][$scope.selected_filter]);
                }
              }

            }
          }
        }
      }
    };
    $scope.showFilter = function(filters){
      return filters > 1;
    }
    

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
