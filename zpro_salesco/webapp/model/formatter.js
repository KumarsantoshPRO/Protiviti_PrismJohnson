
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
        if (status === 'P' || status === 'p') {
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
    showOrderType: function (sString) {

        if (sString) {
            switch (sString) {
                case '11':
                    return 'Project - 11';
                    break;
                case '17':
                    return 'National Project - 17';
                    break;
                case '19':
                    return 'Dealer - 19';
                    break;
                default:
                    break;
            }

        } else {
            return sString;
        }

    },
    showSalesOffice: function (Soname, Vkbur) {

        if (Soname) {
            return Soname + "(" + Vkbur + ")";
        } else {
            return Vkbur;
        }

    },

    exFactoryorDepot: function (sString) {
        if(sString === "X" || sString === "x"){
            return "X";
        }else{
            return null;
        }

       
    },

    showVerticalText: function(sValue){
        if(sValue === "10"){
return "Johnson";
        }else if(sValue === "20"){
return "Porselano"
        }else if(sValue === "30"){
return "Marbonite"
        }else if(sValue === "40"){
return "Endura"
        }
    }
    // nonVisible: function (sVal) {
    //     if (sVal) {
    //         return !sVal;
    //     } else {
    //         return !sVal;
    //     }
    // }

};
