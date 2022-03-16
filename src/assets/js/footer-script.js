// window.piwikHeatmapSessionRecordingAsyncInit = function () {
// 	console.log("piwikHeatmapSessionRecordingAsyncInit")
// 	Piwik.HeatmapSessionRecording.disable();
// };

function hideCookieCategory() {
  var style = document.createElement("style");
  style.setAttribute("id", "cookiebotCategoryHidingStyle");
  if (cookiebotMediaQuery.matches) {
    style.innerHTML = "fieldset > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(5) {display: none !important}";
  } else {
    style.innerHTML = "fieldset > div:nth-of-type(2) {display: none !important} div.CybotCookiebotDialogBodyLevelButtonWrapper {width: 33% !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(5) {display: none !important}";
  }
  document.head.appendChild(style);
}

function adjustCookieCategoryWidth(cookiebotMediaQuery) {
  var style = document.getElementById("cookiebotCategoryHidingStyle");
  if (cookiebotMediaQuery.matches) {
    style.innerHTML = "fieldset > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(5) {display: none !important}";
  } else {
    style.innerHTML = "fieldset > div:nth-of-type(2) {display: none !important} div.CybotCookiebotDialogBodyLevelButtonWrapper {width: 33% !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(2) {display: none !important} div#CybotCookiebotDialogDetailBodyContentCookieContainerTypes > div:nth-of-type(5) {display: none !important}";
  }
}

var cookiebotMediaQuery = window.matchMedia("(max-width: 576px)");
hideCookieCategory();
cookiebotMediaQuery.addListener(adjustCookieCategoryWidth);

