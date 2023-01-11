// ==UserScript==
// @name         TDNext Table Highlighting
// @namespace    https://www.thomasstockwell.com
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.teamdynamix.com/TDNext/Home/Desktop/Default.aspx
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

	var btnColorTables = "<button id='tsColorTables'>Color Tables</button>";

	$("#divHeader div.tdbar-settings div.clearfix").append(btnColorTables);

	$("#tsColorTables").on('click',function(e){
		var iframe;
		var tables;
		console.log($("#ai_569").length);

		if ($("#appDesktop").length>0){
			//Desktop Application
			iframe = $("#appDesktop").contents();
			tables = $("table", iframe);

			$(tables).each(function(i,table){
				colorizeTable(table);
			});
		}
		if ($("#ai_569").length>0) {
			//Ticketing application
			iframe = $("#ai_569").contents();
			console.log(iframe);
			iframe = $("#RightFrame",iframe).contents();
			console.log(iframe);
			tables = $("table", iframe);
			$(tables).each(function(i,table){
				colorizeTable(table);
			});
		}
		function colorizeTable(table){
				var headerSelector = "tr.TDGridHeader th a:contains('Status')"
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
														$(trow).css('background-color',obj[1].BackColor);
														$(trow).css('color',obj[1].Color);
														$("a",trow).css('color',obj[1].Color);
												};
										});
								});
						}
				}
		}
	e.preventDefault();
});
})();