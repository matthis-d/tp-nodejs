'use strict';

zenContactApp.controller('ContactListController', ['$scope', 'contactService', 'Contact', function ($scope, contactService, Contact) {
//    contactService.getAllContacts(function (contacts) {
//        $scope.contacts = contacts;
//    });
  $scope.contacts = Contact.query();

  if (typeof io != 'undefined') {
    var socket = io.connect();
    socket.on('contacts', function (contacts) {
      $scope.$apply(function () {
        $scope.contacts = contacts;
      });
    });
  }
}]);

zenContactApp.controller('ContactEditController', ['$scope', 'contactService', '$routeParams', '$location', 'Contact', function ($scope, contactService, $routeParams, $location, Contact) {
  if ($routeParams.id) {
//    contactService.getContactById($routeParams.id, function (contact) {
//        $scope.contact = contact;
//    });

    $scope.contact = Contact.get({id: $routeParams.id});
  } else {
    $scope.contact = new Contact();
  }

  $scope.saveContact = function (contact) {
//        contactService.saveContact(contact, function (err) {
//            if (!err) {
//                $location.path("/list");
//            } else {
//                console.log(err);
//            }
//        });

    if (typeof contact.id !== "undefined") {
      contact.$update(function () {
        $location.path("/list");
      });
    } else {
      Contact.save(contact, function () {
        $location.path("/list");
      });
    }
  }
}]);
