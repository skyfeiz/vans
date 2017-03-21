this.WbstChart = this.WbstChart = {};
(function() {
	var TimeLine = function() {
		// 下标的间距
		this.xSpace = 20;

		// 数据显示在时间轴的总长
		this.axisLenght = 1000;

		this.isMove = false;
		// 选择区域的宽
		this.aWidth = 0;
		// 选择区域的left值
		this.l = 0;

		this.init();
	}

	var p = TimeLine.prototype;

	p.init = function() {

		this.initDom();
		this.setSize();
		this.resize();
		this.moveEvent();
		this.moveLeft();
		this.btnEvent();
	}
	p.initDom = function() {
		this.timeLine = $('#timeline');
		this.canvas = this.timeLine.find('.canvastimeline');
		this.limitbox = this.timeLine.find('.timelimitbox');
		this.contentBox = this.timeLine.find('.timecontent');
		this.areabox = $('#timeareabox');
		this.axisleft = $('#axisleft');
		this.axisright = $('#axisright');
		this.areaBox = $('#timeareabox');
		this.startline = $('#startline');
		this.endline = $('#endline');

		this.timeBtn = this.timeLine.find('.timebtns li');
	};

	p.setSize = function() {
		// 获取盒子的宽高，给canvas设置宽高
		var json = {
			width: this.timeLine.width(),
			height: this.timeLine.height() - 20
		};

		// 设置canvas显示区域的宽高 有overlow：hidden样式
		this.limitbox.css(json);
		this.limitLeft = this.limitbox.offset().left;
		// 设置canvas实际区域的宽高
		this.canvas.attr({
			width: this.axisLenght + 8,
			height: json.height
		});

		this.contentBox.css({
			width: this.axisLenght + 28,
			height: json.height
		});
		this.drawGrid('now');
		this.l = this.areabox.position().left
		this.aWidth = this.areabox.width();
	}

	p.drawGrid = function(type) {
		var _this = this;
		var xArr = [];
		var yArr = [];
		var ctx = this.canvas[0].getContext('2d');
		ctx.clearRect(0, 0, this.canvas.width(), this.canvas.height());

		ctx.fillStyle = 'green';
		ctx.rect(0, 50, _this.axisLenght, 10);
		ctx.fill();
		

		switch(type){
			case 'now':
				xArr = [' 1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', '10', '11', '12'];
				yArr = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];
				break;
			case 'month':
				yArr = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
				for (var i = 2014; i < 2017; i++) {
					for (var j = 1; j < 13; j++) {
						xArr = xArr.concat(_this.get1monthDays(j,!(i%4)));
					}
				}
				break;
			case 'year':
				xArr = [' 1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', '10', '11', '12'];
				yArr = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];
				break;
			default:
				return;
			 	break;
		}
		console.log(yArr);
		// 画下标  下标不是循环，适合于月下显示日
		// 2004年到2017年的月份
		// var daysArr = [];
		// for (var i = 2014; i < 2017; i++) {
		// 	for (var j = 1; j < 13; j++) {
		// 		daysArr = daysArr.concat(_this.get1monthDays(j,!(i%4)));
		// 	}
		// }
		// console.log(daysArr);

		// 画下标   下边循环相同， 适合于年下显示月    ， 日下显示小时
		
		for (var i = 0; i < this.axisLenght; i += _this.xSpace) {
			// 下标字
			ctx.fillText(xArr[(i / _this.xSpace) % xArr.length], i + 8, 73);
			// 下标线
			ctx.beginPath();
			ctx.moveTo(i + 4, 60);
			ctx.lineTo(i + 4, 64);
			ctx.stroke()
		}

		_this.ySpace = _this.xSpace * xArr.length
			// 画上标
		
		for (var i = 0; i < this.axisLenght; i += _this.ySpace) {
			// 上标字
			ctx.fillText(yArr[i / _this.ySpace], i, 44);
			// 上标线
			ctx.beginPath();
			ctx.moveTo(i + 4, 50);
			ctx.lineTo(i + 4, 54);
			ctx.stroke()
		}
	}

	p.moveEvent = function() {
		var _this = this;
		var widthX;
		var disX;
		var isDown = false;
		var autoMove = false;
		var sign = '';
		var nLeft = 0;
		var datal = 0;
		var dataw = 0;

		// 起始时间轴
		_this.startline.mousedown(function(ev) {
				$(this).next().css('zIndex', 11);
				$(this).css('zIndex', 22);
				nLeft = _this.contentBox.offset().left;
				widthX = -ev.pageX - _this.aWidth + nLeft;
				disX = ev.pageX - _this.l - nLeft;
				sign = 'start';
				isDown = true;
				autoMove = false;

				ev.stopPropagation();
			})
			// 结束时间轴
		_this.endline.mousedown(function(ev) {
			$(this).prev().css('zIndex', 11);
			$(this).css('zIndex', 22);

			nLeft = _this.contentBox.offset().left;
			widthX = ev.pageX - _this.aWidth - nLeft;
			sign = 'end';
			isDown = true;
			autoMove = false;
			ev.stopPropagation();
		})

		_this.areaBox.mousedown(function(ev) {
			disX = ev.pageX - _this.areabox.position().left;
			sign = 'area';
			isDown = true;
			ev.stopPropagation();
		})

		$(document).mousemove(function(ev) {
			if (!isDown) {
				return;
			}
			fnMove(ev);
			ev.preventDefault();
		})

		$(document).mouseup(function() {
			isDown = false;
			autoMove = false;
			clearInterval(_this.timer);

			// 根据l和width算出选择时间区域
			// Math.round(64-4)/20 = 3*30 = 60
			var nl = Math.round((_this.l - 4) / _this.xSpace) * _this.xSpace + 4;
			var nWidth = nl - _this.l;
			_this.aWidth = Math.round((_this.aWidth + nWidth) / _this.xSpace) * _this.xSpace;
			_this.l = nl;
			_this.areabox.css({
				width: _this.aWidth,
				left: _this.l
			});
			if (datal == _this.l && dataw == _this.aWidth) {
				return;
			}
			datal = _this.l;
			dataw = _this.aWidth;
			_this.getRangeTime(datal, dataw);
		})

		function fnMove(ev) {
			var nAreaLeft = _this.areaBox.offset().left;
			nLeft = _this.contentBox.offset().left;
			var limitWidth = _this.limitbox.width();
			var limitLeft = _this.limitbox.offset().left;

			switch (sign) {
				case 'start':
					// 鼠标移动动的距离
					var changeX = ev.pageX - nLeft;
					_this.l = changeX - disX;
					if (_this.l <= 0) {
						_this.l = 0;
						_this.aWidth = -disX - widthX;
					} else {
						_this.aWidth = -changeX - widthX;
					}

					if (ev.pageX < _this.limitbox.offset().left && _this.l > 0) {
						if (!autoMove) {
							clearInterval(_this.timer);
							_this.canvaspMove('left', true);
							autoMove = true;
						}
					}
					break;
				case 'end':
					var changeX = ev.pageX - nLeft;
					_this.aWidth = changeX - widthX;
					if (_this.aWidth + _this.l >= 1000) {
						_this.aWidth = 1000 - _this.l;
					};
					if (ev.pageX >= limitWidth + _this.limitbox.offset().left && _this.aWidth + _this.l < 960) {
						if (!autoMove) {
							clearInterval(_this.timer);
							_this.canvaspMove('right', true);
							autoMove = true;
						}
					}
					break;
				case 'area':
					_this.l = ev.pageX - disX;
					if (_this.l <= 0) {
						_this.l = 0;
					} else if (_this.l + _this.aWidth >= 1000) {
						_this.l = 1000 - _this.aWidth;
					}
					break;
			}
			if (!autoMove) {
				if (_this.aWidth < 20) {
					_this.aWidth = 20;
					$(document).trigger('mouseup');
				}

				_this.areabox.css({
					width: _this.aWidth,
					left: _this.l
				});
			}

		};
	}

	// canvas的父级移动     包含canvas和 时间开始轴，中间区域，时间结束轴等一起移动
	// bOk为true时width和left跟着一起累加
	p.canvaspMove = function(dir, bOk) {
		var _this = this;
		var maxLeft = _this.axisLenght - _this.limitbox.width();
		var n = _this.contentBox.position().left;
		if (dir == 'left') {
			_this.timer = setInterval(function() {
				n += 4;
				if (n >= 4) {
					n = 4;
					clearInterval(_this.timer);
					return;
				}
				if (bOk) {
					_this.aWidth += 4;
					_this.l -= 4;
					if (_this.l <= 0) {
						_this.l = 0;
					}
					_this.areabox.css({
						width: _this.aWidth,
						left: _this.l
					});
				}
				_this.contentBox.css('left', n);
			}, 30);
		} else if (dir == 'right') {
			_this.timer = setInterval(function() {
				n -= 4;
				if (n <= -maxLeft - 4) {
					n = -maxLeft - 4;
					clearInterval(_this.timer);
					return;
				}
				_this.contentBox.css('left', n);
				if (bOk) {
					_this.aWidth += 4;
					if (_this.l + _this.aWidth >= 1000) {
						_this.aWidth = 1000 - _this.l;
					}
					_this.areabox.css({
						width: _this.aWidth
					});
				}
			}, 30)
		}
	}

	// 左移
	p.moveLeft = function() {
		var _this = this;

		// 左移按钮事件
		_this.axisleft.mousedown(function() {
			_this.canvaspMove('left');
		})

		// 右移按钮事件
		_this.axisright.mousedown(function() {
			_this.canvaspMove('right');
		})
	}

	/*
		通过 left 和 width 计算 时间范围
		需要知道，时间起点，下标间距，单元格代表的时间，
	*/
	p.getRangeTime = function(datal, dataw) {
		// - 4  是去除轴开始的位置距离
		var n1 = (datal - 4) / this.xSpace;
		// n1%12   的取值是从0 到 11 ，     ( *%12) || 12 为0 的时候用12 代替
		var startTime = 2004 + Math.floor((n1 - 1) / 12) + '-' + ((n1 % 12) || 12);
		var n2 = dataw / this.xSpace;
		var endTime = 2004 + Math.floor((n2 + n1 - 1) / 12) + '-' + (((n2 + n1) % 12) || 12);
		console.log(startTime, endTime);
	}

	// 大月[1,3,5,7,8,10,12]  小月[4,6,9,11] ,不确定的月[2];
	// 获取1个月个Days数组 false代表不是润年
	p.get1monthDays = function(n, isR) {
		var arr = [];
		var m = 0;
		switch(n){
			case 4:
			case 6:
			case 7:
			case 11:
				m = 30;
				break;
			case 2:
				if (isR) {
					m = 29;
				}else{
					m = 28;
				}
				break;
			default:
				m = 31;
				break;

		}
		for (var i = 0; i < m; i++) {
			arr[i] = i+1;
		}
		return arr;
	}

	p.btnEvent = function(){
		var _this = this;
		_this.timeBtn.click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			_this.drawGrid($(this).attr('data-type'));
		})
		
	}

	p.resize = function() {
		var _this = this;
		$(window).resize(function() {
			_this.setSize();
		});
	}


	WbstChart.TimeLine = TimeLine;
})()