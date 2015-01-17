'use strict';

angular
    .module("teaparty2.widget")
    .service('WidgetHelper', function () {

        /**
         * Change font size of text element to fill the parent element
         * Thanks to: https://github.com/jquery-textfill/jquery-textfill/
         *
         * @param textElement
         * @param parentWidth
         * @param parentHeight
         */
        this.textFill = function(textElement, parentWidth, parentHeight) {
            var fontSize = 100, // Max font size
                minFontSize = 10,
                paddings = 10,
                textHeight,
                textWidth;

            do {
                textElement.style.fontSize = fontSize + 'px';
                textHeight = textElement.offsetHeight;
                textWidth = textElement.offsetWidth;
                fontSize = fontSize - 1;
            } while (
                (textHeight + paddings > parentHeight || textWidth + paddings > parentWidth)
                && fontSize > minFontSize);
        };
    });
