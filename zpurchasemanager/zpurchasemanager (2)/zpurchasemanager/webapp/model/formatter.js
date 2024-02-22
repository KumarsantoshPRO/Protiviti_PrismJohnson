
sap.ui.define([], function () {
    "use strict";
    return {

        getStatusColor: function (status)
        {
            var colorCode = "";
            if(status === 'Pending') {
                colorCode = 6;
            } 
            else {
                colorCode = 10;
            }
            
            return colorCode;
            
        },
        
    };
});