sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    var oItemFieldsNColumnHeaders = {
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
    };
    var oHeadeFieldsNIds = {
        "KUNNR": "idV2InpCustCode",
        "ZTERM": "idV2SLPaymentTerm",
        "VALIDITY": "idV2InpValidity",
        "AUFNR": "idV2InpOrderNo",
        "VALIDITY_DAYS": "idV2InpValidDays",
        "VTWEG": "idV2SLDistChannel",
        "VKBUR": "idV2InpSalesOffice",
        "SPART": "idV2SLVertical"
    };

    return {

        // Header, General Information(Simple form)- Validation
        headerPayloadValidation: function (oControl) {

            var oResourceModel = oControl.getView().getModel("i18nV2").getResourceBundle();
            debugger;
            if (!oControl.getView().getModel("JSONModelPayload").getData().KUNNR) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.custCode"));
                this.headerPayloadState(oControl, "KUNNR");
                return 0;
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
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.payTerm"));
                this.headerPayloadState(oControl, "ZTERM");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.validity"));
                this.headerPayloadState(oControl, "VALIDITY");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().AUFNR) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.ordNo"));
                this.headerPayloadState(oControl, "AUFNR");
                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VALIDITY_DAYS) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.validDays"));
                this.headerPayloadState(oControl, "VALIDITY_DAYS");
                return 0;
            }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().VTWEG) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.distChnl"));
                this.headerPayloadState(oControl, "VTWEG");

                return 0;
            } else if (!oControl.getView().getModel("JSONModelPayload").getData().VKBUR) {
                MessageBox.error("Please enter " + oResourceModel.getText("view2.simpleForm.label.salOffice"));
                this.headerPayloadState(oControl, "VKBUR");
                return 0;
            }
            else if (!oControl.getView().getModel("JSONModelPayload").getData().SPART) {
                MessageBox.error("Please select " + oResourceModel.getText("view2.simpleForm.label.vertical"));
                this.headerPayloadState(oControl, "SPART");
                return 0;
            } else {

                return 1;
            }

        },
        headerPayloadState: function (oControl, sOdataProperty) {
            for (const key in oHeadeFieldsNIds) {
                if (oHeadeFieldsNIds.hasOwnProperty.call(oHeadeFieldsNIds, key)) {
                    const element = oHeadeFieldsNIds[key];
                    if (key !== sOdataProperty) {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("None");
                    } else {
                        oControl.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", oHeadeFieldsNIds[key])).setValueState("Error");
                    }

                }
            }
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
            MessageBox.error('Please enter "' + oItemFieldsNColumnHeaders[vColumnKey] + '" at line number:' + vLine + ' ,before ' + sAction + '');
            return 0;
        },


    }
});