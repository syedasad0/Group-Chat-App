var apiReferenceModule = "commonFunction";

var Promise            = require('bluebird');
var Joi                = require('joi');

exports.checkBlank = function (arr, apiReference) {
    if (!Array.isArray(arr)) {
        return 1;
    }
    var arrlength = arr.length;
    for (var i = 0; i < arrlength; i++) {
        if (arr[i] === undefined || arr[i] == null) {
            arr[i] = "";
        } else {
            arr[i] = arr[i];
        }
        arr[i] = arr[i].toString().trim();
        if (arr[i] === '' || arr[i] === "" || arr[i] === undefined) {
            console.log(apiReference, {EVENT: "Check blank failed", MAN_VALUES: arr});
            return 1;
        }
    }
    return 0;
};
