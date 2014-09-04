'use strict';

/* Directives */


angular.module('myApp.directives', []).
directive('appVersion', ['version',
	function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	}
])

.directive('drink', function(){
	return {
		scope: {
			flavor: "@"
		},
		template: '<div>{{flavor}}</div>'
		// link: function(scope, elem, attrs) {
		// scope.flavor = attrs.flavor;
		// }
	};
});