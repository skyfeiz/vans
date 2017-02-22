/**
 * Created by user on 2016/10/25.
 */
this.foton = this.foton || {};
(function() {
    var DealerAndService = function() {
        this.init();
    };
    var p = DealerAndService.prototype;
    p.init = function() {
        this.type1 = $('<option>请选择经销商</option>').val("-1").data({
            "callback": true
        });
        this.type2 = $('<option>请选择服务商</option>').val("-1").data({
            "callback": true
        });
        this.baseUrl = "/webback/";
        this.getBrand();
        this.getProvince();
        this.initEvent();
        this.initMapPosition();
        //提交
    };
    p.initEvent = function() {
        var cur = this;
        $(".distributor select").bind("change", function() {
            var selectOption = $(this).find("option:selected");
            var obj = {
                locations: selectOption.val(),
                adressName: selectOption.data("address"),
                countryName: selectOption.data("name"),
                provinceId: selectOption.data("provinceId"),
                cityId: selectOption.data("cityId"),
                areaId: selectOption.data("areaId"),
                id: selectOption.data("id"),
                phoneNum: selectOption.data("phone"),
                length: "search"
            };
            cur.initMap(obj);
            var dealerName = $('.distributor select option:selected').val(); //选中的值
            var proviceName = $(".provice select option:selected").val();
            var cityName = $(".city select option:selected").val();
            if (proviceName != "省份" && cityName != "城市") {
                //cur.initMap({"provice":proviceName,"cityName":cityName,"dealerName":dealerName})
            };
        });

        //change事件
        $("select").change(function() {
            var $optSelected = $(this).find("option:selected").text();
            if ($(this).find("option:selected").data("callback")) {
                $(this).find("option:selected").trigger("callback");
            }
            //清空数据
            if ($optSelected == "省") {
                $(".city select").empty();
                $(".city select").append($('<option>城市</option>').val("-1").data({
                    "callback": true
                }));
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({
                    "callback": true
                }));
                $(".distributor select").empty();
                $("input.business_type").val() == "1" ? $(".distributor select").append(cur.type1) : $(".distributor select").append(cur.type2);
            } else if ($optSelected == "城市") {
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({
                    "callback": true
                }));
                $(".distributor select").empty();
                $("input.business_type").val() == "1" ? $(".distributor select").append(cur.type1) : $(".distributor select").append(cur.type2);
            } else if ($optSelected == "区/县") {
                $(".distributor select").empty();
                $("input.business_type").val() == "1" ? $(".distributor select").append(cur.type1) : $(".distributor select").append(cur.type2);
                cur.getDealer();
            }

            if ($(this).parents(".provice").length) {
                $(".country select").empty();
                $(".country select").append($('<option>区/县</option>').val("-1").data({
                    "callback": true
                }));
                $(".distributor select").empty();
                $("input.business_type").val() == "1" ? $(".distributor select").append(cur.type1) : $(".distributor select").append(cur.type2);
            }
        });
    };

    //百度地图api
    p.initMapPosition = function() {
        //浏览器定位
        var cur = this;
        var map = new BMap.Map("maps"); // 创建Map实例
        var point = new BMap.Point(116.3640600000, 39.9961000000);
        map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
        map.enableScrollWheelZoom(true);
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                var latVal = r.point.lat;
                var lngVal = r.point.lng;
                map.addOverlay(mk);
                map.panTo(r.point);
                $.ajax({
                    url: "/webback/dmp/mobileNearestDealer",
                    data: {
                        "lon": lngVal,
                        "lat": latVal,
                        "type": $("input.business_type").val()
                    },
                    type: "get",
                    success: function(json) {
                        cur.initMap(json);
                    },
                    error: function() {
                        cur.initMap({
                            length: 'search',
                            locations: '116_39',
                            countryName: '广州市曼隆汽车销售服务有限公司',
                            adressName: '广州市曼隆汽车销售服务有限公司',
                            phoneNum: '020-36028493',
                        })
                    }
                });
            }
        }, {
            enableHighAccuracy: true
        });
    };
    p.initMap = function(obj) {
        var cur = this;
        var map = new BMap.Map("maps");
        map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
        map.enableScrollWheelZoom(true);
        map.clearOverlays();
        if (obj.length == "search") {
            // 用经纬度设置地图中心点
            var latVal = obj.locations.split("_")[0];
            var lngVal = obj.locations.split("_")[1];
            var myIcon = new BMap.Icon("images/purchase/foton_logo.jpg", new BMap.Size(30, 30));
            var new_point = new BMap.Point(latVal, lngVal);
            var marker = new BMap.Marker(new_point, {
                icon: myIcon
            }); // 创建标注
            map.addOverlay(marker); // 将标注添加到地图中
            map.panTo(new_point);

            var opts1 = {
                width: 260,
                height: 120,
                title: '<span style="font-size:14px;">' + obj.countryName + '</span>'
            };
            var testDriver = "/webback/support/mobile/testDrive?provinceId=" + obj.provinceId + "&cityId=" + obj.cityId + "&areaId=" + obj.areaId + "&dealerName=" + obj.countryName + "&latVal=" + latVal + "&lngVal=" + lngVal + "&id=" + obj.id;
            var testDriver_a;
            if ($("input.business_type").val() == "1") {
                testDriver_a = "<a href='" + testDriver + "'>预约试驾</a>";
            } else {
                testDriver_a = "";
            };
            var useHref = "http://api.map.baidu.com/marker?location=" + lngVal + "," + latVal + "&title=商家位置&content=" + obj.countryName + "&output=html";

            var infoWindow1 = new BMap.InfoWindow("<div style='line-height:1.75;padding-top:16px;font-size:14px;padding-left:28px;'><b>地址: </b>" + obj.adressName + "</br><b>电话: </b><a style='color:#00c9ff;' href='tel:" + obj.phoneNum + "'>" + obj.phoneNum + "</a></div>", opts1);

            marker.addEventListener("click", function() {
                this.openInfoWindow(infoWindow1);
                var $title = $('.BMap_bubble_title');
                var $parent = $title.parent();
                var $img = $parent.next();
                var $content = $('.BMap_bubble_content');
                var $BMap_pop = $('.BMap_pop');
                if ($('.m_btnbox')[0]) {
                    $('.m_btnbox').html()
                } else {
                    $BMap_pop.append('<div class="m_btnbox">' + testDriver_a + '<a href="' + useHref + '">路线查询</a></div>');
                }
                $parent.css({
                    top: 0,
                    left: '1px',
                    width: '290px'
                })
                $title.css({
                    background: '#0066b3',
                    paddingLeft: '30px',
                    color: '#fff',
                    height: '30px',
                    fontSize: '16px',
                    lineHeight: '30px',
                })
                $img.attr('src', 'images/purchase/close.png').css({
                    top: 10,
                    left: 270,
                    width: 12,
                    height: 12
                })
            });
            return;
        }
        if (Object.prototype.toString.call(obj) === '[object Array]' && obj.length) {
            for (var i = 0; i < obj.length; i++) {
                cur.initmapDetail(val, map);
            }
        }
        if (obj.id) {
            var val = obj;
            $(".company .dropItem").empty();
            var $comp = $('<p class="company_name">' + val.dealerName + '</p>' + ' <p class="company_address">地址：' + val.dealerAddress + '</p>' + '<p>电话：<a tel="' + val.dealerTel + '" class="tel_num">' + val.dealerTel + '</a></p>');
            $(".company .dropItem").append($comp);
            cur.initmapDetail(val, map);
        }
    }
    p.initmapDetail = function(val, map) {
        // 用经纬度设置地图中心点
        var latVal = val.longitudeLatitude.split("_")[0] || 116.417854;
        var lngVal = val.longitudeLatitude.split("_")[1] || 39.921988;
        var myIcon = new BMap.Icon("../../static/mStatic/images/support/foton_logo.jpg", new BMap.Size(30, 30));
        var new_point = new BMap.Point(latVal, lngVal);
        var marker = new BMap.Marker(new_point, {
            icon: myIcon
        }); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        map.panTo(new_point);

        var opts1 = {
            width: 260,
            title: '<span style="font-size:14px;color:#0A8021">' + val.dealerName + '</span>'
        };
        //调用地址
        var useHref = "http://api.map.baidu.com/marker?location=" + lngVal + "," + latVal + "&title=商家位置&content=" + val.dealerName + "&output=html";
        var testDriver = "/webback/support/mobile/testDrive?provinceId=" + val.provinceId + "&cityId=" + val.cityId + "&areaId=" + val.areaId + "&dealerName=" + val.dealerName + "&latVal=" + latVal + "&lngVal=" + lngVal + "&id=" + val.id;
        var testDriver_a;
        if ($("input.business_type").val() == "1") {
            testDriver_a = "<a class='test_drimap' style='color:#0066b3;font-size:0.16rem;float:right;' href='" + testDriver + "'>预约试驾</a>";
        } else {
            testDriver_a = "";
        };
        var infoWindow1 = new BMap.InfoWindow("<div style='line-height:1.5;font-size:12px;'><b>地址: </b>" + val.dealerAddress + "</br><b>电话: </b><a style='color:#00c9ff;' href='tel:" + val.dealerTel + "'>" + val.dealerTel + "</a></br><a href='" + useHref + "' style='color:#0066b3; font-size: 0.16rem;' >路线查询</a>" + testDriver_a + "</div>", opts1);
        marker.addEventListener("click", function() {
            this.openInfoWindow(infoWindow1);

        });
    }


    //获取品牌信息
    p.getBrand = function() {
        var cur = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: cur.baseUrl + "dmp/getBrandSeries",
            //url: "testJson/pinpai.json",
            success: function(json) {
                cur.initBrand(json);
            }
        });
    };
    /* 创建品牌/车系 */
    p.initBrand = function(data) {
        var cur = this;
        $(".car_brand select").empty();
        $(".car_brand select").append($('<option>请选择品牌</option>').val("-1").data({
            "callback": true
        }));
        $.each(data, function(i, val) {
            var $option = $('<option>' + val.brandName + '</option>').val(val.brandId).data({
                "callback": true
            });
            $(".car_brand select").append($option);
        });
    };
    //省市县
    p.getProvince = function() {
        var cur = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: cur.baseUrl + "dmp/getProvinceCity",
            //url: "testJson/city.json",
            success: function(json) {
                cur.initprovince(json);
            }
        });
    };
    p.initprovince = function(data) {
        var cur = this;
        $(".provice select").empty();
        $(".provice select").append($('<option>省</option>').val("-1").data({
            "callback": true
        }));
        $.each(data, function(i, val) {
            var id = i.split(",")[0].split("=")[1];
            var name = i.split("=")[2];
            $option = $('<option class="item">' + name + '</option>').val(id).data({
                "callback": true
            });
            $option.bind("callback", function() {
                cur.initCity(val);
            });
            $(".provice select").append($option);
        });
    };

    p.initCity = function(data) {
        var cur = this;
        $(".city select").empty();
        $(".city select").append($('<option>城市</option>').val("-1").data({
            "callback": true
        }));
        $.each(data, function(i, val) {
            var $option = $('<option>' + val.cityName + '</option>').val(val.id).data({
                "callback": true
            });
            $option.bind("callback", function() {
                cur.getCounty(val.id, val.provinceId);
                cur.getDealer();
            });
            $(".city select").append($option);
        });
    };

    p.getCounty = function(cityId, provinceId) {
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
            success: function(json) {
                cur.initCounty(json);
            }
        });
    };

    p.initCounty = function(data) {
        var cur = this;
        $(".country select").empty();
        $(".country select").append($('<option>区/县</option>').val("-1").data({
            "callback": true
        }));
        $.each(data, function(i, val) {
            var $option = $('<option>' + val.areaName + '</option>').val(val.id).data({
                "callback": true
            });
            $option.bind("callback", function() {
                cur.getDealer();
            });
            $(".country select").append($option);
        });
    };

    p.getDealer = function() {
        var cur = this;
        var data = {
            type: $(".business_type").val(),
            brandId: $(".car_brand select option:selected").val(),
            provinceId: $(".provice select option:selected").val(),
            cityId: $(".city select option:selected").val(),
            areaId: $(".country select option:selected").val(),
        };
        $.ajax({
            type: "get",
            dataType: "json",
            data: data,
            url: cur.baseUrl + "dmp/getDealer",
            success: function(json) {
                cur.initDealer(json);
                var map = new BMap.Map("maps");
                map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
                map.enableScrollWheelZoom(true);
                map.clearOverlays();
                for (var i = 0; i < json.length; i++) {
                    cur.initmapDetail(json[i], map);
                }
            }
        });
    };
    p.initDealer = function(data) {
        var cur = this;
        $(".distributor select").empty();
        $(".distributor select").append($('<option>请选择经销商</option>').val("-1").data({
            "callback": true
        }));
        if (data.length == "0") {
            $(".distributor select").empty();
            var name_type = $("input.business_type").val() == "1" ? '此区域没有经销商' : '此区域没有服务商';
            $(".distributor select").append($('<option>' + name_type + '</option>').val("-1").data({
                "callback": true
            }));
            //return;
        }
        $.each(data, function(i, val) {
            var $option = $('<option title=' + val.dealerName + '>' + val.dealerName + '</option>').val(val.longitudeLatitude).data({
                "callback": true,
                "provinceId": val.provinceId,
                "cityId": val.cityId,
                "areaId": val.areaId,
                "address": val.dealerAddress,
                "name": val.dealerName,
                "phone": val.dealerTel,
                "id": val.id
            });
            $option.bind("callback", function() {
                //$(this).parents("div.dropItem").find("span").attr("title",val.dealerName);
            });
            $(".distributor select").append($option);
        });
    };



    foton.DealerAndService = DealerAndService;
})();
