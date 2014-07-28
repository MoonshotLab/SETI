$(function() {
	
	
	// Client list items
	$("#client-menu #client-list li").hover(function(){
		if(!$(this).hasClass("active"))
		{
			$(this).find(".arrow").stop().animate({
					opacity:1,
					left:"10px"
				},250)
		}
		else{
			$(this).find(".arrow").stop().animate({
					opacity:0,
					left:"5px"
				},250)
		}
	}, function(){
		if(!$(this).hasClass("active"))
		{
			$(this).find(".arrow").stop().animate({
				opacity:0,
				left:"5px"
			},250)
		}
	});
	$("#client-menu #client-list li").click(function(){
		$(this).find(".arrow").stop().animate({
			opacity:0,
			left:"5px"
		},250)
	});

	//preloader settings
	$("#top-header").hide();
	$("#main-content").hide();	

	// Initialize Fancybox
	$(".fancybox").fancybox();
	$("#seti-info").fancybox({
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		width		: '70%',
		height		: '70%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none', 
		helpers : {
	        overlay : {
	            css : {
	                'background' : 'rgba(00, 00, 00, 0.8)'
	            }
	        }
	    }
	});

	$("#inf-click-content").fancybox({
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		width		: '70%',
		height		: 'auto',
		autoSize	: false,
		closeClick	: false,
		helpers : {
	        overlay : {
	            css : {
	                'background' : 'rgba(00, 00, 00, 0.8)'
	            }
	        }
	    }
	});


	$("#inf-click-content").click(function(){
		$.fancybox.close();
	});

	

	var menuOut = false;

	

	function showMenu(){
		
		if(!menuOut)
		{
			$("#client-menu").animate({
				left: "0px"
			},200);
			$("#client-menu #menu-button").hide();
			$("#client-menu #client-list").fadeIn();

			menuOut = true;
		}
	};

	function hideMenu(){
		if(menuOut && $(window).width() < 740){
			$("#client-menu").animate({
				left: "-220px"
			},200);
			$("#client-menu #menu-button").show();
			$("#client-menu #client-list").fadeOut();

			menuOut = false;
		}
		
	};
	
	
	

	// Check window size
	$(window).resize(function(){
		if($(window).width() > 740){
			showMenu();
			removeMenuClickEvents();
		}else{
			hideMenu();
			addMenuClickEvents();
		}
	});

	//Init width check
	if($(window).width() < 740){
		hideMenu();
		addMenuClickEvents();
	}
	

	// Reset events
	var menuActive = false;
	function removeMenuClickEvents(){
		if(menuActive)
		{
			console.log("Remove menu Clicks");
			$("#influencer-list-content-holder").unbind("click");
			$("#top-header").unbind("click");
			// $("#client-list li").unbind("click");
			$("#client-menu #title").unbind("click");
			menuActive = false
		}
	}
	function addMenuClickEvents(){
		if(!menuActive)
		{
			console.log("Add Menu Clicks");
			menuActive = true;
			// Click event when menu is out
			$("#influencer-list-content-holder").click(function(){
				if(menuOut){
					hideMenu();
				}
			});
			$("#top-header").click(function(){
				if(menuOut){
					hideMenu();
				}
			});
			$("#client-list li").click(function(){
				hideMenu();
			})
			// Mobile menu slide out
			$("#client-menu #title").click(function(){
				if(!menuOut)
				{
					showMenu();
				}else{
					hideMenu();
				}
			});
			
		}
	}

	// Init settings
		//preloader settings
		$("#top-header").hide();
		$("#main-content").hide();
});

