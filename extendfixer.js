var blockLoader = require("block-loader");
var options = {
  start: "var __extends =",
  end: "};",
  process: function eliminateExtends(pre) {
    var i = pre.indexOf('var __extends = ');
    var x = pre.indexOf('};',i);
    return pre.substring(0,i) + pre.substring(x+2);
  }
};
module.exports = blockLoader(options);

