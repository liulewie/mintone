var app = angular.module('Mintone', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'angular-inview']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl',
			css: 'stylesheets/home.css'
		})
		.when('/talents', {
			templateUrl: 'partials/talents.html',
			controller: 'TalentsCtrl',
			css: 'stylesheets/talents.css'
		})
		.when('/releases', {
			templateUrl: 'partials/releases.html',
			controller: 'ReleasesCtrl',
			css: ['stylesheets/releases.css', 'stylesheets/releaseModal.css']
		})
		.when('/events', {
			templateUrl: 'partials/events.html',
			controller: 'EventsCtrl',
			css: 'stylesheets/events.css'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.controller('NavCtrl', ['$scope', '$log', '$location', '$timeout',
	function ($scope, $log, $location, $timeout) {
		$scope.isHeaderCollapsed = true;
		$scope.isFooterCollapsed = true;
		$scope.isCollapsedHorizontal = false;
		$scope.exitSequence = {};

		$scope.menuItems = ['Home', 'Talents', 'Releases', 'Events', 'About', 'Contact', 'License'];
		// $scope.activeMenu = $scope.menuItems[0];

		$scope.setActive = function(menuItem) {
			
			if($scope.activeMenu !== menuItem){
				// toggle header collapse
				$scope.activeMenu = menuItem;
				$scope.isHeaderCollapsed = true;
				// redirecting to a different page after playing exiting sequence
				var delay = $scope.exitSequence();
				$timeout(function(){
					$location.path(menuItem);
				}, delay);
			}
		}

		// handle for child scope to define exit sequence
	}]);

app.controller('HomeCtrl', ['$scope', '$resource', '$log',
	function($scope, $resource, $log){

		// api calls to retrieve data
		var News = $resource('/api/news');
		News.query(function(news){
			// add the id index to each slide in slides
			var slides = news;
			slides.forEach(function(slide, index){
				// adding the id in reverse order so the most recent news has id = 0
				slide.id = slides.length - index - 1;
			});
			slides.reverse();
			$scope.slides = slides;
		});
		
		$scope.limit = 4;
		// $scope.begin = 0;
		$scope.active = 0;
		$scope.myInterval = 0;
		$scope.noWrapSlides = false;

		// this function is always called by parent scope before redirecting
		$scope.$parent.exitSequence = function(){
			$log.log("HomeCtrl exit sequence triggered");
		};

		// $scope.slides = [];
		// var slides = $scope.slides = [];
		// var currIndex = 0;

	}]);

app.controller('TalentsCtrl', ['$scope', '$resource', '$timeout', '$log',
	function($scope, $resource, $timeout, $log){

		$scope.talents = [];
		$scope.activeTalent = 'none';
		$scope.activeTalentBackgroundURL = "";

		var Talents = $resource('/api/talents');
		Talents.query(function(talents){
			// for (var i = talents.length - 1; i >= 0; i--) {
			// 	$timeout(function(i){
			// 		return function(){
			// 			$scope.talents.push(talents[i]);
			// 			$scope.$apply();
			// 		};
			// 	}(i), 150 * i);
			// }
			$scope.talents = talents;
		});

		$scope.timedVisible = function(index){
			$log.info(index);
			return $timeout(true, 150 * index);
		};

		$scope.setActive = function(index) {
			var talentName = $scope.talents[index].name;

			if(talentName === $scope.activeTalent){
				$scope.activeTalent = 'none';
				$scope.activeTalentBackgroundURL = "";
			}else{
				$scope.activeTalent = talentName;
				$scope.activeTalentBackgroundURL = $scope.talents[index].backgroundURL;
				// for (var i = $scope.talents.length - 1; i >= 0; i--) {
				// 	if($scope.talents[i].name === talentName){
				// 		$scope.activeTalentBackgroundURL = 
				// 			$scope.talents[i].imageURL;
				// 	}
				// }
			}
		};

		// this function is always called by parent scope before redirecting
		$scope.$parent.exitSequence = function(){
			$log.log("TalentsCtrl exit sequence triggered");
		};



	}]);

app.controller('ReleasesCtrl', ['$scope', '$resource', '$log', '$uibModal', '$filter', '$timeout',
	function($scope, $resource, $log, $uibModal, $filter, $timeout){
		var Releases = $resource('/api/releases');
		Releases.query(function(releases){
			releases.sort(function(a, b){
				var dateA = new Date(a.releasedate);
				var dateB = new Date(b.releasedate);
				return dateB - dateA;
			});

			// Add the label text to each release object
			releases.forEach(function(release, index){
				release.labelText = $scope.labelText(release.releasedate);
			});

			$scope.releases = releases;

		});

		$scope.arrayToString = function(arr){
			return arr.join(", ");
		};

		
		$scope.labelText = function(releaseDate){
			var oneDay = 24*60*60*1000;
			var today = new Date();
			var releaseDate = new Date(releaseDate);
			var dayDiff = Math.round((today.getTime() - releaseDate.getTime())/(oneDay));
			
			$log.info('day diff = '+dayDiff);

			if(dayDiff < 0){
				return 'pre-order';
			}else if(dayDiff < 90){
				return 'new';
			}else{
				return '';
			}
		};


		// this function is always called by parent scope before redirecting
		$scope.$parent.exitSequence = function(){
			$log.log("ReleasesCtrl exit sequence triggered");

			var releases = angular.element(document.getElementsByClassName('mt-release'));
			var TIMEOUTPERIODINMS = 100;
			var ANIMATIONDURATION = 1000;

			angular.forEach(releases, function(value, index){
				var release = angular.element(value);
				
				$timeout(
					function(){
						release.addClass('mt-exit');
						// if(events.length -1 === index){
						// 	$log.log("I am the last element");
						// }
					}, 
					TIMEOUTPERIODINMS * index);
			});

			// return the amount of time that should be delayed
			return TIMEOUTPERIODINMS * (releases.length - 1)+ ANIMATIONDURATION;
		};

		// $scope.activeReleaseIndex = -1;
		// $scope.setActive = function(index){
		// 	$scope.activeReleaseIndex = index;

		$scope.open = function (index, size, parentSelector) {
			var parentElem = parentSelector ? 
				angular.element($document[0].querySelector('.mt-releases ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '/partials/releaseModal.html',
				controller: 'ModalInstanceCtrl',
				// controllerAs: '$ctrl',
				size: 'large',
				appendTo: parentElem,
				resolve: {
					release: function () {
						return $scope.releases[index];
					}
				}
			});

			modalInstance.result.then(
				function () {
					// $ctrl.selected = selectedItem;
					$log.info('Modal closed at: ' + new Date());
				}, 
				function () {
					$log.info('Modal dismissed at: ' + new Date());
				}
			);
		};
	}]);

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, release) {

	$scope.release = release;

	// $scope.ok = function () {
	//   $uibModalInstance.close($ctrl.selected.item);
	// };

	// $scope.cancel = function () {
	//   $uibModalInstance.dismiss('cancel');
	// };
});


