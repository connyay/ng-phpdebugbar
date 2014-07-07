(function() {
    'use strict';
    var getDebugBarID = function(response) {
        var headers = response && response.headers && response.headers();
        if (!headers) {
            // Something terrible happened. Bail.
            return;
        }
        // Not very elegant, but this is how the debugbar.js defines the header.
        var headerName = phpdebugbar.ajaxHandler.headerName + '-id';
        return headers[headerName];
    };
    angular.module('ng-phpdebugbar', [])
        .factory('phpDebugBarInterceptor', function() {
            return {
                'request': function(config) {
                    // This is the header that debugbar looks for that triggers
                    // the debugbarid to be returned in the response headers.
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                    return config;
                },
                'response': function(response) {
                    if (phpdebugbar && phpdebugbar.ajaxHandler) {
                        // We have a debugbar and an ajaxHandler
                        // Dig through response to look for the 
                        // debugbar id.
                        var debugBarID = getDebugBarID(response);
                        if (debugBarID) {
                            // A debugBarID was found! Now we just pass the
                            // id to the debugbar to load the data
                            phpdebugbar.loadDataSet(debugBarID, ('ajax'));
                        }
                    }
                    return response;
                }
            };
        })
        .config(['$httpProvider',
            function($httpProvider) {
                // Adds our debug interceptor to all $http requests
                $httpProvider.interceptors.push('phpDebugBarInterceptor');
            }
        ]);

})();