
sap.ui.define([], function () {
    "use strict";
    return {
        

        getStatus: function (status)
        {
            var temp = "";
            if(status === 'A' || status === 'a') {
                temp = "Approved";
            } else if (status === 'R' || status === 'r') {
                temp = "Rejected";
            } else if (status === 'P' || status === 'p') {
                temp = "In Progress";
            } else if (status === 'D' || status === 'd') {
                temp = "Draft";
            } else {
                temp = "";
            }
            
            return temp;
            
        },

        getStatusColor: function (status)
        {
            var colorCode = "";
            if(status === 'On Going') {
                colorCode = 6;
            } else if (status === 'Approved') {
                colorCode = 8;
            } else if (status === 'Rejected') {
                colorCode = 2;
            } else if (status === 'Delay') {
                colorCode = 1;
            } else {
                colorCode = 9;
            }
            
            return colorCode;
            
        },

        getFormattedDate: function (sDate) {
            if (sDate !== undefined && sDate !== null) {
            var aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            return aMonths[sDate.getMonth()] + " " + sDate.getDate() + ", " + sDate.getFullYear();
            } else {
                return sDate;
            }
        },

        getFormattedDateTime: function (sDate) {
            if (sDate !== undefined && sDate !== null) {
            var aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            return aMonths[sDate.getMonth()] + " " + sDate.getDate() + ", " + sDate.getFullYear() + "    " + sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getUTCSeconds() ;
            } else {
                return sDate;
            }
        },

        getDateFromString: function(sDate) {
            var aMonths = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var sYear = sDate.substring(0,4);
            var sMonth = sDate.substring(4,6);
            var sDate = sDate.substring(6,8);

            return aMonths[parseInt(sMonth, 10)] + " " + sDate + ", " + sYear;
        },

        nonVisible: function(sVal) {
            if (sVal) {
                return !sVal;
            } else {
                return !sVal;
            }
        }
        
    };
});