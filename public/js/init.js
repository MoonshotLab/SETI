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

	$("#inf-click-content a").click(function(){
		$.fancybox.close();
	});

	var menuOut = false;

	function showMenu(){
		if(!menuOut)
		{
			$("#client-menu").stop().animate({
				left: "0px"
			},200);
			$("#client-menu #menu-button").hide();
			$("#client-menu #client-list").fadeIn();

			menuOut = true;
		}
	};

	function hideMenu(){
		if(menuOut && $(window).width() < 740){
			$("#client-menu").stop().animate({
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
			$("#client-menu").css("height",$(document).height());
		}
	});

	// Scroll
	$(window).scroll(function(){
		if($(window).width() < 740)
		{
			if($(document).scrollTop() > 180)
			{
				$("#menu-button").css("top",$(document).scrollTop()-90);
			}
			else
			{
				$("#menu-button").css("top","20");
			}

		}

	});


	$("#influencer-list .influencer .c1 img").onerror = function (evt){
		console.log("error!");
	}
	$("#influencer-list .influencer .c1 img").onload = function (evt){
		console.log("loaded");
	}


	// Reload function

	var socket = io();

      socket.on('follow', function(data){
      	reloadData(data.target.screen_name);
      	// console.log(data.target);
        // console.log(data);
      });

      socket.on('influencer', function(data){

        reloadData(data.target.screen_name);
      });

      socket.on('influencer-mention', function(data){
        // console.log("mention" + data);
        reloadData(data.mentionee);
      });

	function reloadData(client){
		console.log("client: " + client);
		switch(client)
		{
			case "wingstop":
				playAudio("ws");
				// Set Reload Time out
				setRefresh(4,"ws");
			break;
			case "DairyQueen":
				playAudio("dq");
				setRefresh(10,"dq");
			break;
			case "Blue_Bunny":
				playAudio("bb");
				setRefresh(8,"bb");
			break;
			case "JoeLongstreet":
				playAudio("bb");
				// Set Reload Time out
				setRefresh(8,"bb");
			break;

		}
		// Setup Loading Screen
		$.fancybox({
			href: '#reloading-animation',
			maxWidth	: 300,
			maxHeight	: 200,
			fitToView	: false,
			width		: '70%',
			height		: 'auto',
			autoSize	: false,
			closeClick	: false,
			hideOnOverlayClick : false,
			showCloseButton : false,
			helpers : {
		        overlay : {
		            css : {
		                'background' : 'rgba(255, 255, 255, 0.5)'
		            }
		        }
		    }
		});
	}
	function setRefresh(time,client){
		setTimeout(function() {
			switch(client){
		      	case "ws":
		      		window.location.href = window.location.href.split("?")[0]+ "?client=ws";
		      	break;
		      	case "dq":
		      		window.location.href = window.location.href.split("?")[0]+ "?client=dq";
		      	break;
		      	case "bb":
		      		window.location.href = window.location.href.split("?")[0] + "?client=bb";
		      	break;
	      	}
		  	// location.reload();
		}, time*1000);
	}

	//Init width check
	if($(window).width() < 740){
		hideMenu();
		addMenuClickEvents();
	}
	//Init var check
	switch (getUrlVars().client){
		case "ws":
			console.log("active client: wingstop ");
			$("#ws-dot").attr("src","img/list-dot-icon-red.png");
		break;
		case "dq":
			$("#dq-dot").attr("src","img/list-dot-icon-red.png");
		break;
		case "bb":
			$("#bb-dot").attr("src","img/list-dot-icon-red.png");
		break;
	}

	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
	function playAudio(dataType){

		switch(dataType){
			case "ws":
				console.log("play sound ws");
				filename = "../audio/ws";
				document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
			break;
			case "dq":
				filename = "../audio/dq";
				document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
			break;
			case "bb":
				filename = "../audio/bb";
				document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
			break;

		}
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
					window.scrollTo(0,0);
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

				wingstopMentions.forEach(function(mention){
					mention.formattedDate = formatRFC339asHumanReadable(mention.created_at);
				});
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

				dqMentions.forEach(function(mention){
					mention.formattedDate = formatRFC339asHumanReadable(mention.created_at);
				});
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

				bbMentions.forEach(function(mention){
					mention.formattedDate = formatRFC339asHumanReadable(mention.created_at);
				});
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

				 $("#client-menu").css("height",$(document).height());
			}
		};

		checkReLoaded = function(){
			if(wingstopInfluencers && wingstopMentions && dqInfluencers && dqMentions && bbInfluencers && bbMentions)
			{
				 // Here
				 $.fancybox.close();
				 // #reloading-animation
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
						return wingstopInfluencers;
					}
				return;
				case "dq":
					if(dqInfluencers)
					{
						return dqInfluencers;
					}
				return;
				case "bb":
					if(bbInfluencers)
					{
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
		this.setInfLink = function(url,message){

			infURL = url;

			$("#inf-click-content a").attr("href", "http://www.twitter.com/" + infURL);


			// Mention Message
			if(message)
			{
				$("#inf-click-content #message").show();
				$("#inf-click-content #message p").text(message);
			}else{
				$("#inf-click-content #message").hide();
			}
			 // ToDo: Setup this fancy box by default and then show/hide
			 // 2. If its a mention, and content in function variable and show data else no message

				$.fancybox({
					href: '#inf-click-content',
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



			return false;
		}
	});

	app.directive('errSrc', function() {
	  return {
	    link: function(scope, element, attrs) {
	      element.bind('error', function() {
	        if (attrs.src != attrs.errSrc) {
	          attrs.$set('src', attrs.errSrc);
	        }
	      });
	    }
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


var monthList = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var formatRFC339asHumanReadable = function(rfc){
	var dateObject = new Date(rfc);

	return [
		monthList[dateObject.getMonth()],
		' ',
		dateObject.getDate(),
		', ',
		dateObject.getFullYear()
	].join('');
};