app.controller('EventsCtrl', ['$scope', '$resource', '$log', '$window', '$timeout',
	function($scope, $resource, $log, $window, $timeout){

		$scope.activeEventID = -1;

		var Events = $resource('/api/events');
		Events.query(function(events){
			$scope.events = events;
			// $scope.$emit("eventsLoaded");
			// $log.log("eventsLoaded emitted");
		});



		// note the index passed here is the sorted ng-repeat index and not the same as the index of the array
		$scope.setActive = function(index) {
			// var activeEventID = $scope.events[index]._id;
			var activeEventID = index;

			if(activeEventID === $scope.activeEventID){
				$scope.activeEventID = -1;
			}else{
				$scope.activeEventID = activeEventID;
			}
		};

		// this function is always called by parent scope before redirecting
		// exit sequence when user navigates away from the page
		// returns the amount of time the controller should wait
		$scope.$parent.exitSequence = function(){
			$log.log("EventsCtrl exit sequence triggered");

			// collapsing any active events
			$scope.activeEventID = -1;

			var events = angular.element(document.getElementsByClassName('mt-event'));
			var TIMEOUTPERIODINMS = 150;
			var ANIMATIONDURATION = 1000;

			angular.forEach(events, function(value, index){
				var event = angular.element(value);
				
				$timeout(
					function(){
						event.addClass('mt-exit');
						// if(events.length -1 === index){
						// 	$log.log("I am the last element");
						// }
					}, 
					TIMEOUTPERIODINMS * index);
			});

			// return the amount of time that should be delayed
			return TIMEOUTPERIODINMS * (events.length - 1)+ ANIMATIONDURATION;
		};

		// var result = document.getElementsByClassName("mt-heading-talent-wrapper");
		// var talentWrapper = angular.element(result);
		// $scope.width = talentWrapper.clientWidth;
		// $log.info($scope.width);

		// $scope.ellipsis = function(element){
		// 	var result = document.getElementsByClassName("mt-heading-talent-wrapper");
		// 	var talentWrapper = angular.element(result);
		// 	if(talentWrapper.clientWidth < 100){
		// 		$log.info("hello");
		// 	}
		// 	$log.info(element.clientWidth);
		// 	if(element.clientWidth > 30){
		// 		$log.info("hello");
		// 		return true;
		// 	}else{
		// 		return false;
		// 	}
		// }

		
		// var onResize = function () {
		//     var element = angular.element(document.getElementsByClassName('mt-event-talent'));
		//     $log.log(element);
		//     angular.forEach(element, function(value, key){
		//          var a = angular.element(value);
		//          var parentWidth = a.parent()[0].clientWidth;
		//          var myWidth = a[0].clientWidth;
		//          $log.log("parentWidth = "+parentWidth+" myWidth = "+myWidth);

		//          var parentOffsetRight = a.parent()[0].offsetLeft + a.parent()[0].offsetWidth;
		//          var myOffsetRight = a[0].offsetLeft + a[0].offsetWidth;
		//          $log.log(a[0].innerText+": parentOffsetRight = "+parentOffsetRight+" myOffsetRight = "+myOffsetRight);

		//          if(myOffsetRight > parentOffsetRight){
		//          	$log.log(a[0].innerText+": hidden");
		//          }else{
		//          	$log.log(a[0].innerText+": show");
		//          }

		//     });
		//     $scope.$apply();
		//     $log.log("window resized");
		// };

		// angular.element($window).on('resize', onResize);


	}]);

