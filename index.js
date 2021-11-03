const { Plugin } = require("@vizality/entities");
const { React, getModule } = require("@vizality/webpack");
const { patch, unpatch } = require("@vizality/patcher");

const Clock = require("./components/Clock");

// const getDefaultMethodByKeyword = (mdl, keyword) => {
//   const defaultMethod = mdl.__vizalityOriginal_default ?? mdl.default;
//   return typeof defaultMethod === "function"
//     ? defaultMethod.toString().includes(keyword)
//     : null;
// };

module.exports = class vzclock extends Plugin {
  async start() {
    this.injectStyles("./style.css");

    // const homeButton = await getModule((m) =>
    //   getDefaultMethodByKeyword(m, "showDMsOnly")
    // );
    const homeButton = await getModule(["homeButton"])
    patch("vz-clock", homeButton, "homeButton", (_, res) => {
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
  }
};
