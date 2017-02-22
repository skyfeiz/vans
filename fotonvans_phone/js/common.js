this.foton = this.foton || {};
var $url = "/ollin/";
var $baseUrl = window.$baseUrl || {};
$baseUrl = 'http://' + document.location.host + '//';
//会员中心接口
var $mcBaseUrl = window.$mcBaseUrl || {};
$mcBaseUrl = 'http://' + document.location.host + $url;
//$mcBaseUrl = 'http://172.24.222.8:8080'+$url;
(function(){
  var Common = function(){
    this.init();
  };
  var p = Common.prototype;
  p.init = function(){
    new foton.header();
    this.$heightNavBar;
    this.$ulHeight;
    this.$liHeight;
    this.initDom();
    this.initRemChange();
    this.initNav();
    this.initWebSit();
    this.initWixinWin();
    new foton.LoginInStatus();
  };
  p.initDom = function(){
    this.$shadow = $(".bg_shadow_nav");
    this.$navPart = $(".hearder .nav_part");
    this.$secTitle = $(".hearder .sec_title");
    this.$thiTitle = $(".hearder .thi_title");
    this.$ul = $(".hearder .nav_part ul");
  };
  //rem处理
  p.initRemChange = function(){
    var tid = null,
    cur = this;
    this.refreshRem();
    window.addEventListener('resize', function() {
      clearTimeout(tid);
      tid = setTimeout(cur.refreshRem, 300);
    }, false);
    window.addEventListener('pageshow', function(e) {
      if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(cur.refreshRem, 300);
      }
    }, false);
  };
  p.refreshRem = function(){
    var docEl = window.document.documentElement;
    var width = docEl.getBoundingClientRect().width;
    var rem = width / 3.75;
    docEl.style.fontSize = rem + 'px';
  };
  //导航
  p.initNav = function(){
    var cur = this;
    cur.$navPart.data("click",true);
    var isFirst=true;
    $(".btn_span").bind("click",function(e){
      e.stopPropagation();
      if(cur.$navPart.data("click")==true){
        cur.$shadow.fadeIn(500);
        cur.$navPart.stop().animate({"right":0},500,function(){
          cur.$heightNavBar = cur.$navPart.height();
          cur.$ulHeight = $(".nav_part ul").height();
          if(cur.$heightNavBar>($(window).height()-$(".hearder").height())){
            cur.$navPart.css({"height": $(window).height()-$(".hearder").height(),"overflow":"auto"})
          }
          if (window.addEventListener && isFirst) {
            isFirst = false;
             simpScroller(document.querySelector(".nav_part"));
          }
        }).css({"display":"block"});
        cur.$navPart.data("click",false);
      }else{
        cur.initNavUp();
      }
    });
    cur.$secTitle.bind("click",function(e){
      e.stopPropagation();
      cur.$secTitle.removeClass("click_bg");
      var $thiT = $(this).siblings(".thi_title");
      if($thiT.css("display")=="none"){
        $(this).addClass("click_bg");
      }else{
        $(this).removeClass("click_bg");
      }
      $(this).parent().siblings().find(".thi_title").stop().slideUp(300);
      $(this).parent().find(".thi_title").stop().slideToggle(300,function(){
        $(this).find(".target_title");
        var $curHieght = $(this).parent().height();
        var $realH = cur.$ulHeight + $curHieght;
        var $windowH = $(window).height();
        var $hearderH = $(".showfixedtop").height();
        if($realH > ($windowH - $hearderH)){
          cur.$navPart.css({"height": $windowH-$hearderH,"overflow":"auto"})
        }else{
          cur.$navPart.css({"height": "auto"})
        }
      });

      if(!$thiT.length){
        $(this).addClass("click_bg");
      }
    });
      cur.$shadow.bind("click",function(){
        cur.initNavUp();
      });
    //touch
    var isSupportTouch = "ontouchend" in document ? true : false;
    if(isSupportTouch){
      var startX,startY,x,y;
       if(!cur.$shadow.length){
        return;
      }
      cur.$shadow[0].addEventListener("touchstart",function(event){
       var touch = event.touches[0];
       startX = touch.pageX;
       startY = touch.pageY;
     });
      cur.$shadow[0].addEventListener("touchmove",function(event){
        var touch = event.touches[0];
        x = touch.pageX - startX;
        y = touch.pageY - startY;
        if(Math.abs(x)>20){
          cur.initNavUp();
        }
      });
    }
  }
  p.initNavUp = function(){
    var cur = this;
    cur.$shadow.fadeOut(500);
    cur.$navPart.stop().animate({"right":"-1.5rem"},500,function(){
      $(this).css({"display":"none"});
    });
    cur.$navPart.data("click",true);
    cur.$secTitle.removeClass("click_bg");
    cur.$thiTitle.slideUp();
    cur.$navPart.css({"height": "auto"});
  };
  //地址切换
  p.initWebSit = function(){
    $(".websitename").change(function(){
      var webAddress = $(this).find("option:selected").val();
      if(webAddress==""){
        return;
      }
      window.location.href = webAddress;
    });
  };
  //微信窗口
  p.initWixinWin = function(){
    $(".footer .weixin_share").bind("click",function(){
      $(".mark_container").fadeIn();
    });
    $(".mark_close").on("click",function(){
      $(this).parent().parent().fadeOut();
      $("html,body").css({"overflow":"visible","height":"auto"});
    });

    $(".footer .app_icon").bind("click",function(){
        $(".mark_app").fadeIn();
      });
      $(".mark_close").on("click",function(){
        $(this).parent().parent().fadeOut();
      });
      
      $("p.weixin_name").click(function(){
      	var p_index = $("p.weixin_name").index(this);
      	$(this).addClass("weixin_color").siblings("p.weixin_name").removeClass("weixin_color");
      	$("img.weixin_ewm").eq(p_index).show().siblings("img.weixin_ewm").hide();
      });
  };

  foton.Common = Common;
})();



