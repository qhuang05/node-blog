$(function(){
	$('#logout').on('click', function(){
		console.log(23434);
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			success: function(res){
				if(res.code){
					location.href = '/';
				}
			},
			error: function(xhr,error,status){}
		})
	})
});