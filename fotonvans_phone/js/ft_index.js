this.foton = this.foton || {};
(function() {
  var FoIndex = function() {
    this.init();
  }
  var p = FoIndex.prototype;
  p.init = function() {
    this.initSwiper();
    this.initEvent();
  }
  p.initSwiper = function() {
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      slidesPerView: 1,
      paginationClickable: true,
      loop: true,
      autoplay: 3000,
      autoplayDisableOnInteraction: false,
      speed: 500
    });
  }
  p.initEvent = function() {
    var $aLi = $('#carclass li');
    $aLi.click(function(){
      var $thisDiv = $(this).find('div');
      if ($thisDiv.css('display') == 'block') {
        $thisDiv.slideUp();
        $(this).removeClass('active');
      }else{
        $aLi.removeClass('active').find('div').slideUp()
        $(this).addClass('active');
        $thisDiv.slideDown();
      }
      
    })

  }
  foton.FoIndex = FoIndex;
})();