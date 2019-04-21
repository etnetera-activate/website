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

			// For consoleQuest step 3
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
	if (window.location.pathname=="/"&& step==undefined) {dataLayer.push({console:consoleQuestTexts[1]})};
}

// Notification to console
consoleQuest.notify = function (textNmb, styleNmb, treasure) {
	if (treasure == 1) {console.log ("%c"+consoleQuestLoot[textNmb], consoleQuestNotifyStyles[styleNmb])}
	else {console.log ("%c"+consoleQuestTexts[textNmb], consoleQuestNotifyStyles[styleNmb])};
}

// Treasure notification to console
var consoleQuestFirstLooted = 0;

consoleQuest.treasure = function(){
	var randomLoot = Math.floor(Math.random()*consoleQuestLoot.length);
	if (consoleQuestFirstLooted == 0) {consoleQuest.notify(4,1); consoleQuestFirstLooted = 1};
	if (consoleQuestLoot.length != 0){
		consoleQuest.notify(randomLoot,1,1);
		consoleQuestLoot.splice(randomLoot,1);
	} else {
		consoleQuest.notify(5,1)
	}
}

// Texts for notification to console
var consoleQuestTexts = [
	"Vítej poutníče,\nvypadáš unaveně. Jistě tě sem, do naší putiky U černé konzole, dovedla dlouhá a náročná cesta.\nBohužel není času nazbyt. Měl bych pro tebe úkol hodný hrdiny. Hrdiny, jež se zrodí nejvýše jednou za generaci. Uprostřed tajemného labyrintu jménem webová analytika se skrývá cenný poklad.\nJsi odvážného ducha a troufneš si ho hledat? Pokud ano, pokud se nebojíš, vyhledej místo známé jako datová vrstva ve které vládne mocný krutovládce Google. Budu tam na tebe čekat.\nHodně štěstí!",
	"Zdravím tě,\nprvní překážky jsi se nezalekl a překonal jsi ji bez zaváhání. To velmi rád vidím.\nDokázal jsi tím, že jsi moudrý a odvážný a dokážeš tedy uchopit to, co se ti hodlám předat. V království toho webu nevládne pouze Google, ale i jeho další bratři jako Adobe, Matomo a Snowplow. A každý z nich ale požaduje vybírat od svých poddaných data jiným způsobem. A co pak má dělat chudák bežná funkce, když musí odvést svůj datový desátek všem těmto mocnostem?\nVelký čaroděj pomocí svých mocných kouzel tedy přivedl k existenci funkci measure. Hodnou a dobrotivou funkci, která vybere data a přerozdělí je jednotlivým vládcům v podobách jaké požadují. Zavolej funkci measure.notify s parametrem true a udivíš, jaká data measure dostává.\nNyní musíš vyhledat samotného čaroděje dechberoucího Lukáše Čecha. Vyhledej jeho portrét a sleduj, co on předá dobréfunkci measure.\n/ Dokud nebude naimplementováno, tak zavolej measure({action:'slideShowMouseover', slideShowPerson:'Lukáš Čech'}) /",
	"Kdo jsi a proč mě rušíš z mých meditací?\nPoklad? Ty si jdeš pro poklad? No to je velmi troufalé!\nNeřeknu ti, kde se poklad nachází, neb sám to nevím. Byl ukryt před dávnými časi, generace ho již nikdo nespatřil a mnozí již pochybují o jeho samé existenci.\nVím ale kde můžeš najít mapu k pokladu. Je skryta v pradávné jeskyni. Vchod do této jeskyně je schovaný pod hitem směřujícím do Matoma a otevřela se před okamžikem, když jsi rozpohyboval můj obraz.\nUtíkej, není čas ztrácet čas!",
	"Poklad získá ten, kdo hrdě a beze strachu, nahlas pronese pradávná slova moci 'consoleQuest.treasure()'",
	"Dokázal jsi to!\nPřekonal jsi všechna protiventví osudu, vahledal mocného čaroděje a nalezl mapu.\nPokud by jsi se chtěl v budoucnu zůčastnit nějaké výpravy s námi, pošli holuba do našeho hradu 'my@activate.cz' a třeba se společně vypravíme k pojhádkovému bohatství i nehynoucí slávě.\nNyní již ber svou zaslouženou odměnu hrdino. Ber dokud pokladnice nebude prázdná.",
	"Pokladnice už je bohužel prázdná. U nás ve firemním Slacku ale zaručen dobrý vtip každy den."
];

// CSS Styles for notification to console
var consoleQuestNotifyStyles = [
	"border: 3px solid red",
	"border-left: 4px dotted blue"
];

// Jokes for treasure
var consoleQuestLoot = [
	" 1-Sranda",
	" 2-Vtip",
	" 3-Fór",
	" 4-Gag",
	" 5-Psina",
	" 6-Hlína"
];

consoleQuest();