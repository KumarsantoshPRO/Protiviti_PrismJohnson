sap.ui.define([],function(){"use strict";return{getFormattedDate:function(e){var r=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd/MM/yyyy"});return r.format(new Date(e))},makeItPositive:function(e){debugger;if(e){if(Number(e)<0){return(Number(e)*-1).toString()}else{return e}}else{return e}},removeLeadingZeros:function(e){if(e){return e.replace(/^0+/,"")}},getStatus:function(e){var r="";if(e==="A"||e==="a"){r="Approved"}else if(e==="R"||e==="r"){r="Rejected"}else if(e==="P"||e==="p"){r="Pending"}else if(e==="D"||e==="d"){r="Delayed"}else if(e==="DL"||e==="dl"){r="Deleted"}else{r=""}return r},getOrderType:function(e){if(e){switch(e){case"11":return"Project - 11";break;case"17":return"National Project - 17";break;case"19":return"Dealer - 19";break;default:break}}else{return e}},getPaymentTerm:function(e){if(e){switch(e){case"HR01":return"CD-4%-25 (Advance) - HR01";break;case"HR07":return"CD-3%-07 Days Payment - HR07";break;case"HR10":return"CD-3%-10 Days Payment - HR10";break;case"HR25":return"CD-2%-25 Days Payment - HR25";break;case"HR30":return"30 Days Payment - HR30";break;case"HR45":return"45 Days Payment - HR45";break;default:break}}else{return e}},getStatus:function(e){var r="";if(e==="A"||e==="a"){r="Approved"}else if(e==="R"||e==="r"){r="Rejected"}else if(e==="P"||e==="p"){r="Pending"}else if(e==="D"||e==="d"){r="Delayed"}else if(e==="DL"||e==="dl"){r="Deleted"}else{r=""}return r},getColor:function(e){if(Number(e)>12){return 8}else if(Number(e)>10&&Number(e)<12){return 1}else if(Number(e)<10){return 2}},getStatusColor:function(e){var r="";if(e==="P"){r=6}else if(e==="A"){r=8}else if(e==="R"){r=2}else if(e==="D"){r=1}else{r=10}return r},getGMColor:function(e){var r="";if(parseInt(e)<15){r=2}else if(parseInt(e)>25){r=8}else{r=1}return r},addPercentageSymbol:function(e){return e+"%"},addPerBox:function(e){return e+" Per Box"}}});
//# sourceMappingURL=formatter-dbg.js.map