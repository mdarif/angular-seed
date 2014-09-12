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

.directive('fixedTblHdrLftCol', function() {
	return {
		restrict: 'E',
		templateUrl: './table.html',
		link: function() {
			var table = $('table.grid')[0];

			var cfg = {
				scroll: {
					height: null,
					width: null,
					headRow: {
						className: 'fTHLC-head-row',
						enabled: true,
						overflow: 'auto'
					},
					leftCol: {
						className: 'fTHLC-left-col',
						enabled: true,
						overflow: 'auto',
						fixedSpan: 1
					},
					syncWith: null
				}
			};

			function scrollRows(table) {
				table.find('thead tr').each(function(i) {
					if (i < getHeadRowCount(table)) {
						$(this).find('th').each(function(j) {
							$(this)
								.css('left', table
									.find('tbody tr:first-child td:nth-child(' + (j + 1) + ')')
									.position()
									.left + 'px');
						});
					}
				});
			}

			function getHeadRowCount(table) {
				return table.find('thead tr').length;
			}

			function scrollCols(table) {
				table.find('tbody tr').each(function() {
					for (var i = 0; i < cfg.scroll.leftCol.fixedSpan; i++) {
						$(this)
							.find('td:nth-child(' + (i + 1) + ')')
							.css('top', $(this)
								.find('td:nth-child(' + (cfg.scroll.leftCol.fixedSpan + 1) + ')')
								.position()
								.top + 'px');
					}
				});
			}


			function setTheadCSS(table) {
				var rows = getHeadFirstRows(table);
				var totalHeight = 0;

				rows.each(function(i) {
					var cols = getHeadCols(table, i);
					var totalWidth = 0;

					cols.each(function(j) {
						var width = $(this).outerWidth(true);
						var height = $(this).outerHeight(true);

						totalWidth += width;

						if (j == 0)
							totalHeight += height;

						$(this)
							.addClass(cfg.scroll.headRow.className)
							.css('position', 'absolute')
							.css('top', (totalHeight - height) + 'px')
							.css('left', (totalWidth - width) + 'px');
					});
				});
			}

			function setLeftColumnCSS(table) {
				var total = 0;
				var cols = getFixedLeftCols(table);

				cols.each(function(i) {
					var width = $(this).outerWidth(true);

					total += width;
					table
						.find('tbody tr td:nth-child(' + (i + 1) + ')')
						.addClass(cfg.scroll.leftCol.className)
						.css('position', 'absolute')
						.css('left', (total - width) + 'px');
				});
			}

			var fixedLeftWidth = null;

			function getFixedLeftCols(table) {
				var cols = $([]);

				for (var i = 0; i < cfg.scroll.leftCol.fixedSpan; i++) {
					cols.push(table.find('tbody tr:first-child td:nth-child(' + (i + 1) + ')'));
				}

				return cols;
			}

			function getFixedLeftWidth(table) {
				var width = fixedLeftWidth;

				if (!width) {
					var cols = getFixedLeftCols(table);

					cols.each(function() {
						width += $(this).outerWidth(true);
					});

					fixedLeftWidth = width;
				}

				return width;
			}

			function getTableWidth(table) {
				var width = 0;

				table.find('tbody tr:first-child td').each(function() {
					width += $(this).outerWidth(true);
				});

				return width;
			}

			function setTbodyCSS(table) {
				var leftCornerWidth = getFixedLeftWidth(table);
				var tableWidth = getTableWidth(table);

				table.find('tbody tr').each(function() {
					$(this).css('width', (tableWidth - leftCornerWidth) + 'px');
				});
			}

			function getHeadFirstRows(table) {
				var rows = $([]);

				for (var i = 0; i < getHeadRowCount(table); i++) {
					rows.push(table.find('thead tr:nth-child(' + (i + 1) + ') th:first-child'));
				}

				return rows;
			}

			function getHeadCols(table, n) {
				return table.find('thead tr:nth-child(' + (n + 1) + ') th');
			}

			function setTableCSS(table) {
				var leftCornerWidth = getFixedLeftWidth(table);
				var tableWidth = getTableWidth(table);

				table
					.css('border-collapse', 'collapse')
					.css('width', (tableWidth - leftCornerWidth) + 'px');
			}


			function init(table) {
				setLeftColumnCSS(table);
				setTbodyCSS(table);
				setTheadCSS(table);
				scrollRows($(table));
				scrollCols($(table));
			}

			// function init(table) {
			//   setLeftColumnCSS(table);
			//   setTbodyCSS(table);
			//   setTheadCSS(table);
			//   setTableCSS(table);

			//   createOuter(table);
			//   createInner(table);

			//   recalHeight(table);

			//   if (cfg.corner.append)
			//     appendCorner(table);

			//   recalHeaderPosition(table);
			// }

			init($(table));

			$(table).parent().scroll(function() {
				if (cfg.scroll.headRow.enabled) {

					scrollRows($(table));
				}

				if (cfg.scroll.leftCol.enabled) {
					scrollCols($(table));
				}
			});


		}


	};
})

.directive('drink', function() {
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