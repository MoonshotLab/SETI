$(function() {

	// Client list items
	$("#client-menu #client-list li").hover(function(){
		$(this).find(".arrow").animate({
			opacity:1,
			marginLeft:"20px"
		},250)
	},function(){
		$(this).find(".arrow").animate({
			opacity:0,
			marginLeft:"+20"
		},250)
	})

});