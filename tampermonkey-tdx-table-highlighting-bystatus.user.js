// ==UserScript==
// @name         TDNext Table Highlighting
// @namespace    https://www.thomasstockwell.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.teamdynamix.com/TDNext/Home/Desktop/Default.aspx
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    const statusColors = {
        "Colors": [
          {"Status":"New","Color":"#FFF58F"},
          {"Status":"Open","Color":"LightBlue"},
          {"Status":"In Process","Color":"LightGreen"},
          {"Status":"On Hold","Color":"LightGray"},
          {"Status":"Testing","Color":"#FFD580"},
          {"Status":"Closed","Color":"Gray"},
          {"Status":"Resolved","Color":"Gray"},
          {"Status":"Cancelled","Color":"Gray"},
        ]
    };

    var btnColorTables = "<button id='tsColorTables'>Color Tables</button>";

    $("#divHeader div.tdbar-settings div.clearfix").append(btnColorTables);

    $("#tsColorTables").on('click',function(e){
        var iframe = $("#appDesktop").contents();
        var tables = $("table",iframe);
        $(tables).each(function(i,table){
            var headerSelector = "tr.TDGridHeader th a[data-sort='StatusName']"
            var headerStatus = $(headerSelector,table);
            var headerStatusIndex = -1;
            if(headerStatus){
                headerStatusIndex = $(headerSelector,table).parent().index();
                if(headerStatusIndex != -1)
                {
                    var tableRow = $("tbody tr",table);
                    $(tableRow).each(function(j,trow){
                        var tableStatusCell = $("td:nth-child("+(headerStatusIndex+1)+")",trow);
                        var status = tableStatusCell.text();
                        Object.entries(statusColors.Colors).forEach((obj)=>{
                            if(status === obj[1].Status)
                            {
                                $(trow).css('background-color',obj[1].Color);
                            };
                        });
                    });
                }
            }
        });
        e.preventDefault();
    });
})();