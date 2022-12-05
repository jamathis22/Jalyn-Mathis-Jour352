(function($) {
	// show searchtext (if any) in search field in sidebar
	var searchText = getUrlParameter("s");
	if (searchText != null) {
		$(".searchform input[name='s']").val(searchText);

		// keep category, tag, year filter values if changing sort by
		//
		var searchCats = getUrlParameter("category_name");
		if (searchCats != null) {
			$(".jetpack-search-form .searchform").append("<input type='hidden' name='category_name' value='"+searchCats+"'/>");
		}

		var searchTags = getUrlParameter("tag");
		if (searchTags != null) {
			$(".jetpack-search-form .searchform").append("<input type='hidden' name='tag' value='"+searchTags+"'/>");
		}

		var searchYears = getUrlParameter("year");
		if (searchYears != null) {
			$(".jetpack-search-form .searchform").append("<input type='hidden' name='year' value='"+searchYears+"'/>");
		}
	}

	$(".search .remove-filter").click(function() {
		var filterType = ($(this).data("filter-type")); 
		var removeValue = ($(this).data("filter-value")); 
		var uri = new URI(window.location.href);
		var uriSearch = uri.search(true);
		if (filterType in uriSearch) {
			var filterValues = uriSearch[filterType].split("+");
			filterValues = jQuery.grep(filterValues, function(value) {
				return value != removeValue;
			});
			uri.setSearch(filterType, filterValues.join("+"));
		}

		// if keyword search removed -OR- no keyword in search, 
		// show newest results first if currently ordered by relevance
		//if ((filterType == "s" || searchText == "") && ("orderby" in uriSearch && uriSearch["orderby"]=="relevance")) {
		//	uri.setSearch("orderby", "date");
		//	uri.setSearch("order", "DESC");
		//}

		
		window.location = uri.toString();
	});

	$(".author .authorpage h5 a").each(function() {
		var heading = $(this).parent();
		var childLinkText = $(this).text();
		$(this).remove();
		heading.text(childLinkText);
	});

	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (isSafari) {
		var mediaQueryList = window.matchMedia("print");
		mediaQueryList.addListener(function(mql) {
			if (mql.matches) {
				doBeforePrint();
			}
		});
	}
	else {
		window.onbeforeprint = function(event) {
			doBeforePrint();
		}
	}

        if (window.location.host == "dev.cnsmaryland.org" ) {
                $("header.header").before("<div class='devstatus'>*** DEVELOPMENT SITE ***</div>");
                $(".devstatus").css({
                        'background-color': 'red',
                        'color' : 'white',
                        'font-weight': 'bold',
                        'text-align': 'center'
                });
        }

})(jQuery);

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function doBeforePrint() {
	// TODO/FIX: need to force images to be loaded before printing
	//jQuery("img").data("no-lazy", 1);
}

