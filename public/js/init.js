$(function() {

	// Variables


	var globalAudio = undefined;
	var wsCounter = 0;
	var dqCounter = 0;
	var bbCounter = 0;


	// ******************************************************************
	// Design Functions
	// ******************************************************************

	// Init settings
	//preloader settings
	$("#top-header").hide();
	$("#main-content").hide();

	//Init width check
	if($(window).width() < 740){
		hideMenu();
		addMenuClickEvents();
	}

	// Click To Enter
	$("#preloader").hide();
	$("#click-to-enter").fadeIn();
	$("#click-to-enter").click(function(){
	 	// Play silent audio
		// globalAudio = document.getElementById("sound").innerHTML='';
	 	// Hide click To Enter
	 	$("#click-to-enter").hide();
	 	// show content
	 	$("#top-header").fadeIn();
	 	$("#main-content").fadeIn();
	 	$("#client-menu").css("height",$(document).height());
	 });

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

	// Reset events
	var menuActive = false;
	function removeMenuClickEvents(){
		if(menuActive)
		{
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

	// ******************************************************************
	// END Design Functions
	// ******************************************************************

	// ******************************************************************
	// Data Function
	// ******************************************************************

	// IO reload function
	var socket = io();

      socket.on('follow', function(data,isTest){
      	reloadData(data.target.screen_name,data,"influencer");
      });

      socket.on('influencer', function(data,isTest){

        reloadData(data.target.screen_name,data,"influencer");
      });

      socket.on('influencer-mention', function(data){
        reloadData(data.mentionee,data,"mention");       
    });

	// Temp Test buttons
	$(document).keypress(function(e){
		switch(e.which){
			case 87:
				addNewContent("ws");
			break;
			case 68:
				addNewContent("dq");
			break;
			case 66:
				addNewContent("bb");
			break;
		}
	});

	function reloadData(client,data,type){
		switch(client)
		{
			case "wingstop":
				addInfl("ws",data,type);
			break;
			case "DairyQueen":
				addInfl("dq",data,type);
			break;
			case "Blue_Bunny":
				addInfl("ws",data,type);
			break;
			case "JoeLongstreet":
				addInfl("ws",data,type);
			break;
		}
	}

	function addNewContent(client,inf){
		var infObj = new Object();
		switch (client){
			case "ws":
				addInfl("ws",infObj,"test");
			break;
			case "dq":
				addInfl("dq",infObj,"test");
			break;
			case "bb":
				addInfl("bb",infObj,"test");
			break;
		}
	}
	
	function getCorrectMinutes(min){
		if(min > 10)
		{
			return min;
		}else{
			return "0" + min;
		}
	}
	function getCurrentHours(hours){
		if (hours > 12) {
		    hours -= 12;
		} else if (hours === 0) {
		   hours = 12;
		}
		return hours;
	}

	function addInfl(client,data,type){
		// Date
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		var time = new Date();
		var currentTime = getCorrectHours(time.getHours())  + ":" + getCorrectMinutes(time.getMinutes());

		if(type == "test")
		{
			data.source = new Object();
			data.source.profile_image_url = "../img/default.jpg";
			var first = chance.first();
			var last = chance.last();
			data.source.name = first + " " + last;
			data.source.screen_name = first+last+Math.floor((Math.random() * 100) + 1);
			data.source.statuses_count = Math.floor((Math.random() * 4000) + 400);
			data.source.followers_count = Math.floor((Math.random() * 1000000) + 50000);
			data.source.friends_count = Math.floor((Math.random() * 25000) + 1);
		}

		if(type == "test" || type == "influencer")
		{
			switch(client)
			{
				case "ws":
					$( ".influencer-holder-ws" ).first().before("<div id='influencer-holder' class='influencer-holder-ws'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.source.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>" + data.source.name + "</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>" + data.source.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                   <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                      <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime +  "</b></p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                    <div class='tweets stat'>\
			                      <p>"+data.source.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.source.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.source.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					wsCounter += 1;
					$( ".influencer-holder-ws" ).first().hide();
					$( ".influencer-holder-ws" ).first().fadeIn();
					$( ".influencer-holder-ws" ).first().addTemporaryClass("new-fluencer", 10000);
					$( ".influencer-holder-ws" ).first().click(function(){
						setInfLinkNewInf(data.source.screen_name);
					});
					// Play Audio
					playAudio("ws");
					$("#ws-menu-click").trigger("click");
				break;
				case "dq":
					$( ".influencer-holder-dq" ).first().before("<div id='influencer-holder' class='influencer-holder-dq'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.source.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>" + data.source.name +"</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>"+ data.source.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                    <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                       <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime + "</p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                    <div class='tweets stat'>\
			                      <p>"+data.source.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.source.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.source.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					dqCounter += 1;
					$( ".influencer-holder-dq" ).first().hide();
					$( ".influencer-holder-dq" ).first().fadeIn();
					$( ".influencer-holder-dq" ).first().addTemporaryClass("new-fluencer", 10000);
					$( ".influencer-holder-dq" ).first().click(function(){
						setInfLinkNewInf(data.source.screen_name);
					});
					// Play Audio
					playAudio("dq");
					$("#dq-menu-click").trigger("click");
				break;
				case "bb":
					$( ".influencer-holder-bb" ).first().before("<div id='influencer-holder' class='influencer-holder-bb'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.source.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>"+ data.source.name +"</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>"+ data.source.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                    <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                       <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime + "</p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                     <div class='tweets stat'>\
			                      <p>"+data.source.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.source.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.source.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					bbCounter += 1;
					$( ".influencer-holder-bb" ).first().hide();
					$( ".influencer-holder-bb" ).first().fadeIn();
					$( ".influencer-holder-bb" ).first().addTemporaryClass("new-fluencer", 10000);
					$( ".influencer-holder-bb" ).first().click(function(){
						setInfLinkNewInf(data.source.screen_name);
					});
					// Play Audio
					playAudio("bb");
					$("#bb-menu-click").trigger("click");
				break;
			}
		}
		else{
			switch(client)
			{
				case "ws":
					$( ".mention-holder-ws").first().before("<div id='influencer-holder' class='mention-holder-ws'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.user.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>" + data.user.name + "</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>" + data.user.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                   <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                      <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime +  "</b></p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                    <div class='tweets stat'>\
			                      <p>"+data.user.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.user.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.user.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					wsCounter += 1;
					$( ".mention-holder-ws" ).first().hide();
					$( ".mention-holder-ws" ).first().fadeIn();
					$( ".mention-holder-ws" ).first().addTemporaryClass("new-fluencer", 10000);
					// Set Click
					$( ".mention-holder-ws" ).first().click(function(){
						setInfLinkNewInf(data.user.screen_name,data.text);
					});
				break;
				case "dq":
					$( ".mention-holder-dq" ).first().before("<div id='influencer-holder' class='mention-holder-dq'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.user.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>" + data.user.name +"</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>"+ data.user.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                    <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                       <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime + "</p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                    <div class='tweets stat'>\
			                      <p>"+data.user.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.user.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.user.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					dqCounter += 1;
					$( ".mention-holder-dq" ).first().hide();
					$( ".mention-holder-dq" ).first().fadeIn();
					$( ".mention-holder-dq" ).first().addTemporaryClass("new-fluencer", 10000);
					// Set Click
					$( ".mention-holder-dq" ).first().click(function(){
						setInfLinkNewInf(data.user.screen_name,data.text);
					});
				break;
				case "bb":
					$( ".mention-holder-bb" ).first().before("<div id='influencer-holder' class='mention-holder-bb'>\
						<div class='influencer'>\
			                <div class='c1'>\
			                  <img src='" + data.user.profile_image_url +"' alt='Profile Picture'>\
			                </div>\
			                <div class='c1-sep'></div>\
			                <div class='c2'>\
			                  <div class='name'>\
			                    <div class='user-name'>"+ data.user.name +"</div>\
			                    <div class='name-sep'></div>\
			                    <div class='twitter-name'>"+ data.user.screen_name + "</div>\
			                  </div>\
			                  <div class='message'>\
			                    <div class='followed-icon'></div>\
			                    <div class='text'>\
			                      <div class='line1'><p> <em>Followed:</em></p></div>\
			                       <div class='line2'><p>" + getMonth(mm) + " " + dd + ", " + yyyy +  "<b> @ " + currentTime + "</p></div>\
			                    </div>\
			                  </div>\
			                </div>\
			                <div class='hor-inf-sep-line'></div>\
			                <div class='c3'>\
			                  <div class='c3-sep'></div>\
			                  <div class='stats'>\
			                     <div class='tweets stat'>\
			                      <p>"+data.user.statuses_count+"</p>\
			                    </div>\
			                    <div class='followers stat'>\
			                       <p>"+data.user.followers_count+"</p>\
			                    </div>\
			                    <div class='following stat'>\
			                       <p>"+data.user.friends_count+"</p>\
			                    </div>\
			                  </div>\
			                </div>\
			              </div>\
			            </div>\
					");
					// fade in
					bbCounter += 1;
					$( ".mention-holder-bb" ).first().hide();
					$( ".mention-holder-bb" ).first().fadeIn();
					$( ".mention-holder-bb" ).first().addTemporaryClass("new-fluencer", 10000);
					// Set Click
					$( ".mention-holder-bb" ).first().click(function(){
						setInfLinkNewInf(data.user.screen_name,data.text);
					});
				break;
			}
		}
	}
	function getMonth(m){
		switch (m){
			case 1:
				return "Jan";
			break;
			case 2:
				return "Feb";
			break;
			case 3:
				return "Mar";
			break;
			case 4:
				return "Apr";
			break;
			case 5:
				return "May";
			break;
			case 6:
				return "Jun";
			break;
			case 7:
				return "Jul";
			break;
			case 8:
				return "Aug";
			break;
			case 9:
				return "Sep";
			break;
			case 10:
				return "Oct";
			break;
			case 11:
				return "Nov";
			break;
			case 12:
				return "Dec";
			break;
		}
	}
	
	setInfLinkNewInf = function(url,message){

			$("#inf-click-content a").attr("href", "http://www.twitter.com/" + url);
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


	// ******************************************************************
	// END Data Function
	// ******************************************************************

	// ******************************************************************
	// Audio Function
	// ******************************************************************
	
	function playAudio(dataType){
		switch(dataType){
			case "ws":
				// filename = "../audio/ws";
				// document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
				// $("#globalAudio").trigger('play');

				var audio = $("#globalAudio");      
			    $("#mp3_src").attr("src", "../../audio/ws.mp3");
			    $("#ogg_src").attr("src", "../../audio/ws.ogg");
			    /****************/
			    audio[0].pause();
			    audio[0].load();//suspends and restores all audio element
			    audio[0].play();
			    /****************/
				
			break;
			case "dq":
				// filename = "../audio/dq";
				var audio = $("#globalAudio");      
			    $("#mp3_src").attr("src", "../../audio/dq.mp3");
			    $("#ogg_src").attr("src", "../../audio/dq.ogg");
			    /****************/
			    audio[0].pause();
			    audio[0].load();//suspends and restores all audio element
			    audio[0].play();
			    /****************/

				// $("#globalAudio").trigger('play');
			break;
			case "bb":
				// filename = "../audio/bb";
				// document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
				// $("#globalAudio").trigger('play');
				var audio = $("#globalAudio");      
			    $("#mp3_src").attr("src", "../../audio/bb.mp3");
			    $("#ogg_src").attr("src", "../../audio/bb.ogg");
			    /****************/
			    audio[0].pause();
			    audio[0].load();//suspends and restores all audio element
			    audio[0].play();
			    /****************/
			break;
		}
	}

	// ******************************************************************
	// END Audio Function
	// ******************************************************************
	
});


// ******************************************************************
// Angular Functions
// ******************************************************************

(function() {

var activeContent = 0;

	// Angular setup
	var app = angular.module("SETI", []);
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

		// ******************************************************
		// Loading Data
		// ******************************************************

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
		var loadCount = 0;

		// ******************************************************
		// Loaded functions
		// ******************************************************

		checkLoaded = function(){
			// show loading bar
			if(!wingstopInfluencers || !wingstopMentions || !dqInfluencers || !dqMentions || !bbInfluencers || !bbMentions)
			{
				$("#loading-bar").fadeIn();
			}
			if(wingstopInfluencers && wingstopMentions && dqInfluencers && dqMentions && bbInfluencers && bbMentions)
			{
				// Loading Done: delete loading bar
				$("#loading-bar").fadeOut();
				$("#full-width-bar").fadeIn();
			}

			// loading bar
			loadCount+=1;
			$("#loading-bar").animate({
				width: loadCount * (100/6) + "%"
			},1000);
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
		
		this.dataLoaded = 1;
		this.setInfLink = function(url,message){
			console.log("set inf link - " + this);
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


	// ******************************************************
	// Menu Functions
	// ******************************************************
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

// Reusable Jquery times function for temporary class
(function($){

    $.fn.extend({ 

        addTemporaryClass: function(className, duration) {
            var elements = this;
            setTimeout(function() {
                elements.removeClass(className);
            }, duration);

            return this.each(function() {
                $(this).addClass(className);
            });
        }
    });

})(jQuery);
