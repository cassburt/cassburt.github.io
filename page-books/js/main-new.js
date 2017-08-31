jQuery(document).ready(function($){
	//cache DOM elements
	var projectsContainer = $('.cd-projects-container'),
		heroContainer = $('.cd-hero-container'),
		projectsPreviewWrapper = projectsContainer.find('.cd-projects-previews'),
		projectPreviews = projectsPreviewWrapper.children('li'),
		heroPreview = hero.children('li'),
		projects = projectsContainer.find('.cd-projects'),
		hero = heroContainer.find('cd-hero'),
		navigationTrigger = $('.cd-nav-trigger'),
		navigation = $('.cd-primary-nav'),
		//if browser doesn't support CSS transitions...
		transitionsNotSupported = ( $('.no-csstransitions').length > 0);

	var animating = false,
		//will be used to extract random numbers for projects slide up/slide down effect
		numRandoms = projects.find('li').length,
		uniqueRandoms = [];

	//open project
	projectsPreviewWrapper.on('click', 'a', function(event){
		event.preventDefault();
		if( animating == false ) {
			animating = true;
			navigationTrigger.add(projectsContainer).addClass('project-open');
			openProject($(this).parent('li'));
		}
	});

	//open hero
	hero.on('click', 'a', function(event){
		event.preventDefault();
		if( animating == false ) {
			animating = true;
			navigationTrigger.add(heroContainer).addClass('project-open');
			openProject($(this).parent('li'));
		}
	});

	navigationTrigger.on('click', function(event){
		event.preventDefault();

		if( animating == false ) {
			animating = true;
			if( navigationTrigger.hasClass('project-open') ) {
				//close visible project
				navigationTrigger.add(projectsContainer).removeClass('project-open');
				closeProject();
			} else if( navigationTrigger.hasClass('nav-visible') ) {
				//close main navigation
				navigationTrigger.removeClass('nav-visible');
				navigation.removeClass('nav-clickable nav-visible');
				if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
			} else {
				//open main navigation
				var x = document.getElementById('menubutton');
				x.style.visibility = 'hidden';
				navigationTrigger.addClass('nav-visible');
				navigation.addClass('nav-visible');
				if(transitionsNotSupported) projectPreviews.addClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
			}
		}

		if(transitionsNotSupported) animating = false;
	});

	//scroll down to project info
	projectsContainer.on('click', '.scroll', function(){
		projectsContainer.animate({'scrollTop':$(window).height()}, 500);
	});

	//check if background-images have been loaded and show project previews
	projectPreviews.children('a').bgLoaded({
	  	afterLoaded : function(){
	   		showPreview(projectPreviews.eq(0));
	  	}
	});

	function showPreview(projectPreview) {
		if(projectPreview.length > 0 ) {
			setTimeout(function(){
				projectPreview.addClass('bg-loaded');
				showPreview(projectPreview.next());
			}, 150);
		}
	}

	function openProject(projectPreview) {
		var projectIndex = projectPreview.index();
		projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');

		if( transitionsNotSupported ) {
			projectPreviews.addClass('slide-out').removeClass('selected');
			projects.children('li').eq(projectIndex).addClass('content-visible');
			animating = false;
		} else {
			slideToggleProjects(projectPreviews, projectIndex, 0, true);
		}
	}

	function openHero(heroPreview) {
		var herotIndex = heroPreview.index();
		hero.children('li').eq(heroIndex).add(heroPreview).addClass('selected');

		if( transitionsNotSupported ) {
			heroPreview.addClass('slide-out').removeClass('selected');
			hero.children('li').eq(projectIndex).addClass('content-visible');
			animating = false;
		} else {
			slideToggleHero(heroPreview, heroIndex, 0, true);
		}
	}

	function closeProject() {
		projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
		});

		//if browser doesn't support CSS transitions...
		if( transitionsNotSupported ) {
			projectPreviews.removeClass('slide-out');
			projects.find('.content-visible').removeClass('content-visible');
			animating = false;
		}
	}

	function closeHero() {
		hero.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			slideToggleHero(hero.children('li'), -1, 0, false);
		});

		//if browser doesn't support CSS transitions...
		if( transitionsNotSupported ) {
			heroPreview.removeClass('slide-out');
			hero.find('.content-visible').removeClass('content-visible');
			animating = false;
		}
	}

	function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
		if(index == 0 ) createArrayRandom();
		if( projectIndex != -1 && index == 0 ) index = 1;

		var randomProjectIndex = makeUniqueRandom();
		if( randomProjectIndex == projectIndex ) randomProjectIndex = makeUniqueRandom();

		if( index < numRandoms - 1 ) {
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
			setTimeout( function(){
				//animate next preview project
				slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
			}, 150);
		} else if ( index == numRandoms - 1 ) {
			//this is the last project preview to be animated
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				if( projectIndex != -1) {
					projects.children('li.selected').addClass('content-visible');
					projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
				} else if( navigation.hasClass('nav-visible') && bool ) {
					navigation.addClass('nav-clickable');
				}
				projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				animating = false;
			});
		}
	}

	function slideToggleHero(hero, projectIndex, index, bool) {
		if(index == 0 ) createArrayRandom();
		if( projectIndex != -1 && index == 0 ) index = 1;

		var randomProjectIndex = makeUniqueRandom();
		if( randomProjectIndex == projectIndex ) randomProjectIndex = makeUniqueRandom();

		if( index < numRandoms - 1 ) {
			hero.eq(randomProjectIndex).toggleClass('slide-out', bool);
			setTimeout( function(){
				//animate next preview project
				slideToggleHero(hero, projectIndex, index + 1, bool);
			}, 150);
		} else if ( index == numRandoms - 1 ) {
			//this is the last project preview to be animated
			hero.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				if( projectIndex != -1) {
					hero.children('li.selected').addClass('content-visible');
					hero.eq(projectIndex).addClass('slide-out').removeClass('selected');
				} else if( navigation.hasClass('nav-visible') && bool ) {
					navigation.addClass('nav-clickable');
				}
				hero.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				animating = false;
			});
		}
	}

	//http://stackoverflow.com/questions/19351759/javascript-random-number-out-of-5-no-repeat-until-all-have-been-used
	function makeUniqueRandom() {
	    var index = Math.floor(Math.random() * uniqueRandoms.length);
	    var val = uniqueRandoms[index];
	    // now remove that value from the array
	    uniqueRandoms.splice(index, 1);
	    return val;
	}

	function createArrayRandom() {
		//reset array
		uniqueRandoms.length = 0;
		for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
	}

	//Run key functions on load
	window.onload = function() {
		navigation.addClass('nav-visible');
		var x = document.getElementById('pjct');
		x.style.visibility = 'hidden';
		var y = document.getElementById('menubutton');
		y.style.visibility = 'hidden';
		var z = document.getElementById('hero-home');
		z.style.visibility = 'hidden';
		if(transitionsNotSupported) projectPreviews.addClass('slide-out');
		else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
	};

	$('.book').on("click",function(){
		navigationTrigger.removeClass('nav-visible');
		navigation.removeClass('nav-clickable nav-visible');
		var x = document.getElementById('pjct');
		x.style.visibility = 'visible';
		var y = document.getElementById('menubutton');
		y.style.visibility = 'visible';
		if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
		else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
	});

	$('.hero').on("click",function(){
		navigationTrigger.removeClass('nav-visible');
		navigation.removeClass('nav-clickable nav-visible');
		var x = document.getElementById('hero-home');
		x.style.visibility = 'visible';
		var y = document.getElementById('menubutton');
		y.style.visibility = 'visible';
		if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
		else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
	});

});

 /*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
 (function($){
 	$.fn.bgLoaded = function(custom) {
	 	var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function(){
			var $this = $(this),
				bgImgs = $this.css('background-image').split(', ');
			$this.data('loaded-count',0);
			$.each( bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function() {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count',$this.data('loaded-count')+1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
})(jQuery);
