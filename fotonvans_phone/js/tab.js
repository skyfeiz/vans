this.foton = this.foton || {};
(function() {
	var Tab = function(json) {
		//btn父级的id
		this.$aBtn = json.$aBtn;

		this.bClass = json.bClass;
		//show父级的id
		this.$aShow = json.$aShow;

		this.sClass = json.sClass;

		this.init();

	}

	var p = Tab.prototype;


	p.init = function() {
		var cur = this;
		cur.$aBtn.click(function(ev){
			ev.stopPropagation();
			cur.$aBtn.removeClass(cur.bClass);
			$(this).addClass(cur.bClass);
			cur.$aShow.removeClass(cur.sClass);
			cur.$aShow.eq($(this).index()).addClass(cur.sClass);
		})
	}

	foton.Tab = Tab;
})()