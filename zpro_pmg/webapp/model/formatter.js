
sap.ui.define([], function () {
    "use strict";
    return {
        makeItPositive: function (sString) {
            debugger;
            if (sString) {
                if (Number(sString) < 0) {
                    return (Number(sString) * -1).toString();
                }else{
                    return sString;
                }
            }else{
                return sString;
            }
        },
        removeLeadingZeros: function (sString) {

            if (sString) {
                return sString.replace(/^0+/, '');
            }

        },
        getStatus: function (status) {
            var temp = "";
            if (status === 'A' || status === 'a') {
                temp = "Approved";
            } else if (status === 'R' || status === 'r') {
                temp = "Rejected";
            } else if (status === 'P' || status === 'p') {
                temp = "Pending";
            } else if (status === 'D' || status === 'd') {
                temp = "Delayed";
            } else if (status === 'DL' || status === 'dl') {
                temp = "Deleted";
            } else {
                temp = "";
            }

            return temp;

        },

        getOrderType: function (sType) {
            var sOrderType = "";
            if (sType === '11' || sType === "17") {
                sOrderType = "Project";
            } else if (sType === '19') {
                sOrderType = "Retail";
            } else {
                sOrderType = "";
            }

            return sOrderType;
        },
        getStatus: function (status) {
            var temp = "";
            if (status === 'A' || status === 'a') {
                temp = "Approved";
            } else if (status === 'R' || status === 'r') {
                temp = "Rejected";
            } else if (status === 'P' || status === 'p') {
                temp = "Pending";
            } else if (status === 'D' || status === 'd') {
                temp = "Delayed";
            } else if (status === 'DL' || status === 'dl') {
                temp = "Deleted";
            } else {
                temp = "";
            }

            return temp;

        },


        getStatusColor: function (status) {
            var colorCode = "";
            if (status === 'P') {
                colorCode = 6;
            } else if (status === 'A') {
                colorCode = 8;
            } else if (status === 'R') {
                colorCode = 2;
            } else if (status === 'D') {
                colorCode = 1;
            }
            // else if(status==='Forwarded')
            // {
            //     colorCode=9;
            // }
            // else if(status==='Deleted')
            // {
            //     colorCode=2;
            // }
            else {
                colorCode = 10;
            }

            return colorCode;

        },

        getGMColor: function (val) {
            var colorCode = "";
            if (parseInt(val) < 15) {
                colorCode = 2;
            } else if (parseInt(val) > 25) {
                colorCode = 8;
            } else {
                colorCode = 1;
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

    }
});