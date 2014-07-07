(function() {
    'use strict';
    var getDebugBarID = function(response) {
        var headers = response && response.headers && response.headers();
        if (!headers) {
            return false;
        }
        var headerName = phpdebugbar.ajaxHandler.headerName + '-id';
        return headers[headerName] || false;
    };
    angular.module('ng-phpdebugbar', [])
        .factory('phpDebugBarInterceptor', function() {
            return {
                'request': function(config) {
                    // Debugbar looks for this header to send back the debugbar id
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                    return config;
                },
                'response': function(response) {
                    if (phpdebugbar && phpdebugbar.ajaxHandler) {
                        var debugBarID = getDebugBarID(response);
                        if (debugBarID) {
                            phpdebugbar.loadDataSet(debugBarID, ('ajax'));
                        }
                    }
                    return response;
                }
            };
        })
        .config(['$httpProvider',
            function($httpProvider) {
                $httpProvider.interceptors.push('phpDebugBarInterceptor');
            }
        ]);

})();