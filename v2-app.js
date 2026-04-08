const OFFER_MAP = {
  quiz: "https://quiz.stonegatefirm.com/sgf-elv-hf02?uid=12&oid=4&affid=57#start",
  eligibility:
    "https://start.timesharecancellation.co/eligibility-check-01?uid=184&oid=4&affid=57",
  native:
    "https://start.timesharecancellation.co/timeshare-relief-support-native?uid=229&oid=4&affid=57",
  cap: "https://get.stonegatecanhelp.com/cap-01?uid=192&oid=4&affid=57#resort",
};

const DEFAULT_DESTINATION = "quiz";
const INTERNAL_PARAMS = new Set(["dest", "offer"]);

function buildDestinationUrl() {
  const pageUrl = new URL(window.location.href);
  const destinationKey = pageUrl.searchParams.get("dest") || DEFAULT_DESTINATION;
  let baseDestination = OFFER_MAP[destinationKey] || OFFER_MAP[DEFAULT_DESTINATION];

  if (/^https?:\/\//i.test(destinationKey)) {
    baseDestination = destinationKey;
  }

  const destinationUrl = new URL(baseDestination);

  pageUrl.searchParams.forEach((value, key) => {
    if (!INTERNAL_PARAMS.has(key)) {
      destinationUrl.searchParams.set(key, value);
    }
  });

  return destinationUrl.toString();
}

function wireCtas() {
  const destination = buildDestinationUrl();
  document.querySelectorAll(".cta-link").forEach((link) => {
    link.href = destination;
  });
}

function initReveal() {
  const revealTargets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function initScrollUi() {
  const sticky = document.getElementById("stickyCta");
  const readingBarFill = document.getElementById("readingBarFill");

  const update = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

    readingBarFill.style.width = `${progress * 100}%`;
    sticky.classList.toggle("show", progress > 0.18);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

wireCtas();
initReveal();
initScrollUi();
