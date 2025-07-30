// ==UserScript==
// @name         TDNext Table Highlighting
// @namespace    https://www.thomasstockwell.com
// @version      0.18
// @description  Will highlight rows in TDX based on ticket status
// @author       You

// @match        https://*.teamdynamix.com/*TDNext/Apps/*Tickets/Desktop.aspx
// @match        https://*.teamdynamix.com/*TDNext/Apps/*Tickets/Default.aspx
// @match        https://*.teamdynamix.com/*TDNext/Home/Desktop/Desktop.aspx
// @match        https://*.teamdynamix.com/*TDNext/Apps/People/PersonTickets.aspx*
// @match        https://*.teamdynamix.com/*TDNext/Apps/*Reporting/ReportViewer*
// @match        https://*.teamdynamix.com/*TDNext/Apps/*Tickets/TicketSearch*
// @match        https://*.teamdynamix.com/*TDNext/Apps/*Tickets/TicketChildren?TicketID=*
// @match        https://*.teamdynamix.com/TDWorkManagement*
// @match        https://*.teamdynamixpreview.com/*
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
        {"Status":"New",                          "BackColor":"LightGreen","TestBackColor":"#FFFFFF",   "Color":"Black"},
        {"Status":"Open",                         "BackColor":"LightBlue","TestBackColor":"#FFFFFF",    "Color":"Black"},
        {"Status":"In Process",                   "BackColor":"#F5CC85","TestBackColor":"#FFFFFF",      "Color":"Black"},
        {"Status":"On Hold",                      "BackColor":"#CFBFF7","TestBackColor":"#FFFFFF",      "Color":"Black"},
        {"Status":"Testing",                      "BackColor":"#B392FC","TestBackColor":"#FFFFFF",      "Color":"Black"},
        {"Status":"Awaiting Customer Feedback",   "BackColor":"#967DF9","TestBackColor":"#FFFFFF",      "Color":"Black"},
        {"Status":"Awaiting Third Party",         "BackColor":"#9c91e3","TestBackColor":"#FFFFFF",      "Color":"Black"},
        {"Status":"Closed",                       "BackColor":"#5E6A75","TestBackColor":"#0d1117",      "Color":"White"},
        {"Status":"Resolved",                     "BackColor":"#91A4B5","TestBackColor":"#0d1117",      "Color":"White"},
        {"Status":"Cancelled",                    "BackColor":"#2B3036","TestBackColor":"#0d1117",      "Color":"White"},
      ]
    };
    waitForKeyElements ("table", function(){
      ProcessPage();
    });

    var observer = new MutationObserver(function(mutationsList, observer) {
        // This callback runs when changes are detected
        mutationsList.forEach(function(mutation) {
            // You can filter mutation types here
            colorizeTable(mutation.target);
        });
    });

    // Set options for what to observe
    observer.observe("table", {
        childList: true,        // Detect add/remove of <tr>
        subtree: true,          // Detect changes in descendants (like <td>)
        characterData: true,    // Detect direct text node changes
        characterDataOldValue: true
        // You can also add: attributes: true, attributeOldValue: true
    });

    function ProcessPage() {
      var iframe;
      var tables;
      $("table").each(function(i,table){
        colorizeTable(table);
      });
      $("table").on('change',function()
      {
        colorizeTable($(this));
      });
      function colorizeTable(table){
        var headerSelector = "tr:first() th:contains('Status'),tr:first() td:contains('Status')";
        var headerStatus = $(headerSelector,table);
        var headerStatusIndex = -1;
        if($(headerStatus).length>0){
          headerStatusIndex = $(headerSelector,table).index();
          if(headerStatusIndex != -1)
          {
            var tableRow = $("tbody tr",table);
            $(tableRow).each(function(j,trow){
                var tableStatusCell = $("td:nth-child("+(headerStatusIndex+1)+")",trow);
                var status = tableStatusCell.text();
                Object.entries(statusColors.Colors).forEach((obj)=>{
                    if(status === obj[1].Status)
                    {
                      if (/(SBTDNext|teamdynamixpreview)/.test(window.location.href)) {
                        $(trow).css('background-image','linear-gradient('+obj[1].BackColor+','+obj[1].TestBackColor+')');
                        $('td',trow).css('background-image','linear-gradient('+obj[1].BackColor+','+obj[1].TestBackColor+')');
                        $(trow).css('color',obj[1].Color);
                        $('td',trow).css('color',obj[1].Color);
                        $('a',trow).attr('style','background-color:rgba(0,0,0,0) !important');
                        $("a",trow).css('color',obj[1].Color);
                      }
                      else {
                        $(trow).css('background-color',obj[1].BackColor);
                        $('td',trow).css('background-color',obj[1].BackColor);
                        $(trow).css('color',obj[1].Color);
                        $('td',trow).css('color',obj[1].Color);
                        $("a",trow).css('color',obj[1].Color);
                      }
                    }
                });
            });
          }
        }
      }
    }
  })();