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
    'prj/salescoordinator/utils/View2/valueHelps',
    'prj/salescoordinator/utils/View2/validation'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, IconPool, Icon, Link, MessageItem, MessageView, Button, Bar, Title, Popover, MessageBox, valueHelps, validation) {
        "use strict";

        return Controller.extend("prj.salescoordinator.controller.View2", {

            onInit: function () {

                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
                this.getData();



                var that = this;
                var oLink = new Link({
                    text: "Show more information",
                    href: "http://sap.com",
                    target: "_blank"
                });

                var oMessageTemplate = new MessageItem({
                    type: '{type}',
                    title: '{title}',
                    description: '{description}',
                    subtitle: '{subtitle}',
                    counter: '{counter}',
                    markupDescription: "{markupDescription}",
                    link: oLink
                });

                var aMockMessages = [{
                    type: 'Error',
                    title: 'Error message',
                    description: 'First Error message description. \n' +
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }, {
                    type: 'Warning',
                    title: 'Warning without description',
                    description: ''
                }, {
                    type: 'Success',
                    title: 'Success message',
                    description: 'First Success message description',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }, {
                    type: 'Error',
                    title: 'Error message',
                    description: 'Second Error message description',
                    subtitle: 'Example of subtitle',
                    counter: 2
                }, {
                    type: 'Information',
                    title: 'Information message',
                    description: 'First Information message description',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }];

                var oModel = new JSONModel(),
                    that = this;

                oModel.setData(aMockMessages);

                this.oMessageView = new MessageView({
                    showDetailsPageHeader: false,
                    itemSelect: function () {
                        oBackButton.setVisible(true);
                    },
                    items: {
                        path: "/",
                        template: oMessageTemplate
                    }
                });
                var oBackButton = new Button({
                    icon: IconPool.getIconURI("nav-back"),
                    visible: false,
                    press: function () {
                        that.oMessageView.navigateBack();
                        that._oPopover.focus();
                        this.setVisible(false);
                    }
                });

                this.oMessageView.setModel(oModel);

                var oCloseButton = new Button({
                    text: "Close",
                    press: function () {
                        that._oPopover.close();
                    }
                }).addStyleClass("sapUiTinyMarginEnd"),
                    oPopoverFooter = new Bar({
                        contentRight: oCloseButton
                    }),
                    oPopoverBar = new Bar({
                        contentLeft: [oBackButton],
                        contentMiddle: [
                            new Title({ text: "Messages" })
                        ]
                    });

                this._oPopover = new Popover({
                    customHeader: oPopoverBar,
                    contentWidth: "440px",
                    contentHeight: "440px",
                    verticalScrolling: false,
                    modal: true,
                    content: [this.oMessageView],
                    footer: oPopoverFooter
                });
                //Start: Santosh changes
                // payload for OData service
                var that = this;
                var sPath = jQuery.sap.getModulePath("prj/salescoordinator", "/model/payload.json");
                var oModelPayload = new JSONModel(sPath);
                oModelPayload.attachRequestCompleted(function (oEvent) {
                    var oModel = oEvent.getSource();
                    that.oLocalJSONPayload = oModel.getData();
                    that.oLocalJSONPayload.header.items.push(that.oLocalJSONPayload.item);

                    var oModelPayload = new JSONModel(that.oLocalJSONPayload.header);
                    that.getView().setModel(oModelPayload, "JSONModelPayload");
                    // var JSONStructureForItem = { "item": [that.oLocalJSONPayload.item] };
                    // debugger;
                    // that.oModelItemPayload = new JSONModel(JSONStructureForItem);
                    // that.getView().setModel(that.oModelItemPayload, "JSONModelForItems");

                });

                // local JSON models
                var sPath = jQuery.sap.getModulePath("prj/salescoordinator", "/model/localJSONData.json");
                var oLocalJSONModel = new JSONModel(sPath);
                oLocalJSONModel.attachRequestCompleted(function (oEvent) {
                    var oLocalModels = oEvent.getSource();
                    var dataLocalModels = oLocalModels.getData();
                    that.getView().setModel(new JSONModel(dataLocalModels), "LocalJSONModels");
                     

                });

                // End: Santosh Changes

            },

            onRouteMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").ID;
                console.log(sID);
                if (sID === "null" || sID === undefined) {
                    var oGlobalModel = new JSONModel({
                        Editable: true,
                        create: true,
                        ID: ""
                    });
                    this.getView().setModel(oGlobalModel, "GlobalModel");
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Generate New Request");
                } else {
                    var oGlobalModel = new JSONModel({
                        Editable: false,
                        create: false,
                        ID: ""
                    });
                    this.getView().setModel(oGlobalModel, "GlobalModel");

                    // this.getView().getModel("oCusModel").setProperty("/Editable", false);
                    this.getView().byId("ObjectPageLayout").getHeaderTitle().setObjectTitle("Display Request Details");
                    this.getRequestData(sID);
                }
            },




            getRequestData: function (sVendr) {
                var oGlobalModel = this.getView().getModel("GlobalModel");
                oGlobalModel.setData({
                    "Editable": false,
                    "create": false,
                    "ID": "",
                    "orderNo": "RN123456801",
                    "region": "NI-Chandigarh",
                    "customer": "Aman Sharma",
                    "custId": "TN0S0117",
                    "orderType": "Retail",
                    "orderTotal": "45,000",
                    "orderCur": "20,000",
                    "reqDate": "10 Oct 2023",
                    "discountPer": "9%",
                    "status": "On Going",
                    "payterm": "Cash",
                    "SalesOfc": "Office 1",
                    "disChanl": "Channel 1",
                    "validity": "5",
                    "invoiceDis": "70",
                    "invoicePer": "25%",
                    "fraightCost": "1000",
                    "schemeVal": "-",
                    "schemePer": "-",
                    "payVal": "10",
                    "payPer": "4%"
                });
                this.getView().setModel(oGlobalModel, "GlobalModel");
            },
            // if(ID === orderNo)

            onEdit: function () {
                this.getView().getModel("GlobalModel").setProperty("/Editable", true);
            },

            onCancel: function () {
                this.getView().getModel("GlobalModel").setProperty("/Editable", false);
            },

            onBack: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page1", {});
            },

            getData: function () {

                var oGetDataModel = new JSONModel([
                    {
                        "customer": "Aman Sharma",
                        "custId": "TN0S0117",
                        "source": "Online",
                        "payterm": "Cash",
                        "validity": "1",
                        "orderNo": "RN123456801",
                        "orderType": "Retail",
                        "remark": "Cash 4%",
                        "material": "OFJA3045",
                        "size": "300x300",
                        "design": "CARGO FLOOR MATT REC",
                        "curVol": "2000",
                        "totalVol": "200",
                        "exFactory": "200",
                        "onInvoice": "22%",
                        "crcEntry": "202.5",
                        "crcPer": "280",
                        "invoiceDis": "70",
                        "invoicePer": "25%",
                        "fraightCost": "1000",
                        "schemeVal": "-",
                        "schemePer": "-",
                        "payVal": "10",
                        "payPer": "4%",
                        "scmDiscnt": "1.4",
                        "scmPercent": "12%",
                        "orcEntity": "1.2",
                        "orcPercent": "32",
                        "freightSqft": "Yes",
                        "competatorName": "First Competator",
                        "competatorLandedPrice": "223",
                    },
                    {
                        "customer": "Aman Sharma",
                        "custId": "TN0S0117",
                        "source": "Online",
                        "payterm": "Cash",
                        "validity": "1",
                        "orderNo": "RN123456801",
                        "orderType": "Retail",
                        "remark": "Cash 4%",
                        "material": "OFJA3045",
                        "size": "300x300",
                        "design": "CARGO FLOOR MATT REC",
                        "curVol": "2000",
                        "totalVol": "200",
                        "exFactory": "200",
                        "onInvoice": "22%",
                        "crcEntry": "202.5",
                        "crcPer": "280",
                        "invoiceDis": "70",
                        "invoicePer": "25%",
                        "fraightCost": "1000",
                        "schemeVal": "-",
                        "schemePer": "-",
                        "payVal": "10",
                        "payPer": "4%",
                        "scmDiscnt": "1.4",
                        "scmPercent": "12%",
                        "orcEntity": "1.2",
                        "orcPercent": "32",
                        "freightSqft": "Yes",
                        "competatorName": "First Competator",
                        "competatorLandedPrice": "223",
                    },
                    {
                        "customer": "Aman Sharma",
                        "custId": "TN0S0117",
                        "source": "Online",
                        "payterm": "Cash",
                        "validity": "1",
                        "orderNo": "RN123456801",
                        "orderType": "Retail",
                        "remark": "Cash 4%",
                        "material": "OFJA3045",
                        "size": "300x300",
                        "design": "CARGO FLOOR MATT REC",
                        "curVol": "2000",
                        "totalVol": "200",
                        "exFactory": "200",
                        "onInvoice": "22%",
                        "crcEntry": "202.5",
                        "crcPer": "280",
                        "invoiceDis": "70",
                        "invoicePer": "25%",
                        "fraightCost": "1000",
                        "schemeVal": "-",
                        "schemePer": "-",
                        "payVal": "10",
                        "payPer": "4%",
                        "scmDiscnt": "1.4",
                        "scmPercent": "12%",
                        "orcEntity": "1.2",
                        "orcPercent": "32",
                        "freightSqft": "Yes",
                        "competatorName": "First Competator",
                        "competatorLandedPrice": "223",

                    },
                    {
                        "customer": "Aman Sharma",
                        "custId": "TN0S0117",
                        "source": "Online",
                        "payterm": "Cash",
                        "validity": "1",
                        "orderNo": "RN123456801",
                        "orderType": "Retail",
                        "remark": "Cash 4%",
                        "material": "OFJA3045",
                        "size": "300x300",
                        "design": "CARGO FLOOR MATT REC",
                        "curVol": "2000",
                        "totalVol": "200",
                        "exFactory": "200",
                        "onInvoice": "22%",
                        "crcEntry": "202.5",
                        "crcPer": "280",
                        "invoiceDis": "70",
                        "invoicePer": "25%",
                        "fraightCost": "1000",
                        "schemeVal": "-",
                        "schemePer": "-",
                        "payVal": "10",
                        "payPer": "4%",
                        "scmDiscnt": "1.4",
                        "scmPercent": "12%",
                        "orcEntity": "1.2",
                        "orcPercent": "32",
                        "freightSqft": "Yes",
                        "competatorName": "First Competator",
                        "competatorLandedPrice": "223",

                    }
                ]);
                this.getView().setModel(oGetDataModel, "oRequestModel");
            },

            handleMessages: function (oEvent) {
                this.oMessageView.navigateBack();
                this._oPopover.openBy(oEvent.getSource());
            },

            //Start: Santosh Changes
            onAddRow: function () {


                var aData = this.getView().getModel("JSONModelPayload").getData().items;
                var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Adding new line");
                if (itemValidationStatus === 1) {
                    var JSONData = this.getView().getModel("JSONModelPayload").getData();

                    // JSONData.items.push(this.oLocalJSONPayload.item);
                    JSONData.items.push({
                        "CURRENTV": "",
                        "CURVOLFT": "",
                        "KUNNR": "",
                        "LANDEDP": "",
                        "MFRGR": "",
                        "NEF": "",
                        "SZCM": "",
                        "WERKS": "",
                        "ZZPRODH4": "",
                        "PRODH1": "",
                        "VKBUR": "",
                        "PAFVFRM": "",
                        "PAFVTO": "",
                        "ERNAM": "",
                        "ERDAT": "",
                        "ERZET": "",
                        "LOEKZ": "",
                        "ZDISP": "",
                        "ISEXDEP": "",
                        "ISMEGAL": "",
                        "ZTERM": "",
                        "VSART": "",
                        "MVGR2": "",
                        "MVGR5": "",
                        "COVERAGE": "",
                        "BOXES": "",
                        "NOSQ": "",
                        "EXFAC": "",
                        "EXDEP": "",
                        "MRP": "",
                        "DISC": "",
                        "DISCB": "",
                        "GST": "",
                        "FRGTBX": "",
                        "TI": "",
                        "GSTI": "",
                        "LDDBOX": "",
                        "LDDSFT": "",
                        "AGENT": "",
                        "COMMBO.": "",
                        "COMPTRSFT": "",
                        "DLCOMSFT": "",
                        "NETEXB": "",
                        "NETEXSQ": "",
                        "COMMBO": "",
                        "SBPRICE": "",
                        "SPART": ""
                    });
                    this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));
                }
                // this.getView().getModel("JSONModelPayload").refresh(true);


                // var oTable = this.getView().byId("idTblProducts");
                // var cell = oTable.getAggregation("items")[0].getAggregation("cells");


                // debugger;
                // var oItem = new sap.m.ColumnListItem({
                //     cells:  cell 
                // });

                // oTable.addItem(oItem);

            },
            onDelete: function (oEvent) {

                // var oTable = oEvent.getSource().getParent().getParent();
                // oTable.removeItem(oEvent.getSource().getParent());
                var index = Number(oEvent.getSource().getId().split("-")[8]);
                var JSONData = this.getView().getModel("JSONModelPayload").getData();

                JSONData.items.splice(index, 1);
                this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));

                // this.getView().getModel("oRequestModel").getData().splice(index, 1);;
                // this.getView().getModel("oRequestModel").refresh(true);
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
            onMaterialFreightGroupsHelp: function () {
                valueHelps.onMaterialFreightGroupsHelp(this);
            },
            // Sizes
            onSizesHelp: function () {
                valueHelps.onSizesHelp(this);
            },
            // Designs 
            onDesignsHelp: function () {
                valueHelps.onDesignsHelp(this);
            },
            // Supply Plant
            onSupplyPlantHelp: function () {
                valueHelps.onSupplyPlantHelp(this);
            },
            // Manufacturing Amount
            onManufacturingAmtHelp: function () {
                valueHelps.onManufacturingAmtHelp(this);
            },

            onValueHelpSearch: function (evt) {
                var aFilter = [];
                var oFilter;

                var sValue = evt.getParameter("value");
                var sPath = "/ET_VALUE_HELPS";
                var oSelectDialog = sap.ui.getCore().byId(evt.getParameter('id'));

                if (evt.getParameter('id') === 'idSDCustomerCodeF4') {
                    oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, sValue)], false);
                } else if (evt.getParameter('id') === 'idSDSalesOfficeF4') {
                    oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("TVKBZ", sap.ui.model.FilterOperator.EQ, sValue)], false);
                }

                aFilter.push(oFilter);
                valueHelps.onCustomerCodeHelpSearch(oSelectDialog, aFilter, sPath, this);
            },

            onValueHelpConfirm: function (evt) {

                var oSelectedItem = evt.getParameter("selectedItem");
                valueHelps.valueHelpConfirm(oSelectedItem, this);
            },

            onSave: function () {
debugger;
                if (this.getView().getModel("JSONModelPayload").getData().ACTION !== "Generated") {
                    this.getView().getModel("JSONModelPayload").getData().ACTION = "Save";
                }


                var headerValidationStatus = validation.headerPayloadValidation(this);
                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().items;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Save");
                    if (itemValidationStatus === 1) {
                        MessageBox.success("Data is valid to send");
                    }
                }
                // this.getView().getModel("JSONModelForItems").getData();
            },
            onGenerate: function () {
                this.getView().getModel("JSONModelPayload").getData().ACTION = "Generated";
            },


            //End: Santosh Changes

        });
    });
