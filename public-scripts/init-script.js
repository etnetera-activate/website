var digitalData = digitalData || {};

(function(a, k, t, i, v, u, j, e, m) {
// Async queue initialization
	a[i] = a[i] || function() {
		(a[i].q = a[i].q || []).push(arguments)
	}
// Measure function
	e = k.createElement(t),
	m = k.getElementsByTagName(t)[0],
	e.async = 1,
	e.src="https://combinatronics.com/etnetera-activate/website/master/public-scripts/measureFunction.js";
	m.parentNode.insertBefore(e, m);
// Google Snippet
	e = k.createElement(t),
	m = k.getElementsByTagName(t)[0],
	e.async = 1,
	e.src="https://combinatronics.com/etnetera-activate/website/master/public-scripts/googleSnippet.js";
	m.parentNode.insertBefore(e, m);
// Matomo Snippet
	e = k.createElement(t),
	m = k.getElementsByTagName(t)[0],
	e.async = 1,
	e.src="https://combinatronics.com/etnetera-activate/website/master/public-scripts/matomoSnippet.js";
	m.parentNode.insertBefore(e, m);		
})(window, document, "script", "measure")