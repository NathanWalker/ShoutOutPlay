/**********************************************************************************
 * (c) 2016, Master Technology
 * Licensed under the MIT license or contact me for a Support or Commercial License
 *
 * I do contract work in most languages, so let me solve your problems!
 *
 * Any questions please feel free to email me or put a issue up on the github repo
 * Version 1.0.2                                      Nathan@master-technology.com
 *********************************************************************************/
"use strict";

function eliminateExtends(pre) {
    var i = pre.indexOf('var __extends = ');
    if (i === -1) {
      return pre;
    }
    var x = pre.indexOf('};',i);
    return pre.substring(0,i) + pre.substring(x+2);
}
module.exports = eliminateExtends; 
