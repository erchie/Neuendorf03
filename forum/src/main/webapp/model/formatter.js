sap.ui.define([
	"sap/ui/core/format/DateFormat"
] , function (DateFormat) {
	"use strict";

	 /**
	 * Formatter for all texts/numbers/icons.
	 * @namespace formatter
	 */
	return {


		 /**
		 * Deleting zeros.
		 * @author WN00096217 (Eric Schuster)
		 * @memberof formatter
		 * @function masterListDate
		 * @param {sap.ui.model.type.Date} oDate - date simple type
		 * @returns {String} - cell texts
		 */
		masterListDate: function (oDate) {
			return this.getModel("i18n").getProperty("enddat") + " " + oDate.toDateString();
		}

	};

});
