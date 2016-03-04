/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and
 * limitations under the License.
 *
 * Copyright (C) OpenHMIS.  All Rights Reserved.
 *
 */

(function() {
    'use strict';

	var base = angular.module('app.genericEntityController');
	base.controller("ItemAttributeTypesController", ItemAttributeTypesController);
	ItemAttributeTypesController.$inject = ['$stateParams', '$injector', '$scope', '$filter', 'EntityRestFactory',
		'ItemAttributeTypesModel', 'ItemAttributeTypesRestfulService', 'EntityFunctions'];

	function ItemAttributeTypesController($stateParams, $injector, $scope, $filter, EntityRestFactory,
				ItemAttributeTypesModel, ItemAttributeTypesRestfulService, EntityFunctions) {

		var self = this;

		var module_name = 'inventory';
		var entity_name = emr.message("openhmis.inventory.itemAttributeType");
		var cancel_page = 'entities.page';
		var rest_name = emr.message("openhmis.inventory.itemAttributeType_rest");

		// @Override
		self.setRequiredInitParameters = self.setRequiredInitParameters || function () {
				self.bindBaseParameters(module_name, rest_name, entity_name, cancel_page);
			}

		self.bindExtraVariablesToScope = self.bindExtraVariablesToScope
			|| function (uuid) {
				if (angular.isDefined($scope.entity) && angular.isDefined($scope.entity.retired)
					&& $scope.entity.retired === true) {
					$scope.retireOrUnretire = $filter('EmrFormat')(emr.message("openhmis.inventory.general.unretire"),
						[self.entity_name]);
				} else {
					$scope.retireOrUnretire = $filter('EmrFormat')(emr.message("openhmis.inventory.general.retire"),
						[self.entity_name]);
				}

				$scope.submitted = $scope.submitted || false;
				$scope.validateBeforeSaveOrUpdate = self.validateBeforeSaveOrUpdate;

				// call functions..
				ItemAttributeTypesRestfulService.loadFormatFields(module_name, self.onLoadFormatFieldsSuccessful);

			}

		self.validateBeforeSaveOrUpdate = self.validateBeforeSaveOrUpdate || function () {
				if (!angular.isDefined($scope.entity.attributeOrder) || $scope.entity.attributeOrder === '') {
					$scope.entity.attributeOrder = null;
				}
				if (!angular.isDefined($scope.entity.foreignKey) || $scope.entity.foreignKey === '') {
					$scope.entity.foreignKey = null;
				}
				if (!angular.isDefined($scope.entity.name) || $scope.entity.name === '') {
					$scope.submitted = true;
					return false;
				}
				return true;
			}

		// call-back functions.
		self.onLoadFormatFieldsSuccessful = self.onLoadFormatFieldsSuccessful || function (data) {
				$scope.formatFields = data.results;
				return EntityFunctions.addExtraFormatListElements($scope.formatFields);
			}

		/* ENTRY POINT: Instantiate the base controller which loads the page */
		$injector.invoke(base.GenericEntityController, self, {
			$scope: $scope,
			$filter: $filter,
			$stateParams: $stateParams,
			EntityRestFactory: EntityRestFactory,
			GenericMetadataModel: ItemAttributeTypesModel
		});
	}
})();