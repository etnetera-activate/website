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

_paq.push(['trackPageView']);

// Main measure function
measure = function (data) {

	measure.notify (data);
	measure.add (data);
	measure.google (data);
	measure.matomo (data);
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
			if (data.action=="portraitClick" && data.portraitPerson=="Lukáš Čech") {consoleQuest3 = "\n\n"+consoleQuestTexts[2]};

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

// Measurement data tranfer for Matomo
measure.matomo = function (data) {
	data = data || {};

	switch (data.action) {
			case 'contactFormSent':
					_paq.push(['trackEvent', 'Contact Form Sent', undefined, undefined]);
					break;
			case 'footerClick':
					_paq.push(['trackEvent', 'Footer Click', data.footerElementName, undefined]);
					break;
			case 'contactsClick':
					_paq.push(['trackEvent', 'Contacts Click', data.contactsElementName, undefined]);
					break;
			case 'usedTechnologyClick':
					_paq.push(['trackEvent', 'Used Technology Click', data.technology, undefined]);
					break;
			case 'anchorClick':
					_paq.push(['trackEvent', 'Anchor Click', data.anchorName, undefined]);
					break;
			case 'portraitClick':
					// consoleQuest step 4
					if (data.portraitPerson == "Lukáš Čech"){
							_paq.push(['setCustomDimension', 1, "Poklad získá ten, kdo hrdě a beze strachu, nahlas pronese pradávná slova moci 'consoleQuest.treasure()'"]);
					};
					_paq.push(['trackEvent', 'Portrait Click', data.portraitPerson, undefined]);
					break;
			default:
					measure.notify ('No instructions for Matomo with action: "' + data.action + '"');
	};
};


// Console Quest
consoleQuest = function (step) {
	// consoleQuest step 1
	if (window.location.pathname=="/" && step==undefined) {consoleQuest.notify (0,0)};
	// consoleQuest step 2
	if (window.location.pathname=="/"&& step==undefined) {dataLayer.push({quest:consoleQuestTexts[1]})};
	// consoleQuest step 3 - in measure.notify
	// consoleQuest step 4 - in measure.matomo
	// consoleQuest step 5 - in consoleQuest.treasure
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
	if (consoleQuestFirstLooted == 0) {consoleQuest.notify(4,0); consoleQuestFirstLooted = 1};
	if (consoleQuestLoot.length != 0){
		consoleQuest.notify(randomLoot,1,1);
		consoleQuestLoot.splice(randomLoot,1);
	} else {
		consoleQuest.notify(5,0)
	}
}

// Texts for notification to console
var consoleQuestTexts = [
	"Vítej poutníče,\nvypadáš unaveně a jistě tě sem, do naší putiky U černé konzole, dovedla dlouhá a náročná cesta.\nBohužel není času nazbyt. Měl bych pro tebe úkol hodný hrdiny. Hrdiny, jež se zrodí nejvýše jednou za generaci. Uprostřed tajemného labyrintu jménem webová analytika se skrývá cenný poklad.\nJsi odvážného ducha a troufneš si ho hledat? Pokud ano, pokud se nebojíš, vyhledej místo známé jako datová vrstva ve které vládne mocný krutovládce Google. Budu tam na tebe čekat.\nHodně štěstí!",
	"Znovu se setkáváme poutníče,\nprvní překážky jsi se nezalekl a překonal jsi ji bez zaváhání. To velmi rád vidím.\nDokázal jsi tím, že jsi moudrý a odvážný, ale především že dokážeš uchopit tajemství, které ti hodlám předat.\nV království tohoto webu nevládne pouze Google, ale i jeho další bratři jako Adobe, Matomo a Snowplow. A každý z nich ale požaduje vybírat od svých poddaných data jiným způsobem. A co pak má dělat chudák bežná funkce, když musí odvést svůj datový desátek všem těmto mocnostem?\nVelký čaroděj pomocí svých mocných kouzel tedy přivedl k existenci funkci measure. Hodnou a dobrotivou funkci, která vybere data a přerozdělí je jednotlivým vládcům v podobách jaké požadují. Zavolej funkci measure.notify s parametrem true a uvidíš, jaká data measure dostává.\nNyní musíš vyhledat samotného čaroděje dechberoucího Lukáše Čecha. Vyhledej jeho portrét a sleduj, co on předá spravedlivé funkci measure.",
	"Kdo jsi a proč mě rušíš z mých meditací?\nPoklad? Ty si jdeš pro poklad? No to je velmi troufalé!\nNeřeknu ti, kde se poklad nachází, neb sám to nevím. Byl ukryt před dávnými časi, generace ho již nikdo nespatřil a mnozí již pochybují o jeho samé existenci.\nVím ale kde můžeš najít mapu k pokladu. Je skryta v pradávné jeskyni. Vchod do této jeskyně je schovaný pod hitem směřujícím do Matoma a otevřela se před okamžikem, když jsi kliknul na můj obraz.\nUtíkej, není čas ztrácet čas!\n/ Dokud nebude naimplementováno Matomo, tak hledej GA collect /",
	"Poklad získá ten, kdo hrdě a beze strachu nahlas pronese pradávná slova moci 'consoleQuest.treasure()'",
	"Dokázal jsi to!\nPřekonal jsi všechna protiventví osudu, vyhledal jsi mocného čaroděje a nalezl mapu dávno ztraceného pokladu.\nPokud by ses v budoucnu chtěl zúčastnit nějaké výpravy s námi, pošli holuba do našeho hradu 'my@activate.cz' a třeba se společně vypravíme k pohádkovému bohatství i nehynoucí slávě.\nNyní již ber svou zaslouženou odměnu hrdino. Ber dokud pokladnice nebude prázdná.",
	"Pokladnice už je bohužel prázdná. U nás ve firemním Slacku ale zaručen dobrý vtip každy den."
];

// CSS Styles for notification to console
var consoleQuestNotifyStyles = [
	"color: #1111c1; font-size: 130%; font-weight: 600",
	"color: #b79000; font-size: 115%; font-weight: 600",
	"background: linear-gradient(#092ae5, #030f56);border: 1px solid #3E0E02;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset;line-height: 40px;text-align: center;font-weight: bold",
	"border-left: 4px solid #092ae5"
];

// Jokes for treasure
var consoleQuestLoot = [
	'Farář zpovídá kostelníka.\nKostelník mluví, mluví a když skončí, farář povídá: "A to je všechno? Kdo mi chodí na mešní víno?"\nKostelník na to: "Tady je nějak špatně slyšet, pane faráři."\n"Nelži, kostelníku! Pán tě slyší!"\n"Tak si to pojďte zkusit, pane faráři."\nTak se vyměněj, kostelník si sedne na farářovo místo a farář se jde zpovídat. Kostelník povídá:\n"Tak co, pane faráři, kdo mi chodí za ženou?"\n"Máš pravdu, kostelníku. Je tu nějak špatně slyšet."',
	'Pět lékařů je na lovu kachen. Praktický, dětský, psychiatr, chirurg a patolog.\nLetí kachna, praktický lékař zamíří a povídá: „Je to kachna? Možná ne, budu to muset prokonzultovat.“ Kachna mezitím uletí.\nLetí druhá kachna, dětský lékař zamíří: „Myslím, že je to kachna, ale co když má děti, musím to promyslet.“ Než se rozmyslí, kachna uletí.\nLetí další kachna, psychiatr zamíří: „Vím, že je to kachna, ale ví to i ona? Zná svoji identitu?“ Než to domyslí, kachna samozřejmě uletí.\nLetí další kachna, na řadě je chirurg, zamíří a kachnu střelí. Kachna spadne, chirurg se otočí na patologa a řekne: „Jděte se podívat, jestli to byla kachna.“',
	'Přijde muž nešťastnou náhodou o přirození a navštíví plastického chirurga s tím,zda by mohl získat nástroj nový. Doktor v operaci nevidí žádný problém. Jen je nutné vybrat velikost.\n"Máme tři druhy" vysvětluje a názorně na modelech ukazuje.\n"Malého, kterého jste měl zřejmě vy, za sedm tisíc, většího za patnáct a největšího za dvaadvacet tisíc.\nNež se ale rozhodnete s konečnou platností pro jednu z variant, možná by bylo dobré se poradit s manželkou."\nMuž doma přednese všechny tři varianty.\nŽena se zamyslí a nakonec odpoví:\n"Já bych radši novou kuchyň." ',
	'Zubař: "Chcete helium?"\nPacient: "A zmírní to bolest?"\nZubař: "Ne, ale když budete křičet, tak to bude srandovní".',
	'Myslím si, že lidé by měli chodit bosí, protože je to opravdu mnohem zdravější. Například já, když se ráno vzbudím obutý, tak mě pak celý den ukrutně bolí hlava a ještě ke všemu mám hroznou žízeň..!',
	'V módním obchodě.\nOna: "Tyhle boty bych si moc přála, miláčku, ale zapomněla jsem si doma peněženku..."\nOn: "A kolik stojí?"\nOna: "Tři a půl tisíce..."\nOn: *vytáhne peněženku*\nOna: *začne dychtit*\nOn: "Tady máš pade na autobus, zajeď si domů pro peněženku, počkám dole v hospodě."',
	'Tchýně začala číst knihu "Exorcista". Začala, ale nedokončila - ta kniha je podle ní největší zlo, jaké kdy viděla. Tak velké, že šla a hodila ji z mola do moře.\n\nTak jsem koupil ještě jednu, pořádně ji namočil pod kohoutkem a dal jí ji do nočního stolku.\n\nMožná přijdu do pekla, ale určitě se budu smát ještě tam.',
	'"Maminko, jak jsem se narodila?"\n"Jednou nám s tatínkem bylo moc hezky, tak jsme se rozhodli, že spolu zasadíme malé semínko.\nTatínek ho dal pěkně do hlíny, já se o něj starala a oba jsme chtěli, aby z něj jednou vyrostla velká zdravá kytička.\nA tak se stalo, že jsme jednoho dne uviděli malý lístek... a pak další a další... a za pár měsíců to byla velká rostlinka, která nám dělala velkou radost.\nA když uplynulo devět měsíců, nastal čas.\nS tátou jsme ji otrhali, usušili, smotli brko a pak se zhulili tak, že jsme při mrdání zapomněli na kondom..."',
	'"Jednoho krásného slunečného dne na konci března 2018 se blížil starý muž k bráně Pražského hradu a vojákovi, který stojí na stráži, řekl: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják hradní stráže se na něj podíval a odpověděl: "Pane, pan Zeman už není prezident a už tady není a nebude."\nStarý muž poděkoval za informaci a odešel.\n\nNásledující den ten samý člověk přišel znovu k branám Pražského hradu a opět řekl stejnému vojákovi: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják hradní stráže se podíval a odpověděl: "Pane, už jsem vám včera říkal, že pan Zeman už není prezident a nebydlí tady."\nStařík opět poděkoval a odešel.\n\nTřetího dne se stařík opět dostavil k Pražskému hradu a řekl: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják už byl pochopitelně rozrušený a odpověděl: "Pane, to je už třetí den v řadě, co mne žádáte o setkání s panem Zemanem. Řekl jsem vám, že pan Zeman už není prezident a nebydlí zde. Copak to nechápete?"\nStarý muž se podíval a řekl: "Ale ano, já to chápu, ale prostě miluju, když to slyším pořád dokola."\nVoják Hradní stráže se postavil do pozoru a řekl: "Uvidíme se zítra, pane!"',
	'Hádka se ženou je jako koncert vesnické kapely.\nNa začátku jedna, dvě novinky a pak hodina osvědčených hitů.',
];

consoleQuest();