sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "zpj/pro/sd/sk/zprovertihead/model/models"], function (e, t, i) {
  "use strict";
  return e.extend("zpj.pro.sd.sk.zprovertihead.Component", {
    metadata: { manifest: "json" },
    init: function () {
      e.prototype.init.apply(this, arguments);
      this.getRouter().initialize();
      this.setModel(i.createDeviceModel(), "device");
    },
  });
});
//# sourceMappingURL=Component.js.map
