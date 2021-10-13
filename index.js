const { Plugin } = require("@vizality/entities");
const { React, getModulesByKeyword } = require("@vizality/webpack");
const { patch, unpatch } = require("@vizality/patcher");
const { forceUpdateElement } = require("@vizality/util");

const Clock = require("./components/Clock");
const Settings = require("./components/Settings");

module.exports = class vzclock extends Plugin {
  async start() {
    this.injectStyles("./style.css");

    vizality.api.settings.registerSettings("vz-clock-settings", {
      category: this.entityID,
      label: "vz-clock",
      render: Settings,
    });

    const homeButton = await getModulesByKeyword(["HomeIcon"])[0];
    patch("vz-clock", homeButton, "DefaultHomeButton", (_, res) => {
      if (!Array.isArray(res)) res = [res];
      res.unshift(
        React.createElement(Clock, {
          className: "vz-clock sticky",
          getSetting: this.settings.get,
          updateSetting: this.settings.update,
        })
      );
      return res;
    });
  }

  stop() {
    unpatch("vz-clock");
    vizality.api.settings.unregisterSettings("vz-clock-settings");
    forceUpdateElement(
      `.${getModulesByKeyword("homeIcon", false)[0].tutorialContainer}`
    );
  }
};
