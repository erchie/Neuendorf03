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
		 * @param {sap.ui.model.type.Date} sNumber - date simple type
		 * @returns {String} -list field
		 */
		toInt: function (sNumber) {
			return parseInt(sNumber, 10);
		}


	};

});
