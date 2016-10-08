$(document).ready(function() {
    		var audio = $('#player');     //播放器标签
    		var list_num = 0;     //歌曲列表数
    		var current_play = 0;     //当前播放id
    		var list_data = '';       //列表数据
    		var current_name = '';        //当前播放名
            var lrc = '';       //歌曲数据
            var id = '';        //定时器
            var flag = 1;       //当前歌词
            var last = 0;       //上一句歌词
    		getList();          //获取歌曲列表
            

//==============方法名===================================
    		//获取歌词列表
    		function getList() {
    			$.ajax({
    				url: 'song.php',
    				type: 'GET',
    				dataType: 'json',
    				data: {method:'getList'},
    			})
    			.done(function(data) {
    				list_data = data.name;
    				list_num = data.name.length;
    				refresh_list();
    				console.log("success");
    			})
    			.fail(function() {
    				console.log("error");
    			})
    			.always(function() {
    				console.log("complete");
    			});
    		}

    		//获取歌词
    		function getLrc(song) {
    			$.ajax({
    				url: 'song.php',
    				type: 'GET',
    				dataType: 'json',
    				data: {method:'getLrc',name:song},
    			})
    			.done(function(data) {
                    lrc = data;
                    console.log(data.msg == 'no');
                    if (data.msg == 'no') {
						refresh_lrc(data.msg);
                    } else {
	                    refresh_lrc(data.lrc);
	                    flag = 0;
	                    id = setInterval(move_lrc,100);
	                    // alert($('#5').text().length);
                    }
                    console.log("success");
    			})
    			.fail(function() {
    				console.log("error");
    			})
    			.always(function() {
    				console.log("complete");
    			});
    		}

    		//初始化歌词显示
            function init_lrc() {
            	clearInterval(id);
                lrc = '';       //歌曲数据
                id = '';        //定时器
                flag = 0;       //当前歌词
                last = -1;       //上一句歌词
                $('.lrctext').css('margin-top','350px');
            }

    		//播放下一首
    		function play_next () {
    			next_play = current_play + 1;
    			if (next_play > list_num-1) {
    				next_play = 0;
    			}
    			audio.attr('src', './mp3/song/'+ list_data[next_play]+'.mp3');
    			current_play = next_play;
    			current_name = list_data[next_play].name;
    			player.play();
                init_lrc();
    			getLrc(current_name);
    		}

    		//播放上一首
    		function play_last () {
    			last_play = current_play - 1;
    			if (last_play < 0) {
    				last_play = list_num-1;
    			} 
    			audio.attr('src', './mp3/song/'+ list_data[last_play].name+'.mp3');
    			current_play = last_play;
    			current_name = list_data[last_play].name;
    			player.play();
                init_lrc();
    			getLrc(current_name);
    		}

    		//歌曲列表
    		function refresh_list() {
    			for (var i = 0; i < list_num; i++) {
    				if (i == 0) {
    					$('#player').attr('src','./mp3/song/'+ list_data[i]+'.mp3');
    					current_play = 0;
    					current_name = list_data[i];
                        init_lrc();
    					getLrc(current_name);
    				}
    				$('.list-group').append('<a href="#" class="list-group-item">'+list_data[i]+'</a>');
    			}
    			bind_change();
    		}

    		//绑定列表点击事件
    		function bind_change() {
	    		$('.list-group-item').each(function (i) {
	    			if (i != 0) {
		    			$(this).click(function () {
		    				$(this).css('background-color','EEEEEE');
		    				audio.attr('src', './mp3/song/'+ $(this).text()+'.mp3');
		    				current_name = $(this).text();
	                        if ($('#status').attr('class') == 'pause') {
	                            $('#status').attr('class','play');
	                            $('#status').find('img').attr('src','./img/play.png');
	                        }
	                        player.play();
	                        init_lrc();
		    				getLrc(current_name);
		    			})
	    			}
    			})
    		}

    		//更新歌词显示
            function refresh_lrc(data) {
                $('.lrctext').empty();
                if (data == 'no') {
                	$('.lrctext').append('<h2 style="color:white;">暂无歌词</h2>');
                } else {
	                 for (var i = 0; i < data.length; i++) {
	                	if (i == 0) {
	                		$('.lrctext').append('<p id='+i+' class="move">'+data[i]+'</p>');
	                	} else {
	                		$('.lrctext').append('<p id='+i+'>'+data[i]+'</p>');
	                	}
	                }
                }
            }

            //歌词动态显示
            function move_lrc() {
            	if (lrc.msg == 'no') {
            		clearInterval(id);
            		return;
            	}
                time = lrc.time;
                if (time[flag]) {
                    if (Math.abs((player.currentTime).toFixed(2) - time[flag]) < 0.1) {
                    	// console.log('length:'+$('#'+flag).text().length)
                    	length = $('#'+flag).text().length;
                        if (length != 1 && length != 0) {
                            $('#'+flag).addClass('move');
                            $('#'+last).removeAttr('class');
                            last = flag;
                            flag += 1;
	                        preHight = $('.lrctext').css('margin-top');
	                        newHight = parseInt(preHight)-30+'px';
	                        $('.lrctext').css('margin-top',newHight);
	                        console.log('padding-top:'+newHight);
                        } else {
                            last = flag-1;
                            flag += 1;
                        }
                        console.log('flag:'+flag+'  last='+last);
                }
            } else {
                console.log('GG');
                clearInterval(id);
            }
        }
            
    		//播放结束自动播放下一首
    		player.onended = function () {
    			play_next();
    		}

    //=========================点击事件===========================================
    		//暂停播放
    		$('#status').click(function () {
    			if ($(this).attr('class') == 'pause') {
    				$(this).attr('class','play');
    				$(this).find('img').attr('src','./img/play.png');
    				player.play();
                    id = setInterval(move_lrc,100);
    			} else {
    				$(this).attr('class','pause');
    				$(this).find('img').attr('src','./img/pause.png');
    				player.pause();
                    clearInterval(id);
    			}
    		})

    		//停止
    		$('#stop').click(function () {
    			$('#status').attr('class','pause');
    			$('#status img').attr('src','./img/pause.png');
    			player.pause();
    			player.currentTime = 0.0;
    			getLrc(current_name);
    		})

    		//上一首
    		$('#last').click(function() {
    			play_last();
    		});

    		//下一首
    		$('#next').click(function() {
    			play_next();
    		});
    	});