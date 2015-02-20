(function() {

    angular
        .module('teaparty2.core')
        .filter('fieldsConcat', FieldsConcatFilter);

    function FieldsConcatFilter() {
        return function (input = '', fieldName = undefined, delimeter = ', ') {
            var out = [];
            for (let obj of input) {
                if (is.not.undefined(obj[fieldName])) out.push(obj[fieldName]);
            }
            return out.join(delimeter);
        };
    }

})();