$(document).on("scroll", function () {
  if (document.body.offsetWidth > 991) {
    if ($(document).scrollTop() > 10) {
      $("nav").addClass("small-bar");
    } else {
      $("nav").removeClass("small-bar");
    }
  } else {
    if ($(document).scrollTop() > 0) {
      $("nav").addClass("decorated");
    } else {
      $("nav").removeClass("decorated");
    }
  }
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDBi1nrdZDnKdQZVG-et2IdKHtUlhOU-FU",
  authDomain: "activate-website-2.firebaseapp.com",
  databaseURL: "https://activate-website-2.firebaseio.com",
  projectId: "activate-website-2",
  storageBucket: "activate-website-2.appspot.com",
  messagingSenderId: "244205330508",
};
firebase.initializeApp(config);

let app = new Vue({
  el: "#app",
  data: {
    loaded: false,
    references: undefined,
    technologies: undefined,
    peoples: undefined,
    activePeople: undefined,
    mediumArticles: undefined,
    calendar: null,
    showReferences: false,
    activeTechnology: null,
    activeTechnologyDescription: false,
    now: Date.now(),
    timestamp: 0,
    message: "",
    name: "",
    email: "",
    error: "",
    errorName: "",
    errorEmail: "",
    sent: false,
    timer: [],
    confirm:
      "Váš požadavek na zničení světa byl zaznamenán. O jeho stavu Vás budeme informovat. Děkujeme.",
  },
  methods: {
    startTrackingVirtualPageviewToPiwik(pageName, pageUrl) {
      // _paq.push(['setCustomUrl', pageUrl]);
      // _paq.push(['setDocumentTitle', pageName]);
      // _paq.push(['trackPageView']);

      document.location.href = "#" + pageUrl;
      Piwik.HeatmapSessionRecording.enable();
      Piwik.HeatmapSessionRecording.setNewPageView(true);
    },
    setActiveTechnologyByName(technologyName) {
      let techKeys = Object.keys(this.technologies);
      // console.log("Searching for technology: "+technologyName)
      for (let i = 0; i < techKeys.length; i++) {
        let tech = this.technologies[techKeys[i]];
        if (technologyName.toLowerCase() === tech.name.toLowerCase()) {
          // console.log("Technology found. Set to: "+ JSON.stringify(tech))
          this.setActiveTechnology(tech);

          document.location.href = "#";
          document.location.href = "#technologies";
        }
      }
    },
    setActiveTechnology: function (technology) {
      this.activeTechnology = technology;
      this.activeTechnologyDescription = true;
      if (technology.helpName.trim() === "")
        technology.helpName = technology.name;
      document.getElementById("interested").innerText =
        "[ Potřebujete pomoci s " + technology.helpName + " ? ]";

      this.startTrackingVirtualPageviewToPiwik(
        document.title + " : TECHNOLOGY :" + technology.name,
        "/virtualPages/technology/" + technology.name
      );
    },
    setActivePeople: function (code) {
      var modalId = "#people-" + code.toLowerCase();
      this.activePeople = modalId;
      setTimeout(function () {
        console.log("Activating modal:" + modalId);
        $(modalId).modal("show");
      }, 500);
    },

    checkForm: function (e) {
      this.errorName = "";
      this.errorEmail = "";

      if (!this.name) {
        this.errorName = "Rádi bychom věděli jak se jmenujete.";
      }
      if (!this.email) {
        this.errorEmail = "Bez e-mailu se vám nemůžeme ozvat.";
      } else if (!this.validEmail(this.email)) {
        this.errorEmail = "Váš pravý e-mail by byl fajn.";
      }

      if (this.errorName === "" && this.errorEmail === "") {
        this.storeMessage();
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    storeMessage: function () {
      const url =
        "/saveMessage?message=" +
        encodeURIComponent(this.message) +
        "&email=" +
        encodeURIComponent(this.email) +
        "&name=" +
        encodeURIComponent(this.name);
      console.log(
        "Storing message " +
        this.message +
        " for " +
        this.email +
        " name: " +
        this.name
      );
      //console.log(url)
      measure({
        action: "contactFormSent",
        name: this.name,
        email: this.email,
        message: this.message,
      });
      if (this.message === "DYCKYMAIL") {
        this.confirm = "Výtečně. Zase o @ blíže.";
      }

      // ulozeni message
      this.$http.get(url).then(
        (response) => {
          this.sent = true;
          this.message = "";
          this.name = "";
          this.email = "";
        },
        (response) => {
          this.error = response.status + " + " + JSON.stringify(response.body);
        }
      );
    },
    photoEnter: function (people, index) {
      for (let i = 1; i <= people.photos; i++) {
        this.timer[index] = setTimeout(function () {
          people.actualPhoto = people.short.toLowerCase() + i;
        }, i * 500);
      }
    },
    photoLeave: function (people, index) {
      clearTimeout(this.timer[index]);
      people.actualPhoto = people.short.toLowerCase() + "1";
    },
    updateLocalStorage: function () {
      console.log("Updating local storage");
      fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fetnetera-activate&api_key=vxx13alxnggbzfqugtped2fmbwko53ry1c8lafmz"
      )
        .then((r) => r.json())
        .then((json) => {
          this.mediumArticles = json.items;
          localStorage.setItem("medium", JSON.stringify(json.items));
          localStorage.setItem("timestamp", Date.now().toString());
        });

      firebase
        .database()
        .ref("/content")
        .once("value")
        .then((snapshot) => {
          data = snapshot.exportVal();
          this.references = data.projects;
          this.peoples = data.peoples;
          this.technologies = data.technologies;

          //order people
          localStorage.setItem("references", JSON.stringify(data.projects));
          localStorage.setItem("peoples", JSON.stringify(data.peoples));
          localStorage.setItem(
            "technologies",
            JSON.stringify(data.technologies)
          );
          localStorage.setItem("timestamp", Date.now().toString());
        });
    },
  },
  computed: {
    filteredTechnologies: function () {
      return _.pickBy(this.technologies, function (tech) {
        return tech.show;
      });
    },
  },
  mounted: function () {
    //Piwik.HeatmapSessionRecording.disable();

    if (localStorage.getItem("medium")) {
      this.mediumArticles = JSON.parse(localStorage.getItem("medium"));
    }
    if (localStorage.getItem("references")) {
      this.references = JSON.parse(localStorage.getItem("references"));
    }
    if (localStorage.getItem("peoples")) {
      this.peoples = JSON.parse(localStorage.getItem("peoples"));
    }
    if (localStorage.getItem("technologies")) {
      this.technologies = JSON.parse(localStorage.getItem("technologies"));
    }
    if (localStorage.getItem("calendar")) {
      this.calendar = JSON.parse(localStorage.getItem("calendar"));
    }
    if (localStorage.getItem("timestamp")) {
      this.timestamp = localStorage.getItem("timestamp");
    }
    if (this.now - this.timestamp > 86400000) {
      this.updateLocalStorage();
    }

    // anchors a dalsi rizeni
    if (document.location.search) {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("technology")) {
        this.setActiveTechnologyByName(urlParams.get("technology"));
      } else if (urlParams.has("people")) {
        this.setActivePeople(urlParams.get("people"));
      }

      if (urlParams.has("reload")) {
        this.updateLocalStorage();
      }
    }

    this.$nextTick(function () {
      //image preloading
      if (window.location.pathname === "/") {
        //let images = [];
        let cssText = "";
        for (let i = 0; i < _.size(this.people); i++) {
          if (this.people[i].photos !== undefined) {
            //images[i] = [];
            for (let x = 0; x < this.people[i].photos; x++) {
              if (cssText !== "") {
                cssText = cssText + ", ";
              }
              //images[i][x] = new Image();
              let num = x + 1;
              //images[i][x].src = "/assets/imgs/peoples/mini/" + this.peoples[i].short.toLowerCase() + num +"-min.jpg";
              cssText =
                cssText +
                "url('/assets/imgs/peoples/mini/" +
                this.people[i].short.toLowerCase() +
                num +
                "-min.jpg')";
            }
          }
        }
        let div = document.createElement("div");
        div.style.backgroundImage = cssText;
        div.style.height = "0px";
        div.style.width = "0px";
        document.body.appendChild(div);
        //console.log(cssText);
      }
    });
    let wrapper = document.getElementById('CookieDeclarationWrapper');
    if (wrapper) {
      let script = document.createElement('script');
      script.setAttribute('id', 'CookieDeclaration');
      script.setAttribute('src', 'https://consent.cookiebot.com/5b826701-b028-4e6c-8559-b65d06f30aea/cd.js');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('async', '');
      wrapper.appendChild(script);
    }
  },
});
