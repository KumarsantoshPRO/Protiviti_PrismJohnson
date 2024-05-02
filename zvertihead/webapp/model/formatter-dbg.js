
sap.ui.define([], function () {
    "use strict";
    return {
        getFormattedDate: function (date) {

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy"
            });
            return dateFormat.format(new Date(date));
        },
        makeItPositive: function (sString) {
            debugger;
            if (sString) {
                if (Number(sString) < 0) {
                    return (Number(sString) * -1).toString();
                } else {
                    return sString;
                }
            } else {
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
       
        getOrderType: function (sString) {
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
        getPaymentTerm: function (sString) {
            if (sString) {
                switch (sString) {
                    case 'HR01':
                        return 'CD-4%-25 (Advance) - HR01';
                        break;
                    case 'HR07':
                        return "CD-3%-07 Days Payment - HR07";
                        break;
                    case "HR10":
                        return "CD-3%-10 Days Payment - HR10";
                        break;
                    case "HR25":
                        return "CD-2%-25 Days Payment - HR25";
                        break;
                    case "HR30":
                        return "30 Days Payment - HR30";
                        break;
                    case "HR45":
                        return "45 Days Payment - HR45";
                        break;

                    default:
                        break;
                }

            } else {
                return sString;
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
        getColor: function (sString) {
            if (Number(sString) > 12) {
                return 8;
            } else if (Number(sString) > 10 && Number(sString) < 12) {
                return 1;
            } else if (Number(sString) < 10) {
                return 2;
            }
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
        addPercentageSymbol: function (sString) {
            return sString + "%";
        },
        addPerBox: function (sString) {
            return sString + " Per Box";
        }


    }
});