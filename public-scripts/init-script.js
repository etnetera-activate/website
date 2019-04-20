var digitalData = digitalData || {};
digitalData._log = [];

// Google measurement snippet
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W6M9MSR')

// Matomo measurement snippet
var _paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
	var u="//matomo.activate.cz/";
	_paq.push(['setTrackerUrl', u+'matomo.php']);
	_paq.push(['setSiteId', '6']);
	var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
	g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();


// Main measure function
measure = function (data) {

	measure.notify (data);
	measure.add (data);
	measure.google (data);
	
	//if (data.action=="slideShowMouseover" && data.slideShowPerson=="Lukáš Čech") {consoleQuest(3)};
}

// Notification to console
measure.notify = function (data){
	switch (data) {
		case true:
			localStorage.setItem("measureLog", true);
			break;
		case false:
			localStorage.setItem("measureLog", false);
			break;
		default:
			var measureLog = localStorage.getItem("measureLog");

			var consoleQuest3;
			if (data.action=="slideShowMouseover" && data.slideShowPerson=="Lukáš Čech") {consoleQuest3 = "\n"+consoleQuestTexts[2]};

			if (measureLog == "true"){
				console.group();
				console.warn ("Measure function has received:\n" +
					JSON.stringify(data, null, 2) +
					consoleQuest3);
				console.groupEnd();
			}
	}
}

// Add data to digitalData
measure.add = function (data){
	window.digitalData = measure.deepMerge (window.digitalData, data);
	digitalData._log.push (data)
}

// Merge two objects
measure.deepMerge = function (orgData, newData) {
    var isArray = Array.isArray(newData);
    var mergedData = isArray && newData || {};

    if (!isArray) {
      if (orgData && typeof orgData === 'object') {
        Object.keys(orgData).forEach(function (key) {
          mergedData[key] = orgData[key];
        });
      }
      Object.keys(newData).forEach(function (key) {
        if (typeof newData[key] !== 'object' || !newData[key]) {
          mergedData[key] = newData[key];
        } else {
          if (!orgData[key]) {
            mergedData[key] = newData[key];
          } else {
            mergedData[key] = measureInterface._deepMerge(orgData[key], newData[key]);
          }
        }
      });
    }
    return mergedData;
};

// Measurement data transfer for Google
measure.google = function (data){
	if (data.action != undefined) {
		data.event = data.action;
	}
    dataLayer.push (data)
}


// Console Quest
consoleQuest = function (step) {
	// Step 1
	if (window.location.pathname=="/" && step==undefined) {consoleQuest.notify (0,0)};
	// Step 2
	if (window.location.pathname=="/"&& step==undefined) {dataLayer[0]={consoleQuest:consoleQuestTexts[1]}};
	// Step 3
	if (step==3) {measure.notify(consoleQuestTexts[2])};

}

// Notification to console
consoleQuest.notify = function (textNmb, styleNmb) {
	console.log ("%c"+consoleQuestTexts[textNmb], consoleQuestNotifyStyles[styleNmb])
}

// Texts for notification to console
var consoleQuestTexts = [
	" Vítej poutníku!\n  Je to tady doste pěkný co? No tak taky jsme jako fakt krutopřísná firma.\n  No každopádně není čas ztrácet čas a ryhle jukni do prvního elementu datový vrstvy Google Tag Manageru. Piece of cake, ne?",
	"Tak se zase potkáváme. Vidím, že s technologií vod Googlu jsi moc dobře obeznámem. Pěkná práce. Každopádně pouze Google není živ člověk. Takže tady pro notifikaci eventů nepoužíváme dataLayer.push, ale funkci measure. Když si ji zavoláš s parametrem true, tak ti začne do konzole vypisovat, jaká data dostavá. Hustý ne? Teď se dobrodruhu vydej do země s fokama lidí, co u nás pracujou a vyhledej Lukáše Čecha, ten ti poradí, kudy dál. See ya.",
	"Ahoj, Já jsem Lukáš Čech a jsem starý moudrý čaroděj a podobný pindy."
];

// CSS Styles for notification to console
var consoleQuestNotifyStyles = [
	"border: 3px solid red",
	"border-left: 4px dotted blue"
];

consoleQuest();