/**
 * Adapted from angular-pageslide-directive under MIT Licence 
 * https://www.npmjs.com/package/angular-pageslide-directive
 * https://github.com/dpiccone/ng-pageslide/blob/master/dist/angular-pageslide-directive.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'));
    } else {
        factory(root.angular);
    }
}(this, function (angular) {

    angular
        .module('pageslide-directive', [])
        .directive('pageslide', ['$transitions','$document', '$timeout', function ($transitions, $document, $timeout) {
            var defaults = {};


            return {
                restrict: 'EA',
                transclude: false,
                scope: {
                    psOpen: '=?',
                    psAutoClose: '@',
                    psSide: '@',
                    psSpeed: '@',
                    psClass: '@',
                    psSize: '@',
                    psZindex: '@',
                    psPush: '@',
                    psContainer: '@',
                    psClickOutside: '@',
                    onopen: '&?',
                    onclose: '&?'
                },
                link: function (scope, el, attrs) {

                    var param = {};

                    param.side = scope.psSide || 'right';
                    param.speed = scope.psSpeed || '1.5';
                    param.size = scope.psSize || '500px';
                    param.zindex = scope.psZindex || 1000;
                    param.className = scope.psClass || 'ng-pageslide';
                    param.push = true;
                    param.clickOutside = true;
                    param.autoClose = true;

                    param.push = param.push && !param.container;

                    el.addClass(param.className); //jQuery method

                    /* DOM manipulation */

                    var content, slider, body, isOpen = false;

                    body = document.body;

                    function onBodyClick(e) {
                        var target = e.touches && e.touches[0] || e.target;
                        if(
                            isOpen &&
                            body.contains(target) &&
                            !slider.contains(target)
                        ) {
                            isOpen = false;
                            scope.psOpen = false;
                            scope.$apply();
                        }

                        if(scope.psOpen) {
                            isOpen = true;
                        }
                    }

                    slider = el[0];

                    if (slider.tagName.toLowerCase() !== 'div' &&
                        slider.tagName.toLowerCase() !== 'pageslide') {
                        throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');
                    }

                    if (slider.children.length === 0) {
                        throw new Error('You need to have content inside the <pageslide>');
                    }

                    content = angular.element(slider.children);

                    body.appendChild(slider);

                    slider.style.zIndex = param.zindex;
                    slider.style.position = 'fixed';
                    slider.style.transitionDuration = param.speed + 's';
                    slider.style.webkitTransitionDuration = param.speed + 's';
                    slider.style.height = param.size;
                    slider.style.transitionProperty = 'top, bottom, left, right';
                    slider.style.background = 'white';
                    slider.style.overflow = 'auto';

                    if (param.push) {
                        body.style.position = 'absolute';
                        body.style.transitionDuration = param.speed + 's';
                        body.style.webkitTransitionDuration = param.speed + 's';
                        body.style.transitionProperty = 'top, bottom, left, right';
                    }

                    if (param.container) {
                        slider.style.position = 'absolute';
                        body.style.position = 'relative';
                        body.style.overflow = 'hidden';
                    }

                    function onTransitionEnd() {
                        if (scope.psOpen) {
                            if (typeof scope.onopen === 'function') {
                                scope.onopen()();
                            }
                        } else {
                            if (typeof scope.onclose === 'function') {
                                scope.onclose()();
                            }
                        }
                    }

                    slider.addEventListener('transitionend', onTransitionEnd);

                    initSlider();

                    function initSlider() {
                        slider.style.width = param.size;
                        slider.style.height = '100%';
                        slider.style.top = '0px';
                        slider.style.bottom = '0px';
                        slider.style.right = '0px';
                    }

                    function psClose(slider, param) {
                        slider.style.right = "-" + param.size;
                        if (param.push) {
                            body.style.right = '0px';
                            body.style.left = '0px';
                        }
                        if (param.clickOutside) {
                            $document.off('touchend click', onBodyClick); 
                        }
                        //jQuery to unlisten handler from touchend click event

                        isOpen = false;
                        scope.psOpen = false;
                    }

                    function psOpen(slider, param) {
                        slider.style.right = "0px";
                        if (param.push) {
                            body.style.right = param.size;
                            body.style.left = '-' + param.size;
                        }

                        scope.psOpen = true;

                        if (param.clickOutside) {
                            $document.on('touchend click', onBodyClick);
                        }
                        //jQuery to unlisten handler from touchend click event
                    }

                    // Watchers

                    scope.$watch('psOpen', function(value) {
                        if (!!value) {
                            psOpen(slider, param);
                        } else {
                            psClose(slider, param);
                        }
                    });

                    // Events

                    scope.$on('$destroy', function () {
                        if (param.clickOutside) {
                            $document.off('touchend click', onBodyClick);
                        }
                        body.removeChild(slider);

                        slider.removeEventListener('transitionend', onTransitionEnd);
                    });

                    if (param.autoClose) {
                        scope.$on('$locationChangeStart', function() {
                            psClose(slider, param);
                        });
                        scope.$on('$stateChangeStart', function() {
                            psClose(slider, param);
                        });
                        $transitions.onExit({}, function () {
                            psClose(slider, param);
                        });
                    }

                }
            };
        }]);
}));
