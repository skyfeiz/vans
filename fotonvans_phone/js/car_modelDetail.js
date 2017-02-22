this.foton = this.foton || {};
(function() {
    var CarModelDetail = function() {
        this.init();
    }
    var p = CarModelDetail.prototype;
    p.init = function() {
        this.countNum = 0;
        this.initHeadStatus();
        this.ftxw();
        this.initDom();
        this.initNav();
        this.loadmore();
        this.initSlideH();
        this.address = [];
        this.haveinf = true;
        this.num = 1;
    }
    p.initNav = function() {
        var $nav = $(".modeDetail_head");

    }
    p.initDom = function() {
        this.$table = $(".main_part table.table");
        this.$tableTr = $("table.table tr.list");
        this.$leftTableTr = $(".main_part tr.left_tr");
        this.$leftTHead = $("tr.left_tableHead");
    }
    p.initSlideH = function() {
        simpScroller(document.querySelector(".slide_ul"), {
            verticalScroll: false,
            horizontalScroll: true,
        });
        //表格高度处理
        var trLen = this.$tableTr.length;
        if (trLen != 0) {
            var trHeight = this.$tableTr.eq(0).height();
            var firstH = $("tr.table_first").height();
            var thirdH = $("tr.table_two").height();
            var allH = firstH + thirdH;
            this.$leftTableTr.height(trHeight);
            this.$leftTHead.height(allH);
        }

    }
    p.initHeadStatus = function() {
        var cur = this;
        $(".modeDetail_head li").click(function(e) {

            if ($(".modeDetail_head > .left_nav_detail").length) {
                $(".modeDetail_head > .left_nav_detail").remove();
            }
            var index = $(this).index();
            $(".modeDetail_head li").removeClass("left_nav_click")
            $(".left_nav").stop().slideUp();
            $(this).addClass("left_nav_click");
            $(".modeDetail_head").append($(this).children().clone())
            $(".modeDetail_head > .left_nav_detail").addClass("nav_checked left_nav_click");
            //cur.initChecked();
            $(".car_sliderBox").css({
                "position": "absolute",
                "zIndex": "-1",
                "opacity": 0
            })
            $(".car_sliderBox").eq(index).css({
                "position": "relative",
                "opacity": "1",
                "zIndex": 10
            });
        });

        $(document).click(function(e) {
            if ($(e.target).parent().hasClass("nav_checked")) {
                $(e.target).parent().remove();
                $(".left_nav").stop().slideDown();
            }

            if (!$(e.target).parents(".modeDetail_head").length && !$(e.target).hasClass("modeDetail_head") && !$(e.target).parent().hasClass("nav_checked")) {
                var firstDetail = $(".modeDetail_head").find(".left_nav_click").find(".left_nav_detail").clone();
                /*  if(cur.countNum==0){
                    $(".modeDetail_head").append(firstDetail)
                  }*/
                if (!$(".modeDetail_head > .left_nav_detail").length) {
                    $(".modeDetail_head").append(firstDetail);
                    $(".modeDetail_head > .left_nav_detail").addClass("nav_checked left_nav_click");
                    $(".left_nav").stop().slideUp();
                } else {
                    //$(".left_nav").slideUp(200);
                }
            }
            cur.countNum++;
        })
    }
    p.initChecked = function() {
            $(".modeDetail_head .nav_checked").click(function() {
                alert(11);
                $(this).remove();
                $(".left_nav").slideDown();
            })
        }
        //视频
    p.ftxw = function() {
        var cur = this;
        $.ajax({
            type: "get",
            url: "/webback/news/mobileJson/video",
            success: function(data) {
                $.each(data.data, function(i, val) {
                    cur.address.push(val.vedioCode);
                    var vibox = '<li>' +
                        '<div class="videobox">' +
                        //                  '<img src="'+ 'images/news/sp_01.jpg' +'" class="videopic"/>'+
                        '<div class="videotitle">' +
                        '<div class="videoyy"></div>' +
                        '<p class="videocon">' + val.title + '</p>' +
                        '</div>' +
                        //                  '<img src="images/news/sp_02.png" class="videobf"/>'+
                        '<div class="videosite"></div>' +
                        '</div>' +
                        '</li>';
                    $("ul.lbbox").append(vibox);

                });
                $.each($('div.videosite'), function(n, add) {
                    var player = polyvObject(add).videoPlayer({
                        'width': '100%',
                        'height': '100%',
                        'vid': cur.address[n]
                    });
                });
            }
        });
    };

    p.loadmore = function() {
        var cur = this;
        $("div.loadmore").click(function() {
            if (cur.haveinf) {
                cur.num++;
                $.ajax({
                    type: "get",
                    url: "/webback/news/mobileJson/video",
                    data: {
                        pageNum: cur.num
                    },
                    success: function(data) {
                        var lilen = $('ul.lbbox li').length;
                        $.each(data.data, function(i, val) {
                            cur.address.push(val.vedioCode);
                            var vibox = $('<li class="fadeIn">' +
                                '<div class="videobox">' +
                                //                  '<img src="'+ 'images/news/sp_01.jpg' +'" class="videopic"/>'+
                                '<div class="videotitle">' +
                                '<div class="videoyy"></div>' +
                                '<p class="videocon">' + val.title + '</p>' +
                                '</div>' +
                                //                  '<img src="images/news/sp_02.png" class="videobf"/>'+
                                '<div class="videosite"></div>' +
                                '</div>' +
                                '</li>');
                            $("ul.lbbox").append(vibox);
                            var player = polyvObject(vibox.find('div.videosite')).videoPlayer({
                                'width': '100%',
                                'height': '100%',
                                'vid': cur.address[lilen + i]
                            });
                        });
                        if (data.data.length < 4) {
                            $("div.loadmore").css({
                                "background-color": "#cccccc"
                            }).html("已经到底啦~");
                            cur.haveinf = false;
                        }
                    }
                });
            } else {
                return false;
            }
        });
    };
    foton.CarModelDetail = CarModelDetail;
})();