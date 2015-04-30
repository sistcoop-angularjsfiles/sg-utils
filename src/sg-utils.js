'use strict';

(function(){

    var moduleSgUtilsIso3166 = angular.module('sg-utils-iso3166', []);
    var moduleSgUtilsIso4217 = angular.module('sg-utils-iso4217', []);
    var moduleSgUtilsUbigeo = angular.module('sg-utils-ubigeo', []);
    var moduleSgUtilsPersona = angular.module('sg-utils-persona', []);
    var moduleSgUtilsOrganizacion = angular.module('sg-utils-organizacion', []);
    var moduleSgUtilsCooperativa = angular.module('sg-utils-cooperativa', []);
    var moduleSgUtilsProducto = angular.module('sg-utils-producto', []);

    var moduleSgUtils = angular.module('sg-utils',
        [
            'sg-utils-iso3166',
            'sg-utils-iso4217',
            'sg-utils-ubigeo',
            'sg-utils-persona',
            'sg-utils-organizacion',
            'sg-utils-cooperativa',
            'sg-utils-producto'
        ]);

    /**
     * Module sg-utils.
     *
     * Utils generales para sg.
     * Estas clases no necesitan dependencias.
     */

    moduleSgUtils.filter('si_no', function() {
        return function(input, mode) {
            var defaultResult = ['Si', 'No'];
            var modeOneResult = ['Activo', 'Inactivo'];
            var modeTwoResult = ['Abierto', 'Cerrado'];
            var modeTreeResult = ['Descongelado', 'Congelado'];

            var result = defaultResult;
            if(mode){
                if(mode.toLowerCase() == 'si'){
                    result = defaultResult;
                } else if(mode.toLowerCase() == 'activo'){
                    result = modeOneResult;
                } else if(mode.toLowerCase() == 'abierto'){
                    result = modeTwoResult;
                } else if(mode.toLowerCase() == 'congelado'){
                    result = modeTreeResult;
                } else {
                    result = defaultResult;
                }
            }

            if (input) {
                return result[0];
            }
            return result[1];
        }
    });

    moduleSgUtils.directive('sgMaxDate', function() {
        return {
            require: 'ngModel',
            link: function($scope, elem, attrs, ngModel) {
                ngModel.$validators.sgmaxdate = function(modelValue,viewValue){
                    var value = modelValue || viewValue;
                    return $scope.maxDate >= value;
                }
            }
        };
    });





    /**
     * Module sg-utils-iso3166.
     *
     * Utils generales para sg-utils-iso3166.
     * Estas clases dependen de sg-3166.
     */












    /**
     * Module sg-utils-iso4217.
     *
     * Utils generales para sg-utils-iso4217.
     * Estas clases dependen de sg-4217.
     */














    /**
     * Module sg-utils-ubigeo.
     *
     * Utils generales para sg-utils-ubigeo.
     * Estas clases dependen de sg-ubigeo.
     */

    moduleSgUtilsUbigeo.directive('sgUbigeo',function(SGDepartamento, SGProvincia, SGDistrito){
        return {
            restrict:'E',
            replace: false,
            require: ['^form','ngModel'],
            link: function($scope, elem, attrs, ngModel){

                ngModel[1].$validators.sgubigeo = function(modelValue,viewValue){
                    var value = modelValue || viewValue;
                    value = value ? value : '';
                    //false representa error y true represeta exito
                    if($scope.requerido)
                        return (value.length == 6);
                    else
                        return (value.length == 6  || value.length == 0);
                };

                SGDepartamento.$search().then(function(data){
                    $scope.departamentos = data;
                    $scope.activeListener();
                });
                $scope.provincias = undefined;
                $scope.distritos = undefined;

                $scope.ubigeo = {
                    departamento: undefined,
                    provincia: undefined,
                    distrito: undefined
                };

                $scope.$watch('ubigeo.departamento', function(){
                    if(!angular.isUndefined($scope.ubigeo.departamento) && $scope.ubigeo.departamento){
                        $scope.provincias = $scope.ubigeo.departamento.$getProvincias().$object;
                        ngModel[0].$setDirty();
                    } else {
                        $scope.ubigeo.provincia = undefined;
                        $scope.ubigeo.distrito = undefined;

                        $scope.provincias = undefined;
                        $scope.distritos = undefined;
                    }
                });
                $scope.$watch('ubigeo.provincia', function(){
                    if(!angular.isUndefined($scope.ubigeo.provincia) && $scope.ubigeo.provincia){
                        $scope.distritos = SGProvincia.$getDistritos($scope.ubigeo.departamento.codigo, $scope.ubigeo.provincia.codigo).$object;
                    } else {
                        $scope.ubigeo.distrito = undefined;

                        $scope.distritos = undefined;
                    }
                });
                $scope.$watch('ubigeo.distrito', function(){
                    if(!angular.isUndefined($scope.ubigeo.distrito) && $scope.ubigeo.distrito){
                        var ubigeo = $scope.ubigeo.departamento.codigo + $scope.ubigeo.provincia.codigo + $scope.ubigeo.distrito.codigo;
                        ngModel[1].$setViewValue(ubigeo);
                    }
                });

                $scope.activeListener = function(){
                    var listener = $scope.$watch(function(){return ngModel[1].$modelValue}, function(){
                        if( ngModel[1].$modelValue
                            && ngModel[1].$modelValue.length == 6
                                //&& angular.isUndefined($scope.departamentos)
                            && angular.isUndefined($scope.provincias)
                            && angular.isUndefined($scope.distritos)){

                            for(var i=0;i<$scope.departamentos.length;i++){
                                if($scope.departamentos[i].codigo == ngModel[1].$modelValue.substring(0, 2)){
                                    $scope.ubigeo.departamento = $scope.departamentos[i];
                                    break;
                                }
                            }

                            $scope.ubigeo.departamento.$getProvincias().then(function(data){
                                $scope.provincias = data;
                                for(var i=0;i<$scope.provincias.length;i++){
                                    if($scope.provincias[i].codigo == ngModel[1].$modelValue.substring(2, 4)){
                                        $scope.ubigeo.provincia = $scope.provincias[i];
                                        break;
                                    }
                                }

                                SGProvincia.$getDistritos($scope.ubigeo.departamento.codigo, $scope.ubigeo.provincia.codigo).then(function(data){
                                    $scope.distritos = data;

                                    for(var i=0;i<$scope.distritos.length;i++){
                                        if($scope.distritos[i].codigo == ngModel[1].$modelValue.substring(4, 6)){
                                            $scope.ubigeo.distrito = $scope.distritos[i];
                                            break;
                                        }
                                    }
                                });

                            });
                            listener();
                        } else {
                            listener();
                        }
                    });
                };
            },
            scope: {
                requerido: '@'
            },
            template: ''
            +'<div class="row">'
            +'<div class="col-sm-4">'
            +'<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.departamento.$invalid && (formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted)}">'
            +'<label>Departamento</label>'
            +'<ui-select name="departamento" ng-model="ubigeo.departamento">'
            +'<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            +'<ui-select-choices repeat="item in departamentos | filter: $select.search">'
            +'<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            +'<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            +'</ui-select-choices>'
            +'</ui-select>'
            +'<div ng-messages="formSgUbigeo.departamento.$error" ng-if="formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted">'
            +'<div class="help-block" ng-message="required">Ingrese departamento.</div>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'<div class="col-sm-4">'
            +'<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.provincia.$invalid && (formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted)}">'
            +'<label>Provincia</label>'
            +'<ui-select name="provincia" ng-model="ubigeo.provincia">'
            +'<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            +'<ui-select-choices repeat="item in provincias | filter: $select.search">'
            +'<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            +'<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            +'</ui-select-choices>'
            +'</ui-select>'
            +'<div ng-messages="formSgUbigeo.provincia.$error" ng-if="formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted">'
            +'<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'<div class="col-sm-4">'
            +'<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.provincia.$invalid && (formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted)}">'
            +'<label>Distrito</label>'
            +'<ui-select name="distrito" ng-model="ubigeo.distrito">'
            +'<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            +'<ui-select-choices repeat="item in distritos | filter: $select.search">'
            +'<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            +'<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            +'</ui-select-choices>'
            +'</ui-select>'
            +'<div ng-messages="formSgUbigeo.distrito.$error" ng-if="formSgUbigeo.distrito.$touched || formSgUbigeo.$submitted">'
            +'<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>'
        }
    });







    /**
     * Module sg-utils-persona.
     *
     * Utils generales para sg-utils-persona.
     * Estas clases dependen de sg-persona.
     */




})();