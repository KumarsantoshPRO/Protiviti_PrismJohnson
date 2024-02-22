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
                        "orderNo" : "RN123456801",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0T0003",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0T0008",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "AP0S0191",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajesh Gupta",
                        "custId" : "MH0H0002",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "RJ0S0017",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharm",
                        "custId" : "TN0K0029",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "UP0K0004",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "HR0S0026",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456810",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "BH0J0001",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456811",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "MH0R0026",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456812",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "WB0D0007",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    },
                    {
                        "orderNo" : "RN123456813",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "DL0K0009",
                        "orderTotal" : "250",
                        "orderCur" : "120",
                        "reqDate" : "10 Oct 2023",
                        "status" : "Pending"
                    }
                ]);
                this.getView().setModel(oRequestModel, "RequestModel");
                },
                getPendingData: function() {
                        var oPendingModel = new JSONModel([
                            {
                                "orderNo" : "RN123456801",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharma",
                                "custId" : "TN0S0117",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456802",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "TN0T0003",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456803",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "TN0T0008",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456804",
                                "region" : "NI-Chandigarh",
                                "customer" : "Mohit Rajput",
                                "custId" : "AP0S0191",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456805",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rajesh Gupta",
                                "custId" : "MH0H0002",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456806",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "RJ0S0017",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456807",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharm",
                                "custId" : "TN0K0029",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456808",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "UP0K0004",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456809",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "HR0S0026",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456810",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharma",
                                "custId" : "BH0J0001",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456811",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "MH0R0026",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456812",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "WB0D0007",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456813",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "DL0K0009",
                                "orderTotal" : "250",
                                "orderCur" : "120",
                                "reqDate" : "10 Oct 2023",
                                "status" : "Pending"
                            },
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
