var digitalData = digitalData || {};
digitalData._log = [];

// Google measurement snippet
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://validate.activate.cz/container?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','');

// Main measure function
measure = function (data) {
	measure.notify (data);
	measure.add (data);
	measure.google (data);
	consoleQuest.matomo (data);
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
			var consoleQuest3 = "";
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
};


// Console Quest
consoleQuest = function (step) {
	// consoleQuest step 1
	if (window.location.pathname=="/" && step==undefined) {consoleQuest.notify (0,0)};
	// consoleQuest step 2
	if (window.location.pathname=="/"&& step==undefined) {dataLayer.push({quest:consoleQuestTexts[1]})};
	// consoleQuest step 3 - in measure.notify
	// consoleQuest step 4 - in consoleQuest.matomo
	// consoleQuest step 5 - in consoleQuest.treasure
}

// consoleQuest step 4 - fake Matomo hit
consoleQuest.matomo = function (data) {
	if (data.action == "portraitClick" && data.portraitPerson == "Lukáš Čech") {
		var img = document.createElement("img");
		img.src = "https://matomo.activate.cz/matomo.php?e_c=Portrait%20Click&e_a=Luk%C3%A1%C5%A1%20%C4%8Cech&idsite=6&rec=1&r=821257&h=11&m=51&s=21&url=https%3A%2F%2Factivate.cz%2F&_id=872f16b1be511eee&_idts=1614523591&_idvc=8&_idn=0&send_image=1&pdf=1&qt=0&realp=0&wma=0&dir=0&fla=0&java=0&gears=0&ag=0&cookie=1&res=1920x1200&dimension1=Poklad%20z%C3%ADsk%C3%A1%20ten%2C%20kdo%20hrd%C4%9B%20a%20beze%20strachu%2C%20nahlas%20pronese%20prad%C3%A1vn%C3%A1%20slova%20moci%20%27consoleQuest.treasure()%27&gt_ms=21&pv_id=RkDzPr";
		document.body.appendChild(img);
	}
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
	"Vítej poutníče,\njistě tě sem, do naší putiky U modré konzole, dovedla dlouhá a náročná cesta. Pohodlně se tedy usaď a vydechni.\nVypadáš jako někdo, komu bych mohl svěřit prastaré tajemnství. Ač se to na první pohled může zdát podivuhodné, nacházejí se v tomto kraji úžasné poklady.\nJsi odvážného ducha a troufneš si některý z nich hledat?\nJeden je ukryt prostřed labyrintu jménem webová analytika. První indicie k němu se nachází na místě známém jako datová vrstva, kterou ovládá mocný krutovládce Google.\nDruhý hlídají rytíři fanatického řádu Anti spam. Je bys mohl nalézt, když na webu vyhledáš mocný e-mailingový nástroj a podrobně prozkoumáš jeho emblém.\nZvol cestu, která je blízká tvému srdci a já budu doufat, že se tam s tebou znovu setkám.\nHodně štěstí!",
	"Rád tě vidím poutníče,\nprvní překážky jsi se nezalekl a překonal jsi ji bez zaváhání. To mě velmi těší.\nDokázal jsi tím, že jsi moudrý a odvážný, ale především že dokážeš uchopit tajemnství, které ti hodlám předat.\nV království tohoto webu nevládne pouze Google, ale i jeho další bratři jako Adobe, Matomo a Snowplow. A každý z nich ale požaduje vybírat od svých poddaných data jiným způsobem. A co pak má dělat chudák bežná funkce, když musí odvést svůj datový desátek všem těmto mocnostem?\nVelký čaroděj pomocí svých mocných kouzel tedy přivedl k existenci funkci measure. Dobrotivou a milosrdnou funkci, která vybere data a přerozdělí je jednotlivým vládcům v podobách, jaké požadují. Zavolej funkci measure.notify s parametrem true a uvidíš, jaká data measure dostává.\nNyní vyhledej samotného, čaroděje dechberoucího Lukáše Čecha. Prohlédni si jeho portrét a sleduj, co on předá spravedlivé funkci measure.",
	"Kdo jsi a proč mě rušíš z mých meditací?\nPoklad? Ty si jdeš pro poklad? No to je velmi troufalé!\nNeřeknu ti, kde se poklad nachází, neb sám to nevím. Byl ukryt před dávnými časy, generace ho již nikdo nespatřil a mnozí již pochybují o jeho samotné existenci.\nVím ale, kde můžeš najít mapu k pokladu. Je skryta v pradávné jeskyni. Vchod do této jeskyně je schovaný pod hitem směřujícím do Matoma a otevřela se před okamžikem, když jsi kliknul na můj obraz.\nUtíkej, není čas ztrácet čas!",
	"Poklad získá ten, kdo hrdě a beze strachu nahlas pronese pradávná slova moci 'consoleQuest.treasure()'",
	"Dokázal jsi to!\nPřekonal jsi všechna protiventví osudu, vyhledal jsi mocného čaroděje a nalezl mapu dávno ztraceného pokladu.\nPokud by ses v budoucnu chtěl zúčastnit nějaké výpravy s námi, pošli holuba do našeho hradu 'info@activate.cz' a třeba se společně vypravíme k pohádkovému bohatství i nehynoucí slávě.\nNyní již ber svou zaslouženou odměnu hrdino. Ber dokud pokladnice nebude prázdná.",
	"Pokladnice už je bohužel prázdná. U nás ve firemním Slacku ale zaručen dobrý vtip každy den."
];

