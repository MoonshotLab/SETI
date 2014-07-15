$(function() {


	// UI elements

	// Active red border on focus
	$(".input-wrapper input").focus(function(){
		$(this).parent().css("border","1px solid #bf2e1a");

	});
	$(".input-wrapper input").focusout(function(){
		$(this).parent().css("border","1px solid #e1e3e3");
	});
	// Make whole DIV clickable
	$(".input-wrapper").click(function(){
		$(this).find("input").focus();
	});
	// Check content and act responsive
	$("#user-input").on('input',function(){
		var content = $("#user-input").val();
		if(content != "" && content != "Username")
		{
			$("#user-input").css("color","#403f3f");
			$("#user-input").css("font-weight","400");
		}
		else
		{
			$("#user-input").css("color","#c0c0c0");
			$("#user-input").css("font-weight","300");
		}
	});
	$("#pass-input").on('input',function(){
		var content = $("#pass-input").val();
		if(content != "" && content != "Username")
		{
			$("#pass-input").css("color","#403f3f");
			$("#pass-input").css("font-weight","400");
		}
		else
		{
			$("#pass-input").css("color","#c0c0c0");
			$("#pass-input").css("font-weight","300");
		}
	});
	// On Focus Input Change
	$("#user-input").focus(function(){
		var content = $("#user-input").val();
		if(content == "Username"){
			$("#user-input").val("");
		}
	});
	$("#user-input").focusout(function(){
		var content = $("#user-input").val();
		if(content == ""){
			$("#user-input").val("Username");
			$("#user-input").css("color","#c0c0c0");
			$("#user-input").css("font-weight","300");
		}
	});
	$("#pass-input").focus(function(){
		var content = $("#pass-input").val();
		if(content == "Password"){
			$("#pass-input").val("");
		}
	});
	$("#pass-input").focusout(function(){
		var content = $("#pass-input").val();
		if(content == ""){
			$("#pass-input").val("Password");
			$("#pass-input").css("color","#c0c0c0");
			$("#pass-input").css("font-weight","300");
		}
	});

});