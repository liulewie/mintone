var app = angular.module('Mintone', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/talents', {
            templateUrl: 'partials/talents.html',
            controller: 'TalentsCtrl'
        })
        .when('/releases', {
            templateUrl: 'partials/releases.html',
            controller: 'ReleasesCtrl'
        })
        .when('/events', {
            templateUrl: 'partials/events.html',
            controller: 'EventsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var News = $resource('/api/news');
        News.query(function(news){
            $scope.news = news;
        });
    }]);

app.controller('TalentsCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Talents = $resource('/api/talents');
        Talents.query(function(talents){
            $scope.talents = talents;
        });
    }]);

app.controller('ReleasesCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Releases = $resource('/api/releases');
        Releases.query(function(releases){
            $scope.releases = releases;
        });
    }]);

app.controller('EventsCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Events = $resource('/api/events');
        Events.query(function(events){
            $scope.events = events;
        });
    }]);