/**
 * This project is AngularJS adaptation of kamlekar's slim-scroll
 * All credits goes to
 * https://github.com/kamlekar/slim-scroll
 */

angular.module('ngSlimScroll', [])
    .directive('slimScroll', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
        var init_attribute = "data-slim-scroll-init";
        var defaults = {
            minHeight: 25,
            wrapperClass: 'slim-scroll-wrapper',
            scrollbarContainerClass: 'slim-scroll-scrollbar-container',
            scrollbarClass: 'slim-scroll-scrollbar',
            specialClass: 'animate'
        };
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {options: '='},
            template: '<div><div class="slim-scroll-wrapper" data-ng-transclude></div></div>',
            link: function ($scope, element) {
                element.removeAttr(init_attribute);

                var options = angular.extend({}, defaults, $scope.options);
                //continue once DOM is ready
                $timeout(function () {
                    var wrapperDomElement = element.children()[0],
                        wrapperElement = angular.element(wrapperDomElement);
                    if (wrapperDomElement.offsetHeight < wrapperDomElement.scrollHeight) {
                        element.attr(init_attribute, '1');
                        wrapperElement.addClass(options.wrapperClass);

                        //create scrollbar container
                        var scrollbarContainerElement = angular.element($window.document.createElement('div'));
                        scrollbarContainerElement.addClass(options.scrollbarContainerClass);


                        //create scrollbar
                        var scrollbarElement = angular.element($window.document.createElement('div'));
                        scrollbarElement.addClass(options.scrollbarClass);

                        //insert to dom
                        element.append(scrollbarContainerElement);
                        scrollbarContainerElement.append(scrollbarElement);

                        //functions
                        var values = {},
                            getTop = function (el) {
                                var t = document.documentElement.scrollTop;
                                return el.getBoundingClientRect().top + (t ? t : document.body.scrollTop);
                            },
                            getReposition = function (h) {
                                var x = parseInt(scrollbarElement[0].style.top.replace("%", "")) * h / 100;
                                return x ? x : 0;
                            },
                            assignValues = function () {
                                values.height = scrollbarContainerElement[0].offsetHeight;
                                values.scrollHeight = wrapperDomElement.scrollHeight;

                                values.position = (values.height / values.scrollHeight) * 100;
                                values.scrollbarHeight = values.scrollHeight * values.height / 100;

                                values.scrollPosition = options.fixedHeight
                                    ? (options.fixedHeight / values.height * 100)
                                    : (values.scrollbarHeight < options.minHeight
                                    ? options.minHeight / values.height * 100
                                    : values.position);

                                values.remainder = 100 - values.scrollPosition;
                                values.x = (values.scrollHeight - values.height) * ((values.scrollPosition - values.position) / (100 - values.position));
                                values.heightRate = Math.abs((values.x / values.remainder) + (values.scrollHeight / 100));
                                scrollbarElement[0].style.height = values.scrollPosition + '%';

                                values.reposition = getReposition(values.height);
                            },
                            setScroll = function (e) {
                                e = e || event;
                                var el = e.target || event.srcElement,
                                    p = el.parentElement || el.parentNode;

                                if (!values || p === scrollbarContainerElement[0]) return;

                                var eY = e.pageY || event.clientY,
                                    top = ((eY - getTop(wrapperDomElement.parentElement || wrapperDomElement.parentNode)) / values.height * 100) - values.scrollPosition / 2;
                                if (top > values.remainder) top = values.remainder;
                                else if (top < 0) top = 0;
                                scrollbarElement[0].style.top = top + '%';
                                wrapperDomElement.scrollTop = top * values.heightRate;
                                scrollbarContainerElement.addClass(options.specialClass);
                            },
                            beginScroll = function (e) {
                                var sel = $window.getSelection ? $window.getSelection() : $window.document.selection;
                                if (sel) {
                                    if (sel.removeAllRanges) sel.removeAllRanges();
                                    else if (sel.empty) sel.empty();
                                }
                                e = e || event;
                                var el = e.currentTarget || e.srcElement;

                                $document.bind('mousemove', moveScroll);
                                $document.bind('mouseup', endScroll);

                                values.offsetTop = getTop(wrapperDomElement);

                                values.firstY = e.pageY || event.clientY;
                                if (!values.reposition)
                                    values.reposition = getReposition(values.height);

                                wrapperElement.addClass('unselectable');
                            },
                            moveScroll = function (e) {
                                e = e || event;
                                var eY = e.pageY || e.clientY,
                                    top = (values.reposition + eY - values.firstY) / values.height * 100;

                                if (values.remainder < top) top = values.remainder;
                                if (!values.previousTop) values.previousTop = top + 1;
                                var blnThreshold = top >= 0 && values.firstY > values.offsetTop;
                                if ((values.previousTop > top && blnThreshold) || (blnThreshold && (wrapperDomElement.scrollTop + values.height !== values.scrollHeight))) {
                                    scrollbarElement[0].style.top = top + '%';
                                    values.previousTop = top;
                                    wrapperDomElement.scrollTop = top * values.heightRate;
                                }
                                scrollbarContainerElement.removeClass(options.specialClass);
                            },
                            endScroll = function (e) {

                                $document.unbind('mousemove', moveScroll);
                                $document.unbind('mouseup', endScroll);

                                values.reposition = 0;
                                wrapperElement.removeClass('unselectable');
                                scrollbarContainerElement.addClass(options.specialClass);
                            },
                            doScroll = function (e) {
                                if (!values) return;
                                scrollbarContainerElement.removeClass(options.specialClass);
                                scrollbarElement[0].style.top = wrapperDomElement.scrollTop / values.heightRate + '%';
                                scrollbarContainerElement.addClass(options.specialClass);
                            };

                        if (options.keepFocus) {
                            wrapperElement.attr('tabindex', '-1');
                            wrapperDomElement.focus();
                        }

                        scrollbarElement.bind('mousedown', beginScroll);
                        scrollbarContainerElement.bind('click', setScroll);
                        wrapperElement.bind('scroll', doScroll);
                        angular.element($window).bind('resize', assignValues);

                        assignValues();

                        $scope.$on('$destroy', function () {
                            scrollbarElement.unbind('mousedown');
                            scrollbarContainerElement.unbind('click');
                            wrapperElement.unbind('scroll');
                            angular.element($window).unbind('resize', assignValues);
                        });
                    }
                })

            }
        }
    }]);