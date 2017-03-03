var main = function() {
  $('.dropdown-toggle').click(function() {
  	// used to make the menu visible or invisible. show() will make a section show
    $('.dropdown-menu').toggle(); 
  });
}

// JQuery to run the main method only when the document is completely loaded
$(document).ready(main);

/*
JQuery
1. Events
2. DOM Manipulation
3. Effects
*/

var main = function(){
    $('.icon-menu').click(function(){
        $('.menu').animate({
            left: '0px'
        }, 200);
        
        $('body').animate({
            left: '285px'
        }, 200);
    });
};

$(document).ready(main);

// JQuery Events

/*
How does AngularJS do 
1. click, keypress, keyup
2. addClass/removeClass/toggleClass, hide/show/toggle
3. add text
4. sibling: next(), prev()
	children: children()
5. animate
*/


// .ready
	$(document).ready(function_name);

	var main = function() {
	  $(".like-button").click(function() {
	    $(this).toggleClass("active");
	  });
	};

	$(document).ready(main);

// .click
	$('.social li').click(function() {
	  $(this).toggleClass('active');
	});

// .keypress()
	var main = function() {
	  $(".like-button").click(function() {
	    $(this).toggleClass("active");
	  });
	};

	$(document).ready(main);

// event object
	$(document).keypress(function(event) {
	  if(event.which === 109) {
	    $('.dropdown-menu').toggle();
	  }
	});

// Toggle show and hide
var main = function() {
  $('.article').click(function() {
    $('.article').removeClass('current');
    $('.description').hide();

    $(this).addClass('current');
    $(this).children('.description').show();
  });

  $(document).keypress(function(event) {
    if(event.which === 111) {
      $('.description').hide();

      $('.current').children('.description').show();
    }

    else if(event.which === 110) {
      var currentArticle = $('.current');
      var nextArticle = currentArticle.next();
      
      currentArticle.removeClass('current');
      nextArticle.addClass('current');
    }
  });
}

$(document).ready(main);



// DOM Manipulation

$('p').text('abc')							// select p and replace text
$('p').text()								// select p and return text
$('<h1>').text('abc').appendTo('.items')	// create h1 and add text
$('<h1>').text('abc').prependTo('.items')
$('.btn').click(function() {
  $('.selected').remove();
});

var main = function(){
    $('.btn').click(function(){
        var post = $('.status-box').val();
        $('<li>').text(post).prependTo('.posts');
        $('.status-box').val('');
        $('.counter').text('140');
        $('.btn').addClass('disabled');
    });
    
    $('.status-box').keyup(function(){
        var postLength = $(this).val().length;
        var charactersLeft = 140 - postLength;
        $('.counter').text(charactersLeft);
        
        if(charactersLeft < 0){
            $('.btn').addClass('disabled');
        }else if(charactersLeft === 140 ){
            $('.btn').addClass('disabled');
        }else{
            $('.btn').removeClass('disabled');
        }
        
        
    });
    
    $('.btn').addClass('disabled');
};

$(document).ready(main);

/*
Animate

	- slideDown()
	- slideUp()
	- fadeIn() can be used to implement flash
	- fadeOut()
*/

// AngularJS

//Filter
	// format into currency
	//<p class="price">{{product.price | currency}} </p>

	// date format
	  $scope.product = {
	    name: 'The Book of Trees',
			price: 19,
	    pubdate: new Date('2014', '03', '08')
	  };

// Directive
	// ng-app, ng-controller, ng-repeat
	/* ng-src
	<div class="thumbnail"> 
	    <img ng-src="{{ product.cover }}"/> 
	    <p class="title">{{ product.name }}</p> 
	    <p class="price">{{ product.price | currency }}</p> 
	    <p class="date">{{ product.pubdate | date }}</p> 
	  </div> 
	*/

// Interactive
$scope.plusOne = function(index){
    $scope.products[index].likes += 1;
    };


// directive
	/*
	<div class="main" ng-controller="MainController">
      <div class="container">
      	<div ng-repeat="app in apps" class="card">
        	<app-info info="app"></app-info>
        </div>
      </div>
    </div>

	js/directives/appInfo.html
    <img class="icon" ng-src="{{ info.icon }}"> 
	<h2 class="title">{{ info.title }}</h2> 
	<p class="developer">{{ info.developer }}</p> 
	<p class="price">{{ info.price | currency }}</p>
	*/

	// the elements name is apparently derived from appInfo -> app-info
	app.directive('appInfo', function(){
	  return {
	    restrict: 'E',
	    scope: {
	      info: '='
	    },
	    templateUrl: 'js/directives/appInfo.html'
	  };
	});


	// interative directive
	app.directive('installApp', function(){
	  return {
	    restrict: 'E',
	    scope: {},
	    templateUrl: 'js/directives/installApp.html',
	    link: function(scope, element, attrs) { 
	      scope.buttonText = "Install", 
	      scope.installed = false, 

	      scope.download = function() { 
	        element.toggleClass('btn-active'); 
	        if(scope.installed) { 
	          scope.buttonText = "Install"; 
	          scope.installed = false; 
	        } else { 
	          scope.buttonText = "Uninstall"; 
	          scope.installed = true; 
	        } 
	      }
	    }
	  };
	});

	/*
	<button class="btn btn-active" ng-click="download()"> 
	  {{ buttonText }} 
	</button>
	*/



























