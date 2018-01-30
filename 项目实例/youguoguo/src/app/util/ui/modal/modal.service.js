(function() {
    'use strict';

    angular
        .module('util.ui.modal')
        .factory('modalService', modalService);

    /* @ngInject */
    function modalService($uibModal, $q) {
        var service = {
            openConfirmModal: openConfirmModal,
            openErrorModal: openErrorModal,
            openBackModel: openBackModel,
            tip: tipModal,
            preview: previewModal,
            editModal: editModal
        };
        return service;

        /**
         * 打开confirm modal, 并返回点击确认后的promise
         * @param tip
         */
        function openConfirmModal(tip) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: 'app/util/ui/modal/confirm-modal.html',
                size: 'md',
                controller: 'ConfirmModal',
                controllerAs: 'vm',
                resolve: {
                    data: function() {
                        return angular.copy(tip);
                    }
                }
            });

            return instance.result;
        }

        /**
         * 打开error modal
         * @param tip
         */
        function openErrorModal(tip) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/util/ui/modal/error-modal.html',
                size: 'md',
                controller: 'ErrorModal',
                controllerAs: 'vm',
                resolve: {
                    data: function() {
                        return angular.copy(tip);
                    }
                }
            });
        }

        /**
         * [页面有修改但未保存时提醒]
         * @param  {[type]} tip [提醒信息]
         * @return {[type]}     [description]
         */
        function openBackModel(tip) {
            $uibModal.open({
                templateUrl: "app/util/ui/modal/backModal.html",
                controller: "backModalCtrl",
                controllerAs: 'vm',
                resolve: {
                    modal: function() {
                        return angular.copy(tip);
                    }
                }
            });
        }

        function tipModal(tip) {
            var deferred = $q.defer();
            $uibModal.open({
                templateUrl: "app/util/ui/modal/tipModal.html",
                controller: "TipModalCtrl",
                controllerAs: 'vm',
                resolve: {
                    modal: function() {
                        return angular.copy(tip);
                    }
                }
            }).result.then(function(res) {
                if (res === "success") {
                    deferred.resolve("success");
                } else {
                    deferred.reject("fail");
                }
            });
            return deferred.promise;
        }

        function previewModal(ctrl, page, modal) {
            $uibModal.open({
                templateUrl: page,
                controller: ctrl,
                controllerAs: 'vm',
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            });
        }

        function editModal(ctrl, page, modal) {
            var deferred = $q.defer();
            $uibModal.open({
                templateUrl: page,
                controller: ctrl,
                controllerAs: 'vm',
                resolve: {
                    modal: function() {
                        return angular.copy(modal);
                    }
                }
            }).result.then(function(res) {
                if (res === "success") {
                    deferred.resolve("success");
                } else {
                    deferred.reject("fail");
                }
            });
            return deferred.promise;
        }

    }

})();
