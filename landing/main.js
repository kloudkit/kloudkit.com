// Progressive enhancements. The page renders fine without any of this.
(function () {
  "use strict";

  const enhancements = {
    // Keep the footer year current without a rebuild.
    year() {
      const el = document.getElementById("year");

      if (el) {
        el.textContent = new Date().getFullYear();
      }
    },
  };

  for (const run of Object.values(enhancements)) {
    try {
      run();
    } catch (err) {
      console.error(err);
    }
  }
})();
