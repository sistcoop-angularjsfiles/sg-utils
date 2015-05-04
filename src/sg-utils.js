'use strict';

(function(){

    var moduleSgUtilsIso3166 = angular.module('sg-utils-iso3166', []);
    var moduleSgUtilsIso4217 = angular.module('sg-utils-iso4217', []);
    var moduleSgUtilsUbigeo = angular.module('sg-utils-ubigeo', []);
    var moduleSgUtilsPersona = angular.module('sg-utils-persona', []);
    var moduleSgUtilsOrganizacion = angular.module('sg-utils-organizacion', []);
    var moduleSgUtilsCooperativa = angular.module('sg-utils-cooperativa', []);
    var moduleSgUtilsProducto = angular.module('sg-utils-producto', []);
    var moduleSgUtilsRrhh = angular.module('sg-utils-rrhh', []);

    var moduleSgUtils = angular.module('sg-utils',
        [
            'sg-utils-iso3166',
            'sg-utils-iso4217',
            'sg-utils-ubigeo',
            'sg-utils-persona',
            'sg-utils-organizacion',
            'sg-utils-cooperativa',
            'sg-utils-producto',
            'sg-utils-rrhh'
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




    moduleSgUtils.service('SGDialog', ['$modal', function($modal) {
        var dialog = {};

        var openDialog = function(title, message, btns) {
            var controller = function($scope, $modalInstance, title, message, btns) {
                $scope.title = title;
                $scope.message = message;
                $scope.btns = btns;

                $scope.ok = function () {
                    $modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            controller.$inject = ['$scope', '$modalInstance', 'title', 'message', 'btns'];

            return $modal.open({
                template: ''+
                "<div class=\"modal-header\">\n" +
                "<button type=\"button\" class=\"close\" ng-click=\"cancel()\">\n" +
                "<span class=\"pficon pficon-close\"></span>\n" +
                "</button>\n" +
                "<h4 class=\"modal-title\">{{title}}</h4>\n" +
                "</div>\n" +
                "<div class=\"modal-body\">{{message}}</div>\n" +
                "<div class=\"modal-footer\">\n" +
                "<button type=\"button\" data-ng-class=\"btns.cancel.cssClass\" ng-click=\"cancel()\">{{btns.cancel.label}}</button>\n" +
                "<button type=\"button\" data-ng-class=\"btns.ok.cssClass\" ng-click=\"ok()\">{{btns.ok.label}}</button>\n" +
                "</div>\n" +
                "",
                controller: controller,
                resolve: {
                    title: function() {
                        return title;
                    },
                    message: function() {
                        return message;
                    },
                    btns: function() {
                        return btns;
                    }
                }
            }).result;
        };

        var escapeHtml = function(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        };

        dialog.confirmDelete = function(name, type, success) {
            var title = 'Eliminar ' + escapeHtml(type.charAt(0).toUpperCase() + type.slice(1));
            var msg = '¿Estas seguro de querer eliminar permanentemente el/la ' + type + ' ' + name + '?';
            var btns = {
                ok: {
                    label: 'Eliminar',
                    cssClass: 'btn btn-danger'
                },
                cancel: {
                    label: 'Cancelar',
                    cssClass: 'btn btn-default'
                }
            };

            openDialog(title, msg, btns).then(success);
        };

        dialog.confirmGenerateKeys = function(name, type, success) {
            var title = 'Generate new keys for realm';
            var msg = 'Are you sure you want to permanently generate new keys for ' + name + '?';
            var btns = {
                ok: {
                    label: 'Generate Keys',
                    cssClass: 'btn btn-danger'
                },
                cancel: {
                    label: 'Cancel',
                    cssClass: 'btn btn-default'
                }
            };

            openDialog(title, msg, btns).then(success);
        };

        dialog.confirm = function(title, message, success, cancel) {
            var btns = {
                ok: {
                    label: title,
                    cssClass: 'btn btn-danger'
                },
                cancel: {
                    label: 'Cancel',
                    cssClass: 'btn btn-default'
                }
            };

            openDialog(title, message, btns).then(success, cancel);
        };

        return dialog
    }]);


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

    moduleSgUtilsUbigeo.directive('sgUbigeo',['SGUbigeo', function(SGUbigeo){
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

                SGUbigeo.$search().then(function(data){
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
                        $scope.distritos = SGUbigeo.$getDistritos($scope.ubigeo.departamento.ubigeoDepartamento, $scope.ubigeo.provincia.ubigeoProvincia).$object;
                    } else {
                        $scope.ubigeo.distrito = undefined;

                        $scope.distritos = undefined;
                    }
                });
                $scope.$watch('ubigeo.distrito', function(){
                    if(!angular.isUndefined($scope.ubigeo.distrito) && $scope.ubigeo.distrito){
                        var ubigeo = $scope.ubigeo.distrito.ubigeo;
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
                                if($scope.departamentos[i].ubigeoDepartamento == ngModel[1].$modelValue.substring(0, 2)){
                                    $scope.ubigeo.departamento = $scope.departamentos[i];
                                    break;
                                }
                            }

                            $scope.ubigeo.departamento.$getProvincias().then(function(data){
                                $scope.provincias = data;
                                for(var i=0;i<$scope.provincias.length;i++){
                                    if($scope.provincias[i].ubigeoProvincia == ngModel[1].$modelValue.substring(2, 4)){
                                        $scope.ubigeo.provincia = $scope.provincias[i];
                                        break;
                                    }
                                }

                                SGUbigeo.$getDistritos($scope.ubigeo.departamento.ubigeoDepartamento, $scope.ubigeo.provincia.ubigeoProvincia).then(function(data){
                                    $scope.distritos = data;

                                    for(var i=0;i<$scope.distritos.length;i++){
                                        if($scope.distritos[i].ubigeoDistrito == ngModel[1].$modelValue.substring(4, 6)){
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
    }]);







    /**
     * Module sg-utils-persona.
     *
     * Utils generales para sg-utils-persona.
     * Estas clases dependen de sg-persona.
     */







    /**
     * Module sg-utils-cooperativa.
     *
     * Utils generales para sg-utils-cooperativa.
     * Estas clases dependen de sg-persona.
     */

    moduleSgUtilsCooperativa.directive('sgMonedaBovedaAgenciaValidate', function($q, SGBoveda) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link:function($scope, elem, attrs, ngModel){
                $scope.agencia;
                attrs.$observe('sgAgencia', function(val) {
                    if(val){
                        ngModel.$setViewValue(null);
                        ngModel.$render();
                    }
                    $scope.agencia = $scope.$eval(val);
                });

                ngModel.$asyncValidators.disponible = function(modelValue, viewValue){
                    var value = modelValue || viewValue;
                    if($scope.agencia){

                        return SGBoveda.$search({agencia: $scope.agencia.codigo}).then(
                            function(response){
                                for(var i=0; i < response.length; i++){
                                    if(response[i].moneda == value.alphabeticCode){
                                        return $q.reject('Moneda ya existente en agencia.');
                                    }
                                }
                                return true;
                            }, function error(){
                                return $q.reject('error');
                            }
                        );

                    } else {
                        return $q.when();
                    }

                };
            }
        };
    });



    /**
     * Module sg-utils-rrhh.
     *
     * Utils generales para sg-utils-rrhh.
     * Estas clases dependen de sg-rrhh.
     */

    moduleSgUtilsRrhh.directive('sgAbreviaturaSucursalValidate', function($q, SGSucursal) {
        return {
            restrict:'AE',
            require: 'ngModel',
            scope: {
                sgExclude: '=sgExclude'
            },
            link:function($scope, elem, attrs, ngModel){
                var selfInclude = $scope.$eval(attrs.sgSelfInclude);
                ngModel.$asyncValidators.disponible = function(modelValue, viewValue){
                    var value = modelValue || viewValue;
                    return SGSucursal.$findByAbreviatura(value).then(
                        function(response){
                            if(response){
                                if($scope.sgExclude){
                                    if(response.id == $scope.sgExclude.id){
                                        return true;
                                    }
                                }
                                return $q.reject('Abreviatura de sucursal no disponible');
                            }
                            else {
                                return true;
                            }
                        },
                        function error(response){
                            return $q.reject('Error al buscar sucursal');
                        }
                    );
                };
            }
        };
    });

    moduleSgUtilsRrhh.directive('sgDenominacionSucursalValidate', function($q, SGSucursal) {
        return {
            restrict:'AE',
            require: 'ngModel',
            scope: {
                sgExclude: '=sgExclude'
            },
            link:function($scope, elem, attrs, ngModel){
                var selfInclude = $scope.$eval(attrs.sgSelfInclude);
                ngModel.$asyncValidators.disponible = function(modelValue, viewValue){
                    var value = modelValue || viewValue;
                    return SGSucursal.$findByDenominacion(value).then(
                        function(response){
                            if(response){
                                if($scope.sgExclude){
                                    if(response.id == $scope.sgExclude.id){
                                        return true;
                                    }
                                }
                                return $q.reject('Denominacion de sucursal no disponible');
                            }
                            else {
                                return true;
                            }
                        },
                        function error(response){
                            return $q.reject('Error al buscar sucursal');
                        }
                    );
                };
            }
        };
    });

    moduleSgUtilsRrhh.directive('sgCodigoAgenciaValidate', function($q, SGAgencia) {
        return {
            restrict:'AE',
            require: 'ngModel',
            link:function($scope,elem,attrs,ngModel){
                ngModel.$asyncValidators.disponible = function(modelValue,viewValue){
                    var value = modelValue || viewValue;
                    return SGAgencia.$findByCodigo(value).then(
                        function(response){
                            if(response)
                                return $q.reject('Codigo de agencia no disponible');
                            else
                                return true;
                        },
                        function error(response){
                            return $q.reject('Error');
                        }
                    );
                };
            }
        };
    });

    angular.module("sgtemplate/modal/modal.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("sgtemplate/modal/modal.html",
            "<div class=\"modal-header\">\n" +
            "<button type=\"button\" class=\"close\" ng-click=\"cancel()\">\n" +
            "<span class=\"pficon pficon-close\">×</span>\n" +
            "</button>\n" +
            "<h4 class=\"modal-title\">{{title}}</h4>\n" +
            "</div>\n" +
            "<div class=\"modal-body\">{{message}}</div>\n" +
            "<div class=\"modal-footer\">\n" +
            "<button type=\"button\" data-ng-class=\"btns.cancel.cssClass\" ng-click=\"cancel()\">{{btns.cancel.label}}</button>\n" +
            "<button type=\"button\" data-ng-class=\"btns.ok.cssClass\" ng-click=\"ok()\">{{btns.ok.label}}</button>\n" +
            "</div>\n" +
            ""
        );
    }]);



})();