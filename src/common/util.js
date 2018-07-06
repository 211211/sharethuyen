import React from "react";

import { Alert } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, MESSAGES } from "../common/config.js";

class Util {
  static buildQueryParam(paramObj) {
    if (typeof paramObj == "undefined") return "";

    let paramUrl = $.param(paramObj);
    return "?" + paramUrl;
  }

  static getNumOfPage(recordsTotal) {
    var numOfPage = recordsTotal / CONSTANT.PAGING.NUM_OF_ROW;
    if (numOfPage <= 1) {
      return 1;
    } else if (Number.isInteger(numOfPage)) {
      return numOfPage;
    } else {
      return Math.floor(numOfPage) + 1;
    }
  }

  static currencyFormatter() {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });
  }

  static growl(messageKey) {
    if (MESSAGES[messageKey]) {
      $.growl.notice({ message: MESSAGES[messageKey] });
    } else {
      $.growl.notice({ message: messageKey });
    }
  }

  static growlError(messageKey, title) {
    if (MESSAGES[messageKey]) {
      $.growl.error({ message: MESSAGES[messageKey], title: title });
    } else {
      $.growl.error({ message: messageKey, title: title });
    }
  }

  static initDataTable(datatableEl, url, columnDefs, overrideOpts = {}) {
    const defaultOpts = {
      processing: true,
      rowId: "id",
      order: [0, "desc"],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.childRowImmediate,
          type: ""
        }
      },
      serverSide: true,
      ajax: {
        url: url
      },
      columnDefs: columnDefs || []
    };
    const opts = Object.assign({}, defaultOpts, overrideOpts);
    return datatableEl.addClass("nowrap").DataTable(opts);
  }

  static mapErrors(errorObj) {
    let errorKeys = Object.keys(errorObj);
    let errors = errorKeys.length ? (
      <Alert danger dismissible>
        {errorKeys.map((field, i) => {
          return (
            <div key={i}>
              <div>
                <strong>{field}:</strong>
              </div>
              <ul>
                {errorObj[field].map((error, j) => {
                  return <li key={j}>{error}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </Alert>
    ) : null;
    return errors;
  }

  static isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static isInPeakSeason(current, peak_season_start_date, peak_season_end_date) {
    return current.isSameOrAfter(peak_season_start_date) && current.isSameOrBefore(peak_season_end_date);
  }

  static getBoatLogo(color_hex) {
    return `<br><svg style='fill: ${color_hex}' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 448.508 448.508" style="enable-background:new 0 0 448.508 448.508;" xml:space="preserve" width="30px" height="30px">
    <g>
      <path style="stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" d="M131.896,304.53l0.031,0.008   c18.193,5.075,40.746,10.712,64.277,13.143c-2.138-0.667-4.268-1.351-6.381-2.066c-23.42-7.125-45.465-11.48-66.838-13.189   c2.975,0.621,5.939,1.309,8.879,2.097L131.896,304.53z" stroke="#933EC5"/>
      <path style="stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" d="M218.874,325.325   c-29.414,0-59.245-6.399-88.67-14.607c-13.166-3.529-26.702-5.301-40.198-5.3c-31.157,0.001-62.073,9.45-87.52,28.54   c24.655-10.414,48.674-15.175,72.857-15.174c21.101,0.001,42.328,3.626,64.192,10.285c19.7,6.68,41.592,10.487,63.451,10.487   c19.406,0,38.781-3.009,56.563-9.672c-11.274-0.897-22.565-2.471-33.715-4.686C223.517,325.281,221.197,325.325,218.874,325.325z" stroke="#933EC5"/>
      <path style="stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" d="M55.729,275.199   c21.563-6.916,44.19-10.424,67.26-10.424c19.829,0,39.618,2.609,58.817,7.755l0.045,0.012l0.044,0.013   c33.708,9.403,78.059,20.197,122.182,20.197c24.01,0,46.25-3.143,67.127-9.517l77.304-148.526c0,0-162.357-16.376-446.022,122.976   v40.646h4.137C21.785,288.573,38.243,280.809,55.729,275.199z M239.254,192.224c6.627,0,12,5.373,12,12c0,6.627-5.373,12-12,12   s-12-5.373-12-12C227.254,197.596,232.627,192.224,239.254,192.224z M201.254,204.224c6.627,0,12,5.373,12,12   c0,6.627-5.373,12-12,12s-12-5.373-12-12C189.254,209.597,194.627,204.224,201.254,204.224z M164.754,216.224   c6.627,0,12,5.373,12,12c0,6.627-5.373,12-12,12s-12-5.373-12-12C152.754,221.597,158.127,216.224,164.754,216.224z" stroke="#933EC5"/>
      <path style="stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" d="M179.473,281.24   c-18.498-4.958-37.523-7.447-56.485-7.447C79.2,273.792,35.76,287.071,0,313.9c34.646-14.636,68.397-21.326,102.382-21.324   c29.649,0.001,59.479,5.096,90.202,14.453c27.684,9.387,58.448,14.738,89.164,14.738c50.849,0,101.553-14.673,137.844-50   c-37.338,21.854-76.166,30.001-115.515,30.001C262.739,301.768,220.827,292.776,179.473,281.24z" stroke="#933EC5"/>
      <path style="stroke-width:0;stroke-linecap:round;stroke-linejoin:round;" d="M96.575,132.911l3.659,12.041   c6.723-2.837,25.23-10.244,46.143-15.142c4.03-0.942,8.066,1.559,9.013,5.592c0.944,4.033-1.56,8.068-5.593,9.013   c-21.549,5.047-40.84,13.108-45.174,14.976l10.625,34.957c0,0,93.771-44.118,203.885-60.232l-106.165-23.737   c0,0-79.13-9.933-149.614,22.611C63.354,132.99,78.333,137.616,96.575,132.911z" stroke="#933EC5"/>
    </g></svg>`;
  }

  // Convert time in hh:mma to sec from 00:00
  static convertTimeToSec(time) {
    if (typeof time !== "string" || time.length !== 7) {
      throw new Error("Time must be a 7 character string!");
    }
    const hh = parseInt(time.substr(0, 2));
    const mm = parseInt(time.substr(3, 2));
    const a = time.substr(5, 2);
    return hh * 60 + mm + (a == "pm" && hh !== 12 ? 12 * 60 : 0);
  }

  static convertSecToTime(sec) {
    return moment()
      .startOf("day")
      .add(sec, "minutes")
      .format("hh:mma");
  }

  static retrieveSearchQuery() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search.slice(1));
    const q = params.get("q");
    return q;
  }

  static setQueryUrl(search) {
    const params = new URLSearchParams();
    params.append("q", search);
    const query = params.toString();
    if (search && search != "") {
      history.pushState(null, null, `${window.location.pathname}?${query}`);
    } else {
      history.pushState(null, null, window.location.pathname);
    }
  }

  static getJsonFromUrl(hashBased) {
    var query;
    if (hashBased) {
      var pos = location.href.indexOf("?");
      if (pos == -1) return [];
      query = location.href.substr(pos + 1);
    } else {
      query = location.search.substr(1);
    }
    var result = {};
    query.split("&").forEach(function(part) {
      if (!part) return;
      part = part.split("+").join(" "); // replace every + with space, regexp-free version
      var eq = part.indexOf("=");
      var key = eq > -1 ? part.substr(0, eq) : part;
      var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
      var from = key.indexOf("[");
      if (from == -1) result[decodeURIComponent(key)] = val;
      else {
        var to = key.indexOf("]", from);
        var index = decodeURIComponent(key.substring(from + 1, to));
        key = decodeURIComponent(key.substring(0, from));
        if (!result[key]) result[key] = [];
        if (!index) result[key].push(val);
        else result[key][index] = val;
      }
    });
    return result;
  }
}

export default Util;
