sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "pj/zpmg/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter) {
        "use strict";

        return Controller.extend("pj.zpmg.controller.View1", {
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
                else if (sKey === "Delayed") {
                    this.getDelayedData();
                } else if (sKey === "Forwarded") {
                    this.getForwardedData();
                }else if (sKey === "BP") {
                    this.getBPData();
                }else if (sKey === "Frieght") {
                    this.getFrieghtData();
                }else if (sKey === "Rejected") {
                    this.getRejectedData();
                }else if (sKey === "Deleted") {
                    this.getDeletedData();
                }

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
                        "orderType" : "Retail",
                        "orderTotal" : "45000",
                        "orderCur" : "20000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "5 Days",
                        "GM" : "9",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0T0003",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "10 Days",
                        "GM":"16",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0T0008",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "12 Days",
                        "GM":"14",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "AP0S0191",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "21 Days",
                        "GM":"13",
                        "status" : "Forwarded"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajesh Gupta",
                        "custId" : "MH0H0002",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "15 Days",
                        "GM":"50",
                        "status" : "Deleted"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "RJ0S0017",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "16 Days",
                        "GM":"12",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharm",
                        "custId" : "TN0K0029",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "21 Days",
                        "GM":"14",
                        "status" : "Deleted"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "UP0K0004",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "27 Days",
                        "GM":"28",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "HR0S0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "11 Days",
                        "GM":"17",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456810",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "BH0J0001",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "7 Days",
                        "GM":"26",
                        "status" : "Rejected"
                    },
                    {
                        "orderNo" : "RN123456811",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "MH0R0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "9 Days",
                        "GM":"18",
                        "status" : "Approved"
                    },
                    {
                        "orderNo" : "RN123456812",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "WB0D0007",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "8 Days",
                        "GM":"13",
                        "status" : "Deleted"
                    },
                    {
                        "orderNo" : "RN123456813",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "DL0K0009",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "validityDays": "6 Days",
                        "GM":"15",
                        "status" : "Deleted"
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
                                "orderType" : "Retail",
                                "orderTotal" : "45000",
                                "orderCur" : "20000",
                                "reqDate" : "10 Oct 2023",
                                "GM" : "9%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456802",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "TN0T0003",
                                "orderTotal" : "50000",
                                "orderType" : "Projects",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"16%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456803",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "TN0T0008",
                                "orderTotal" : "50000",
                                "orderType" : "Projects",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"14%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456804",
                                "region" : "NI-Chandigarh",
                                "customer" : "Mohit Rajput",
                                "custId" : "AP0S0191",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"13%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456805",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rajesh Gupta",
                                "custId" : "MH0H0002",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"2%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456806",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "RJ0S0017",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"12%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456807",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharm",
                                "custId" : "TN0K0029",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"14%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456808",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "UP0K0004",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"16%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456809",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "HR0S0026",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"18%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456810",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharma",
                                "custId" : "BH0J0001",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"20%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456811",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "MH0R0026",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"11%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456812",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "WB0D0007",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"13%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456813",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "DL0K0009",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"15%",
                                "status" : "Pending"
                            }
                ]);
                this.getView().setModel(oPendingModel, "RequestModel");
            },
            getApprovedData: function() {

                var oApprovedModel = new JSONModel([
                        {
                            "orderNo" : "RN123456801",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "TN0S0117",
                            "orderType" : "Retail",
                            "orderTotal" : "45000",
                            "orderCur" : "20000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"9%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456802",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "TN0T0003",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Edited and Approved"
                        },
                        {
                            "orderNo" : "RN123456803",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "TN0T0008",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456804",
                            "region" : "NI-Chandigarh",
                            "customer" : "Mohit Rajput",
                            "custId" : "AP0S0191",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Pending at accounts"
                        },
                        {
                            "orderNo" : "RN123456805",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rajesh Gupta",
                            "custId" : "MH0H0002",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"2%",
                            "status" : "Edited and Approved"
                        },
                        {
                            "orderNo" : "RN123456806",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "RJ0S0017",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"12%",
                            "status" : "Pending at accounts"
                        },
                        {
                            "orderNo" : "RN123456807",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharm",
                            "custId" : "TN0K0029",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456808",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "UP0K0004",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Pending at accounts"
                        },
                        {
                            "orderNo" : "RN123456809",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "HR0S0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"18%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456810",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "BH0J0001",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"20%",
                            "status" : "Edited and Approved"
                        },
                        {
                            "orderNo" : "RN123456811",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "MH0R0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"11%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456812",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "WB0D0007",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Edited and Approved"
                        },
                        {
                            "orderNo" : "RN123456813",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "DL0K0009",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"15%",
                            "status" : "Approved"
                        }
                ]);
                this.getView().setModel(oApprovedModel, "RequestModel");
            },
            getDelayedData: function() {
                var oDelayedModel = new JSONModel([
                    {
                        "orderNo" : "RN123456801",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45000",
                        "orderCur" : "20000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"9%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0T0003",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"16%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0T0008",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"14%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "AP0S0191",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"13%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajesh Gupta",
                        "custId" : "MH0H0002",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"2%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "RJ0S0017",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"12%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharm",
                        "custId" : "TN0K0029",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"14%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "UP0K0004",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"16%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "HR0S0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"18%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456810",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "BH0J0001",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"20%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456811",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "MH0R0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"11%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456812",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "WB0D0007",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"13%",
                        "status" : "Delayed"
                    },
                    {
                        "orderNo" : "RN123456813",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "DL0K0009",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "gM":"15%",
                        "status" : "Delayed"
                    }
                ]);
                this.getView().setModel(oDelayedModel, "RequestModel");
                },
                getForwardedData: function() {
                    var oForwardedModel = new JSONModel([
                        {
                            "orderNo" : "RN123456801",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "TN0S0117",
                            "orderType" : "Retail",
                            "orderTotal" : "45000",
                            "orderCur" : "20000",
                            "reqDate" : "10 Oct 2023",
                            "GM" : "9%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456802",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "TN0T0003",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456803",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "TN0T0008",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Forwarded to NH"
                        },
                        {
                            "orderNo" : "RN123456804",
                            "region" : "NI-Chandigarh",
                            "customer" : "Mohit Rajput",
                            "custId" : "AP0S0191",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Forwarded to NH"
                        },
                        {
                            "orderNo" : "RN123456805",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rajesh Gupta",
                            "custId" : "MH0H0002",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"2%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456806",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "RJ0S0017",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"12%",
                            "status" : "Forwarded to NH"
                        },
                        {
                            "orderNo" : "RN123456807",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharm",
                            "custId" : "TN0K0029",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Forwarded to NH"
                        },
                        {
                            "orderNo" : "RN123456808",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "UP0K0004",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456809",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "HR0S0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"18%",
                            "status" : "Forwarded to NH"
                        },
                        {
                            "orderNo" : "RN123456810",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "BH0J0001",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"20%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456811",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "MH0R0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"11%",
                            "status" : "Approved"
                        },
                        {
                            "orderNo" : "RN123456812",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "WB0D0007",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Rejected"
                        },
                        {
                            "orderNo" : "RN123456813",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "DL0K0009",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"15%",
                            "status" : "Approved"
                        }
                    ]);
                    this.getView().setModel(oForwardedModel, "RequestModel");
                    },
                    getBPData: function() {
                        var oBPModel = new JSONModel([
                            {
                                "orderNo" : "RN123456801",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharma",
                                "custId" : "TN0S0117",
                                "orderType" : "Retail",
                                "orderTotal" : "45000",
                                "orderCur" : "20000",
                                "reqDate" : "10 Oct 2023",
                                "GM" : "9%",
                                "status" : "REnegotiation done"
                            },
                            {
                                "orderNo" : "RN123456802",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "TN0T0003",
                                "orderTotal" : "50000",
                                "orderType" : "Projects",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"16%",
                                "status" : "Negotiation not possible"
                            },
                            {
                                "orderNo" : "RN123456803",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "TN0T0008",
                                "orderTotal" : "50000",
                                "orderType" : "Projects",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"14%",
                                "status" : "Renegotiation no possible"
                            },
                            {
                                "orderNo" : "RN123456804",
                                "region" : "NI-Chandigarh",
                                "customer" : "Mohit Rajput",
                                "custId" : "AP0S0191",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"13%",
                                "status" : "Forwarded to NH"
                            },
                            {
                                "orderNo" : "RN123456805",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rajesh Gupta",
                                "custId" : "MH0H0002",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"2%",
                                "status" : "Negotiation not possible"
                            },
                            {
                                "orderNo" : "RN123456806",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "RJ0S0017",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"12%",
                                "status" : "Forwarded to NH"
                            },
                            {
                                "orderNo" : "RN123456807",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharm",
                                "custId" : "TN0K0029",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"14%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456808",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "UP0K0004",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"16%",
                                "status" : "Renegotiation on going"
                            },
                            {
                                "orderNo" : "RN123456809",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "HR0S0026",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"18%",
                                "status" : "Pending"
                            },
                            {
                                "orderNo" : "RN123456810",
                                "region" : "NI-Chandigarh",
                                "customer" : "Aman Sharma",
                                "custId" : "BH0J0001",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"20%",
                                "status" : "Renegotiation on going"
                            },
                            {
                                "orderNo" : "RN123456811",
                                "region" : "NI-Chandigarh",
                                "customer" : "Kunal Kapoor",
                                "custId" : "MH0R0026",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"11%",
                                "status" : "Negotiation not possible"
                            },
                            {
                                "orderNo" : "RN123456812",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "WB0D0007",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"13%",
                                "status" : "Negotiation not possible"
                            },
                            {
                                "orderNo" : "RN123456813",
                                "region" : "NI-Chandigarh",
                                "customer" : "Rahul Sharma",
                                "custId" : "DL0K0009",
                                "orderType" : "Projects",
                                "orderTotal" : "50000",
                                "orderCur" : "12000",
                                "reqDate" : "10 Oct 2023",
                                "GM":"15%",
                                "status" : "Renegotiation done"
                            }
                        ]);
                        this.getView().setModel(oBPModel, "RequestModel");
                        },
                        getFrieghtData: function() {
                            var oFrieghtModel = new JSONModel([
                                {
                                    "orderNo" : "RN123456801",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Aman Sharma",
                                    "custId" : "TN0S0117",
                                    "orderType" : "Retail",
                                    "orderTotal" : "45000",
                                    "orderCur" : "20000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM" : "9%",
                                    "status" : "REnegotiation done"
                                },
                                {
                                    "orderNo" : "RN123456802",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Kunal Kapoor",
                                    "custId" : "TN0T0003",
                                    "orderTotal" : "50000",
                                    "orderType" : "Projects",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"16%",
                                    "status" : "Negotiation not possible"
                                },
                                {
                                    "orderNo" : "RN123456803",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rahul Sharma",
                                    "custId" : "TN0T0008",
                                    "orderTotal" : "50000",
                                    "orderType" : "Projects",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"14%",
                                    "status" : "Renegotiation no possible"
                                },
                                {
                                    "orderNo" : "RN123456804",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Mohit Rajput",
                                    "custId" : "AP0S0191",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"13%",
                                    "status" : "Forwarded to NH"
                                },
                                {
                                    "orderNo" : "RN123456805",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rajesh Gupta",
                                    "custId" : "MH0H0002",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"2%",
                                    "status" : "Negotiation not possible"
                                },
                                {
                                    "orderNo" : "RN123456806",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rahul Sharma",
                                    "custId" : "RJ0S0017",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"12%",
                                    "status" : "Forwarded to NH"
                                },
                                {
                                    "orderNo" : "RN123456807",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Aman Sharm",
                                    "custId" : "TN0K0029",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"14%",
                                    "status" : "Pending"
                                },
                                {
                                    "orderNo" : "RN123456808",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Kunal Kapoor",
                                    "custId" : "UP0K0004",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"16%",
                                    "status" : "Renegotiation on going"
                                },
                                {
                                    "orderNo" : "RN123456809",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rahul Sharma",
                                    "custId" : "HR0S0026",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"18%",
                                    "status" : "Pending"
                                },
                                {
                                    "orderNo" : "RN123456810",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Aman Sharma",
                                    "custId" : "BH0J0001",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"20%",
                                    "status" : "Renegotiation on going"
                                },
                                {
                                    "orderNo" : "RN123456811",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Kunal Kapoor",
                                    "custId" : "MH0R0026",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"11%",
                                    "status" : "Negotiation not possible"
                                },
                                {
                                    "orderNo" : "RN123456812",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rahul Sharma",
                                    "custId" : "WB0D0007",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"13%",
                                    "status" : "Negotiation not possible"
                                },
                                {
                                    "orderNo" : "RN123456813",
                                    "region" : "NI-Chandigarh",
                                    "customer" : "Rahul Sharma",
                                    "custId" : "DL0K0009",
                                    "orderType" : "Projects",
                                    "orderTotal" : "50000",
                                    "orderCur" : "12000",
                                    "reqDate" : "10 Oct 2023",
                                    "GM":"15%",
                                    "status" : "Renegotiation done"
                                }
                            ]);
                            this.getView().setModel(oFrieghtModel, "RequestModel");
                            },
                            getRejectedData: function() {
                var oRejectedModel = new JSONModel([
                    {
                        "orderNo" : "RN123456801",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "TN0S0117",
                        "orderType" : "Retail",
                        "orderTotal" : "45000",
                        "orderCur" : "20000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"9%",
                        "status": "Gross Margin is low"
                    },
                    {
                        "orderNo" : "RN123456802",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "TN0T0003",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"16%",
                        "status" : "Negotiation is possible"
                    },
                    {
                        "orderNo" : "RN123456803",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "TN0T0008",
                        "orderTotal" : "50000",
                        "orderType" : "Projects",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"14%",
                        "status" : "Other"
                    },
                    {
                        "orderNo" : "RN123456804",
                        "region" : "NI-Chandigarh",
                        "customer" : "Mohit Rajput",
                        "custId" : "AP0S0191",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"13%",
                        "status" : "Other"
                    },
                    {
                        "orderNo" : "RN123456805",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rajesh Gupta",
                        "custId" : "MH0H0002",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"2%",
                        "status" : "Gross Margin is low"
                    },
                    {
                        "orderNo" : "RN123456806",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "RJ0S0017",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"12%",
                        "status" : "Negotiation is possible "
                    },
                    {
                        "orderNo" : "RN123456807",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharm",
                        "custId" : "TN0K0029",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"14%",
                        "status" : "Other"
                    },
                    {
                        "orderNo" : "RN123456808",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "UP0K0004",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"16%",
                        "status" : "Other"
                    },
                    {
                        "orderNo" : "RN123456809",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "HR0S0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"18%",
                        "status" : "Negotiation is possible"
                    },
                    {
                        "orderNo" : "RN123456810",
                        "region" : "NI-Chandigarh",
                        "customer" : "Aman Sharma",
                        "custId" : "BH0J0001",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"20%",
                        "status" : "Negotiation is possible"
                    },
                    {
                        "orderNo" : "RN123456811",
                        "region" : "NI-Chandigarh",
                        "customer" : "Kunal Kapoor",
                        "custId" : "MH0R0026",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"11%",
                        "status" : "Gross Margin is low"
                    },
                    {
                        "orderNo" : "RN123456812",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "WB0D0007",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"13%",
                        "status" : "Gross margin is low"
                    },
                    {
                        "orderNo" : "RN123456813",
                        "region" : "NI-Chandigarh",
                        "customer" : "Rahul Sharma",
                        "custId" : "DL0K0009",
                        "orderType" : "Projects",
                        "orderTotal" : "50000",
                        "orderCur" : "12000",
                        "reqDate" : "10 Oct 2023",
                        "GM":"15%",
                        "status" : "Gross Margin is low"
                    }
                ]);
                this.getView().setModel(oRejectedModel, "RequestModel");
                },
                getDeletedData: function() {
                    var oDeletedModel = new JSONModel([
                        {
                            "orderNo" : "RN123456801",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "TN0S0117",
                            "orderType" : "Retail",
                            "orderTotal" : "45000",
                            "orderCur" : "20000",
                            "reqDate" : "10 Oct 2023",
                            "GM" : "9%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456802",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "TN0T0003",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456803",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "TN0T0008",
                            "orderTotal" : "50000",
                            "orderType" : "Projects",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456804",
                            "region" : "NI-Chandigarh",
                            "customer" : "Mohit Rajput",
                            "custId" : "AP0S0191",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456805",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rajesh Gupta",
                            "custId" : "MH0H0002",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"2%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456806",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "RJ0S0017",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"12%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456807",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharm",
                            "custId" : "TN0K0029",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"14%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456808",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "UP0K0004",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"16%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456809",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "HR0S0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"18%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456810",
                            "region" : "NI-Chandigarh",
                            "customer" : "Aman Sharma",
                            "custId" : "BH0J0001",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"20%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456811",
                            "region" : "NI-Chandigarh",
                            "customer" : "Kunal Kapoor",
                            "custId" : "MH0R0026",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"11%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456812",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "WB0D0007",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"13%",
                            "status" : "Deleted"
                        },
                        {
                            "orderNo" : "RN123456813",
                            "region" : "NI-Chandigarh",
                            "customer" : "Rahul Sharma",
                            "custId" : "DL0K0009",
                            "orderType" : "Projects",
                            "orderTotal" : "50000",
                            "orderCur" : "12000",
                            "reqDate" : "10 Oct 2023",
                            "GM":"15%",
                            "status" : "Deleted"
                        }
                    ]);
                    this.getView().setModel(oDeletedModel, "RequestModel");
                    },
            onOrderClicked: function() {
                this.oRouter.navTo("page2");
            }
        });
    });
