var app = angular.module('LocalVotingApp', []);

app.factory('DataService', function($q, $http) {
    return {
        getData: function(address) {
            var defer = $q.defer();
            var addr = encodeURIComponent(address);
            $http.get('https://www.googleapis.com/civicinfo/v2/voterinfo?address=' + addr + '&key=AIzaSyB16sS2CG5ySFh--gRk0S8s90yDbJX_fJU', {
                    cache: 'true'
                })
                .success(function(data) {
                    defer.resolve(data);
                });

            return defer.promise;
        }
    };
});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

app.controller('MainController', function($scope, DataService) {
    $scope.gPlace;

    //$scope.address = '';
    $scope.address = '';
    $scope.civicInfo = null;

    $scope.getCivicInfo = function() {
        DataService.getData($scope.address).then(function(data) {
            $scope.civicInfo = data;

            $scope.civicInfo.election.electionDOTW = moment($scope.civicInfo.election.electionDay).format('dddd');
            $scope.civicInfo.election.electionDay = moment($scope.civicInfo.election.electionDay).format('MMMM D, YYYY');
            console.log(data);
        });
    };
});

/*
    $scope.address = '';

  //$scope.voted = 'none';
  $scope.voted = {};


  DataService.getData().then(function(data){
    $scope.candidates = data.candidates;
    $scope.candidates.forEach(function(element, index){
      element.index = index;
    });
  });

  $scope.changeVote = function(flag, iss, cName, ina) {
    names = cName + ina + iss.description;
    voted = "none";
    console.log(ina);

    if (names in $scope.voted) {
      voted = $scope.voted[names];
    } else {
      if (flag == 'up') {
        $scope.voted[names] = 'up';
      } else {
        $scope.voted[names] = 'down';
      }
    }

    if (voted == 'none') {
      if (flag == 'up') {
        iss.up++;
      } else {
        iss.down++;
      }
      $scope.voted[names] = flag;
    } else {
      if (voted == 'up' && flag == 'up') {
        iss.up--;
        $scope.voted[names] = 'none';
      } else if (voted == 'up' && flag == 'down') {
        iss.up--;
        iss.down++;
        $scope.voted[names] = flag;
      } else if (voted == 'down' && flag == 'down') {
        iss.down--;
        $scope.voted[names] = 'none';
      } else if (voted == 'down' && flag == 'up') {
        iss.up++;
        iss.down--;
        $scope.voted[names] = flag;
      }
    }

  }

  $scope.newIssue = {};

  $scope.addNewIssue = function($event, index) {
    $scope.newIssue.up = 0;
    $scope.newIssue.down = 0;
    console.log($scope.candidates);
    console.log(index);
    $scope.candidates[index].issues.push($scope.newIssue);
    $scope.newIssue = {};
    $event.preventDefault();
  }
  */