//登录状态处理
(function(){
  var LoginInStatus = function(){
    this.init();
  };
  var p = LoginInStatus.prototype;
  p.init = function(){
    this.judgeLoad();
  };
  //判断登录状态
  p.judgeLoad = function() {
    var cur = this;
    $.ajax({
      url: $mcBaseUrl + "login/getstatus",
      type:"get",
      dataType:"json",
      success:function(data){
        if(data.status == "0"){
          if($(".nav_part .memberNum").length=="0"){
            //生成结构
            cur.initDomUser(data);
          }
        }else{
          if($(".showfixedtop .memberNum").length!="0"){
            cur.initAllDom();
            // window.location.href =$url+"bottom/login"
          }
        }
      }
    });
  };
  p.initDomUser = function(data){
    //清除原来的
    var $sLI = $(".sec_loginIn");
    var $slU = $(".sec_loginUp");
    $sLI.addClass("isLoIn").children().remove();
    $slU.addClass("isLoUp").children().remove();
    $slU.append($('<a class="memberNum"><i></i>'+data.data+'</a>'));
    $sLI.append($('<a class="loginOut" href="javascript:memberLogout()">退出登录</a>'));
    $(".nav_part .memberNum").bind("click",function(e) {
      window.location.href = $mcBaseUrl + "memberreview/mobile/memberMain"
    });
  }
  p.initAllDom = function(){
    var $sLI = $(".sec_loginIn");
    var $slU = $(".sec_loginUp");
    $sLI.removeClass("isLoIn").children().remove();
    $slU.removeClass("isLoUp").children().remove();
    $slU.append($('<a href='+$mcBaseUrl+'"memberreview/mobile/signUp">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</a>'));
    $sLI.append($('<a href='+$mcBaseUrl+'"memberreview/mobile/login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</a>'));
  }
  foton.LoginInStatus = LoginInStatus;
})();

//退出登录的方法
function memberLogout(){
  var $sLI = $(".sec_loginIn");
  var $slU = $(".sec_loginUp");
  $sLI.removeClass("isLoIn").children().remove();
  $slU.removeClass("isLoUp").children().remove();
  $slU.append($('<a href='+$mcBaseUrl+'"memberreview/mobile/signUp">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</a>'));
  $sLI.append($('<a href='+$mcBaseUrl+'"memberreview/mobile/login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</a>'));
   $.ajax({
     url : $mcBaseUrl+"MemberCenter/logout",
     type : "get",
     success : function(data) {
     window.location.href = $mcBaseUrl+"bottom/login";
     }
   });
}



