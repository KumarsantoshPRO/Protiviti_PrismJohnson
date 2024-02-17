sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    var aColumnNames = {
        "MFRGR": "Material Freight Groups",
        "SZMM": "Sizes",
        "MATIN": "Designs",
        "WERKS": "Supplying Plant",
        "PRODH1": "Manufacturing Plant",
        "": "Current Volume (Sqft)",
        "": "Total Volume (Sqft)",
        "": "Ex Factory (SqFt)",
        "": "On-Invoice discount per SqFt",
        "": "Schemes discount per SqFt(If Applicable)",
        "": "Schemes %",
        "": "ORC Entity",
        "": "ORC %",
        "": "Freight SqFt",
        "": "Competitor Name",
        "": "Competitor landed price",
        "": "Competitor receipt",
        "": "Quality",
        "": "Part A/B",
        "": "Landed",
        "": "Net Ex factory(NEF)",
        "": "",
        "": "",
        "": ""
    }
    return {

        // Header, General Information(Simple form)- Validation
        headerPayloadValidation: function (oControl) {

            var headerValidation = 1;
            if (!oControl.getView().getModel("JSONModelPayload").getData().KUNNR) {
                this.headerPayloadState(oControl, 1);
            }
            //else if(!oControl.getView().getModel("JSONModelPayload").getData().TI){
            //     MessageBox.error(" ");
            // }else if(!oControl.getView().getModel("JSONModelPayload").getData().GST){
            //     MessageBox.error(" ");
            // }else
            //  if(!oControl.getView().getModel("JSONModelPayload").getData().NAME){
            //     MessageBox.error("Please enter Customer Name");
            // }else
            //  if(!oControl.getView().getModel("JSONModelPayload").getData().ACTION){
            //     MessageBox.error(" ");
            // }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().ZTERM) {
                this.headerPayloadState(oControl, 2);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY) {
                this.headerPayloadState(oControl, 3);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().AUFNR) {
                this.headerPayloadState(oControl, 4);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY_DAYS) {
                this.headerPayloadState(oControl, 5);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VTWEG) {
                this.headerPayloadState(oControl, 6);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VKBUR) {
                this.headerPayloadState(oControl, 7);
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().SPART) {
                this.headerPayloadState(oControl, 8);
            } else {
                this.headerPayloadState(oControl, 9);
            }

        },
        headerPayloadState: function (oControl, nIndex) {

            switch (nIndex) {
                case 1:
                    MessageBox.error("Please enter Customer Code");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 2:
                    MessageBox.error("Please select Payment Term");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 3:
                    MessageBox.error("Please enter Validity");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 4:
                    MessageBox.error("Please enter Order No");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 5:
                    // {i18n>view2.simpleForm.label.validDays}
                    MessageBox.error("Please select Validity(Days)");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 6:
                    MessageBox.error("Please select Distribution Channel");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                    break;
                case 7:
                    MessageBox.error("Please enter Sales Office");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 0;
                case 8:
                    MessageBox.error("Please select Vertical");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    headerValidation = 0;
                case 9:
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidity")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpOrderNo")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpValidDays")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None");
                    headerValidation = 1;

                    break;
                default:
                    break;
            }

            return headerValidation;
        },
        // Items, Additional Product Details(Table) - Validation
        itemsPayloadValidation: function (aData, oControl, sAction) {

            var vColumnNo = 0;
            var oTable = oControl.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts"))

            for (var j = 0; j < oTable.getAggregation("items").length; j++) {
                for (let k = 0; k < oTable.getAggregation("items")[0].getAggregation("cells").length; k++) {

                    if (k === 16 || k === 17) {

                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getSelectedKey() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                        }

                    } else if (k === 20) {

                    }
                    else {
                        if (oTable.getAggregation("items")[j].getAggregation("cells")[k].getValue() === '') {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("Error")
                        } else {
                            oTable.getAggregation("items")[j].getAggregation("cells")[k].setValueState("None")
                        }
                    }

                }
            }

            for (var i = 0; i < aData.length; i++) {
                debugger;
                var vLine = i + 1;

                if (aData[i].MFRGR === '') { this.itemsErrorMessage('MFRGR', vLine, sAction); }
                else if (aData[i].SZMM === '') { this.itemsErrorMessage('SZMM', vLine, sAction); }

                else if (aData[i].CURVOLFT === ' ') { this.itemsErrorMessage('CURVOLFT ', vLine, sAction); }
                else if (aData[i].KUNNR === ' ') { this.itemsErrorMessage('KUNNR ', vLine, sAction); }
                else if (aData[i].LANDEDP === ' ') { this.itemsErrorMessage('LANDEDP ', vLine, sAction); }
                else if (aData[i].NEF === ' ') { this.itemsErrorMessage('NEF ', vLine, sAction); }
                else if (aData[i].ZZPRODH4 === ' ') { this.itemsErrorMessage('ZZPRODH4 ', vLine, sAction); }
                else if (aData[i].PRODH1 === ' ') { this.itemsErrorMessage('PRODH1 ', vLine, sAction); }
                else if (aData[i].VKBUR === ' ') { this.itemsErrorMessage('VKBUR ', vLine, sAction); }
                else if (aData[i].PAFVFRM === ' ') { this.itemsErrorMessage('PAFVFRM ', vLine, sAction); }
                else if (aData[i].PAFVTO === ' ') { this.itemsErrorMessage('PAFVTO ', vLine, sAction); }
                else if (aData[i].ERNAM === ' ') { this.itemsErrorMessage('ERNAM ', vLine, sAction); }
                else if (aData[i].ERDAT === ' ') { this.itemsErrorMessage('ERDAT ', vLine, sAction); }
                else if (aData[i].ERZET === ' ') { this.itemsErrorMessage('ERZET ', vLine, sAction); }
                else if (aData[i].LOEKZ === ' ') { this.itemsErrorMessage('LOEKZ ', vLine, sAction); }
                else if (aData[i].ZDISP === ' ') { this.itemsErrorMessage('ZDISP ', vLine, sAction); }
                else if (aData[i].ISEXDEP === ' ') { this.itemsErrorMessage('ISEXDEP ', vLine, sAction); }
                else if (aData[i].ISMEGAL === ' ') { this.itemsErrorMessage('ISMEGAL ', vLine, sAction); }
                else if (aData[i].ZTERM === ' ') { this.itemsErrorMessage('ZTERM ', vLine, sAction); }
                else if (aData[i].VSART === ' ') { this.itemsErrorMessage('VSART ', vLine, sAction); }
                else if (aData[i].MVGR2 === ' ') { this.itemsErrorMessage('MVGR2 ', vLine, sAction); }
                else if (aData[i].MVGR5 === ' ') { this.itemsErrorMessage('MVGR5 ', vLine, sAction); }
                else if (aData[i].MATIN === '') { this.itemsErrorMessage('MATIN', vLine, sAction); }
                else if (aData[i].COVERAGE === ' ') { this.itemsErrorMessage('COVERAGE ', vLine, sAction); }
                else if (aData[i].BOXES === ' ') { this.itemsErrorMessage('BOXES ', vLine, sAction); }
                else if (aData[i].NOSQ === ' ') { this.itemsErrorMessage('NOSQ ', vLine, sAction); }
                else if (aData[i].EXFAC === ' ') { this.itemsErrorMessage('EXFAC ', vLine, sAction); }
                else if (aData[i].EXDEP === ' ') { this.itemsErrorMessage('EXDEP ', vLine, sAction); }
                else if (aData[i].MRP === ' ') { this.itemsErrorMessage('MRP ', vLine, sAction); }
                else if (aData[i].DISC === ' ') { this.itemsErrorMessage('DISC ', vLine, sAction); }
                else if (aData[i].DISCB === ' ') { this.itemsErrorMessage('DISCB ', vLine, sAction); }
                else if (aData[i].GST === ' ') { this.itemsErrorMessage('GST ', vLine, sAction); }
                else if (aData[i].FRGTBX === ' ') { this.itemsErrorMessage('FRGTBX ', vLine, sAction); }
                else if (aData[i].TI === ' ') { this.itemsErrorMessage('TI ', vLine, sAction); }
                else if (aData[i].GSTI === ' ') { this.itemsErrorMessage('GSTI ', vLine, sAction); }
                else if (aData[i].LDDBOX === ' ') { this.itemsErrorMessage('LDDBOX ', vLine, sAction); }
                else if (aData[i].LDDSFT === ' ') { this.itemsErrorMessage('LDDSFT ', vLine, sAction); }
                else if (aData[i].AGENT === ' ') { this.itemsErrorMessage('AGENT ', vLine, sAction); }
                else if (aData[i].COMPTRSFT === ' ') { this.itemsErrorMessage('COMPTRSFT ', vLine, sAction); }
                else if (aData[i].DLCOMSFT === ' ') { this.itemsErrorMessage('DLCOMSFT ', vLine, sAction); }
                else if (aData[i].NETEXB === ' ') { this.itemsErrorMessage('NETEXB ', vLine, sAction); }
                else if (aData[i].NETEXSQ === ' ') { this.itemsErrorMessage('NETEXSQ ', vLine, sAction); }
                else if (aData[i].COMMBO === ' ') { this.itemsErrorMessage('COMMBO ', vLine, sAction); }
                else if (aData[i].SBPRICE === ' ') { this.itemsErrorMessage('SBPRICE ', vLine, sAction); }
                else { return 1; }
            }


        },
        itemsErrorMessage: function (vColumnKey, vLine, sAction) {
            MessageBox.error('Please enter "' + aColumnNames[vColumnKey] + '" at line number:' + vLine + ' ,before ' + sAction + '');
            return 0;
        },


    }
});