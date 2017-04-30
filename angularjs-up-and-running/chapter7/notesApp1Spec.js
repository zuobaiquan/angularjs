// File: chapter7/notesApp1Spec.js

describe('ItemCtrl with inline mock', function () {
    beforeEach(module('notesApp1')); // instantiate our module

    var ctrl, mockService;

    // override the ItemService with our own mock
    beforeEach(module(function ($provide) {
        mockService = {
            list: function () {
                return [{id: 1, label: 'Mock'}];
            }
        };

        $provide.value('ItemService', mockService);
    }));

    beforeEach(inject(function ($controller) {
        ctrl = $controller('ItemCtrl');
    }));

    it('should load mocked out items', function () {
        expect(ctrl.items).toEqual([{id: 1, label: 'Mock'}]);
    });

});