(function() {

var activeContent = 0;

	// Angular setup
	var app = angular.module("SETI",[]);
	// Vars
	var clientData;

	app.controller("DataController",function($scope,$http){
		
		// ******************************************************
		// Variables
		// ******************************************************

		this.dataLoaded = 1;

		var contentData;
		var contentList;
		var contentDataMentions;
		var contentListMentions;
		// Wingstop
		var wingstopInfluencers = null;
		var wingstopInfluencerCount = 0;
		var wingstopMentions = null;
		var wingstopMentionCount = 0;
		var wingstopList = Array();
		var wingstopMentionList = Array();
		// Dairy Queen
		var dqInfluencers = null;
		var dqInfluencerCount = 0;
		var dqMentions = null;
		var dqMentionCount = 0;
		var dqList = Array();
		var dqMentionList = Array();
		// Blue Bunny
		var bbInfluencers = null;
		var bbInfluencerCount = 0;
		var bbMentions = null;
		var bbMentionCount = 0;
		var bbList = Array();
		var bbMentionList = Array();

		// Wingstop
		$http.get('/wingstop/influencers').success(function(data) {
		    wingstopInfluencers = data;
		    wingstopInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	wingstopList[i] = wingstopInfluencers[i];
		    };
		    	checkLoaded();
		});
		$http.get('/wingstop/mentions').success(function(data) {
		    wingstopMentions = data;
		    wingstopMentionCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	wingstopMentionList[i] = wingstopMentions[i];
		    };
		    checkLoaded();
		});
		// Dairy Queen
		$http.get('/dairyqueen/influencers').success(function(data) {
		    dqInfluencers = data;
		    dqInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	dqList[i] = dqInfluencers[i];
		    };
		    checkLoaded();
		});
		$http.get('/dairyqueen/mentions').success(function(data) {
		    dqMentions = data;
		    dqMentionCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	dqMentionList[i] = dqMentions[i];
		    };
		    checkLoaded();
		});
		// Blue Bunny
		$http.get('/blue_bunny/influencers').success(function(data) {
		    bbInfluencers = data;
		    bbInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	bbList[i] = bbInfluencers[i];
		    };
		    checkLoaded();
		});
		$http.get('/blue_bunny/mentions').success(function(data) {
		    bbMentions = data;
		    bbMentionCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	bbMentionList[i] = bbMentions[i];
		    };
		    checkLoaded();
		});

		checkLoaded = function(){
			if(wingstopInfluencers && wingstopMentions && dqInfluencers && dqMentions && bbInfluencers && bbMentions)
			{
				 $("#preloader").hide();
				 $("#top-header").fadeIn();
				 $("#main-content").fadeIn();
			}
		};

		// ******************************************************
		// Public functions
		// ******************************************************
		
		this.getInfluencerCount = function(client){
			switch(client)
			{
				case "ws":
					return wingstopInfluencerCount;
				break;
				case "dq":
					return dqInfluencerCount;
				break;
				case "bb":
					return bbInfluencerCount;
				break;
			};
		};
		this.getMentionCount = function(client){
			switch(client)
			{
				case "ws":
					return wingstopMentionCount;
				break;
				case "dq":
					return dqMentionCount;
				break;
				case "bb":
					return bbMentionCount;
				break;
			};
		};
		
		this.getInfluencerData = function(client)
		{
			switch (client)
			{
				case "ws":
					if(wingstopInfluencers)
					{
						// return wingstopList;
						return wingstopInfluencers;
					}
				return;
				case "dq":
					if(dqInfluencers)
					{
						// return dqList;
						return dqInfluencers;
					}
				return;
				case "bb":
					if(bbInfluencers)
					{
						// return bbList;
						return bbInfluencers;
					}
				return;
			}
		};
		this.getMentionData = function(client)
		{
			switch (client)
			{
				case "ws":
					if(wingstopMentions)
					{
						// return wingstopMentionList;
						return wingstopMentions;
					}
				return;
				case "dq":
					if(dqMentions)
					{
						// return dqMentionList;
						return dqMentions;
					}
				return;
				case "bb":
					if(bbMentions)
					{
						// return bbMentionList;
						return bbMentions;
					}
				return;
			}
		};

		// ******************************************************
		// Endless scroll functions
		// ******************************************************

		// Influencers
		$scope.pagerFunctionC1 = function(){
			if(wingstopInfluencers)
			{
				// Switch active content
				contentData = wingstopInfluencers;
				contentList = wingstopList;

				var lastCount = contentList.length-1;
				if((lastCount) + 20 < contentData.length)
				{
					for(var i = 1; i <= 19; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}else{
					var lastContent = contentData.length-lastCount;
					for(var i = 1; i <= lastContent-1; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}

			}

		};
		$scope.pagerFunctionC2 = function(){
			if (dqInfluencers)
			{
				// Switch active content
				contentData = dqInfluencers;
				contentList = dqList;

				var lastCount = contentList.length-1;
				if((lastCount + 20) < contentData.length)
				{
					for(var i = 1; i <= 19; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}else{
					var lastContent = contentData.length-lastCount;
					for(var i = 1; i <= lastContent-1; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}
			}

		};
		$scope.pagerFunctionC3 = function(){
			if (bbInfluencers)
			{
				// Switch active content
				contentData = bbInfluencers;
				contentList = bbList;

				var lastCount = contentList.length-1;
				if((lastCount) + 20 < contentData.length)
				{
					for(var i = 1; i <= 19; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}else{
					var lastContent = contentData.length-lastCount;
					for(var i = 1; i <= lastContent-1; i++) {
				      contentList.push(contentData[lastCount + i]);
				    };
				}
			}
		};
		$scope.mentionPagerFunction = function(client){
			switch (client)
			{
				case "ws" :
					// Switch active content
					contentDataMentions = wingstopMentions;
					contentListMentions = wingstopMentionList;
				break;
				case "dq":

				break;
				case "bb":

				break;
			}
			var lastCountMention = contentListMentions.length-1;
			console.log("last count: " + lastCountMention + " - " + contentListMentions.length);
			if((lastCountMention) + 20 < contentDataMentions.length)
			{
				for(var i = 1; i <= 19; i++) {
			      contentListMentions.push(contentDataMentions[lastCountMention + i]);
			    };
			}else{
				var lastContentMention = contentDataMentions.length-lastCountMention;
				for(var i = 1; i <= lastContentMention-1; i++) {
			      contentListMentions.push(contentDataMentions[lastCountMention + i]);
			    };
			}
		}
		this.dataLoaded = 1;
		this.setInfLink = function(url){
			
			console.log("click!!!");

			infURL = url;
			$("#inf-click-content a").attr("href", "http://www.twitter.com/" + infURL);
			 // ToDo: Setup this fancy box by default and then show/hide
			 // 2. If its a mention, and content in function variable and show data else no message
			// $.fancybox({
			// 	href: '#inf-click-content',
			// 	maxWidth	: 800,
			// 	maxHeight	: 600,
			// 	fitToView	: false,
			// 	width		: '70%',
			// 	height		: 'auto',
			// 	autoSize	: false,
			// 	closeClick	: false,
			// 	helpers : {
			//         overlay : {
			//             css : {
			//                 'background' : 'rgba(00, 00, 00, 0.8)'
			//             }
			//         }
			//     }
			// });
			console.log("it should open now!");
			$("#inf-click-content").trigger( "click" );

			// return false;
		}
	});




	// Menu
	app.controller("MenuController",function(){

		// ******************************************************
		// Menu Variables
		// ******************************************************

		this.menuItem = 2;
		activeContent = 2;
		this.contentType = 1;

		// ******************************************************
		// Menu Functions
		// ******************************************************

		this.activeMenu = function(menuNum){
			if(this.menuItem !== menuNum)
			{
				this.menuItem = menuNum;
				activeContent = menuNum;
				window.scrollTo(0,0);
			}
		};
		this.getActiveMenu = function(menuNum){
			return menuNum === this.menuItem;
		};
		this.activeContent = function(contentNum)
		{
			if(this.contentType !== contentNum)
			{
				this.contentType = contentNum;
			}
		};
		this.getActiveContent = function(contentNum){
			return contentNum === this.contentType;
		};

	});
})();