// CSS Styles for notification to console
var consoleQuestNotifyStyles = [
	"color: #01abdf; font-size: 14px; font-weight: 500; background-color: #ffffff;padding: 5px 5px 5px 10px;border-left: 5px solid #01abdf;line-height: 20px;display: block; width: 90%;",
	"color: #fcc201; font-size: 14px; font-weight: 500; background-color: #ffffff;padding: 5px 5px 5px 10px;border-left: 5px solid #fcc201;line-height: 20px;display: block; width: 90%;"
];

// Jokes for treasure
var consoleQuestLoot = [
	'Farář zpovídá kostelníka.\nKostelník mluví, mluví a když skončí, farář povídá: "A to je všechno? Kdo mi chodí na mešní víno?"\nKostelník na to: "Tady je nějak špatně slyšet, pane faráři."\n"Nelži, kostelníku! Pán tě slyší!"\n"Tak si to pojďte zkusit, pane faráři."\nTak se vyměněj, kostelník si sedne na farářovo místo a farář se jde zpovídat. Kostelník povídá:\n"Tak co, pane faráři, kdo mi chodí za ženou?"\n"Máš pravdu, kostelníku. Je tu nějak špatně slyšet."',
	'Pět lékařů je na lovu kachen. Praktický, dětský, psychiatr, chirurg a patolog.\nLetí kachna, praktický lékař zamíří a povídá: „Je to kachna? Možná ne, budu to muset prokonzultovat.“ Kachna mezitím uletí.\nLetí druhá kachna, dětský lékař zamíří: „Myslím, že je to kachna, ale co když má děti, musím to promyslet.“ Než se rozmyslí, kachna uletí.\nLetí další kachna, psychiatr zamíří: „Vím, že je to kachna, ale ví to i ona? Zná svoji identitu?“ Než to domyslí, kachna samozřejmě uletí.\nLetí další kachna, na řadě je chirurg, zamíří a kachnu střelí. Kachna spadne, chirurg se otočí na patologa a řekne: „Jděte se podívat, jestli to byla kachna.“',
	'Přijde muž nešťastnou náhodou o přirození a navštíví plastického chirurga s tím,zda by mohl získat nástroj nový. Doktor v operaci nevidí žádný problém. Jen je nutné vybrat velikost.\n"Máme tři druhy" vysvětluje a názorně na modelech ukazuje.\n"Malého, kterého jste měl zřejmě vy, za sedm tisíc, většího za patnáct a největšího za dvaadvacet tisíc.\nNež se ale rozhodnete s konečnou platností pro jednu z variant, možná by bylo dobré se poradit s manželkou."\nMuž doma přednese všechny tři varianty.\nŽena se zamyslí a nakonec odpoví:\n"Já bych radši novou kuchyň." ',
	'Zubař: "Chcete helium?"\nPacient: "A zmírní to bolest?"\nZubař: "Ne, ale když budete křičet, tak to bude srandovní".',
	'Myslím si, že lidé by měli chodit bosí, protože je to opravdu mnohem zdravější. Například já, když se ráno vzbudím obutý, tak mě pak celý den ukrutně bolí hlava a ještě ke všemu mám hroznou žízeň..!',
	'V módním obchodě.\nOna: "Tyhle boty bych si moc přála, miláčku, ale zapomněla jsem si doma peněženku..."\nOn: "A kolik stojí?"\nOna: "Tři a půl tisíce..."\nOn: *vytáhne peněženku*\nOna: *začne dychtit*\nOn: "Tady máš pade na autobus, zajeď si domů pro peněženku, počkám dole v hospodě."',
	'Tchýně začala číst knihu "Exorcista". Začala, ale nedokončila - ta kniha je podle ní největší zlo, jaké kdy viděla. Tak velké, že šla a hodila ji z mola do moře.\nTak jsem koupil ještě jednu, pořádně ji namočil pod kohoutkem a dal jí ji do nočního stolku.\nMožná přijdu do pekla, ale určitě se budu smát ještě tam.',
	'"Maminko, jak jsem se narodila?"\n"Jednou nám s tatínkem bylo moc hezky, tak jsme se rozhodli, že spolu zasadíme malé semínko.\nTatínek ho dal pěkně do hlíny, já se o něj starala a oba jsme chtěli, aby z něj jednou vyrostla velká zdravá kytička.\nA tak se stalo, že jsme jednoho dne uviděli malý lístek... a pak další a další... a za pár měsíců to byla velká rostlinka, která nám dělala velkou radost.\nA když uplynulo devět měsíců, nastal čas.\nS tátou jsme ji otrhali, usušili, smotli brko a pak se zhulili tak, že jsme při mrdání zapomněli na kondom..."',
	'"Jednoho krásného slunečného dne na konci března se blížil starý muž k bráně Pražského hradu a vojákovi, který stojí na stráži, řekl: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják hradní stráže se na něj podíval a odpověděl: "Pane, pan Zeman už není prezident a už tady není a nebude."\nStarý muž poděkoval za informaci a odešel.\nNásledující den ten samý člověk přišel znovu k branám Pražského hradu a opět řekl stejnému vojákovi: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják hradní stráže se podíval a odpověděl: "Pane, už jsem vám včera říkal, že pan Zeman už není prezident a nebydlí tady."\nStařík opět poděkoval a odešel.\nTřetího dne se stařík opět dostavil k Pražskému hradu a řekl: "Chtěl bych se setkat s prezidentem Zemanem."\nVoják už byl pochopitelně rozrušený a odpověděl: "Pane, to je už třetí den v řadě, co mne žádáte o setkání s panem Zemanem. Řekl jsem vám, že pan Zeman už není prezident a nebydlí zde. Copak to nechápete?"\nStarý muž se podíval a řekl: "Ale ano, já to chápu, ale prostě miluju, když to slyším pořád dokola."\nVoják Hradní stráže se postavil do pozoru a řekl: "Uvidíme se zítra, pane!"',
	'Hádka se ženou je jako koncert vesnické kapely.\nNa začátku jedna, dvě novinky a pak hodina osvědčených hitů.',
];

consoleQuest();