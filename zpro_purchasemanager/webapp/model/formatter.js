
jQuery.sap.declare("sap.formatter");
sap.formatter = {

    getFormattedDate: function (date) {

        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "dd/MM/yyyy"
        });
        return dateFormat.format(new Date(date));
    },

    removeLeadingZeros: function (sString) {
 
        if (sString) {
            return sString.replace(/^0+/, '');
        }

    },
 
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
   
 
};
