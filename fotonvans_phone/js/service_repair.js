/**
 * Created by user on 2016/9/18.
 */
this.foton = this.foton || {};
(function(){
    var RepaireAndMaintain = function(){
        this.init();
    }
    var p = RepaireAndMaintain.prototype;
    p.init = function(){
        this.baseUrl = "/webback/";
        this.initDom();
        //获取品牌
//      this.getBrand();
        this.getProvince();
        this.initEvent();
        this.initRadio();
        //生成年月日
        this.getDay();
        //验证
        this.initVerification();
        //提交
        this.initSubmit();
    }
    p.initDom = function(){

    }
    //生成年月日
    p.getDay = function(){
        var cur = this;
        var today = new Date();
        var i = 1;
        var $op = $(".yearMonthDay select");
        $op.empty();
        $op.append($('<option>年/月/日</option>'))
        for(i=1; i<8; i++){
            var change = today.getTime() + 1000*60*60*24;
            today.setTime(change); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth()+1;
            var tDate = today.getDate();
            var order = tYear+"-"+tMonth+"-"+tDate;
            var $option = $('<option>'+order+'</option>');
            $op.append($option);
        };

    };
    //单选
    p.initDom = function(){
        this.$radio = $(".choice_time label");
        this.$radioTest = $(".test_time label");
    }
    p.initRadio = function(){
        this.handleRadio(this.$radio);
        this.$radio.eq(0).trigger("click");
        this.handleRadio(this.$radioTest);
    }
    p.handleRadio =function(dom){
        var cur = this;
        dom.bind("click",function(){
            var isOrno = $(this).children("input:checked");
            if(isOrno){
                $(this).children("input").prop("disabled",false);
                dom.removeClass("click_bg");
                $(this).addClass("click_bg");
            }else{
                $(this).children("input").prop("disabled",true);
                $(this).removeClass("click_bg");
            };
        });
    };
    //回填方法
    p.initDataBack = function(){
        //测试回填方法
        setTimeout(function(){
            $(".provice select option").each(function(i,val){
                if($(".provice select option").eq(i).text()=="北京市"){
                    $(".provice select option").eq(i).prop("selected",true);
                    $(this).parent().trigger("change");
                }
            });
            $(".city select option").each(function(i,val){
                if($(".city select option").eq(i).text()=="北京市"){
                    $(".city select option").eq(i).prop("selected",true);
                    $(this).parent().trigger("change");
                }
            });
            console.log($(".provice select").find("option").text());
        },2000);
        setTimeout(function(){
            $(".country select option").each(function(i,val){
                if($(".country select option").eq(i).text()=="朝阳区"){
                    $(".country select option").eq(i).prop("selected",true);
                    $(this).parent().trigger("change");
                }
            });
        },2600);
    }
    //事件
    p.initEvent = function(){
        //change事件
        $("select").change(function(){
            var $optSelected = $(this).find("option:selected").text()
            if($(this).find("option:selected").data("callback")){
                $(this).find("option:selected").trigger("callback");
            }
            //清空数据
            if($optSelected=="省"){
                $(".city select").empty();
                $(".city select").append($('<option>市</option>').val("-1").data({"callback":true}));
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({"callback":true}));
                $(".distributor select").empty();
                $(".distributor select").append($('<option>请选择经销商</option>').val("-1").data({"callback":true}));
            }else if($optSelected=="市"){
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({"callback":true}));
                $(".distributor select").empty();
                $(".distributor select").append($('<option>请选择经销商</option>').val("-1").data({"callback":true}));
            }else if($optSelected=="区/县"){
                $(".distributor select").empty();
                $(".distributor select").append($('<option>请选择经销商</option>').val("-1").data({"callback":true}));
            }else if($optSelected=="请选择品牌"){
                $(".car_type select").empty();
                $(".car_type select").append($('<option>请选择车型</option>').val("-1").data({"callback":true}));
            }

            if($(this).parents(".provice").length){
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({"callback":true}));
                $(".distributor select").empty();
                $(".distributor select").append($('<option>请选择经销商</option>').val("-1").data({"callback":true}));
            }
        });
    }
    //获取品牌信息
    p.getBrand = function(){
        var cur = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: cur.baseUrl + "dmp/getBrandSeries",
            //url: "testJson/pinpai.json",
            success: function(json){
                cur.initBrand(json);
            }
        })
    };
    /* 创建品牌/车系 */
    p.initBrand = function(data){
        var cur = this;
        $(".car_brand select").empty();
        $(".car_brand select").append($('<option>请选择品牌</option>').val("-1").data({"callback":true}));
        $.each(data,function(i,val){
            var $option = $('<option>'+val.brandName+'</option>').val(val.brandId).data({"callback":true});
            $(".car_brand select").append($option);
        });
    };
    //省市县
    p.getProvince = function(){
        var cur = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: cur.baseUrl + "dmp/getProvinceCity",
            //url: "testJson/city.json",
            success: function(json){
                cur.initprovince(json);
            }
        })
    };
    p.initprovince = function(data){
        var cur = this;
        $(".provice select").empty();
        $(".provice select").append($('<option>省</option>').val("-1").data({"callback":true}));
        $.each(data,function(i,val){
            var id = i.split(",")[0].split("=")[1];
            var name = i.split("=")[2];
            $option = $('<option class="item">'+name+'</option>').val(id).data({"callback": true});
            $option.bind("callback",function(){
                cur.initCity(val);
            })
            $(".provice select").append($option);
        })
    };

    p.initCity = function(data){
        var cur = this;
        $(".city select").empty();
        $(".city select").append($('<option>市</option>').val("-1").data({"callback":true}));
        $.each(data,function(i,val){
            var $option = $('<option>'+val.cityName+'</option>').val(val.id).data({"callback": true});
            $option.bind("callback",function(){
                cur.getCounty(val.id,val.provinceId);
            })
            $(".city select").append($option);
        })
    };

    p.getCounty = function(cityId, provinceId){
        var cur = this;
        $.ajax({
            type: "get",
            dataType: "json",
            data: {
                cityId: cityId,
                provinceId: provinceId
            },
            url: cur.baseUrl + "dmp/getArea",
            //url: "testJson/county.json",
            success: function(json){
                cur.initCounty(json);
            }
        })
    };

    p.initCounty = function(data){
        var cur = this;
        $(".country select").empty();
        $(".country select").append($('<option>区/县</option>').val("-1").data({"callback":true}));
        $.each(data,function(i,val){
            var $option = $('<option>'+val.areaName+'</option>').val(val.id).data({"callback": true});
            $(".country select").append($option);
        })
    };
    //验证
    p.initVerification = function(){
        var cur = this;
        $("#getForm select").change(function(){
            if($(this).parents(".car_brand").length){
                cur.initSelectJe($(".car_brand"),"请选择品牌")
            }
            if($(this).parents(".car_type").length){
                cur.initSelectJe($(".car_type"),"请选择车型");
            }
            if($(this).parents(".provice").length){
                cur.initSelectJe($(".provice"),"请选择省份");
            }
            if($(this).parents(".city").length){
                cur.initSelectJe($(".city"),"请选择城市");
            }
            if($(this).parents(".yearMonthDay").length){
                cur.initSelectJe($(".yearMonthDay"),"请选择日期");
            }
            if($(this).parents(".detailTime").length){
                cur.initSelectJe($(".detailTime"),"请选择日期");
            }

        });

        $(".name input, .your_need textarea").bind("blur",function(e){
            if(!$.trim($(this).val())==""){
                $(this).parent().find("p.warnning").remove();
            }
        });
        //车牌号
        $(".vin_numner input,.license_number input").bind("blur",function(e){
            if($.trim($(".vin_numner input").val())!="" || $.trim($(".license_number input").val())!=""){
                $("p.warnning").remove();
            }
        });
        //手机验证
        $(".phone input, .landline input").bind("blur",function(){
        var $phoneText = /^(0|86|17951)?(1[3-8])[0-9]{9}$/.test($(".phone input").val());
        var $landline = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test($("input.part_one").val()+"-"+$("input.part_t").val());
        	if($phoneText && $landline){
        	    $("#hide_tel").val($(".vin_numner input").val());
        	    $("p.warnning").remove();
        	}else if($phoneText){
        	    $("#hide_tel").val($(".phone input").val());
        	    $("p.warnning").remove();
        	}else if($landline){
        	    $("#hide_tel").val($(".landline .part_one").val()+"-"+$(".landline .part_t").val());
        	    $("p.warnning").remove();
        	}else if(!$phoneText){
        		 cur.initWarn($(".phone"),"手机号格式错误");
        		 return;
        	}else if(!$landline){
        		 cur.initWarn($(".landline"),"固定电话号码格式错误");
        		 return;
        	}else{
        		return;
        	}
        });
    }
    //提交
    p.initSubmit = function(){
        var cur = this;
        $(".button_up a.sign_up").on("click",function(e){
            var data = $("#getFrom").serialize();
            var $phoneText = /^(0|86|17951)?(1[3-8])[0-9]{9}$/.test($(".phone input").val());
            var $landline = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test($("input.part_one").val()+"-"+$("input.part_t").val());
            e.stopPropagation();
            //品牌
//          if(cur.initSelectJe($(".car_brand"),"请选择品牌","请选择品牌")){
//              return;
//          }
             //车牌和vin码 license_number
//           if($.trim($(".vin_numner input").val())=="" && $.trim($(".license_number input").val())==""){
//               cur.initWarn($(".vin_numner"),"请输入VIN号与车牌号其中一项");
//               cur.initWarn($(".license_number"),"请输入VIN号与车牌号其中一项");
//               return;
//           }else if(!$.trim($(".vin_numner input").val())==""){
//               $("#hide_carNum").val($(".vin_numner input").val());
//               $("p.warnning").remove();
//           }else if(!$.trim($(".vin_numner input").val())==""){
//               $("#hide_carNum").val($(".license_number input").val());
//               $("p.warnning").remove();
//           }
            //省
            if(cur.initSelectJe($(".provice"),"省","请选择省份")){
                return;
            };
            //市
            if(cur.initSelectJe($(".city"),"市","请选择市")){
                return;
            };
            //姓名
            if($.trim($(".name input").val())==""){
               cur.initWarn($(".name"),"请输入姓名");
               return;
            }else{
               cur.initWarn($(".name"),"请输入姓名","dele");
            }
            //手机
            if($.trim($(".phone input").val())=="" && $.trim($(".landline input").val())==""){
                cur.initWarn($(".phone"),"请输入手机号码与固定电话其中一项");
                cur.initWarn($(".landline"),"请输入手机号码与固定电话其中一项");
                return;
            }else if($phoneText && $landline){
                $("#hide_tel").val($(".vin_numner input").val());
                $("p.warnning").remove();
            }else if($phoneText){
                $("#hide_tel").val($(".phone input").val());
                $("p.warnning").remove();
            }else if($landline){
                $("#hide_tel").val($(".landline .part_one").val()+"-"+$(".landline .part_t").val());
                $("p.warnning").remove();
            }else if(!$phoneText){
            	 cur.initWarn($(".phone"),"手机号格式错误");
            	 return;
            }else if(!$landline){
            	 cur.initWarn($(".landline"),"固定电话号码格式错误");
            	 return;
            }else{
            	return;
            }
            //需求
//          if($.trim($(".your_need textarea").val())==""){
//             cur.initWarn($(".your_need"),"请输入需求");
//             return;
//          }else{
//             cur.initWarn($(".your_need"),"请输入需求","dele");
//          }

            //时间
            if(cur.initSelectJe($(".yearMonthDay"),"年/月/日","请选择日期")){
                return;
            };
            if(cur.initSelectJe($(".detailTime"),"时间","请选择日期")){
                return;
            };
            $("#hide_time").val($(".yearMonthDay select option:selected").text()+" "+$(".detailTime select option:selected").text());
            $.ajax({
                url: cur.baseUrl + "clue/reapirMaintain",
                type: "post",
                data: $("#getForm").serialize(),
                beforeSend:function(){
                    $(".button_up a").append($("<div class='up_load'></div>"));
                    $(".button_up a").addClass("click_status");
                },
                success: function(data){
                    cur.initLayerMsg("提交成功");
                    if(data){
                        // $.ajax({
                        //     url:cur.baseUrl + "MemberCenter/deal",
                        //     type:"get",
                        //     data:{"brand":1,"action":3},
                        //     dataType:"json",
                        //     success:function(data){
                        //
                        //     }
                        // });
                        window.location.reload();
                    }
                },
                error:function(){
                    $(".button_up .up_load").remove();
                    $(".button_up a").removeClass("click_status");
                    cur.initLayerMsg("提交失败");
                }
            });
        });
    }
    p.initLayerMsg = function(text){
        var $layerMsg =  $('<div class="layui-layer-msg">'
            +'  <div id="" class="layui-layer-content">'+text+'</div>'
            +'  <span class="layui-layer-setwin"></span>'
            +'</div>');
        $(".main_part").append($layerMsg);
        setTimeout(function(){
            $(".layui-layer-msg").remove();
        },4000);
    }
    p.initSelectJe = function(dom,text,warnText){
        var cur = this,isTrue = false;
        if(dom.find("select option:selected").text()==text){
            cur.initWarn(dom,warnText);
            isTrue = true;
        }else{
            cur.initWarn(dom,warnText,"dele");
        }
        return isTrue;
    }
    p.initWarn = function(dom,warnText,deletes){
        if(deletes){
            dom.find("p.warnning").remove();
            return;
        }
        if(dom.find("p.warnning").length){
            dom.find("p.warnning").text(warnText);
            var topH = $("p.warnning").offset().top - 200;
            $(document).find("html,body").scrollTop(topH);
            return;
        }
        var $warn = $('<p class="warnning">'+warnText+'</p>');
        dom.append($warn);
        var toph = $("p.warnning").offset().top - 200;
        $(document).find("html,body").scrollTop(toph);
    }
    foton.RepaireAndMaintain  = RepaireAndMaintain;
})();