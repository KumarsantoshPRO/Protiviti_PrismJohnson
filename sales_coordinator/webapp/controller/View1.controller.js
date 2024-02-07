sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "prj/salescoordinator/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("prj.salescoordinator.controller.View1", {

            formatter: formatter,
            onInit: function () {
                this.getAllRequestData();
            },

            onNewPress: function() {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                {
                    "ID": "null"
                });
            },

            onBack: function(){
                this.getOwnerComponent().getRouter().navTo("RouteView1", {
                });
            },

            onClickofItem: function(oEvent){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("page2",
                {
                    ID: oEvent.getSource().getCells()[0].getText()
                });
                
            },




            onFilterSelect: function (oEvent) {
                var sKey = oEvent.getParameter("key");
                if (sKey === "All") {
                    this.getAllRequestData();
                } else if (sKey === "OnGoing") {
                    this.getOnGoingData();
                } else if (sKey === "Approved") {
                    this.getApprovedData();
                } else if (sKey === "Rejected") {
                    this.getRejectedData();
                } else if (sKey === "Delay") {
                    this.getDelayData();
                }

            },




            getAllRequestData: function() {
                var oRequestModel = new JSONModel([
                    {
                        "orderNo" : "RN123456801",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajash Gupta",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN1234568010",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN1234568010",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456801",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajash Gupta",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN1234568010",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    }
                ]);
                this.getView().setModel(oRequestModel, "RequestModel");

            },

            getOnGoingData: function() {

                var oDelayModel = new JSONModel([
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },            
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN1234568010",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    },
                    {
                        "orderNo" : "RN1234568010",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "On Going"
                    }
                ]);
                this.getView().setModel(oDelayModel, "RequestModel");
            },

            getApprovedData: function() {

                var oApprovedModel = new JSONModel([
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajash Gupta",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Approved"
                    }
                ]);
                this.getView().setModel(oApprovedModel, "RequestModel");
            },

            getRejectedData: function() {

                var oRejectedModel = new JSONModel([
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajash Gupta",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Rejected"
                    }
                ]);
                this.getView().setModel(oRejectedModel, "RequestModel");
            },

            getDelayData: function() {

                var oDelayModel = new JSONModel([
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajash Gupta",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45,000",
                        "orderCur" : "20,000",
                        "reqDate" : "10 Oct 2023",
                        "discountPer" : "9%",
                        "status" : "Delay"
                    }
                ]);
                this.getView().setModel(oDelayModel, "RequestModel");

            }
        });
    });
