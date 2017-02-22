var $url = "/fotonvans/";
this.foton = this.foton || {};
(function() {

	var Brand = function() {

		this.num = 1;

		this.init();
	};

	var p = Brand.prototype;

	p.init = function() {
		this.initDom();
		this.eventLoadMore();
	}

	p.initDom = function() {
		this.$aLoadMore = $('.loadmore');
	}

	p.eventLoadMore = function() {
		var cur = this;
		this.$aLoadMore.click(function() {
			var $this = $(this),
				zType = $this.attr('z-type');
			switch(zType){
				case '1':
					new foton.LoadMore({
						url: 'testdata/more.json',
						$ele: $this,
						fn: function(res){
							var htmlStr = '';
							$.each(res.data,function(i,val){
								htmlStr += '<li class="his_step clearfix">'+
		                           ' <div class="z_axis fl"></div>'+
		                           ' <div class="axis_cont fr">'+
		                                '<a href="javascript:;">'+
		                                   ' <h4>2013</h4>'+
		                                   ' <div class="clearfix">'+
		                                        '<img class="fl" src="images/about/history4.jpg" alt="" />'+
		                                        '<p class="fr">图雅诺再次服务于国家关键时刻成为G20 峰会官方指定用车。</p>'+
		                                    '</div>'+
		                               ' </a>'+
		                            '</div>'+
		                        '</li>'
							})
							$this.prev().append(htmlStr);
						}
					})
				 	break;
				case '2':
					new foton.LoadMore({
						url: 'testdata/more.json',
						$ele: $this,
						fn: function(res){
							var htmlStr = '';
							$.each(res.data,function(i,val){
								htmlStr += '<h4 class="honor_title">2015年商务汽车荣誉</h4>'+
							                '<div class="honorbox clearfix">'+
							                    '<img class="fl" src="images/about/honor3.jpg" alt="" />'+
							                    '<p class="fr">中国轻害茸度车型评选</p>'+
							                '</div>'+
							                '<div class="honorbox clearfix">'+
							                    '<img class="fl" src="images/about/honor4.jpg" alt="" />'+
							                    '<p class="fr">2016年轻客之星推荐</p>'+
							                '</div>'
							})
							$this.prev().append(htmlStr);
						}
					})
				 	break;
			}

		})
	}

	p.loadinf = function(data, $parent) {

		$.each(data, function(i, val) {

			var default_li = '<li class="his_step clearfix">' +
				'<div class="z_axis fl"></div>' +
				'<div class="axis_cont fr">' +
				' <a href="javascript:;">' +
				' <h4>' + val.year + '</h4>' +
				'<div class="clearfix">' +
				'<img class="fl" src="images/about/' + val.src + '" alt="" />' +
				'<p class="fr">' + val.title + '</p>' +
				'</div>' +
				'</a>' +
				'</div>' +
				'</li>';
			$parent.append(default_li);
		});
	};

	foton.Brand = Brand;

})();