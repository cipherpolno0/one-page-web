"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDirectory = __dirname;
const html = fs.readFileSync(path.join(rootDirectory, "index.html"), "utf8");
const source = fs.readFileSync(path.join(rootDirectory, "script.js"), "utf8");
const checks = [];

const check = (name, condition) => {
  checks.push({ name, pass: Boolean(condition) });
};

class ClassList {
  constructor() {
    this.values = new Set();
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  contains(name) {
    return this.values.has(name);
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.values.has(name) : force;

    if (shouldAdd) {
      this.values.add(name);
    } else {
      this.values.delete(name);
    }

    return shouldAdd;
  }
}

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.classList = new ClassList();
    this.hidden = false;
    this.value = "";
    this.textContent = "";
    this.focused = false;
  }

  set className(value) {
    String(value)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((name) => this.classList.add(name));
  }

  get className() {
    return [...this.classList.values].join(" ");
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  replaceChildren(...nodes) {
    this.children = [...nodes];
  }

  addEventListener(type, listener) {
    (this.listeners[type] ??= []).push(listener);
  }

  dispatch(type, extra = {}) {
    const event = {
      type,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...extra
    };

    (this.listeners[type] ?? []).forEach((listener) => listener(event));
    return event;
  }

  querySelectorAll(selector) {
    return selector === "a" ? this.links : [];
  }

  focus() {
    this.focused = true;
  }
}

const buildEnvironment = ({ empty = false, validDocumentUrl = false } = {}) => {
  const documentListeners = {};
  const mediaListeners = [];
  const elements = {
    "[data-news-list]": new Element("div"),
    "[data-news-controls]": new Element("form"),
    "#news-search": new Element("input"),
    "#news-category": new Element("select"),
    "#news-results-count": new Element("p"),
    "#news-empty-state": new Element("p"),
    "[data-document-list]": new Element("div"),
    ".menu-button": new Element("button"),
    ".primary-nav": new Element("nav"),
    "#current-year": new Element("span")
  };
  elements[".primary-nav"].links = [new Element("a"), new Element("a"), new Element("a")];

  const document = {
    createElement: (name) => new Element(name),
    querySelector: (selector) => (empty ? null : elements[selector] ?? null),
    addEventListener: (type, listener) => {
      (documentListeners[type] ??= []).push(listener);
    },
    dispatch: (type, extra = {}) => {
      (documentListeners[type] ?? []).forEach((listener) => listener({ type, ...extra }));
    }
  };
  const mediaQuery = {
    addEventListener: (type, listener) => {
      if (type === "change") {
        mediaListeners.push(listener);
      }
    },
    emit: (matches) => mediaListeners.forEach((listener) => listener({ matches }))
  };
  const window = {
    location: { href: "https://example.test/" },
    matchMedia: () => mediaQuery
  };
  const testSource = validDocumentUrl
    ? source.replace('url: ""', 'url: "https://example.org/sample.pdf"')
    : source;

  vm.runInNewContext(testSource, { document, window, URL, Date, Intl, Number, String, Array, Set }, { filename: "script.js" });
  return { document, elements, mediaQuery };
};

try {
  new Function(source);
  check("JavaScript syntax", true);
} catch {
  check("JavaScript syntax", false);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const internalLinkTargets = [...html.matchAll(/\shref="(#[^"]+)"/g)].map((match) => match[1].slice(1));
check("No duplicate IDs", new Set(ids).size === ids.length);
check("All internal links have targets", internalLinkTargets.every((target) => ids.includes(target)));

let environment;
try {
  environment = buildEnvironment();
  check("Initialization has no uncaught exception", true);
} catch {
  check("Initialization has no uncaught exception", false);
}

if (environment) {
  const { document, elements, mediaQuery } = environment;
  const newsList = elements["[data-news-list]"];
  const searchInput = elements["#news-search"];
  const categorySelect = elements["#news-category"];
  const resultsCount = elements["#news-results-count"];
  const emptyState = elements["#news-empty-state"];
  const menuButton = elements[".menu-button"];
  const primaryNav = elements[".primary-nav"];
  const documentList = elements["[data-document-list]"];

  check("Initial news results", newsList.children.length === 6 && resultsCount.textContent === "แสดงข่าว 6 รายการ");
  check(
    "Sample document unavailable states",
    documentList.children.length === 4
      && documentList.children.every((card) => card.children[2].children[0].getAttribute("aria-disabled") === "true")
  );

  searchInput.value = "กำหนดเวลาการให้บริการ";
  searchInput.dispatch("input");
  check("Search in title", newsList.children.length === 1 && emptyState.hidden === true);

  searchInput.value = "ตรวจสอบความครบถ้วน";
  searchInput.dispatch("input");
  check("Search in summary", newsList.children.length === 1 && emptyState.hidden === true);

  searchInput.value = "";
  categorySelect.value = "กิจกรรม";
  categorySelect.dispatch("change");
  check("Filter by category", newsList.children.length === 1 && resultsCount.textContent === "แสดงข่าว 1 รายการ");

  searchInput.value = "ไม่พบคำนี้";
  searchInput.dispatch("input");
  check("Empty search state", newsList.children.length === 0 && emptyState.hidden === false);

  searchInput.value = "";
  categorySelect.value = "";
  searchInput.dispatch("input");
  check("Clear search and filter", newsList.children.length === 6 && emptyState.hidden === true);

  menuButton.dispatch("click");
  check("Open menu by click", primaryNav.classList.contains("is-open") && menuButton.getAttribute("aria-expanded") === "true");

  primaryNav.links[0].dispatch("click");
  check("Close menu after link selection", !primaryNav.classList.contains("is-open") && menuButton.getAttribute("aria-expanded") === "false");

  menuButton.dispatch("click");
  document.dispatch("keydown", { key: "Escape" });
  check("Close menu with Escape and restore focus", !primaryNav.classList.contains("is-open") && menuButton.focused);

  menuButton.dispatch("click");
  mediaQuery.emit(true);
  check("Close menu after desktop resize", !primaryNav.classList.contains("is-open"));
  check("Current year is rendered", /^25\d{2}$/.test(elements["#current-year"].textContent));
}

try {
  const firstLoad = buildEnvironment();
  const secondLoad = buildEnvironment();
  check(
    "Reload initializes a fresh page correctly",
    firstLoad.elements["[data-news-list]"].children.length === 6
      && secondLoad.elements["[data-news-list]"].children.length === 6
  );
} catch {
  check("Reload initializes a fresh page correctly", false);
}

try {
  buildEnvironment({ empty: true });
  check("Missing elements do not throw", true);
} catch {
  check("Missing elements do not throw", false);
}

try {
  const environmentWithDocumentUrl = buildEnvironment({ validDocumentUrl: true });
  const actions = environmentWithDocumentUrl.elements["[data-document-list]"].children[0].children[2].children;
  check(
    "Available document links are safe",
    actions.length === 2
      && actions[0].target === "_blank"
      && actions[0].rel === "noopener noreferrer"
      && actions[1].download === "sample-request-information-form.pdf"
  );
} catch {
  check("Available document links are safe", false);
}

const failures = checks.filter((checkItem) => !checkItem.pass);
console.log(JSON.stringify({ passed: checks.length - failures.length, total: checks.length, failures, checks }, null, 2));
process.exitCode = failures.length ? 1 : 0;
