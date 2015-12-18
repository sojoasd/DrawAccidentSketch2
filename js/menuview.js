var PicViewObj = new PicViewModel();
var _tempMenuObj;

var MenuModel = function() {
    this.ChooseObject = function(callback) {
        $(document).delegate('.dropdown-menu > li > a', 'click', function(e) {
            event.preventDefault();

            var imgTypeName = e.currentTarget.title;

            if (_tempMenuObj !== this) {
                $('.dropdown-menu > li a').removeClass('add-bridge');
                _tempMenuObj = this;
                $(this).toggleClass('add-bridge');
                $('.menu-content').remove();

                $(this).after('<div class="menu-content"></div>');
                $('.menu-content').css({
                    'margin-top': -(e.pageY / 2)
                }); //這個目前 menu 項目太少，還看不出來有問題

                var $menuObj = $(this);
                PicViewObj.GetPic(imgTypeName, function(data) {
                    var Obj;
                    switch ($menuObj[0].id) {
                        case "Car":
                            Obj = data.Car;
                            break;

                        case "Person":
                            Obj = data.Person;
                            break;

                        case "Road":
                            Obj = data.Road;
                            break;

                        case "Sign":
                            Obj = data.Sign;
                            break;
                    }

                    var HtmlTabTitleString = "";
                    var HtmlTabContentString = "";
                    HtmlTabTitleString += '<ul class="nav nav-tabs" role="tablist">';
                    HtmlTabContentString += '<div class="tab-content">';

                    var keyCount = 0;
                    $.each(Obj, function(key) {
                        HtmlTabTitleString += '<li><a href="#' + key + '" aria-controls="' + key + '" role="tab" data-toggle="tab">' + key + '</a></li>';
                        HtmlTabContentString += '<div class="tab-pane" id="' + key + '"></div>';
                        keyCount += 1;
                    });

                    HtmlTabContentString += '</div>';
                    HtmlTabTitleString += '</ul>';

                    $('.menu-content').append(HtmlTabTitleString);
                    $('.menu-content').append(HtmlTabContentString);
                    $('.menu-content').find('ul > li').eq(0).toggleClass('active');
                    var activeID = "#" + $('.menu-content').find('ul > li').eq(0)[0].textContent;
                    $(activeID).addClass('active');

                    $('.menu-content').find('.nav-tabs').css({
                        'width': screen.width * (3 / 4) + 'px'
                    });

                    $.each(Obj, function(key, objs) {
                        $.each(objs, function(index, value) {
                            $('#' + key).append('<div class="imgstyle"><img id="' + index + '" src="' + value + '" alt=""></div>');
                        });
                    });

                    $('.imgstyle img').click(function(e) {
                        var obj = {
                            TypeName: $(this).closest('.menu-content').prev()[0].title,
                            ImgPath: $(this)[0].attributes.src.value,
                            lefts: e.pageX,
                            tops: e.pageY,
                        };
                        callback(obj);
                        _tempMenuObj = null;
                        $('.menu-content').remove();
                        $menuObj.removeClass('add-bridge');
                    });
                });
            } else {
                _tempMenuObj = null;
                $('.menu-content').remove();
                $(this).removeClass('add-bridge');
            }
        });
    };
};

$('.show-on-hover').hover(function() {
    $('.menu-content').remove();
    $('.dropdown-menu > li').find('a').removeClass('add-bridge');
});

$('.menu-content').on('mouseleave', function() {
    _tempMenuObj = null;
});

$('.menu-bridge').on('mouseleave', function() {
    _tempMenuObj = null;
    // $('.dropdown-menu > li').find('a').removeClass('add-bridge');
});
