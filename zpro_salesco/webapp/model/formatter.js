
jQuery.sap.declare("sap.formatter");
sap.formatter = {

    removeLeadingZeros: function (sString) {
 
        if (sString) {
            return sString.replace(/^0+/, '');
        }

    },

    getFormattedDate: function (date) {
       
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "MMM dd, yyyy"
        });
        return dateFormat.format(new Date(date));
    },

    formatDate: function (oDate) {

        if (oDate) {
            if (oDate.length === 10) {
                return sap.formatter.getFormattedDate(oDate.substring(3, 5) + "/" + oDate.substring(0, 2) + "/" + oDate.substring(6, 10));
            } else {
                return sap.formatter.getFormattedDate(oDate.substring(4, 6) + "/" + oDate.substring(6, 8) + "/" + oDate.substring(0, 4));
            }
        } else {
            return "";
        }

    },

    // To call formatter in XML view use below template
    // {path:<dataBindingPath>, formatter:'sap.formatter.<method name>'}
    getStatus: function (status, date) {
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


    getStatusColor: function (status)
    {
        var colorCode = "";
        if(status === 'P' || status === 'p') {
            colorCode = 6;
        } else if (status === 'A' || status === 'a') {
            colorCode = 8;
        } else if (status === 'R' || status === 'r') {
            colorCode = 2;
        } else if (status === 'D' || status === 'd') {
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
   

    getFormattedDate: function (sDate) {
        if (sDate !== undefined && sDate !== null) {
            // var aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            // return aMonths[sDate.getMonth()] + " " + sDate.getDate() + ", " + sDate.getFullYear();
            var aMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      
            if (sDate.getDate() < 10) {
                var aDay = ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
                return aDay[sDate.getDate()] + "/" + aMonths[sDate.getMonth()] + "/" + sDate.getFullYear();
            } else {
                return sDate.getDate() + "/" + aMonths[sDate.getMonth()] + "/" + sDate.getFullYear();
            }
        } else {
            return sDate;
        }
    },

    getFormattedDateTime: function (sDate) {
        if (sDate !== undefined && sDate !== null) {
            var aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            return aMonths[sDate.getMonth()] + " " + sDate.getDate() + ", " + sDate.getFullYear() + "    " + sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getUTCSeconds();
        } else {
            return sDate;
        }
    },

    getDateFromString: function (sDate) {
        var aMonths = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var sYear = sDate.substring(0, 4);
        var sMonth = sDate.substring(4, 6);
        var sDate = sDate.substring(6, 8);

        return aMonths[parseInt(sMonth, 10)] + " " + sDate + ", " + sYear;
    },

    nonVisible: function (sVal) {
        if (sVal) {
            return !sVal;
        } else {
            return !sVal;
        }
    }


};
