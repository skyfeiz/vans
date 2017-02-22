this.foton = this.foton || {};
(function() {
	var LoadMore = function(json) {

		this.url = json.url;

		this.$ele = json.$ele;

		this.fn = json.fn;

		this.num = 1;

		this.haveif = true;

		this.init();
	}

	var p = LoadMore.prototype;


	p.init = function() {
		var cur = this;
		var $this = this.$ele;

		if ($this.attr('bok') == 'end') {
			return;
		}

		this.num++;

		$.ajax({
			type: 'get',
			url: this.url,
			success: function(res) {
				if (res.data.length == 0) {
					$this.css({
						"background-color": "#cccccc"
					}).html("已经到底啦~").attr('bok', 'end');
					return;
				}

				cur.fn && cur.fn(res);

				if (res.data.length < 4) {
					$this.css({
						"background-color": "#cccccc"
					}).html("已经到底啦~").attr('bok', 'end');
				}
			}
		})
	}

	foton.LoadMore = LoadMore;
})()