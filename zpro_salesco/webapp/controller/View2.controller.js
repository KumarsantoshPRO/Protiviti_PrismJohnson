sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/IconPool',
    'sap/ui/core/Icon',
    'sap/m/Link',
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Button',
    'sap/m/Bar',
    'sap/m/Title',
    'sap/m/Popover',
    'sap/m/MessageBox',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/valueHelps',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/validation',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/salesOffice',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/customerCode',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/materialFreightGroup',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/designs',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/supplyPlant',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/manufacturingPlant',
    'zpj/pro/sk/sd/salescoordinator/zprosalesco/utils/View2/part',
    "sap/m/PDFViewer",
    'sap/ui/core/Fragment',
    'sap/ui/core/format/DateFormat',
    "sap/m/MessageToast",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        IconPool,
        Icon,
        Link,
        MessageItem,
        MessageView,
        Button,
        Bar,
        Title,
        Popover,
        MessageBox,
        valueHelps,
        validation,
        salesOffice,
        customerCode,
        materialFreightGroup,
        Designs,
        supplyPlant,
        manufacturingPlant,
        part,
        PDFViewer,
        Fragment,
        DateFormat,
        MessageToast, ExportTypeCSV, exportLibrary, Spreadsheet) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("zpj.pro.sk.sd.salescoordinator.zprosalesco.controller.View2", {

            onInit: function () {

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

                // local JSON models
                this._fileDetail;
                this.Pafno;
                this._allAttachment = [];
                this._attachmentPayload;
                var dataModelValueHelp = this.getOwnerComponent().getModel("valueHelp").getData();
                this.getView().setModel(new JSONModel(dataModelValueHelp), "LocalJSONModels");
                this.bindingContextPath;

                //Start: Upload, View and Download Attachment
                var dataModelForAttachments = this.getOwnerComponent().getModel("attachments").getData();
                this.getView().setModel(new JSONModel(dataModelForAttachments), "LocalJSONModelForAttachment");
                var oUploadSet = this.byId(sap.ui.core.Fragment.createId("idV2FragAttach", "idV2UploadSet"))

                // Modify "add file" button
                oUploadSet.getDefaultFileUploader().setButtonOnly(false);
                oUploadSet.getDefaultFileUploader().setTooltip("");
                oUploadSet.getDefaultFileUploader().setIconOnly(true);
                oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");

                this.opdfViewer = new PDFViewer();
                this.getView().addDependent(this.opdfViewer);
                //End: Upload, View and Download Attachment
            },

            onRouteMatched: function (oEvent) {
                var oGlobalModel = {
                    "Editable": false
                }
                var oEditableFields = {
                    "Editable": false
                }
                var oModelGlobalModel = new JSONModel(oGlobalModel);
                this.getView().setModel(oModelGlobalModel, "GlobalModel");
                var oModelGlobalEditable = new JSONModel(oEditableFields);
                this.getView().setModel(oModelGlobalEditable, "GlobalEditableModel");


                var sID = oEvent.getParameter("arguments").ID;
                this.sID = oEvent.getParameter("arguments").ID;

                if (sID === "null" || sID === undefined) {



                    this.clearSummary();
                    this.getView().byId("FileUploaderId").setVisible(true);
                    // this.getView().byId("id.excelExport.Link").setVisible(true);
                    this.getView().getModel("GlobalModel").setProperty("/Editable", true);
                    this.getView().getModel("GlobalEditableModel").setProperty("/Editable", true);
                    this.getView().byId("idV2OPSSumDetail").setVisible(true);

                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(false);
                    this.getView().byId("idV2OPSubAttach").setVisible(true);
                    // payload for OData service
                    var dataModelPayload = this.getOwnerComponent().getModel("payload").getData();
                    dataModelPayload.header.ET_SALES_COORD_ISET.results = [];
                    dataModelPayload.header.ET_SALES_COORD_ISET.results.push(dataModelPayload.item);
                    this.getView().setModel(new JSONModel(dataModelPayload.header), "JSONModelPayload");
                    this.onClear();
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Generate New Request");
                } else {
                    this.clearSummary();
                    this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                    this.getView().getModel("GlobalEditableModel").setProperty("/Editable", false);
                    this.getView().byId("FileUploaderId").setVisible(false);
                    // this.getView().byId("id.excelExport.Link").setVisible(false);
                    this.getView().byId("idV2OPSSumDetail").setVisible(false);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(true);
                    var aFilter = [];
                    var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Pafno", sap.ui.model.FilterOperator.EQ, sID)], false);
                    aFilter.push(oFilter);
                    var sPath = "/ET_SALES_COORD_HEADERSet('" + sID + "')";
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Display Request Details:" + sID.replace(/^0+/, ''));

                    var that = this;
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        // filters: aFilter,
                        urlParameters: {
                            "$expand": "ET_SALES_COORD_ISET"
                        },
                        success: function (Data) {
                            if (Data.Status === 'P' || Data.Status === 'D') {
                                that.getView().byId("idV2BtnEdit").setVisible(true);
                            } else {
                                that.getView().byId("idV2BtnEdit").setVisible(true);
                            }
                            Data.Validity = Data.Validity.replace(/^0+/, '');

                            var aTableItems = Data.ET_SALES_COORD_ISET.results;
                            var nLen = aTableItems.length;
                            for (var j = 0; j < nLen; j++) {
                                if (aTableItems[j].Isexdep === "") {
                                    aTableItems[j].Isexdep = " ";
                                }
                            }
                            // Disc and Discb  conversion
                            if (Data.Vtweg === '19') {

                            } else {
                                for (var i = 0; i < nLen; i++) {
                                    aTableItems[i].Disc = aTableItems[i].Discb;
                                    aTableItems[i].Discb = null;
                                }
                            }


                            that.getView().setModel(new JSONModel(Data), "JSONModelPayload");
                            if (that.getView().getModel("JSONModelPayload").getProperty("/Vtweg")) {
                                that.sPreviousDistributionChannel = that.getView().getModel("JSONModelPayload").getProperty("/Vtweg");
                            }
                            if (that.getView().getModel("JSONModelPayload").getProperty("/Spart")) {
                                that.sPreviousVertical = that.getView().getModel("JSONModelPayload").getProperty("/Spart");
                            }
                            that.getView().setBusy(false);
                        },
                        error: function (oError) {
                            that.getView().setBusy(false);
                            var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                            if (sErrorMessage) {
                                MessageBox.error(sErrorMessage, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            } else {
                                MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }

                        }
                    });
                    var sPathUpload = "/ETFILE_UPLOAD_HSet('" + sID + "')";
                    that.getView().setBusy(true);
                    that.getView().getModel("ZFILE_UPLOAD_SRV_01").read(sPathUpload, {
                        urlParameters: {
                            "$expand": "Nav_File_Upload"
                        },
                        async: false,
                        success: function (Data) {
                            that.getView().byId("idV2OPSAttach").setVisible(true);
                            var attachments = Data;
                            that.getView().getModel("LocalJSONModelForAttachment").setData({ "attachments": attachments });
                            that.getView().getModel("LocalJSONModelForAttachment").refresh(true);
                            that.getView().setBusy(false);
                        },
                        error: function (oError) {
                            that.getView().setBusy(false);
                            var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                            if (sErrorMessage) {
                                MessageBox.error(sErrorMessage, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            } else {
                                MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }

                        }
                    });



                }
            },

            onEdit: function () {
                if (this.sID !== "null") {
                    this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                    this.getView().getModel("GlobalEditableModel").setProperty("/Editable", true);
                    this.getView().byId("FileUploaderId").setVisible(false);
                    // this.getView().byId("id.excelExport.Link").setVisible(false);
                    this.getView().byId("idV2OPSSumDetail").setVisible(true);
                } else {
                    this.getView().getModel("GlobalModel").setProperty("/Editable", true);
                    this.getView().getModel("GlobalEditableModel").setProperty("/Editable", true);
                    this.getView().byId("FileUploaderId").setVisible(true);
                    this.getView().byId("idV2OPSSumDetail").setVisible(true);
                }
            },
            //Start: Distribution and Vertical Selection change
            onDistributionChannelChange: function (oEvent) {
                var sLastSelectedDistributionChannel = oEvent.getSource().getSelectedKey();
                oEvent.getSource().setValueState("None");
                this.getView().getModel("JSONModelPayload").setProperty("/Zterm", "");
                var vGetSelectedValue = oEvent.getSource().getSelectedKey();
                if (vGetSelectedValue === "11" || vGetSelectedValue === "17") {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(false);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2LblPayTerm")).setRequired(false);
                    MessageToast.show("Enter 'Discount' per box");
                } else {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(true);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2LblPayTerm")).setRequired(true);
                    MessageToast.show("Enter 'Discount' in Percentage");
                }
                if (this.sPreviousDistributionChannel) {
                    MessageBox.confirm("Products will be refreshed if Distributor Channel changed, Do you wish to continue ", {
                        actions: ["Yes", "No"],
                        onClose: function (oAction) {
                            if (oAction === "Yes") {
                                this.sPreviousDistributionChannel = sLastSelectedDistributionChannel;
                                this.clearProducts();
                                this.clearSummary();

                            } else {
                                if (this.sPreviousDistributionChannel) {
                                    this.getView().getModel("JSONModelPayload").setProperty("/Vtweg", this.sPreviousDistributionChannel)
                                    // oEvent.getSource().setSelectedKey(this.sPreviousDistributionChannel);
                                }
                            }
                        }.bind(this)
                    });
                } else {
                    this.sPreviousDistributionChannel = oEvent.getSource().getSelectedKey();
                }
            },
            onVerticalSelectChange: function (oEvent) {
                var sLastSelectedVertical = oEvent.getSource().getSelectedKey();
                oEvent.getSource().setValueState("None");
                if (this.sPreviousVertical) {
                    MessageBox.confirm("Products will be refreshed if Vertical changed, Do you wish to continue ", {
                        actions: ["Yes", "No"],
                        onClose: function (oAction) {
                            if (oAction === "Yes") {
                                this.sPreviousVertical = sLastSelectedVertical;
                                this.clearProducts();
                                this.clearSummary();
                            } else {
                                if (this.sPreviousVertical) {
                                    this.getView().getModel("JSONModelPayload").setProperty("/Spart", this.sPreviousVertical);
                                    // oEvent.getSource().setSelectedKey(this.sPreviousVertical);
                                }
                            }
                        }.bind(this)
                    });
                } else {
                    this.sPreviousVertical = oEvent.getSource().getSelectedKey();
                }
            },
            clearProducts: function () {
                var JSONData = this.getView().getModel("JSONModelPayload").getData();
                var oRow = {
                    "Mfrgr": "",
                    "Szmm": "",
                    "Mvgr2": "",
                    "Werks": "",
                    "Prodh1": "",
                    "CurVolFt": "",
                    "TotalVol": "",
                    "Disc": null,
                    "Discb": null,
                    "Commbox": null,
                    "Exfacsqft": null,
                    "Exdepsqft": null,
                    "Commboxp": null,
                    "Frgtsqft": null,
                    "Compname": null,
                    "Complanprice": null,
                    "Remark": null,
                    "Zzprodh4": "",
                    "Mvgr5": "",
                    "Isexdep": ""
                };
                JSONData.ET_SALES_COORD_ISET.results = [oRow];
                this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));

            },
            //End: Distribution and Vertical Selection change
            onCancel: function () {

                var that = this;
                MessageBox.confirm("Are you sure you want to cancel?", {
                    actions: ["Yes", "No"],
                    onClose: function (oAction) {
                        if (oAction === "Yes") {
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteMain", {});
                        }
                    }.bind(this)
                });
            },

            onClear: function () {
                this.sPreviousDistributionChannel = null;
                this.sPreviousVertical = null;
                var JSONData = {
                    "Pafvto": null,
                    "Kunnr": "",
                    "Pafvfrm": null,
                    "Ti": "1",
                    "Gst": "18",
                    "Name": "",
                    "Action": "",
                    "Zterm": "",
                    "Validity": "",
                    "Aufnr": "",
                    "Vtweg": "",
                    "Vkbur": "",
                    "Spart": "",
                    "ET_SALES_COORD_ISET": {
                        "results": [{
                            "Mfrgr": "",
                            "Szmm": "",
                            "Mvgr2": "",
                            "Werks": "",
                            "Prodh1": "",
                            "CurVolFt": "",
                            "TotalVol": "",
                            "Disc": null,
                            "Discb": null,
                            "Commbox": null,
                            "Exfacsqft": null,
                            "Exdepsqft": null,
                            "Commboxp": null,
                            "Frgtsqft": null,
                            "Compname": null,
                            "Complanprice": null,
                            "Remark": null,
                            "Zzprodh4": "",
                            "Mvgr5": "",
                            "Isexdep": ""
                        }]
                    }
                }
                this.getView().getModel("JSONModelPayload").setData(JSONData);
                this.getView().getModel("JSONModelPayload").refresh(true);
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("RouteMain", {});

            },

            _getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18nV2").getResourceBundle();
            },

            onInvoiceLiveValidation: function (oEvent) {
                oEvent.getSource().setValueState("None");

                var value = Number(oEvent.getSource().getValue());
                var sValue = oEvent.getSource().getValue();
                if (sValue.includes(".")) {
                    if (sValue.split(".")[1].length > 2) {

                        MessageToast.show("Only 2 Decimal allowed");
                        sValue = sValue.substring(0, sValue.length - 1);
                        oEvent.getSource().setValue(sValue);
                    }
                }

                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }
                if (this.getView().getModel("JSONModelPayload").getProperty('/Vtweg') === "19") {
                    if (value > 100) {
                        MessageBox.error("Percentage value not correct");
                        oEvent.getSource().setValue("");
                    }
                }
            },
            onOrcPerLiveValidation: function (oEvent) {

                var sValue = oEvent.getSource().getValue();
                if (sValue.includes(".")) {
                    if (sValue.split(".")[1].length > 2) {

                        MessageToast.show("Only 2 Decimal allowed");
                        sValue = sValue.substring(0, sValue.length - 1);
                        oEvent.getSource().setValue(sValue);
                    }
                }
                oEvent.getSource().setValueState("None");

                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }
                if (this.getView().getModel("JSONModelPayload").getProperty('/Vtweg') === "19") {
                    if (value > 100) {
                        MessageBox.error("Percentage value not correct");
                        oEvent.getSource().setValue("");
                    }
                }
            },

            onLiveChange: function (oEvent) {
                oEvent.getSource().setValueState("None");
            },

            onValidityNumber: function (oEvent) {
                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }

                var sValue = oEvent.getSource().getValue();
                if (sValue.includes(".")) {
                    MessageBox.error("Decimal numbers not allowed");
                    oEvent.getSource().setValue("");
                }
            },
            onNumberValidation: function (oEvent) {

                var sValue = oEvent.getSource().getValue();
                if (sValue.includes(".")) {
                    if (sValue.split(".")[1].length > 2) {

                        MessageToast.show("Only 2 Decimal allowed");
                        sValue = sValue.substring(0, sValue.length - 1);
                        oEvent.getSource().setValue(sValue);
                    }
                }
                oEvent.getSource().setValueState("None");
                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                }
                // else if (value > 99) {
                //     MessageBox.error("Please enter value less than 100");
                //     oEvent.getSource().setValue("");
                // }

            },

            onFrgtValidation: function (oEvent) {
                var sValue = oEvent.getSource().getValue();
                if (sValue.includes(".")) {
                    if (sValue.split(".")[1].length > 2) {

                        MessageToast.show("Only 2 Decimal allowed");
                        sValue = sValue.substring(0, sValue.length - 1);
                        oEvent.getSource().setValue(sValue);
                    }
                }
                oEvent.getSource().setValueState("None");
                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue(null);
                }
                // else if (value > 99) {
                //     MessageBox.error("Please enter value less than 100");
                //     oEvent.getSource().setValue("");
                // }

            },
            onAddRow: function () {

                var headerValidationStatus = validation.headerPayloadValidation(this);
                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Adding new line");
                    if (itemValidationStatus === 1) {
                        var JSONData = this.getView().getModel("JSONModelPayload").getData();
                        var nRowIndex = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results.length;
                        JSONData.ET_SALES_COORD_ISET.results.push({
                            "Mfrgr": "",
                            "Szmm": "",
                            "Mvgr2": "",
                            "Werks": "",
                            "Prodh1": "",
                            "CurVolFt": "",
                            "TotalVol": "",
                            "Disc": null,
                            "Discb": null,
                            "Commbox": null,
                            "Exfacsqft": null,
                            "Exdepsqft": null,
                            "Commboxp": null,
                            "Frgtsqft": null,
                            "Compname": null,
                            "Complanprice": null,
                            "Remark": null,
                            "Zzprodh4": "",
                            "Mvgr5": "",
                            "Isexdep": ""
                        });

                        this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));

                        this.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2SC")).scrollTo(0, 0, 500);

                    }
                }

            },

            onDelete: function (oEvent) {

                var vLen = oEvent.getSource().getParent().getBindingContextPath().split("/").length

                var index = Number(oEvent.getSource().getParent().getBindingContextPath().split("/")[vLen - 1]);

                var JSONData = this.getView().getModel("JSONModelPayload").getData();
                if (JSONData.ET_SALES_COORD_ISET.results.length > 1) {
                    JSONData.ET_SALES_COORD_ISET.results.splice(index, 1);
                } else {
                    MessageBox.error("Atlease one entry is required");
                }

                this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));

                // Date format corrector
                var data = this.getView().getModel("JSONModelPayload").getData();
                data.Pafvto = new Date(data.Pafvto);
                data.Pafvfrm = new Date(data.Pafvfrm);
                var aItems = data.ET_SALES_COORD_ISET.results;
                for (let index = 0; index < aItems.length; index++) {
                    for (const key in aItems[index]) {
                        if (Object.hasOwnProperty.call(aItems[index], key)) {
                            if (key === 'Erdat') {
                                aItems[index].Erdat = new Date(aItems[index].Erdat);
                            }
                        }
                    }
                }

            },

            //Start: Customer Code
            // On Value Help(F4)
            onCustomerCodeHelp: function () {
                customerCode.onCustomerCodeHelp(this);
            },
            // On F4 search
            onValueHelpSearch_custCode: function (oEvent) {
                customerCode.onValueHelpSearch_custCode(oEvent, this);
            },
            // On F4 confirm
            onValueHelpConfirm_custCode: function (oEvent) {
                customerCode.onValueHelpConfirm_custCode(oEvent, this);
            },

            // on Submit
            onCustomerCodeInputSubmit: function (oEvent) {

                customerCode.onCustomerCodeInputSubmit(oEvent, this);
            },
            // On Suggest
            onSuggest_custCode: function (oEvent) {
                customerCode.onSuggest_custCode(oEvent, this);
            },
            // On change
            onCustomerCodeInputChange: function () {
                customerCode.onCustomerCodeInputChange(this);
            },
            // on Suggestion select
            onCustomerCodeInputSuggestionSelect: function (oEvent) {
                customerCode.onCustomerCodeInputSuggestionSelect(oEvent, this);

            },
            // On live change
            onCustomerCodeLiveChange: function (oEvent) {
                customerCode.onCustomerCodeLiveChange(oEvent);
            },

            //End: Customer Code

            //Start: Sales Office
            // on Value Help(F4)
            onSalesOfficeHelp: function () {
                salesOffice.onSalesOfficeHelp(this);
            },
            // on Submit
            onSalesOfficeInputSubmit: function (oEvent) {
                salesOffice.salesOffice_submitCall(oEvent, this);
            },
            // on F4 search/liveChange
            onValueHelpSearch_salOffice: function (oEvent) {
                salesOffice.onSalesOfficeHelpSearch(oEvent, this);
            },
            // on F4 confirm
            onValueHelpConfirm_salOffice: function (oEvent) {
                salesOffice.onSalesOfficeValueHelpConfirm(oEvent, this);
            },
            // On Suggest
            onSuggest_salesOffice: function (oEvent) {
                salesOffice.onSuggest_salesOffice(oEvent, this);
            },

            // On live change
            onSalesOfficeLiveChange: function (oEvent) {
                salesOffice.onSalesOfficeLiveChange(oEvent);
            },
            //End: Sales Office


            // Start: Material Freight Group

            // on Value Help(F4)
            onMaterialFreightGroupsHelp: function (oEvent) {
                materialFreightGroup.onMaterialFreightGroupsHelp(oEvent, this);
            },
            // on F4 search/liveChange
            onMaterialFreightGroupsValueHelpSearch: function (oEvent) {
                materialFreightGroup.onMaterialFreightGroupsValueHelpSearch(oEvent, this);
            },
            // on F4 confirm
            onMaterialFreightGroupsHelpConfirm: function (oEvent) {
                materialFreightGroup.onMaterialFreightGroupsHelpConfirm(oEvent, this);
            },
            // On Suggest
            onSuggest_MaterialFreightGroups: function (oEvent) {
                materialFreightGroup.onSuggest_MaterialFreightGroups(oEvent, this);
            },
            // Submit action
            onMaterialFreightGroupInputSubmit: function (oEvent) {
                materialFreightGroup.onMaterialFreightGroupInputSubmit(oEvent, this);
            },
            // On live change
            onMaterialFreightGroupsLiveChange: function (oEvent) {
                materialFreightGroup.onMaterialFreightGroupsLiveChange(oEvent);
            },

            // End: Material Freight Group

            // Start: Designs

            // on Value Help(F4)
            onDesignsHelp: function (oEvent) {
                Designs.onDesignsHelp(oEvent, this);
            },
            // on F4 search/liveChange
            onValueHelpSearchDesing: function (oEvent) {
                Designs.onValueHelpSearchDesing(oEvent, this);
            },
            // on F4 confirm
            onDesignsHelpConfirm: function (oEvent) {
                Designs.onDesignsHelpConfirm(oEvent, this);
            },
            // On Suggest
            onSuggest_Designs: function (oEvent) {
                Designs.onSuggest_Designs(oEvent, this);
            },

            // Submit action
            onDesignsInputSubmit: function (oEvent) {
                Designs.onDesignsInputSubmit(oEvent, this);
            },
            // On live change
            onDesignsLiveChange: function (oEvent) {
                Designs.onDesignsLiveChange(oEvent);
            },
            // End: Designs

            //Start: Supply Plant

            // on Value Help(F4)
            onSupplyPlantHelp: function (oEvent) {
                supplyPlant.onSupplyPlantHelp(oEvent, this);
            },
            // on F4 search/liveChange
            onSupplyPlantValueHelpSearch: function (oEvent) {
                supplyPlant.onSupplyPlantValueHelpSearch(oEvent, this)
            },
            // on F4 confirm
            onSupplyPlantHelpConfirm: function (oEvent) {
                supplyPlant.onSupplyPlantHelpConfirm(oEvent, this);
            },

            // On Suggest
            onSuggest_SupplyPlant: function (oEvent) {
                supplyPlant.onSuggest_SupplyPlant(oEvent, this);
            },
            // Submit action
            onSupplyPlantInputSubmit: function (oEvent) {
                supplyPlant.onSupplyPlantInputSubmit(oEvent, this);

            },

            // On live change
            onSupplyPlantLiveChange: function (oEvent) {
                supplyPlant.onSupplyPlantLiveChange(oEvent);
            },

            //End: Supply Plant

            //Start: Manufacturing Plant
            // on Value Help(F4)
            onManufacturingAmtHelp: function (oEvent) {
                manufacturingPlant.onManufacturingAmtHelp(oEvent, this);
            },
            // on F4 search/liveChange 
            onManufacturingPlantValueHelpSearch: function (oEvent) {
                manufacturingPlant.onManufacturingPlantValueHelpSearch(oEvent, this);
            },

            // on F4 confirm
            onManufacturingAmtHelpConfirm: function (oEvent) {
                manufacturingPlant.onManufacturingAmtHelpConfirm(oEvent, this);
            },
            // On Suggest

            onSuggest_ManufacturingPlant: function (oEvent) {
                manufacturingPlant.onSuggest_ManufacturingPlant(oEvent, this);

            },

            // Submit action
            onManufacturingPlantInputSubmit: function (oEvent) {
                manufacturingPlant.onManufacturingPlantInputSubmit(oEvent, this);
            },

            // On live change
            onManufacturingPlantLiveChange: function (oEvent) {
                manufacturingPlant.onManufacturingPlantLiveChange(oEvent);
            },


            //End: Manufacturing Plant

            // Start: Part
            onPartSelectChange: function (oEvent) {
                part.onPartSelectChange(oEvent, this);
            },
            // End: Part


            onRadioButtonGroupSelect: function (oEvent) {
                if (oEvent.getSource().getSelectedIndex() === 0) {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "F";
                } else {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "D";

                }
            },

            onSave: function () {
                this.onGenerateBeforeSave();
            },
            onGenerateBeforeSave: function () {
                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    // Date format corrector
                    var data = this.getView().getModel("JSONModelPayload").getData();
                    data.Pafvto = new Date(data.Pafvto);
                    data.Pafvfrm = new Date(data.Pafvfrm);
                    var aItems = data.ET_SALES_COORD_ISET.results;
                    for (let index = 0; index < aItems.length; index++) {
                        for (const key in aItems[index]) {
                            if (Object.hasOwnProperty.call(aItems[index], key)) {
                                if (key === 'Erdat') {
                                    aItems[index].Erdat = new Date(aItems[index].Erdat);
                                }
                            }
                        }
                    }
                    this.getView().getModel("JSONModelPayload").refresh(true);
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;

                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Generate");
                    if (itemValidationStatus === 1) {
                        this.getView().byId("idV2OPSAttach").setVisible(true);
                        this.getView().getModel("JSONModelPayload").getData().Action = "GENERATE";

                        // Disc and Discb convertion
                        var aTableItems = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                        var nLen = aTableItems.length;
                        for (var j = 0; j < nLen; j++) {
                            if (aTableItems[j].Isexdep === "") {
                                aTableItems[j].Isexdep = " ";
                            }

                        }
                        if (this.getView().getModel("JSONModelPayload").getData().Vtweg === '19') {

                        } else {

                            for (var i = 0; i < nLen; i++) {
                                aTableItems[i].Discb = aTableItems[i].Disc;
                                aTableItems[i].Disc = null;
                            }
                        }




                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        this.getView().setBusy(true);

                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {
                                var aTableItems = oData.ET_SALES_COORD_ISET.results;
                                var nLen = aTableItems.length;
                                for (var j = 0; j < nLen; j++) {
                                    if (aTableItems[j].Isexdep === "") {
                                        aTableItems[j].Isexdep = " ";
                                    }

                                }
                                // Disc and Discb  conversion
                                if (oData.Vtweg === '19') {

                                } else {
                                    var aTableItems = oData.ET_SALES_COORD_ISET.results;
                                    var nLen = aTableItems.length;
                                    for (var i = 0; i < nLen; i++) {
                                        aTableItems[i].Disc = aTableItems[i].Discb;
                                        aTableItems[i].Discb = null;
                                    }
                                }
                                this.getView().setBusy(false);
                                this.getView().getModel("JSONModelPayload").setData(oData);
                                this.getView().getModel("JSONModelPayload").refresh(true);



                                this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                                this.getView().getModel("GlobalEditableModel").setProperty("/Editable", false);


                                this.getView().byId("idV2Bar").setVisible(true);
                                this.getView().byId("idV2BtnSave").setVisible(true);
                                this.getView().byId("FileUploaderId").setVisible(false);
                                // this.getView().byId("id.excelExport.Link").setVisible(false);
                                this.getView().byId("idV2OPSSumDetail").setVisible(true);
                                this._displaySummaryDetails();
                                this.onSaveAfterGenerate();
                            }.bind(this),
                            error: function (oError) {
                                this.getView().setBusy(false);
                                this.getView().byId("idV2BtnSave").setVisible(false);
                                var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                                if (sErrorMessage) {
                                    MessageBox.error(sErrorMessage, {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {

                                        }
                                    });
                                } else {
                                    MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {

                                        }
                                    });
                                }
                            }.bind(this)
                        });


                    }
                }
            },
            onSaveAfterGenerate: function () {


                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Save");
                    if (itemValidationStatus === 1) {

                        this.getView().getModel("JSONModelPayload").getData().Action = "SAVE";
                        var aTableItems = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                        var nLen = aTableItems.length;
                        for (var j = 0; j < nLen; j++) {
                            if (aTableItems[j].Isexdep === "") {
                                aTableItems[j].Isexdep = " ";
                            }

                        }

                        if (this.getView().getModel("JSONModelPayload").getData().Vtweg === '19') {

                        } else {

                            for (var i = 0; i < nLen; i++) {
                                aTableItems[i].Discb = aTableItems[i].Disc;
                                aTableItems[i].Disc = null;
                            }
                        }
                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        var that = this;
                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {

                                var aAttachmentsItems = that.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Nav_File_Upload.results;
                                if (aAttachmentsItems.length > 0) {
                                    that.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Pafno = oData.Pafno;
                                    for (var i = 0; i < aAttachmentsItems.length; i++) {
                                        aAttachmentsItems[i].Pafno = oData.Pafno
                                    }
                                    var _attachmentPayload = that.getView().getModel("LocalJSONModelForAttachment").getData().attachments

                                    var sPathUpload = "/ETFILE_UPLOAD_HSet"
                                    that.getView().setBusy(true);
                                    that.getView().getModel("ZFILE_UPLOAD_SRV_01").create(sPathUpload, _attachmentPayload, {
                                        async: false,
                                        success: function (Data) {
                                            that.getView().setBusy(false);

                                            MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno.replace(/^0+/, '') + "", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                    var oRouter = this.getOwnerComponent().getRouter();
                                                    oRouter.navTo("RouteMain", {});
                                                }.bind(this)
                                            });
                                        },
                                        error: function (oError) {
                                            that.getView().setBusy(false);
                                            var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                                            if (sErrorMessage) {
                                                MessageBox.error(sErrorMessage, {
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    onClose: function (oAction) {

                                                    }
                                                });
                                            } else {
                                                MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    onClose: function (oAction) {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {

                                    MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno.replace(/^0+/, '') + "", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {
                                            window.location.reload();
                                        }
                                    });
                                }

                            },
                            error: function (oError) {
                                that.getView().setBusy(false);
                                var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                                if (sErrorMessage) {
                                    MessageBox.error(sErrorMessage, {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {

                                        }
                                    });
                                } else {
                                    MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {

                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            },

            fireAllInputs: function () {
                // come back here
                this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).fireSubmit();
                this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).fireSubmit();

            },

            onGenerate: function () {

                var vSalesOffice = this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).getValue().match(/\d+/)[0];

                // var vSalesOffice = this.getView().getModel("JSONModelPayload").getData().Vkbur

                if (vSalesOffice) {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("None");
                    this.getView().getModel("JSONModelPayload").getData().Vkbur = vSalesOffice;
                    var headerValidationStatus = validation.headerPayloadValidation(this);

                    var paymentTerm = this.getView().getModel("JSONModelPayload").getProperty("/Zterm");
                    var distributorChannel = this.getView().getModel("JSONModelPayload").getProperty("/Vtweg");
                    if (distributorChannel === '19' && !paymentTerm) {
                        MessageBox.error("Please enter Payment Term");
                        this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("Error");
                    } else {
                        this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setValueState("None");
                        if (headerValidationStatus === 1) {
                            // Date format corrector
                            var data = this.getView().getModel("JSONModelPayload").getData();
                            data.Pafvto = new Date(data.Pafvto);
                            data.Pafvfrm = new Date(data.Pafvfrm);
                            var aItems = data.ET_SALES_COORD_ISET.results;
                            for (let index = 0; index < aItems.length; index++) {
                                for (const key in aItems[index]) {
                                    if (Object.hasOwnProperty.call(aItems[index], key)) {
                                        if (key === 'Erdat') {
                                            aItems[index].Erdat = new Date(aItems[index].Erdat);
                                        }
                                    }
                                }
                            }
                            this.getView().getModel("JSONModelPayload").refresh(true);
                            var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;

                            var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Generate");
                            if (itemValidationStatus === 1) {
                                this.getView().byId("idV2OPSAttach").setVisible(true);
                                this.getView().getModel("JSONModelPayload").getData().Action = "GENERATE";

                                var aTableItems = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                                var nLen = aTableItems.length;

                                for (var j = 0; j < nLen; j++) {
                                    if (aTableItems[j].Isexdep === "") {
                                        aTableItems[j].Isexdep = " ";
                                    }

                                }
                                // Disc and Discb convertion

                                if (this.getView().getModel("JSONModelPayload").getData().Vtweg === '19') {

                                } else {

                                    for (var i = 0; i < nLen; i++) {
                                        aTableItems[i].Discb = aTableItems[i].Disc;
                                        aTableItems[i].Disc = null;
                                    }
                                }


                                var sPath = "/ET_SALES_COORD_HEADERSet";
                                this.getView().setBusy(true);

                                this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                                    async: false,
                                    success: function (oData) {
                                        var aTableItems = oData.ET_SALES_COORD_ISET.results;
                                        var nLen = aTableItems.length;
                                        for (var j = 0; j < nLen; j++) {
                                            if (aTableItems[j].Isexdep === "") {
                                                aTableItems[j].Isexdep = " ";
                                            }

                                        }
                                        // Disc and Discb  conversion
                                        if (oData.Vtweg === '19') {

                                        } else {

                                            for (var i = 0; i < nLen; i++) {
                                                aTableItems[i].Disc = aTableItems[i].Discb;
                                                aTableItems[i].Discb = null;


                                            }
                                        }



                                        this.getView().setBusy(false);
                                        oData.Validity = oData.Validity.replace(/^0+/, '');

                                        this.getView().getModel("JSONModelPayload").setData(oData);
                                        this.getView().getModel("JSONModelPayload").refresh(true);

                                        this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                                        this.getView().getModel("GlobalEditableModel").setProperty("/Editable", false);

                                        this.getView().byId("idV2Bar").setVisible(true);
                                        this.getView().byId("idV2BtnSave").setVisible(true);
                                        this.getView().byId("FileUploaderId").setVisible(false);
                                        // this.getView().byId("id.excelExport.Link").setVisible(false);
                                        this.getView().byId("idV2OPSSumDetail").setVisible(true);
                                        this.getView().byId("idV2BtnEdit").setVisible(true);
                                        this.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2SC")).scrollTo(0, 0, 500);
                                        this._displaySummaryDetails();

                                    }.bind(this),
                                    error: function (oError) {
                                        this.getView().setBusy(false);
                                        this.getView().byId("idV2BtnSave").setVisible(false);
                                        var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                                        if (sErrorMessage) {
                                            MessageBox.error(sErrorMessage, {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {

                                                }
                                            });
                                        } else {
                                            MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {

                                                }
                                            });
                                        }
                                    }.bind(this)
                                });


                            }
                        }
                    }
                } else {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).setValueState("Error");
                    MessageBox.error("Please enter Sales Office");
                }

            },

            _displaySummaryDetails: function () {
                var vInvoiceDiscount = 0;
                var vOrc = 0;
                var vFreightDiscount = 0;
                var vPayTermDiscount = 0;
                var vTotalValume = 0;
                var aItemsData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                for (let index = 0; index < aItemsData.length; index++) {
                    // Disc and Discb conversion
                    var vInvoiceType;
                    var vOrcType;
                    if (this.getView().getModel("JSONModelPayload").getProperty("/Vtweg") !== '19') {
                        vInvoiceDiscount = vInvoiceDiscount + Number(aItemsData[index].Disc);
                        vInvoiceType = "Per Box"
                    } else {
                        vInvoiceDiscount = vInvoiceDiscount + Number(aItemsData[index].Disc);
                        vInvoiceType = "%"
                    }

                    if (this.getView().getModel("JSONModelPayload").getProperty("/Vtweg") === '19') {
                        vOrc = vOrc + Number(aItemsData[index].Commboxp);
                        vOrcType = "%"
                    } else {
                        vOrc = vOrc + Number(aItemsData[index].Commbox);
                        vOrcType = "Per Box"
                    }


                    vPayTermDiscount = vPayTermDiscount + Number(aItemsData[index].CashDiscount);
                    vFreightDiscount = vFreightDiscount + (Number(aItemsData[index].Frgtsqft) * Number(aItemsData[index].TotalVol));
                    vTotalValume = vTotalValume + Number(aItemsData[index].TotalVol);
                }
                vInvoiceDiscount = (vInvoiceDiscount / aItemsData.length).toFixed(2);
                vOrc = (vOrc / aItemsData.length).toFixed(2);
                vFreightDiscount = (vFreightDiscount / vTotalValume).toFixed(2);
                vPayTermDiscount = (vPayTermDiscount / aItemsData.length).toFixed(2);
                if (vInvoiceDiscount === NaN || vInvoiceDiscount === 0 || vInvoiceDiscount === '' || vInvoiceDiscount === undefined) {
                    vInvoiceDiscount = 'Not Available'
                }
                if (vOrc === NaN || vOrc === 0 || vOrc === '' || vOrc === undefined) {
                    vOrc = 'Not Available'
                }
                if (vFreightDiscount === NaN || vFreightDiscount === 0 || vFreightDiscount === '' || vFreightDiscount === undefined) {
                    vFreightDiscount = 'Not Available'
                }
                if (vPayTermDiscount === NaN || vPayTermDiscount === 0 || vPayTermDiscount === '' || vPayTermDiscount === undefined) {
                    vPayTermDiscount = 'Not Available'
                }
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpInvcDis")).setValue(vInvoiceDiscount.toString() + vInvoiceType);
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpOrc")).setValue(vOrc.toString() + vOrcType);
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpfraightCost")).setValue(vFreightDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpPayTermDis")).setValue(vPayTermDiscount.toString());
            },

            clearSummary: function () {
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpInvcDis")).setValue("");
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpOrc")).setValue("");
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpfraightCost")).setValue("");
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpPayTermDis")).setValue("");
            },

            //Start: Upload, View and Download Attachment
            onBeforeUploadStarts: function (oEvent) {

                var that = this;
                this.fileName = oEvent.getParameters().item.getFileName()
                this.fileType = oEvent.getParameters().item.getMediaType()

                var file = oEvent.getParameters().item.getFileObject()

                var reader = new FileReader();
                reader.onload = function (e) {
                    var vContent = e.currentTarget.result

                    that.updateFile(that.fileName, that.fileType, vContent);
                }
                reader.readAsDataURL(file);
            },
            updateFile: function (fileName, fileType, vContent) {

                var decodedPdfContent,
                    blob,
                    vStatus = 1;

                if (fileType === 'image/jpeg') {
                    decodedPdfContent = atob(vContent.split('data:image/jpeg;base64,')[1]);
                    vStatus = 1;
                }
                else if (fileType === 'image/png') {
                    decodedPdfContent = atob(vContent.split('data:image/png;base64,')[1]);
                    vStatus = 1
                }
                else if (fileType === 'application/pdf') {
                    decodedPdfContent = atob(vContent.split('data:application/pdf;base64,')[1]);
                    vStatus = 1
                } else {
                    vStatus = 0;
                }


                var byteArray = new Uint8Array(decodedPdfContent.length)
                for (var i = 0; i < decodedPdfContent.length; i++) {
                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                }
                if (fileType === 'image/jpeg') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'image/jpeg'
                    });
                }

                else if (fileType === 'image/png') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'image/png'
                    });
                }
                else if (fileType === 'application/pdf') {
                    blob = new Blob([byteArray.buffer], {
                        type: 'application/pdf'
                    });
                }

                var _url = URL.createObjectURL(blob);
                jQuery.sap.addUrlWhitelist("blob");

                this._fileDetail = {
                    Filename: fileName,
                    Attachment: vContent,
                    Pafno: ""
                }


                this.getView().getModel("LocalJSONModelForAttachment").getData().attachments.Nav_File_Upload.results.push(this._fileDetail)

            },
            onViewAttachmentObjectStatusPress: function (oEvent) {

                var sFile = oEvent.getSource().getParent().getProperty("thumbnailUrl"),
                    sFileName = oEvent.getSource().getParent().getProperty("fileName"),
                    oButton = oEvent.getSource();

                var _imageSrc = { "ZRFILE": sFile, "ZRFNAME": sFileName };
                var oModelForImage = new sap.ui.model.json.JSONModel(_imageSrc);
                this.getView().setModel(oModelForImage, "oModelForImage");

                if (sFile.includes('PDF') || sFile.includes('pdf')) {
                    var fileName = sFileName

                    var decodedPdfContent = atob(sFile.split('data:application/pdf;base64,')[1]);
                    var byteArray = new Uint8Array(decodedPdfContent.length)
                    for (var i = 0; i < decodedPdfContent.length; i++) {
                        byteArray[i] = decodedPdfContent.charCodeAt(i);
                    }
                    var blob = new Blob([byteArray.buffer], {
                        type: 'application/pdf'
                    });
                    var _pdfurl = URL.createObjectURL(blob);
                    jQuery.sap.addUrlWhitelist("blob");
                    this.opdfViewer.setSource(_pdfurl);
                    this.opdfViewer.setTitle(fileName);
                    this.opdfViewer.open();
                } else {
                    if (this.oPopover) {
                        this.oPopover.destroy();
                        delete this._pPopover;
                    }

                    // create popover for image
                    if (!this._pPopover) {
                        this._pPopover = Fragment.load({
                            id: this.getView().getId(),
                            name: "pj.zpmg.view.fragments.imagePopover",
                            controller: this
                        }).then(function (oPopover) {
                            return oPopover;
                            oPopover.setModel(oModelForImage);
                        });
                    }
                    this._pPopover.then(function (oPopover) {
                        oPopover.openBy(oButton);

                        oPopover.getAggregation("content")[0].setSrc(_imageSrc.ZRFILE);
                        this.oPopover = oPopover;
                    }.bind(this));
                }

            },
            handleClose: function (oEvent) {
                oEvent.getSource().getParent().getParent().destroy();
            },
            imageDownload: function (oEvent) {
                const sURL = this.getView().getModel("oModelForImage").getData().ZRFILE;
                const imageName = this.getView().getModel("oModelForImage").getData().ZRFNAME;
                fetch(sURL)
                    .then((oResponse) => oResponse.blob())
                    .then((oBlob) => {
                        const sBlobURL = URL.createObjectURL(oBlob);
                        const oLink = document.createElement('a');
                        oLink.href = sBlobURL;
                        oLink.download = imageName;
                        oLink.target = '_blank';
                        document.body.appendChild(oLink);
                        oLink.click();
                        document.body.removeChild(oLink);
                    });
                oEvent.getSource().getParent().getParent().destroy()
            },
            //End: Upload, View and Download Attachment

            // Start: Upload Excel
            onUpload: function (oEvent) {

                this._import(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);
            },
            _import: function (file) {

                var that = this;
                var excelData = {};

                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        });



                        var tabValues = [];
                        var payload = {

                            "Pafvto": null,
                            "Kunnr": excelData[0].Customer_Code,
                            "Pafvfrm": null,
                            "Ti": "1",
                            "Gst": "18",
                            "Name": "",
                            "Action": "",
                            "Zterm": excelData[0].Payment_Term,
                            "Validity": excelData[0].Validity,
                            "Aufnr": excelData[0].Purchase_Order_No,
                            "Vtweg": excelData[0].Distribution_Channel,
                            "Vkbur": excelData[0].Sales_Office,
                            "Spart": excelData[0].Vertical,
                            "ET_SALES_COORD_ISET": {
                                "results": []
                            }
                        };
                        for (var index = 0; index < excelData.length; index++) {
                            if (excelData[index].Customer_Code) {
                                var i = index.toString();
                                var oTab = {};
                                oTab.Mfrgr = excelData[i].Material_Freight_Group;
                                oTab.Mvgr2 = excelData[i].Design;
                                oTab.Werks = excelData[i].Supplying_Plant;
                                oTab.Prodh1 = excelData[i].Manufacturing_Plant;
                                oTab.CurVolFt = excelData[i].Current_Volume;
                                oTab.TotalVol = excelData[i].Total_Volume;
                                oTab.Zzprodh4 = excelData[i].Quality;
                                oTab.Mvgr5 = excelData[i].Part_AorBorL;
                                if (!excelData[i].Ex_FACTORYorDEPOT) {
                                    oTab.Isexdep = " ";
                                } else {
                                    oTab.Isexdep = excelData[i].Ex_FACTORYorDEPOT;
                                }

                                oTab.Disc = excelData[i].On_Invoice_Discount;
                                if (excelData[0].Distribution_Channel === '19') {
                                    oTab.Commboxp = excelData[i].ORC;
                                } else {
                                    oTab.Commbox = excelData[i].ORC;
                                }
                                oTab.Frgtsqft = excelData[i].Freight;
                                oTab.Compname = excelData[i].Competitor_Name;
                                oTab.Complanprice = excelData[i].Competitor_Landed_Price;
                                oTab.Remark = excelData[i].Remark;
                                payload.ET_SALES_COORD_ISET.results.push(oTab);
                            }
                        }

                        that.getView().getModel("JSONModelPayload").setData(payload);
                        that.getView().getModel("JSONModelPayload").refresh(true);

                        that.fnResolve();
                        that.fireCalls();

                    };
                    reader.onerror = function (ex) {

                    };
                    reader.readAsBinaryString(file);

                }

            },
            fnResolve: function () {

                // get call - Get Customer Name using customer code
                var sTerm = this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpCustCode")).getValue(),
                    aFilters = [],
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = "/Kunnr",
                    sValue2 = "/Name",
                    sMessage = "Entered Customer code is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
                this.getView().setBusy(true);
                // get call - Get Size using MFG
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                var nLen = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results.length;
                [...Array(nLen)].reduce((p, _, index) =>
                    p.then(() => delay(Math.random() * 1000))
                        .then(() => {
                            if (index === nLen - 1) {
                                this.getView().setBusy(false);
                            }
                            var bindingContextPath = "/ET_SALES_COORD_ISET/results/" + index + "",
                                sValue1 = bindingContextPath + "/Mfrgr",
                                sValue2 = bindingContextPath + "/Szmm",
                                sTerm = this.getView().getModel("JSONModelPayload").getProperty(sValue1),
                                aFilters = [],
                                Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart"),
                                oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false),
                                oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                                oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false),
                                sMessage = "Entered Material Freight Group is wrong";
                            aFilters.push(oFilterDomname);
                            aFilters.push(oFilterDomname1);
                            aFilters.push(oFilterDomname2);

                            if (Division) {
                                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
                                this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None")
                            } else {
                                MessageBox.error("Please select vertical first");
                                this.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
                                this.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
                                this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error")
                            }
                        })
                    , Promise.resolve());


            },

            fireCalls: function () {


                validation.headerPayloadValidation(this);
                var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                validation.itemsPayloadValidation(aData, this, "Proceed");

                // this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLDistChannel")).fireChange();
                // this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2InpSalesOffice")).fireSubmit();
                // var aTableItems = this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2TblProducts")).getBinding('items');
                if (this.getView().getModel("JSONModelPayload").getProperty("/Vtweg") === '19') {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2LblPayTerm")).setRequired(true);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(true);
                } else {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2LblPayTerm")).setRequired(false);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(false);
                }

            },
            _submitCall: function (sTerm, aFilters, sValue1, sValue2, sMessage) {

                if (sTerm) {
                    var sPath = "/ET_VALUE_HELPSSet";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        filters: aFilters,
                        // urlParameters: {
                        //     "$expand": ""
                        // },
                        success: function (Data) {

                            if (Data.results.length === 1) {
                                if (sValue1.includes("Mvgr2")) {
                                    this.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].Ddtext);
                                } else {
                                    this.getView().getModel("JSONModelPayload").setProperty(sValue1, Data.results[0].DomvalueL);
                                }
                                if (sValue2) {
                                    this.getView().getModel("JSONModelPayload").setProperty(sValue2, Data.results[0].Ddtext);
                                }
                            } else {
                                this.getView().getModel("JSONModelPayload").setProperty(sValue1, "");
                                if (sValue2) {
                                    this.getView().getModel("JSONModelPayload").setProperty(sValue2, "");
                                }
                                MessageBox.error(sMessage)
                            }
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (sError) {
                            this.getView().setBusy(false);
                            var sErrorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                            if (sErrorMessage) {
                                MessageBox.error(sErrorMessage, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            } else {
                                MessageBox.error("Something went wrong, Please refresh browser and try again", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }
                        }.bind(this)
                    });

                }

            },
            // End: Upload Excel

            // Start: Download Excel
            //Excel export using Spreadsheet
            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId(sap.ui.core.Fragment.createId("idV2FragAddPrdDetails", "idV2TblProducts"));
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level',
                        textAlign: 'Left',
                        wrap: true,
                        context: {

                            sheetName: 'Product Details'
                        }
                    },
                    dataSource: oRowBinding,
                    count: 0,
                    fileName: 'Product Details.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service

                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            createColumnConfig: function () {
                var aCols = [];
                aCols.push({
                    property: 'CustomerCode',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'DistributionChannel',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'PaymentTerm',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'ValidityInDays',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'PurchaseOrderNo',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'SalesOffice',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'Vertical',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'MaterialFreightGroup',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'Design',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'SupplyingPlant',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'ManufacturingPlant',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'CurrentVolumeInSqft',
                    type: EdmType.String
                });
                aCols.push({
                    property: 'TotalVolumeInSqft',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'Quality',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'OnInvoiceDiscount',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'ORCByBox',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'ORCInPer',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'FreightInSqFt',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'CompetitorName',
                    type: EdmType.Number
                });

                aCols.push({
                    property: 'CompetitorLandedPrice',
                    type: EdmType.Number
                });
                aCols.push({
                    property: 'PartAorB',
                    type: EdmType.Number
                });

                return aCols;
            },
            // End: Download Excel


        });
    });
