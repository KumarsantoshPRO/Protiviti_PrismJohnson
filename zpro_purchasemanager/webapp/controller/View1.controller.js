sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "pj/zpurchasemanager/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter) {
        "use strict";

        return Controller.extend("pj.zpurchasemanager.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.getAllRequestData();
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            
            onClickofItem: function (oEvent) {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                    {
                        ID: oEvent.getSource().getCells()[0].getText()
                    });
                //this.oRouter.navTo("page2");
            },
            onFilterSelect: function (oEvent) {
                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this.getAllRequestData();
                } else if (sKey === "Pending") {
                    this.getPendingData();
                } 
                else if (sKey === "Approved") {
                    this.getApprovedData();
                } 
                // else if (sKey === "Rejected") {
                //     this.getRejectedData();
                // } else if (sKey === "Delay") {
                //     this.getDelayData();
                // }

            },
            onOrderClicked: function() {
                this.oRouter.navTo("page2");
            },
            getAllRequestData: function() {
                var oRequestModel = new JSONModel([

                    {
                        "orderNo": "120027",
                        "region": "5100",
                        "customer": "India Tile Gallery Plot no 489,H.No",
                        "custId": "MH0I0011",
                        "Vtweg": "19",
                        "orderTotal": "1000.00",
                        "orderCur": "1000.00",
                        "Validity": "007",
                        "reqDate": "Mar 13, 2024",
                        "status": "Pending"  
                    },
                    {
                        "orderNo": "120017",
                        "region": "5200",
                        "customer": "India Tile Gallery Plot no 489,H.No",
                        "custId": "MH0I0011",
                        "Vtweg": "19",
                        "orderTotal": "1000.00",
                        "orderCur": "1000.00",
                        "Validity": "007",
                        "reqDate": "Mar 13, 2024",
                        "status": "Pending"  
                    }

              
                ]);
                this.getView().setModel(oRequestModel, "RequestModel");
                },
                getPendingData: function() {
                        var oPendingModel = new JSONModel([

                            {
                                "orderNo": "120027",
                                "region": "5100",
                                "customer": "India Tile Gallery Plot no 489,H.No",
                                "custId": "MH0I0011",
                                "Vtweg": "19",
                                "orderTotal": "1000.00",
                                "orderCur": "1000.00",
                                "Validity": "007",
                                "reqDate": "Mar 13, 2024",
                                "status": "Pending"  
                            },
                            {
                                "orderNo": "120017",
                                "region": "5200",
                                "customer": "India Tile Gallery Plot no 489,H.No",
                                "custId": "MH0I0011",
                                "Vtweg": "19",
                                "orderTotal": "1000.00",
                                "orderCur": "1000.00",
                                "Validity": "007",
                                "reqDate": "Mar 13, 2024",
                                "status": "Pending"  
                            }
        
                      
                        ]);
                this.getView().setModel(oPendingModel, "RequestModel");
            },
            getApprovedData: function() {

                var oApprovedModel = new JSONModel([]);
                this.getView().setModel(oApprovedModel, "RequestModel");
            },
            onOrderClicked: function() {
                this.oRouter.navTo("page2");
            }
        });
    });
