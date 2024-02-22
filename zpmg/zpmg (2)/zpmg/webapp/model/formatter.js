
sap.ui.define([], function () {
    "use strict";
    return {

        getStatusColor: function (status)
        {
            var colorCode = "";
            if(status === 'Pending') {
                colorCode = 6;
            } else if (status === 'Approved') {
                colorCode = 8;
            } else if (status === 'Rejected') {
                colorCode = 2;
            } else if (status === 'Delayed') {
                colorCode = 1;
            } 
            else if(status==='Forwarded')
            {
                colorCode=9;
            }
            else if(status==='Deleted')
            {
                colorCode=2;
            }
            else {
                colorCode = 10;
            }
            
            return colorCode;
            
        },

        getGMColor: function (val)
        {
            var colorCode = "";
            if(parseInt(val) < 15) {
                colorCode = 2;
            } else if (parseInt(val) > 25) {
                colorCode = 8;
            } else {
                colorCode = 1;
            }
            
            return colorCode;
        }
        
    }
});