// directive for using partial-specific css file in routing
app.directive('head', ['$rootScope','$compile',
	function($rootScope, $compile){
		return {
			restrict: 'E',
			link: function(scope, elem){
				var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
				elem.append($compile(html)(scope));
				scope.routeStyles = {};
				$rootScope.$on('$routeChangeStart', function (e, next, current) {
					if(current && current.$$route && current.$$route.css){
						if(!angular.isArray(current.$$route.css)){
							current.$$route.css = [current.$$route.css];
						}
						angular.forEach(current.$$route.css, function(sheet){
							delete scope.routeStyles[sheet];
						});
					}
					if(next && next.$$route && next.$$route.css){
						if(!angular.isArray(next.$$route.css)){
							next.$$route.css = [next.$$route.css];
						}
						angular.forEach(next.$$route.css, function(sheet){
							scope.routeStyles[sheet] = sheet;
						});
					}
				});
			}
		};
	}
]);

// add the following to element
// mt-img-preload="{{slide.imageURL}}"
// class="fade"
app.directive('mtImgPreload', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		// scope: {
		//   ngSrc: '@mtImgPreload'
		// },
		link: function(scope, element, attrs) {
		
			var a = new Image;  
			//fade in cube when image is loaded. 
			// a.onload = function(){ element.addClass('in')};        
			a.src = "/images/news_image_0.jpg";

			// could potentially add in an image child with display = none
			// select it here and on its load make this element visible 
			// element.on('load', function() {
			//   element.addClass('in');
			// }).on('error', function() {
				
			// });

			// scope.$watch('ngSrc', function(newVal) {
			//   element.removeClass('in');
			// });
		}
	};
}]);

app.directive('mtEnter', ['$timeout', function($timeout) {
		return {
			restrict: 'A', 
				scope: {
						index: '@'
				},
				link: function(scope, element, attrs) {
			var TIMEOUTPERIODINMS = 150;
			$timeout(function(){
				element.addClass('mt-enter');
				// element.addClass('magictime');
				// element.addClass('slideRightReturn');
				 
				// $scope.$apply();
			}, TIMEOUTPERIODINMS * (scope.index));
				}
		};
}]);

app.directive('mtEllipsisInline', ['$window', '$log', function($window, $log){
	return{
		restrict: 'A',
		scope:{
			data: '@'
		},
		transclude: true,
		template: '<span ng-transclude></span><i class="ellipsis fa fa-ellipsis-h"></i>',
		link: function(scope, element, attrs) {

			scope.$watch('data', function(newValue, oldValue){

				var onResize = function(){

					// var ellipsisTemplate = '<i class="ellipsis fa fa-ellipsis-h"></i>';
					// element.append(ellipsisTemplate);
					var ellipsis = angular.element(element[0].querySelector('.fa-ellipsis-h'));
					// ellipsis.addClass('ng-hide');

					return function() {

						var me = element[0];
						if(me.scrollWidth < me.offsetWidth && !element.hasClass('ng-hide')){
							$log.log(me.innerText+": ellipsis off");
							ellipsis.addClass('ng-hide');
						}else if(me.scrollWidth >= me.offsetWidth && element.hasClass('ng-hide')){
							$log.log(me.innerText+": ellipsis on");
							element.removeClass('ng-hide');
							// element.remove(ellipsis);
						}
					}
				}();

				// angular.element(document).ready(onResize);
				angular.element($window).on('resize', onResize);
			});
		}
	};
}]);


