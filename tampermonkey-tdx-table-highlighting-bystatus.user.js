// ==UserScript==
// @name         TDNext Table Highlighting
// @namespace    https://www.thomasstockwell.com
// @version      0.9
// @description  try to take over the world!
// @author       You

// @match        https://*.teamdynamix.com/TDNext/Apps/569/Tickets/Desktop.aspx
// @match        https://*.teamdynamix.com/TDNext/Apps/569/Tickets/Default.aspx
// @match        https://*.teamdynamix.com/TDNext/Home/Desktop/Desktop.aspx
// @match        https://*.teamdynamix.com/TDNext/Apps/People/PersonTickets.aspx*
// @match        https://*.teamdynamix.com/TDNext/Apps/569/Reporting/ReportViewer*
// @match        https://*.teamdynamix.com/TDNext/Apps/569/Tickets/TicketSearch*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://github.com/tomstock1337/tampermonkey-tdx-table-highlighting-bystatus/raw/main/tampermonkey-tdx-table-highlighting-bystatus.user.js
// @updateURL    https://github.com/tomstock1337/tampermonkey-tdx-table-highlighting-bystatus/raw/main/tampermonkey-tdx-table-highlighting-bystatus.user.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(
  function() {
    'use strict';

    const statusColors = {
      "Colors": [
        {"Status":"New",       "BackColor":"LightGreen",   "Color":"Black"},
        {"Status":"Open",      "BackColor":"LightBlue",    "Color":"Black"},
        {"Status":"In Process","BackColor":"#F5CC85",      "Color":"Black"},
        {"Status":"On Hold",   "BackColor":"#C4B0F5",      "Color":"Black"},
        {"Status":"Testing",   "BackColor":"#C4B0F5",      "Color":"Black"},
        {"Status":"Closed",    "BackColor":"#5E6A75",      "Color":"White"},
        {"Status":"Resolved",  "BackColor":"#91A4B5",      "Color":"White"},
        {"Status":"Cancelled", "BackColor":"#2B3036",      "Color":"White"},
      ]
    };
    waitForKeyElements ("table", function(){
      ProcessPage();
    });
    function ProcessPage() {
      var iframe;
      var tables;
      $("table").each(function(i,table){
        colorizeTable(table);
      });
      function colorizeTable(table){
        var headerSelector = "tr:first() th a:contains('Status'), tr:first() td a:contains('Status')";
        var headerStatus = $(headerSelector,table);
        var headerStatusIndex = -1;
        headerStatusIndex = $(headerSelector,table).parent().index();
        if ($(headerSelector,table).length<=0){
            headerSelector = "tr:first() td:contains('Status')";
            headerStatus = $(headerSelector,table);
            headerStatusIndex = $(headerSelector,table).index();
        }
        if($(headerStatus).length>0){
          if(headerStatusIndex != -1)
          {
            var tableRow = $("tbody tr",table);
            $(tableRow).each(function(j,trow){
                var tableStatusCell = $("td:nth-child("+(headerStatusIndex+1)+")",trow);
                var status = tableStatusCell.text();
                Object.entries(statusColors.Colors).forEach((obj)=>{
                    if(status === obj[1].Status)
                    {
                        $(trow).css('background-color',obj[1].BackColor);
                        $(trow).css('color',obj[1].Color);
                        $("a",trow).css('color',obj[1].Color);
                    }
                });
            });
          }
        }
      }
    }
  })();