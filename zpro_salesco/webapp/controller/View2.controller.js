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
                // var sPath = "/ET_VALUE_HELPSSet";

                // var aFilter = [];
                // var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false);
                // var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, "LARS")], false);
                // // var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                // aFilter.push(oFilterDomname);
                // aFilter.push(oFilterDomname1);

                // this.getView().setBusy(true);
                // this.getView().getModel().read(sPath, {
                //     filters: aFilter,
                //     // urlParameters: {
                //     //     "$expand": ""
                //     // },
                //     success: function (Data) {
                //       
                //         var JSONModelForSuggest = new JSONModel(Data.results);
                //         this.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                //         this.getView().getModel("JSONModelForSuggest").refresh(true);
                //         this.getView().setBusy(false);
                //     }.bind(this),
                //     error: function (sError) {
                //         this.getView().setBusy(false);
                //     }.bind(this)
                // });




                var oGlobalModel = {
                    "Editable": false
                }
                var oModelGlobalModel = new JSONModel(oGlobalModel);
                this.getView().setModel(oModelGlobalModel, "GlobalModel");

                var sID = oEvent.getParameter("arguments").ID;

                if (sID === "null" || sID === undefined) {

                    this.getView().getModel("GlobalModel").setProperty("/Editable", true);
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
                    this.getView().getModel("GlobalModel").setProperty("/Editable", false);
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
                                that.getView().byId("idV2BtnEdit").setVisible(false);
                            }
                            Data.Validity = Data.Validity.replace(/^0+/, '');
                            // Disc and Discb  conversion
                            if (Data.Vtweg === '19') {

                            } else {
                                var aTableItems = Data.ET_SALES_COORD_ISET.results;
                                var nLen = aTableItems.length;
                                for (var i = 0; i < nLen; i++) {
                                    aTableItems[i].Disc = aTableItems[i].Discb;
                                    aTableItems[i].Discb = null;
                                }
                            }

                            that.getView().setModel(new JSONModel(Data), "JSONModelPayload");
                            that.getView().setBusy(false);
                        },
                        error: function (oError) {
                            that.getView().setBusy(false);
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {

                                }
                            });

                        }
                    });
                    var sPathUpload = "/ETFILE_UPLOAD_HSet('" + sID + "')";
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

                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {

                                }
                            });

                        }
                    });



                }
            },
            onEdit: function () {
                this.getView().getModel("GlobalModel").setProperty("/Editable", true);
            },

            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue"),
                    aFilters = [],
                    sPath = "/ET_VALUE_HELPSSet",
                    oFilterDomname,
                    oFilterDomname1,
                    oFilterDomname2,
                    nLen = 1;
                if (oEvent.getSource().sId.includes("idV2InpCustCode")) {
                    if (sTerm.length > 3) {
                        nLen = 1;
                    } else {
                        nLen = 0;
                    }

                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                } else if (oEvent.getSource().sId.includes("idV2InpSalesOffice")) {
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                    aFilters.push(oFilterDomname2);
                }
                // material Freight Group suggestion 
                else if (oEvent.getSource().sId.includes("idV2TblCLIInpMatFreGrp")) {
                    var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart")
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);
                    aFilters.push(oFilterDomname2);
                }
                // Design suggestion
                else if (oEvent.getSource().sId.includes("idV2TblCLIInpDesigns")) {
                    var sContextPath = oEvent.getSource().getParent().getBindingContextPath();
                    var Mfrgr = this.getView().getModel("JSONModelPayload").getContext(sContextPath).getProperty("Mfrgr");
                    var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart");
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false);
                    aFilters.push(oFilterDomname2);
                }
                // Supply plant suggestion
                else if (oEvent.getSource().sId.includes("idV2TblCLIInpSuppPlant")) {
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                    aFilters.push(oFilterDomname2);
                }
                // Manufacturing plant suggestion
                else if (oEvent.getSource().sId.includes("idV2TblCLIInpManPlant")) {
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false);
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false);
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, "")], false);
                    aFilters.push(oFilterDomname2);
                }

                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);

                if (sTerm && nLen === 1) {
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        filters: aFilters,
                        success: function (Data) {

                            if (Data.results.length > 0) {
                                var JSONModelForSuggest = new JSONModel(Data.results);
                                this.getView().setModel(JSONModelForSuggest, "JSONModelForSuggest");
                                this.getView().getModel("JSONModelForSuggest").refresh(true);
                            }
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (sError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });

                }
            },
            // Submit action - Customer code
            onCustomerCodeInputSubmit: function (oEvent) {

                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = "/Kunnr",
                    sValue2 = "/Name",
                    sMessage = "Entered Customer code is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },
            // Submit action - Sales Office
            onSalesOfficeInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = "/Vkbur",
                    sValue2 = "",
                    sMessage = "Entered Sales Office is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                // aFilters.push(oFilterDomname2);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },
            // Submit action - Material Freight Group
            onMaterialFreightGroupInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart"),
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false),
                    bindingContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                    sValue1 = bindingContextPath + "/Mfrgr",
                    sValue2 = bindingContextPath + "/Szmm",
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

            },
            // Submit action - Designs
            onDesignsInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    sContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                    Mfrgr = this.getView().getModel("JSONModelPayload").getContext(sContextPath).getProperty("Mfrgr"),
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false),
                    sValue1 = sContextPath + "/Mvgr2",
                    sValue2 = "",
                    sMessage = "Entered Design is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                aFilters.push(oFilterDomname2);
                if (Mfrgr) {
                    this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
                } else {
                    MessageBox.error("Please select Material Frieght Group first");
                    this.getView().getModel("JSONModelPayload").setProperty(sValue1, "");

                }

            },
            // Submit action - Supply plant
            onSupplyPlantInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    sContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = sContextPath + "/Werks",
                    sValue2 = "",
                    sMessage = "Entered Supply Plant is wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },
            // Submit action - Manufacturing Plant
            onManufacturingPlantInputSubmit: function (oEvent) {
                var sTerm = oEvent.getParameter("value"),
                    aFilters = [],
                    sContextPath = oEvent.getSource().getParent().getBindingContextPath(),
                    oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false),
                    oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sTerm)], false),
                    sValue1 = sContextPath + "/Prodh1",
                    sValue2 = "",
                    sMessage = "Entered Manufacturing Plantis wrong";
                aFilters.push(oFilterDomname);
                aFilters.push(oFilterDomname1);
                this._submitCall(sTerm, aFilters, sValue1, sValue2, sMessage);
            },

            // Common function for all submit calls
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
                        }.bind(this)
                    });

                }

            },

            onDistributionChannelChange: function (oEvent) {

                this.getView().getModel("JSONModelPayload").setProperty("/Zterm", "");
                var vGetSelectedValue = oEvent.getSource().getSelectedKey();
                if (vGetSelectedValue === "11" || vGetSelectedValue === "17") {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(false);
                    MessageToast.show("Enter 'On-Invoice discount' in Amount");
                } else {
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLPaymentTerm")).setEnabled(true);
                    MessageToast.show("Enter 'On-Invoice discount' in Percentage");
                }
            },

            onCancel: function () {

                var that = this;
                MessageBox.confirm("Are you sure you want to cancel?", {
                    actions: ["Yes", "No"],
                    onClose: function (oAction) {
                        if (oAction === "Yes") {
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteMain", {});
                        } else {

                        }
                    }.bind(this)
                });
            },

            onClear: function () {
                var JSONData = {
                    "Isexdep": "",
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
                            "Zzprodh4": "",
                            "Mvgr5": ""
                        }]
                    }
                }
                this.getView().getModel("JSONModelPayload").setData(JSONData);
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("RouteMain", {});

            },

            _getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18nV2").getResourceBundle();
            },

            onNumberValidation: function (oEvent) {
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
            onAddRow: function () {


                var headerValidationStatus = validation.headerPayloadValidation(this);
                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Adding new line");
                    if (itemValidationStatus === 1) {
                        var JSONData = this.getView().getModel("JSONModelPayload").getData();
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
                            "Frgtsqft": "",
                            "Compname": null,
                            "Complanprice": null,
                            "Zzprodh4": "",
                            "Mvgr5": ""
                        });
                        this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));
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
            // Customer Code Plant
            onCustomerCodeHelp: function () {
                valueHelps.onCustomerCodeHelp(this);
            },
            // Sales Office
            onSalesOfficeHelp: function () {
                valueHelps.onSalesOfficeHelp(this);
            },
            // Material Freight Group
            onMaterialFreightGroupsHelp: function (oEvent) {
                var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart");
                if (Division) {
                    this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
                    valueHelps.onMaterialFreightGroupsHelp(this, Division);
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("None")
                } else {
                    MessageBox.error("Please select vertical first");
                    this.byId(sap.ui.core.Fragment.createId("idV2FragGenInfo", "idV2SLVertical")).setValueState("Error")
                }
            },
            // Sizes
            onSizesHelp: function (oEvent) {
                valueHelps.onSizesHelp(this);
            },
            // Designs 
            onDesignsHelp: function (oEvent) {

                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var Mfrgr = this.getView().getModel("JSONModelPayload").getContext(sPath).getProperty("Mfrgr");
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Mvgr2";
                if (Mfrgr) {
                    valueHelps.onDesignsHelp(this, Mfrgr);
                } else {
                    MessageBox.error("Please select 'Material Freight Group' first");
                }
            },
            // Supply Plant
            onSupplyPlantHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Werks";
                valueHelps.onSupplyPlantHelp(this);
            },
            // Manufacturing Amount
            onManufacturingAmtHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Prodh1";
                valueHelps.onManufacturingAmtHelp(this);
            },

            onValueHelpSearch: function (evt) {
                var aFilter = [];
                var oFilter;

                var sValue = evt.getParameter("value");
                var sPath = "/ET_VALUE_HELPSSet";
                var oSelectDialog = sap.ui.getCore().byId(evt.getParameter('id'));

                if (evt.getParameter('id') === 'idSDCustomerCodeF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "KNA1")], false);
                } else if (evt.getParameter('id') === 'idSDSalesOfficeF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "TVKBZ")], false);
                }
                else if (evt.getParameter('id') === 'idSDMaterialFreightGroupsF4') {

                    var Division = this.getView().getModel("JSONModelPayload").getProperty("/Spart");
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
                    var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Division)], false);
                    aFilter.push(oFilterDomname2);
                }
                else if (evt.getParameter('id') === 'idSDDesignsF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
                    var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, Mfrgr)], false)
                    aFilter.push(oFilterDomname2);
                } else if (evt.getParameter('id') === 'idSDSupplyingPlantF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
                } else if (evt.getParameter('id') === 'idSDManufacturingAmountF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T179")], false);
                }


                var oFilterDomname1 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname1", sap.ui.model.FilterOperator.EQ, sValue)], false);
                aFilter.push(oFilterDomname1);
                aFilter.push(oFilterDomname);
                valueHelps.onCustomerCodeHelpSearch(oSelectDialog, aFilter, sPath, this);
            },

            onValueHelpConfirm: function (evt) {

                var oSelectedItem = evt.getParameter("selectedItem");
                valueHelps.valueHelpConfirm(oSelectedItem, this, this.bindingContextPath);
            },

            onMaterialFreightGroupsHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");

                var aModelData = this.getView().getModel("JSONModelPayload").getProperty("/ET_SALES_COORD_ISET/results");
                var bindingContextPathMFG = this.bindingContextPath + "/Mfrgr";
                var bindingContextPathSize = this.bindingContextPath + "/Szmm";
                for (var i = 0; i < aModelData.length; i++) {
                    if (sSelectedValue === aModelData[i].Mfrgr && i != Number(this.bindingContextPath.split("/")[3])) {
                        MessageBox.error(sSelectedValue + " this 'Material Freigth Group' already selected");

                        this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, "");
                        this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, "");
                        i = aModelData.length;
                    } else {
                        this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, sSelectedValue);
                        var aFilter = [];
                        var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SIZE")], false);
                        var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, sSelectedValue)], false);
                        aFilter.push(oFilterDomname);
                        aFilter.push(oFilterDomname2);
                        var sPath = "/ET_VALUE_HELPSSet"
                        var that = this;
                        this.getView().setBusy(true);
                        this.getView().getModel().read(sPath, {
                            filters: aFilter,
                            // urlParameters: {
                            //     "$expand": ""
                            // },
                            success: function (Data) {
                                that.getView().setBusy(false);
                                that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, Data.results[0].Ddtext);
                            },
                            error: function (oError) {
                                that.getView().setBusy(false);
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }
                        });
                    }
                    // }
                }




            },

            onDesignsHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },
            onSupplyPlantHelpConfirm(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },
            onManufacturingAmtHelpConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("JSONModelPayload").setProperty(this.bindingContextPath, sSelectedValue);
            },



            onRadioButtonGroupSelect: function (oEvent) {
                if (oEvent.getSource().getSelectedIndex() === 0) {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "F";
                } else {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "D";

                }
            },

            onSave: function () {


                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Save");
                    if (itemValidationStatus === 1) {

                        this.getView().getModel("JSONModelPayload").getData().Action = "SAVE";

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
                                    that.getView().getModel("ZFILE_UPLOAD_SRV_01").create(sPathUpload, _attachmentPayload, {
                                        async: false,
                                        success: function (Data) {
                                            MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno.replace(/^0+/, '') + "", {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                    window.location.reload();
                                                }
                                            });
                                        },
                                        error: function (oError) {

                                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno + "", {
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {
                                            window.location.reload();
                                        }
                                    });
                                }

                            },
                            error: function (oError) {
                                MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }
                        });
                    }
                }
            },

            onGenerate: function () {
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

                        if (this.getView().getModel("JSONModelPayload").getData().Vtweg === '19') {

                        } else {
                            var aTableItems = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                            var nLen = aTableItems.length;
                            for (var i = 0; i < nLen; i++) {
                                aTableItems[i].Discb = aTableItems[i].Disc;
                                aTableItems[i].Disc = null;
                            }
                        }

                        var that = this;
                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        this.getView().setBusy(true);

                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {

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

                                that.getView().getModel("JSONModelPayload").setData(oData)
                                that.getView().getModel("JSONModelPayload").refresh(true);

                                that.getView().getModel("GlobalModel").setProperty("/Editable", false);
                                that.getView().getModel("GlobalModel").refresh(true);

                                that.getView().byId("idV2Bar").setVisible(true);
                                that.getView().byId("idV2BtnSave").setVisible(true);


                                that.getView().setBusy(false);
                            },
                            error: function (oError) {
                                that.getView().setBusy(false);
                                that.getView().byId("idV2BtnSave").setVisible(false);
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value, {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                    }
                                });
                            }
                        });

                        this._displaySummaryDetails();
                    }
                }

            },

            _displaySummaryDetails: function () {
                var vInvoiceDiscount = 0;
                var vSchemeDiscount = 0;
                var vFreightDiscount = 0;
                var vPayTermDiscount = this.getView().getModel("JSONModelPayload").getData().Zterm;
                var aItemsData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISET.results;
                for (let index = 0; index < aItemsData.length; index++) {
                    // Disc and Discb conversion

                    if (aItemsData[index].Disc === null || aItemsData[index].Disc === '0.00' || aItemsData[index].Disc === '') {
                        vInvoiceDiscount = vInvoiceDiscount + Number(aItemsData[index].Discb);
                    } else {
                        vInvoiceDiscount = vInvoiceDiscount + Number(aItemsData[index].Disc);
                    }
                    vSchemeDiscount = vSchemeDiscount + Number(aItemsData[index].Schemedisc);
                    vFreightDiscount = vFreightDiscount + Number(aItemsData[index].Frgtsqft)
                }
                vInvoiceDiscount = vInvoiceDiscount / aItemsData.length;
                vSchemeDiscount = vSchemeDiscount / aItemsData.length;
                vFreightDiscount = vFreightDiscount / aItemsData.length;
                if (vInvoiceDiscount === NaN || vInvoiceDiscount === 0 || vInvoiceDiscount === '') {
                    vInvoiceDiscount = 'Not Available'
                }
                if (vSchemeDiscount === NaN || vSchemeDiscount === 0 || vSchemeDiscount === '') {
                    vSchemeDiscount = 'Not Available'
                }
                if (vFreightDiscount === NaN || vFreightDiscount === 0 || vFreightDiscount === '') {
                    vFreightDiscount = 'Not Available'
                }
                if (vPayTermDiscount === NaN || vPayTermDiscount === 0 || vPayTermDiscount === '') {
                    vPayTermDiscount = 'Not Available'
                }
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpInvcDis")).setValue(vInvoiceDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpSchDis")).setValue(vSchemeDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpfraightCost")).setValue(vFreightDiscount.toString());
                this.byId(sap.ui.core.Fragment.createId("idV2FragSumDeatil", "idV2InpPayTermDis")).setValue(vPayTermDiscount.toString());
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
                            name: "zpj.pro.sk.sd.salescoordinator.zprosalesco.view.fragments.View2.imagePopover",
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
                            "Isexdep": "",
                            "Pafvto": null,
                            "Kunnr": excelData[0].CustomerCode,
                            "Pafvfrm": null,
                            "Ti": "1",
                            "Gst": "18",
                            "Name": "",
                            "Action": "",
                            "Zterm": excelData[0].PaymentTerm,
                            "Validity": excelData[0].ValidityInDays,
                            "Aufnr": excelData[0].PurchaseOrderNo,
                            "Vtweg": excelData[0].DistributionChannel,
                            "Vkbur": excelData[0].SalesOffice,
                            "Spart": excelData[0].Vertical,
                            "ET_SALES_COORD_ISET": {
                                "results": []
                            }
                        };
                        for (var index = 0; index < excelData.length; index++) {
                            var i = index.toString();
                            var oTab = {};
                            oTab.Mfrgr = excelData[i].MaterialFreightGroup;
                            oTab.Mvgr2 = excelData[i].Design;
                            oTab.Werks = excelData[i].SupplyingPlant;
                            oTab.Prodh1 = excelData[i].ManufacturingPlant;
                            oTab.CurVolFt = excelData[i].CurrentVolumeInSqft;
                            oTab.TotalVol = excelData[i].TotalVolumeInSqft;
                            oTab.Zzprodh4 = excelData[i].Quality;
                            oTab.Disc = excelData[i].OnInvoiceDiscount;
                            oTab.Commbox = excelData[i].ORCByBox;
                            oTab.Commboxp = excelData[i].ORCInPer;
                            oTab.Frgtsqft = excelData[i].FreightInSqFt;
                            oTab.Compname = excelData[i].CompetitorName;
                            oTab.Complanprice = excelData[i].CompetitorLandedPrice;
                            oTab.Mvgr5 = excelData[i].PartAorB;
                            payload.ET_SALES_COORD_ISET.results.push(oTab);
                        }

                        that.getView().getModel("JSONModelPayload").setData(payload);
                        that.getView().getModel("JSONModelPayload").refresh(true);

                        that.fnResolve();

                    };
                    reader.onerror = function (ex) {

                    };
                    reader.readAsBinaryString(file);

                }

            },
            fnResolve: function () {
                // Come back here
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
