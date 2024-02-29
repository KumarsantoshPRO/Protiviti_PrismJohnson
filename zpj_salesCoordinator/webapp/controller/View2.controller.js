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
                // local JSON models

                var dataModelValueHelp = this.getOwnerComponent().getModel("valueHelp").getData();
                this.getView().setModel(new JSONModel(dataModelValueHelp), "LocalJSONModels");
                this.bindingContextPath;
                // End: Santosh Changes

            },

            onRouteMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").ID;

                if (sID === "null" || sID === undefined) {
                    //Start: Santosh changes
                    // payload for OData service
                    var dataModelPayload = this.getOwnerComponent().getModel("payload").getData();
                    dataModelPayload.header.ET_SALES_COORD_ISet.results.push(dataModelPayload.item);
                    this.getView().setModel(new JSONModel(dataModelPayload.header), "JSONModelPayload");

                    // var that = this;
                    // var sPath = jQuery.sap.getModulePath("prj/salescoordinator", "/model/payload.json");
                    // var oModelPayload = new JSONModel(sPath);
                    // oModelPayload.attachRequestCompleted(function (oEvent) {
                    //     var oModel = oEvent.getSource();
                    //     that.oLocalJSONPayload = oModel.getData();
                    //     that.oLocalJSONPayload.header.ET_SALES_COORD_ISet.push(that.oLocalJSONPayload.item);

                    //     oModelPayload = new JSONModel(that.oLocalJSONPayload.header);
                    //     that.getView().setModel(oModelPayload, "JSONModelPayload");

                    // });
                    //End: Santosh changes
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
                debugger;
                var that = this;
                // this.getView().getModel("GlobalModel").setProperty("/Editable", false);
                MessageBox.confirm("Are you sure you want to cancel?", {
                    actions: ["Yes", "No"],
                    onClose: function (oAction) {
                        if (oAction === "Yes") {
                            // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                            // navigator.toExternal({
                            //     target: {
                            //         semanticObject: "#"
                            //     }
                            // });
                            var oRouter = that.getOwnerComponent().getRouter();
                            oRouter.navTo("page1", {});
                        } else {

                        }
                    }
                });
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

            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            onNumberValidation: function (oEvent) {
                var value = Number(oEvent.getSource().getValue());
                if (isNaN(value)) {
                    MessageBox.error("Only numeric values allowed");
                    oEvent.getSource().setValue("");
                } else if (value > 99) {
                    MessageBox.error("Please enter value less than 100");
                    oEvent.getSource().setValue("");
                }

            },
            onOrcEntityChange: function (oEvent) {

                // var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
                // this.getView().getModel("JSONModelPayload").getContext(sPath).getObject();
                oEvent.getSource().getParent().getParent().getAggregation("cells")[12].getAggregation("items")[0].setValue("");
                oEvent.getSource().getParent().getParent().getAggregation("cells")[12].getAggregation("items")[0].setEditable(false);
            },
            onOrcPercentageChange: function (oEvent) {

                // var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
                // this.getView().getModel("JSONModelPayload").getContext(sPath).getObject();
                oEvent.getSource().getParent().getParent().getAggregation("cells")[11].getAggregation("items")[0].setValue("");
                oEvent.getSource().getParent().getParent().getAggregation("cells")[11].getAggregation("items")[0].setEditable(false);
            },
            onAddRow: function () {

                var headerValidationStatus = validation.headerPayloadValidation(this);
                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISet.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Adding new line");
                    if (itemValidationStatus === 1) {
                        var JSONData = this.getView().getModel("JSONModelPayload").getData();

                        // JSONData.items.push(this.oLocalJSONPayload.item);
                        JSONData.ET_SALES_COORD_ISet.results.push({
                            "Mfrgr": "",
                            "Szmm": "",
                            "Mvgr2": "",
                            "Werks": "",
                            "Prodh1": "",
                            "CurrentVol": "10",
                            "TotalVol": "10",
                            "Disc": "10",
                            "Schemedisc": "10",
                            "Commbox": "10",
                            "Commboxp": "10",
                            "Frgtbx": "10",
                            "Compname": "ABC",
                            "Complanprice": "10",
                            "Zzprodh4": "",
                            "Mvgr5": ""
                        });
                        this.getView().getModel("JSONModelPayload").setData(JSON.parse(JSON.stringify(JSONData)));
                    }
                }
                // this.getView().getModel("JSONModelPayload").refresh(true);


                // var oTable = this.getView().byId("idTblProducts");
                // var cell = oTable.getAggregation("items")[0].getAggregation("cells");


                // 
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
            onMaterialFreightGroupsHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath();
                valueHelps.onMaterialFreightGroupsHelp(this);
            },
            // Sizes
            onSizesHelp: function (oEvent) {
                valueHelps.onSizesHelp(this);
            },
            // Designs 
            onDesignsHelp: function (oEvent) {
                this.bindingContextPath = oEvent.getSource().getParent().getBindingContextPath() + "/Mvgr2";
                valueHelps.onDesignsHelp(this);
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
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZPRICECAT")], false);
                }
                else if (evt.getParameter('id') === 'idSDDesignsF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "ZMATSOURCE")], false);
                } else if (evt.getParameter('id') === 'idSDSupplyingPlantF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
                } else if (evt.getParameter('id') === 'idSDManufacturingAmountF4') {
                    var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "T001W")], false);
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
                var bindingContextPathMFG = this.bindingContextPath + "/Mfrgr";
                var bindingContextPathSize = this.bindingContextPath + "/Szmm";
                this.getView().getModel("JSONModelPayload").setProperty(bindingContextPathMFG, sSelectedValue);
                var aFilter = [];
                var oFilterDomname = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, "SIZE")], false);
                var oFilterDomname2 = new sap.ui.model.Filter([new sap.ui.model.Filter("Domname2", sap.ui.model.FilterOperator.EQ, sSelectedValue)], false);
                aFilter.push(oFilterDomname);
                aFilter.push(oFilterDomname2);
                var sPath = "/ET_VALUE_HELPSSet"
                var that = this;

                this.getView().getModel().read(sPath, {
                    filters: aFilter,
                    // urlParameters: {
                    //     "$expand": ""
                    // },
                    success: function (Data) {
                        that.getView().getModel("JSONModelPayload").setProperty(bindingContextPathSize, Data.results[0].Ddtext);
                    },
                    error: function (sError) {

                    }
                });
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
                // selectedIndex


                if (oEvent.getSource().getSelectedIndex() === 0) {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "X";
                } else {
                    this.getView().getModel("JSONModelPayload").getData().Isexdep = "X";

                }
            },
            onSave: function () {
                debugger;

                var headerValidationStatus = validation.headerPayloadValidation(this);

                if (headerValidationStatus === 1) {
                    var aData = this.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISet.results;
                    var itemValidationStatus = validation.itemsPayloadValidation(aData, this, "Save");
                    if (itemValidationStatus === 1) {
                        if (this.getView().getModel("JSONModelPayload").getData().Action !== "GENERATE") {
                            this.getView().getModel("JSONModelPayload").getData().Action = "SAVE";
                        }
                        var sPath = "/ET_SALES_COORD_HEADERSet";
                        this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                            async: false,
                            success: function (oData) {
                                MessageBox.success("Request saved successfully with PAF Number:" + oData.Pafno + "", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {

                                        // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                        // navigator.toExternal({
                                        //     target: {
                                        //         semanticObject: "#"
                                        //     }
                                        // });
                                        window.location.reload();
                                    }
                                });
                            },
                            error: function (sError) {
                                MessageBox.error("Request creation failed", {
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                        // var navigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                        // navigator.toExternal({
                                        //     target: {
                                        //         semanticObject: "#"
                                        //     }
                                        // });

                                        window.location.reload()
                                    }
                                });
                            }
                        });
                    }
                }
                // this.getView().getModel("JSONModelForItems").getData();
            },
            onGenerate: function () {

                this.getView().getModel("JSONModelPayload").getData().Action = "GENERATE";
                // var oGeneratePostHeader = JSON.parse(JSON.stringify(this.getView().getModel("JSONModelPayload").getData()));
                // oGeneratePostHeader.ET_SALES_COORD_ISet = [];
                // var oGenratePostItems = {
                //     "Kunnr": "",
                //     "Mfrgr": "",
                //     "Szcm": "",
                //     "Werks": "",
                //     "Zzprodh4": "",
                //     "Prodh1": "",
                //     "CurrentVol": "",
                //     "Exdep": "",
                //     "Commbox": "",
                //     "Commboxp": ""
                // };
                // oGeneratePostHeader.ET_SALES_COORD_ISet.push(oGenratePostItems);

                var that = this;
                var sPath = "/ET_SALES_COORD_HEADERSet";
                this.getView().getModel().create(sPath, this.getView().getModel("JSONModelPayload").getData(), {
                    async: false,
                    success: function (oData) {

                        that.getView().getModel("JSONModelPayload").setData(oData)
                        // that.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISet = [];
                        // that.getView().getModel("JSONModelPayload").getData().ET_SALES_COORD_ISet = oData.ET_SALES_COORD_ISet.results;

                        that.getView().getModel("JSONModelPayload").refresh(true);
                        that.getView().byId("idV2BtnSave").setVisible(true);
                    },
                    error: function (sError) {

                        that.getView().byId("idV2BtnSave").setVisible(true);
                    }
                });


            },


            //End: Santosh Changes

        });
    });
