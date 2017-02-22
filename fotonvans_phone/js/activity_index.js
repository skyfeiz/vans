this.foton = this.foton || {};
(function() {
	var activity = function() {
		this.change();
		this.loadEvent();
	};
	var p = activity.prototype;

	p.change = function() {
		var cur = this;
		$("div.hdbox").eq(0).show();
		$("ul.optionbox li").click(function() {
			var index = $(this).index();
			$(this).addClass("pitchBG").siblings().removeClass("pitchBG");
			$("div.hdbox").eq(index).fadeIn().siblings("div.hdbox").hide();
		});
	};

	p.loadEvent = function() {
		$('.loadmore').click(function() {
			var $this = $(this);
			new foton.LoadMore({
				$ele: $this,
				url: 'testdata/more.json',
				fn: function(res) {
					var htmlStr = '';
					$.each(res.data,function(i.val){
						htmlStr += '<li class="clearfix">'+
								'<a href="activity_details.html">'+
									'<img src="images/activity/hd01.jpg" class="lbpic" />'+
									'<div class="lbcon">'+
										'<p class="lbcon_title">福田奥铃中国勒芒轻卡耐力赛即日起火热报名！</p>'+
										'<p class="lbcon_con">只要你身体健康、拥有B2（含）以上驾照2年以上、一年内无重大交通事故记录，热爱卡车赛事运动，就可以参与报名~在线报名还有机会赢</p>'+
										'<p class="lbcon_time">2016/03/23</p>'+
									'</div>'+
								'</a>'+
							'</li>';
					});
					$this.prev().append(htmlStr);
				}
			});
		});
	};

	foton.activity = activity;
})();