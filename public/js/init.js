$(function() {
	// Client list items
	$("#client-menu #client-list li").hover(function(){
		if(!$(this).hasClass("active"))
		{
			$(this).find(".arrow").animate({
					opacity:1,
					left:"10px"
				},250)
		}
	}, function(){
		if(!$(this).hasClass("active"))
		{
			$(this).find(".arrow").animate({
				opacity:0,
				left:"5px"
			},250)
		}
	});
});

(function() {

var activeContent = 0;

	// Angular setup
	var app = angular.module("SETI",['infinite-scroll']);
	// Vars
	var clientData;
	
	app.controller("DataController",function($scope,$http){
		
	
		// Data

		var contentData;
		var contentList;
		// Wingstop
		var wingstopInfluencers = null;
		var wingstopInfluencerCount = 0;
		this.wingstopMentions = null;
		var wingstopMentionCount = 0;
		var wingstopList = Array();
		// Dairy Queen
		var dqInfluencers = null;
		var dqInfluencerCount = 0;
		this.dqMentions = null;
		var dqMentionCount = 0;
		var dqList = Array();

		// Blue Bunny
		var bbInfluencers = null;
		var bbInfluencerCount = 0;
		this.bbMentions = null;
		var bbMentionCount = 0;
		var bbList = Array();

		// Wingstop
		$http.get('http://localhost:3000/wingstop/influencers').success(function(data) {
		    wingstopInfluencers = data;
		    wingstopInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	wingstopList[i] = wingstopInfluencers[i];
		    };
		});
		$http.get('http://localhost:3000/wingstop/mentions').success(function(data) {
		    wingstopMentions = data;
		    wingstopMentionCount = data.length;
		});
		// Dairy Queen
		$http.get('http://localhost:3000/dairyqueen/influencers').success(function(data) {
		    dqInfluencers = data;
		    dqInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	dqList[i] = dqInfluencers[i];
		    };
		});
		$http.get('http://localhost:3000/dairyqueen/mentions').success(function(data) {
		    dqMentions = data;
		    dqMentionCount = data.length;
		});
		// Blue Bunny
		$http.get('http://localhost:3000/bluebunny/influencers').success(function(data) {
		    bbInfluencers = data;
		    bbInfluencerCount = data.length;
		    for (var i = 0; i <= 9; i++) {
		    	bbList[i] = bbInfluencers[i];
		    };
		});
		$http.get('http://localhost:3000/bluebunny/mentions').success(function(data) {
		    bbData = data;
		    bbMentionCount = data.length;
		});

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
						return wingstopList;
					}
				return;
				case "dq":
					if(dqInfluencers)
					{
						return dqList;
					}
				return;
				case "bb":
					if(bbInfluencers)
					{
						return bbList;
					}
				return;
			}
		};

		$scope.pagerFunctionC1 = function(){
			if(wingstopInfluencers)
			{
				// Switch active content
				contentData = wingstopInfluencers;
				contentList = wingstopList;

				var lastCount = contentList.length-1;
				for(var i = 1; i <= 19; i++) {
			      contentList.push(contentData[lastCount + i]);
			    };
			}
			
		};
		$scope.pagerFunctionC2 = function(){
			if (dqInfluencers)
			{
				// Switch active content
				contentData = dqInfluencers;
				contentList = dqList;

				var lastCount = contentList.length-1;
				for(var i = 1; i <= 19; i++) {
			      contentList.push(contentData[lastCount + i]);
			    };
			}
			
		};
		$scope.pagerFunctionC3 = function(){
			if (bbInfluencers)
			{
				// Switch active content
				contentData = bbInfluencers;
				contentList = bbList;

				var lastCount = contentList.length-1;
				for(var i = 1; i <= 19; i++) {
			      contentList.push(contentData[lastCount + i]);
			    };
			}
			
		};
	});
	
	


	// Menu 
	app.controller("MenuController",function(){
		this.menuItem = 2;
		activeContent = 2;

		this.contentType = 1;
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
				console.log("active Content : " + contentNum);
				this.contentType = contentNum;
			}
		};
		this.getActiveContent = function(contentNum){
			return contentNum === this.contentType;
		};
		
	});
})();