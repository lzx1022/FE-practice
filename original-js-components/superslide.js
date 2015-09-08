(function() {

//  1. helpers ----------------------------------------------------------------

    // 1.1. 主要为了兼容 IE8 的事件处理方法集
    var EventUtil = {
        addHandler: function(el, type, handler) {
            if (el.addEventListener) {
                el.addEventListener(type, handler, false);
            } else {
                el.attachEvent('on', type, handler);
            }
        },
        getEvent: function(event) {
            return event ? event : window.event;
        },
        getTarget: function(event) {
            return event.target || event.srcElement;
        }
    };
    // 1.2. 获取元素的索引
    function getIndex(el) {
        var parentEl = el.parentNode,
            childEls = parentEl.getElementsByTagName('li');
        for (var i = 0; i < childEls.length; i++) {
            if (childEls[i] === el) return i;
        }
    }

// 2. api ---------------------------------------------------------------------

    var api = {
        slide: function(slideClassName, autoslide) {
            var slideBox = document.querySelectorAll(slideClassName);
            for (var i = 0; i < slideBox.length; i++) {
                (function(slideBoxIndex) {
                    // 2.1. 初始化一些变量

                    var currentIndex = 0,
                        slideBoxUlEl = slideBox[slideBoxIndex].getElementsByTagName('ul')[0],
                        slideBoxUlLiEls = slideBoxUlEl.getElementsByTagName('li'),
                        count = slideBoxUlLiEls.length,
                        slideBoxOlEl = document.createElement('ol'),
                        slideBoxOlLiEls = slideBoxOlEl.getElementsByTagName('li');

                    // 2.2. 生成 <ol> 按钮组，prev next 按钮
                    (function() {
                        for (var i = 1; i < count + 1; i++) {
                            var liEl = document.createElement('li');
                            slideBoxOlEl.appendChild(liEl);
                        }
                        slideBox[slideBoxIndex].appendChild(slideBoxOlEl);

                        var nextBtn = document.createElement('a'),
                            prevBtn = document.createElement('a');
                        nextBtn.className = 'next';
                        prevBtn.className = 'prev';
                        slideBox[slideBoxIndex].appendChild(nextBtn);
                        slideBox[slideBoxIndex].appendChild(prevBtn);
                    })();

                    // 2.3. 设定轮播效果，同时处理按钮选中状态
                    var changeState = function(state) {
                        function getState(className, zIndex, opacity) {
                            slideBoxOlLiEls[currentIndex].className = className;
                            slideBoxUlLiEls[currentIndex].style.zIndex = zIndex;
                            slideBoxUlLiEls[currentIndex].getElementsByTagName('img')[0].style.opacity = opacity;
                        }
                        if (state === 'disappear') {
                            getState('', '0', '0');
                        }
                        else {
                            getState('activeli', '1', '1');
                        }
                    };
                    // 先给初始的 ol > li 加上 .activeli 否则刚刷新的时候是没有选中项的
                    changeState('occur');

                    // 判断是否是自动播放
                    if (autoslide === true) {
                        var setIntervalId = setInterval(function(){
                            changeState('disappear');
                            currentIndex = currentIndex < count - 1 ? currentIndex + 1 : 0;
                            changeState('occur');
                        }, 12000)
                    } else {
                        // 绑定事件
                        var slidePic = function(e) {
                            e = EventUtil.getEvent(e);
                            target = (EventUtil.getTarget(e));
                            if (target.tagName === 'LI') {
                                changeState('disappear');
                                currentIndex = getIndex(EventUtil.getTarget(event));
                                changeState('occur');
                            } else if (target.className === 'next') {
                                changeState('disappear');
                                currentIndex = currentIndex < count - 1 ? currentIndex + 1 : 0;
                                changeState('occur');
                            } else {
                                changeState('disappear');
                                currentIndex = currentIndex === 0 ? count - 1 : currentIndex - 1;
                                changeState('occur');
                            }
                        };
                        EventUtil.addHandler(slideBox[slideBoxIndex], 'click', slidePic);
                    }
                })(i);
            }
        }
    }

    // umd expose
    if (typeof exports === 'object') {
        module.exports = api;
    } else if (typeof define === 'function' && define.amd) {
        define(function(){ return api; });
    } else {
        this.slideBox = api;
    }
})();

