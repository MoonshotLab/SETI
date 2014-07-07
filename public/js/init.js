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

	// Angular setup
	var app = angular.module("SETI",[]);
	// Vars
	var clientData;
	
	app.controller("DataController",function($scope,$http){
		// Data
		// this.wingstopData = null;
		this.wingstopInfluencers = null;
		var wingstopInfluencerCount = 0;
		this.wingstopMentions = null;
		var wingstopMentionCount = 0;
		// this.dqData = null;
		this.dqInfluencers = null;
		var dqInfluencerCount = 0;
		this.dqMentions = null;
		var dqMentionCount = 0;
		// this.bbData = null;
		this.bbInfluencers = null;
		var bbInfluencerCount = 0;
		this.bbMentions = null;
		var bbMentionCount = 0;

		// Wingstop
		$http.get('http://localhost:3000/wingstop/influencers').success(function(data) {
		    wingstopInfluencers = data;
		    wingstopInfluencerCount = data.length;
		});
		$http.get('http://localhost:3000/wingstop/mentions').success(function(data) {
		    wingstopMentions = data;
		    wingstopMentionCount = data.length;
		    console.log("Wingstop Mention Data Loaded");
		});
		// Dairy Queen
		$http.get('http://localhost:3000/dairyqueen/influencers').success(function(data) {
		    dqInfluencers = data;
		    dqInfluencerCount = data.length;
		    console.log("Dairy Queen Influencers Loaded");
		});
		$http.get('http://localhost:3000/dairyqueen/mentions').success(function(data) {
		    dqMentions = data;
		    dqMentionCount = data.length;
		    console.log("Dairy Queen Mentions Loaded");
		});
		// Blue Bunny
		$http.get('http://localhost:3000/bluebunny/influencers').success(function(data) {
		    bbData = data;
		    bbInfluencerCount = data.length;
		    console.log("Blue Bunny influencers Loaded");
		});
		$http.get('http://localhost:3000/bluebunny/mentions').success(function(data) {
		    bbData = data;
		    bbMentionCount = data.length;
		    console.log("Blue Bunny Mentions Loaded");
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
	});
	
	


	// Menu 
	app.controller("MenuController",function(){
		this.menuItem = 2;
		
		this.activeMenu = function(menuNum){
			if(this.menuItem !== menuNum)
			{
				console.log("activeMenu call");
				this.menuItem = menuNum;
			}
		};

		this.getActiveMenu = function(menuNum){
			return menuNum === this.menuItem;
		}
		
	});
})();