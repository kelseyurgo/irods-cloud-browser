'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home/:vcName', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl',
            resolve: {

                // set vc name as selected
                selectedVc: function ($route, virtualCollectionsService) {

                    var vcData = virtualCollectionsService.listUserVirtualCollectionData($route.current.params.vcName);
                    return vcData;
                },
                // do a listing
                pagingAwareCollectionListing: function ($route, collectionsService) {
                    var vcName = $route.current.params.vcName;

                    var path = $route.current.params.path;
                    if (path == null) {
                        path = "";
                    }

                    return collectionsService.listCollectionContents(vcName, path, 0);
                }

            }
        }).when('/home', {
      templateUrl: 'home/home.html',
      controller: 'homeCtrl',
      resolve: {
          // set vc name as selected
          selectedVc: function ($route) {

              return null;
          },
          // do a listing
          pagingAwareCollectionListing: function ($route, collectionsService) {
              return {};
          }

      }
  });
}])
    .controller('homeCtrl', ['$scope','$log', '$http', '$location', 'MessageService','globals','virtualCollectionsService','collectionsService','selectedVc','pagingAwareCollectionListing',function ($scope, $log, $http, $location, MessageService, $globals, $virtualCollectionsService, $collectionsService, selectedVc, pagingAwareCollectionListing) {

        /*
        basic scope data for collections and views
         */

        $scope.selectedVc = selectedVc;
        $scope.pagingAwareCollectionListing = pagingAwareCollectionListing.data;


        /*
        Get a default list of the virtual collections that apply to the logged in user, for side nav
         */
        
        $scope.listVirtualCollections = function () {

            $log.info("getting virtual colls");
            return $http({method: 'GET', url: $globals.backendUrl('virtualCollection')}).success(function (data) {
                $scope.virtualCollections = data;
            }).error(function () {
                $scope.virtualCollections = [];
            });
        };

        /**
         * Handle the selection of a virtual collection from the virtual collection list, by causing a route change and updating the selected virtual collection
         * @param vcName
         */
        $scope.selectVirtualCollection = function (vcName) {
            $log.info("selectVirtualCollection()");
            if (!vcName) {
                MessageCenterService.danger("missing vcName");
                return;
            }

            $log.info("list vc contents for vc name:" + vcName);
            $location.path("/home/" + vcName);
            $location.search("path", "");


        };

        var side_nav_toggled = "no";
        $scope.side_nav_toggle = function () {            
            if (side_nav_toggled == "no"){
                side_nav_toggled = "yes";
                $('.side_nav_options').animate({'opacity':'0'});
                $('#side_nav').animate({'width':'3%'});
                $('#main_contents').animate({'width':'96.9%'});
                $('.side_nav_toggle_button').text('>>');
            }else if(side_nav_toggled == "yes"){  
                side_nav_toggled = "no";      
                $('#main_contents').animate({'width':'81.9%'});
                $('#side_nav').animate({'width':'18%'});
                $('.side_nav_options').animate({'opacity':'1'});
                $('.side_nav_toggle_button').text('<<');
            }
        };
        /**
         * INIT
         */

        $scope.listVirtualCollections();

}])
    .factory('virtualCollectionsService', ['$http', '$log','globals', function ($http, $log, globals) {
        var virtualCollections = [];
        var virtualCollectionContents = [];
        var selectedVirtualCollection = {};

      return {


            listUserVirtualCollections: function () {
                $log.info("getting virtual colls");
                return $http({method: 'GET', url: globals.backendUrl('virtualCollection')}).success(function (data) {
                   virtualCollections = data;
                }).error(function () {
                   virtualCollections = [];
                });
            },

            listUserVirtualCollectionData: function (vcName) {
                $log.info("listing virtual collection data");

                if (!vcName) {
                    virtualCollectionContents = [];
                    return;
                }

                return $http({method: 'GET', url: globals.backendUrl('virtualCollection/') + vcName}).success(function (data) {
                    virtualCollections = data;
                }).error(function () {
                    virtualCollections = [];
                });

            }

        };


    }])
    .factory('collectionsService', ['$http', '$log', 'globals', function ($http, $log, $globals) {

        var pagingAwareCollectionListing = {};

        return {

            selectVirtualCollection : function(vcName) {
                //alert(vcName);
            },

            /**
             * List the contents of a collection, based on the type of virtual collection, and any subpath
             * @param reqVcName
             * @param reqParentPath
             * @param reqOffset
             * @returns {*|Error}
             */
            listCollectionContents: function (reqVcName, reqParentPath, reqOffset) {
                $log.info("doing get of the contents of a virtual collection");

                if (!reqVcName) {
                    $log.error("recVcName is missing");
                    throw "reqMcName is missing";
                }

                if (!reqParentPath) {
                    reqParentPath = "";
                }

                if (!reqOffset) {
                    reqOffset = 0;
                }

                $log.info("requesting vc:" + reqVcName + " and path:" + reqParentPath);
                return $http({method: 'GET', url: $globals.backendUrl('collection/') + reqVcName, params: {path: reqParentPath, offset: reqOffset }}).success(function (response) {
                    pagingAwareCollectionListing = response.data;

                }).error(function () {
                    pagingAwareCollectionListing = {};

                });

            },
            addNewCollection: function(parentPath, childName) {
                $log.info("addNewCollection()");
            }


        };


    }]);

