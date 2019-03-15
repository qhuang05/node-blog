$(document).ready(function(){
	$('#toRegister').on('click', function(){
		$('.login-wrap').fadeOut();
		$('.register-wrap').fadeIn();
	})
	$('#toLogin').on('click', function(){
		$('.register-wrap').fadeOut();
		$('.login-wrap').fadeIn();				
	})
	// 注册
	$('#registerBtn').on('click', function(){
		var params = {
			username: $('#registerWrap input[name="username"]').val(),
			password: $('#registerWrap input[name="password"]').val(),
			repassword: $('#registerWrap input[name="repassword"]').val()			
		};
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data: params,
			dataType: 'json',
			success: function(res){
				$('#registerWrap .error-message').text(res.message);
				if(res.code){
					setTimeout(function(){
						$('#registerWrap').fadeOut();
						$('#loginWrap').fadeIn();	
						$('#registerWrap .error-message').text('');
					}, 1000)
				}
			},
			error: function(xhr,error,status){}
		})
	})
	// 登录
	$('#loginBtn').on('click', function(){
		var params = {
			username: $('#loginWrap input[name="username"]').val(),
			password: $('#loginWrap input[name="password"]').val()
		}
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data: params,
			dataType: 'json',
			success: function(res){
				if(res.code){
					location.reload();
				} else{
					$('#loginWrap .error-message').text(res.message);
				}
			},
			error: function(xhr,error,status){}
		})
	})
	// 退出
	$('#logout').on('click', function(){
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			success: function(res){
				if(res.code){
					location.reload()
				}
			},
			error: function(xhr,error,status){}
		})
	})
})