(function(){
  var header = function(){
    p.init();
  }
  var p = header.prototype;
  p.init = function(){
    var header = $('<div class="showfixedtop">'
 +'       <div class="foton_logo">'
 +'       <a href="index.html"><img src="images/index/foton_logo.png" alt="">'
 +'       </a>'
 +'       </div>'
 +'       <div class="login_up">'
 +'       <i></i>'
 +'       <a href="${basePath}support/mobile/testDrive">预约试驾</a>'
 +'		  <span class="tab_line"></span>'
 +'       </div>'
 +'       <div class="button_nav">'
 +'       <span class="btn_span">菜单</span>'
 +'       <div class="nav_part">'
 +'       <ul>'
 +'       <li>'
 +'       <span class="sec_title sec_loginUp"><a href="#">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</a></span>'
 +'   </li>'
 +'   <li>'
 +'   <span class="sec_title sec_loginIn"><a href="#">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</a></span>'
 +'   </li>'
 +'   <li>'
 +'   <span class="sec_title sec_index"><a href="index.html"><i class="index_icon icon"></i>首页</a></span>'
 +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="all_icon icon"></i>车型介绍</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">车系</a>'
 +'       </div>'
 +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="sale_icon icon"></i>品牌活动</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">优惠信息</a>'
 +'       </div>'
 +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="buy_icon icon"></i>购买支持</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">经销商查询</a>'
 +'       <a class="target_title" href="#">预约试驾</a>'
 +'       <a class="target_title" href="#">精品配饰</a>'
 +'       <a class="target_title" href="#">在线订购</a>'
 +'       </div>'
 +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="curstm_icon icon"></i>客户支持</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">服务商查询</a>'
 +'       <a class="target_title" href="#">会员中心</a>'
 +'       <a class="target_title" href="#">在线客服</a>'
 +'       <a class="target_title" href="#">维修与保养</a>'
 +'       <a class="target_title" href="#">服务政策</a>'
 +'       </div>'
 +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="vipcenter_icon icon"></i>会员中心</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">服务商查询</a>'
 +'       <a class="target_title" href="#">会员中心</a>'
 +'       <a class="target_title" href="#">在线客服</a>'
 +'       <a class="target_title" href="#">维修与保养</a>'
 +'       <a class="target_title" href="#">服务政策</a>'
 +'       </div>'
 +'       </li>'
 // +'       <li>'
 // +'       <span class="sec_title"><i class="news_icon icon"></i>新闻中心</span>'
 // +'       <div class="thi_title">'
 // +'       <a class="target_title" href="#">奥铃资讯</a>'
 // +'       </div>'
 // +'       </li>'
 +'       <li>'
 +'       <span class="sec_title"><i class="abbrand_icon icon"></i>关于品牌</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">品牌介绍</a>'
 +'       <a class="target_title" href="#">品牌荣誉</a>'
 +'       <a class="target_title" href="#">品牌历程</a>'
 +'       <a class="target_title" href="#">技术研发</a>'
 +'       <a class="target_title" href="#">招商加盟</a>'
 +'       <a class="target_title" href="#">联系我们</a>'
 +'       </div>'
 +'       </li>'
 +'       <li class="last_li">'
 +'       <span class="sec_title"><i class="comin_icon icon"></i>走进福田</span>'
 +'       <div class="thi_title">'
 +'       <a class="target_title" href="#">品牌介绍</a>'
 +'       <a class="target_title" href="#">品牌荣誉</a>'
 +'       <a class="target_title" href="#">品牌历程</a>'
 +'       <a class="target_title" href="#">技术研发</a>'
 +'       <a class="target_title" href="#">招商加盟</a>'
 +'       <a class="target_title" href="#">联系我们</a>'
 +'       </div>'
 +'       </li>'
 +'       </ul>'
 +'       </div>'
 +'       <div class="bg_shadow_nav">'
 +'       </div>'
 +'       </div>'
 +'       </div>');


    var footer  = $('<div class="content_part">'
 +'       <p class="vip_phone">'
 +'       <span>24小时贵宾热线：</span><a href="tel:4008199199">'
 +'       <i></i>4008-199-199</a>'
 +'       </p>'
 +'       <p class="foton_share">'
 +'       <span>福田官方公众平台：</span>'
 +'   <a class="weibo_share" href="http://m.weibo.cn/u/2731341697"></a>'
 +'       <span class="weixin_share"></span>'
 +'       <a class="taobao_web" href="https://foton.m.tmall.com/?"></a>'
 +'       <a class="app_icon"></a>'
 +'       </p>'
 +'       <div class="foton_web clearfix">'
 +'       <span>福田汽车旗下品牌：</span>'
 +'   <span class="websitesanjiao"></span>'
 +'       <div class="otherWeb">'
 +'       <div class="websitechoose">'
 +'       <span class="websitesanjiao"></span>'
 +'       <select class="websitename">'
 +'       <option selected value ="">商务汽车官方网站</option>'
 +'       <option value="http://www.aumantruck.com/">欧曼官方网站</option>'
 +'       <option value="http://auv.foton.com.cn/">欧辉客车官方网站</option>'
 +'       <option value="http://aumark.foton.com.cn//">欧马可官方网站</option>'
 +'       <option value="http://ollin.foton.com.cn/">奥铃官方网站</option>'
 +'       <option value="http://van.foton.com.cn">商务汽车官方网站</option>'
 +'       <option value="http://gratourauto.com/">北京福田伽途官方网站</option>'
 +'       <option value="http://tunland.foton.com.cn/">拓陆者/萨瓦纳官方网站</option>'
 +'       <option value="http://forland.foton.com.cn/">时代汽车官方网站</option>'
 +'       <option value="http://rowor.foton.com.cn">瑞沃品牌官方网站</option>'
 +'       <option value="http://fotonloxa.com/">雷萨重机官方网站</option>'
 +'       <option value="http://bfcec.com.cn/">福田康明斯官方网站</option>'
 +'       <option value="http://pbms.foton.com.cn">供应商门户网站</option>'
 +'       </select>'
 +'       </div>'
 +'       </div>'
 +'       </div>'
 +'       <div class="copyAndOtherWeb clearfix">'
 +'       <div class="foton_copy">'
 +'       <p>© 北汽福田汽车股份有限公司版权所有</p>'
 +'   <p class="ipc_num">京ICP备12004550号  京公网安备 110401000095号</p>'
 +'   </div>'
 +'   </div>'
 +'   </div>'
 +'   <div class="mark_container">'
 +'       <div class="markBg"></div>'
 +'       <div class="mark_content">'
 +'       <div class="mark_close"></div>'
 +'       <p class="p_top">扫描下方的二维码 <br>'
 +'       即可关注福田汽车集团官方微信号</p>'
 +'       <div class="mark_box clearfix">'
 +'       <div class="mark_left">'
 +'       <img src="images/index/foton_weixin.jpg">'
 +'       <p>官方微信</p>'
 +'       </div>'
 +'       </div>'
 +'       <p class="bot">点击二维码，保存图片后用微信扫一扫即可关注</p>'
 +'   </div>'
 +'   </div>'
 +'   <div class="mark_app">'
 +'       <div class="markBg"></div>'
 +'       <div class="mark_content">'
 +'       <div class="mark_close"></div>'
 +'       <p class="p_top">扫描下方的二维码 <br>'
 +'       </p>'
 +'       <div class="mark_box clearfix">'
 +'       <div class="mark_left">'
 +'       <img src="images/index/app.png">'
 +'       <p>APP</p>'
 +'       </div>'
 +'       </div>'
 +'       <p class="bot">识别二维码，即可下载福田时代之家APP</p>'
 +'   </div>'
 +'   </div>');
    $(".hearder").html(header);
    $(".footer").html(footer)
  }
  foton.header = header;
})();