app.directive('mtEllipsisWrap', ['$window', '$log', '$timeout', function($window, $log, $timeout){
	return{
		restrict: 'A',
		// scope:{
		// 	data: '@'
		// },
		link: function(scope, element, attrs) {

			// $log.log(me.content+": offsetLeft = "+me.offsetLeft+" offsetWidth = "+me.offsetWidth);
			// angular.element(element.children()).ready(function() {
			// scope.$on("eventsLoaded", function(){
			// scope.$watch('data', function(newValue, oldValue){

			// on a timed delay to make sure that all the children ng-repeat elements 
			// have been populated and the correct width are calculated
			$timeout(function(){
				var onResize = function(){

					// store the intial right offset in an array
					// as elements are hidden, offset will becomes 0, hence its important
					// to store it ahead of time
					var children = element.children();
					var childOffsetRight = [];
					angular.forEach(children, function(value, index){
						var child = angular.element(value);
						childOffsetRight[index] = (index == 0) ? 
							child.outerWidth(true) :
							child.outerWidth(true) + childOffsetRight[index-1];

						// childOffsetRight[index] = child.offsetLeft + child.offsetWidth
						// $log.log(child.offsetWidth);
					});
					// $log.log(childOffsetRight);
					// $log.log(children);

					// add the ellipsis element and hide it
					var ellipsisTemplate = '<i class="ellipsis fa fa-ellipsis-h"></i>';
					element.append(ellipsisTemplate);
					var ellipsis = angular.element(element[0].querySelector('.fa-ellipsis-h'));
					ellipsis.addClass('ng-hide');

					// returning a function with the above variables
					return function(){
						var me = element[0];
						// var parentOffsetRight = me.offsetLeft + me.offsetWidth;
						// var parentOffsetRight = me.offsetWidth;
						var parentOffsetRight = element.outerWidth(true);
						
						angular.forEach(children, function(value, index){
								var child = angular.element(value);

							if(parentOffsetRight > childOffsetRight[index] && child.hasClass('ng-hide')){
								$log.log(child.text()+": show");
								child.removeClass('ng-hide');
								ellipsis.addClass('ng-hide');
							}else if(parentOffsetRight <= childOffsetRight[index] && !child.hasClass('ng-hide')){
								$log.log(child.text()+": hidden");
								child.addClass('ng-hide');
								ellipsis.removeClass('ng-hide');
							}
						});
					};
				}();

				// angular.element(document).ready(onResize);
				angular.element($window).on('resize', onResize);

			}, 500);
				
		}
	};
}]);


app.directive('inViewport', function($window) {
	return {
		scope: {
			scroll:'=scrollposition'
		},
		link: function(scope, element, attrs) {
			var windowEl = angular.element($window);
			var handler = function() {
				console.log($window.scrollY+' at: '+new Date());
				scope.scroll = 0;
				// scope.scroll = windowEl.scrollTop();
			}
			// console.log(windowEl);
			// windowEl.on('scroll', scope.$apply.bind(scope, handler));
			windowEl.on('scroll', handler());
			handler();
		}
	};
});


app.animation('.view-animate', ['$log', '$timeout', function($log, $timeout) {
	return {
		enter: function(element, done) {
			// element.css('display', 'none');
			// $(element).fadeIn(1000, function() {
			//   done();
			// });

			done();
		},
		leave: function(element, done) {
		

		// $log.log('leave animation triggered');

		// var events = angular.element(document.getElementsByClassName('mt-event'));
		// var TIMEOUTPERIODINMS = 150;

		// angular.forEach(events, function(value, index){
		// 	var event = angular.element(value);
			
		// 	$timeout(
		// 		function(){
		// 			// event.addClass('mt-exit');
		// 			event.fadeOut();
		// 		}, 
		// 		TIMEOUTPERIODINMS * index);

		// 	event.animate({opacity: 0}, {duration: 2000});
		// 	event.fadeOut();


		// });

		// done();

		// $timeout(done, TIMEOUTPERIODINMS*7 );

		done();
		},
		move: function(element, done) {
			// element.css('display', 'none');
			// $(element).slideDown(500, function() {
			//   done();
			// });
				done();
		}
	}
}]);







