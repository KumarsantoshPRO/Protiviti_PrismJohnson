sap.ui.define([], function () {
  "use strict";
  return {
    getFormattedDate: function (date) {
      var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "dd/MM/yyyy",
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
    getDiscountAmtorBox: function (sValue1, sValue2) {
      if (sValue1 === "0.00") {
        return sValue2;
      } else {
        return sValue1;
      }
    },
    removeLeadingZeros: function (sString) {
      if (sString) {
        return sString.replace(/^0+/, "");
      }
    },

    getOrderType: function (sString) {
      if (sString) {
        switch (sString) {
          case "11":
            return "Project - 11";
            break;
          case "17":
            return "National Project - 17";
            break;
          case "19":
            return "Dealer - 19";
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
          case "HR01":
            return "CD-4% Advance - HR01";
            break;
          case "HR07":
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
          case "HRJ3":
            return "HRJ3";
            break;
          case "S001":
            return "Advance Payment - S001";
            break;
          case "S002":
            return "07 days Payment - S002";
            break;
          case "S003":
            return "15 days Payment - S003";
            break;
          case "S004":
            return "30 days Payment- S004";
            break;
          case "S005":
            return "Part advance & balance against delivery - S005";
            break;
          case "S006":
            return "7 days payment without PDC - S006";
            break;
          case "S007":
            return "15 days payment without PDC - S007";
            break;
          case "S008":
            return "30 days payment without PDC - S008";
            break;
          case "S009":
            return "30 Days LC from delivery of material - S009";
            break;
          case "S010":
            return "90 days payment without PDC - S010";
            break;
          case "S011":
            return "50% Adv & Bal agnst delivery- S011";
            break;
          case "S013":
            return "60 days payment without PDC - S013";
            break;
          case "S014":
            return "75 days payment without PDC - S014";
            break;
          case "S015":
            return "45 days payment without PDC - S015";
            break;
          case "P017":
            return "Within 40 days from the date of goods receipt - P017";
            break;
          case "DL45":
            return "DL45";
            break;
          case "ER07":
            return "East Rgn. Cash Discount- 3%- 7 Days - ER07 ";
            break;
          case "ER15":
            return "East Rgn. Cash Discount- 2%- 15 Days- ER15 ";
            break;
          case "ER22":
            return "East Rgn. Cash Discount- 4%-22 Days- ER22 ";
            break;
          case "ER29":
            return "East Rgn. Cash Discount- 3%-29 Days- ER29 ";
            break;
          case "ER32":
            return "East Rgn. Cash Discount- 3%-32 Days- ER32 ";
            break;
          case "ER35":
            return "East Rgn. 35 Days Payment- ER35";
            break;
          case "ER40":
            return "East Rgn. Cash Discount- 1.5 %-40 Days - ER40";
            break;
          case "ER43":
            return "East Rgn. Cash Discount- 0%-43 Days- ER43 ";
            break;
          case "ER46":
            return "East Rgn. Cash Discount- 2%- 46 Days- ER46";
            break;
          case "ER50":
            return "East Rgn. Cash Discount- 1 %-50 Days- ER50 ";
            break;
          case "ER51":
            return "East Rgn. 51 Days Payment- ER51";
            break;
          case "ER60":
            return "East Rgn. No CD>60 Days- ER60 ";
            break;

          default:
            break;
        }
      } else {
        return sString;
      }
    },

    showSource: function (Sname, Source) {
      if (Sname) {
        return Sname + "(" + Source + ")";
      } else {
        return Source;
      }
    },
    getStatus: function (status) {
      var temp = "";
      if (status === "A" || status === "a") {
        temp = "Approved";
      } else if (status === "R" || status === "r") {
        temp = "Rejected";
      } else if (status === "P" || status === "p") {
        temp = "Pending";
      } else if (status === "D" || status === "d") {
        temp = "Delayed";
      } else if (status === "DL" || status === "dl") {
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
      if (status === "P") {
        colorCode = 6;
      } else if (status === "A") {
        colorCode = 8;
      } else if (status === "R") {
        colorCode = 2;
      } else if (status === "D") {
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
    },
  };
});
