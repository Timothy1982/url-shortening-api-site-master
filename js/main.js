var app = new Vue({
  el: "#app",
  data: {
    showMenu: false,
    savedUrls: [],
    longUrl: "",
    urlError: false,
    apiError: false,
    apiErrorMsg: "",
    loadingUrl: false,
    shortUrl: {},
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    getSavedUrls() {
      let cacheSavedUrls = localStorage.getItem("savedUrls");
      if (cacheSavedUrls) {
        this.savedUrls = JSON.parse(cacheSavedUrls).slice().reverse();
      }
    },
    shortenUrl() {
      if (this.longUrl.length < 3 || !this.longUrl.startsWith("http")) {
        this.urlError = true;
      } else {
        this.loadingUrl = true;
        this.callApi(this.longUrl);
      }
    },
    removeUrlError() {
      this.urlError = false;
    },
    saveUrlData(response) {
      let cacheUrl = {
        code: response.data.result.code,
        original_link: response.data.result.original_link,
        short_link: response.data.result.short_link2,
      };
      this.loadingUrl = false;
      this.savedUrls.unshift(cacheUrl);
      localStorage.setItem("savedUrls", JSON.stringify(this.savedUrls));
    },
    callApi(url) {
      axios
        .get("https://api.shrtco.de/v2/shorten?url=" + url)
        .then((response) => {
          if (response.data.ok == true) {
            this.saveUrlData(response);
            this.longUrl = "";
          }
        })
        .catch((err) => {
          this.loadingUrl = false;
          this.apiErrorMsg =
            "There was a problem getting a short Url. Please try again.";
          this.apiError = true;
          setTimeout(() => {
            this.apiError = false;
          }, 5000);
        });
    },
    copyToClipboard(url, id) {
      this.resetCopyBtns();
      navigator.clipboard.writeText(url).then(() => {
        this.$refs["copyBtn"][id].textContent = "copied!";
        this.$refs["copyBtn"][id].classList.add("btn-copied");
      });
    },
    resetCopyBtns() {
      for (let i = 0; i < this.$refs["copyBtn"].length; i++) {
        this.$refs["copyBtn"][i].classList.remove("btn-copied");
        this.$refs["copyBtn"][i].textContent = "Copy";
      }
    },
  },
  mounted() {
    this.getSavedUrls();
  },
});
