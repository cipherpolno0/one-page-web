(() => {
  "use strict";

  const newsItems = [
    {
      id: "news-item-1",
      title: "แจ้งกำหนดเวลาการให้บริการข้อมูลประจำสัปดาห์",
      date: "2026-09-24",
      category: "ประกาศ",
      summary: "ขอให้ผู้รับบริการตรวจสอบช่วงเวลาติดต่อและเตรียมข้อมูลที่จำเป็นก่อนประสานงาน เพื่อช่วยให้การรับเรื่องเป็นไปอย่างต่อเนื่อง",
      url: "#contact",
      featured: true
    },
    {
      id: "news-item-2",
      title: "ปรับปรุงรายการเอกสารตัวอย่างสำหรับผู้ขอรับบริการ",
      date: "2026-09-20",
      category: "เอกสาร",
      summary: "เผยแพร่รายการเอกสารฉบับตัวอย่างเพื่อใช้ตรวจสอบความครบถ้วนก่อนยื่นคำขอ และลดขั้นตอนการติดต่อซ้ำ",
      url: "#contact"
    },
    {
      id: "news-item-3",
      title: "แนวทางส่งข้อมูลเพื่อขอเผยแพร่บนช่องทางประชาสัมพันธ์",
      date: "2026-09-18",
      category: "บริการ",
      summary: "ส่งหัวข้อ เนื้อหาสรุป วันที่ต้องการเผยแพร่ และเอกสารประกอบตามความเหมาะสม เพื่อให้เจ้าหน้าที่จัดลำดับการนำเสนอได้ชัดเจน",
      url: "#contact"
    },
    {
      id: "news-item-4",
      title: "เปิดรับข้อเสนอหัวข้อสำหรับกิจกรรมแลกเปลี่ยนข้อมูล",
      date: "2026-09-15",
      category: "กิจกรรม",
      summary: "ขอเชิญส่งประเด็นที่ต้องการแลกเปลี่ยนเรียนรู้ เพื่อใช้ประกอบการจัดกิจกรรมตัวอย่างและพัฒนาเนื้อหาให้เหมาะกับผู้รับบริการ",
      url: "#contact"
    },
    {
      id: "news-item-5",
      title: "โปรดตรวจสอบข้อมูลก่อนส่งคำขอผ่านช่องทางออนไลน์",
      date: "2026-09-10",
      category: "แจ้งเตือน",
      summary: "ข้อมูลติดต่อ ชื่อเอกสาร และรายละเอียดการขอรับบริการควรครบถ้วน เพื่อให้สามารถตอบกลับหรือส่งต่อเรื่องได้อย่างถูกต้อง",
      url: "#contact"
    },
    {
      id: "news-item-6",
      title: "แนะนำการจัดเตรียมข้อมูลเพื่อการติดต่อที่รวดเร็ว",
      date: "2026-09-05",
      category: "ความรู้",
      summary: "จัดเตรียมหัวข้อคำถาม รายละเอียดที่เกี่ยวข้อง และช่องทางติดต่อกลับไว้ล่วงหน้า เพื่อช่วยให้การประสานงานมีความชัดเจนมากขึ้น",
      url: "#contact"
    }
  ];

  const documentItems = [
    {
      title: "แบบฟอร์มขอรับบริการข้อมูล",
      fileName: "sample-request-information-form.pdf",
      category: "แบบฟอร์ม",
      date: "2026-09-24",
      size: "124 KB",
      url: ""
    },
    {
      title: "คู่มือการติดต่อประสานงาน",
      fileName: "sample-contact-guide.pdf",
      category: "คู่มือ",
      date: "2026-09-20",
      size: "286 KB",
      url: ""
    },
    {
      title: "ปฏิทินการให้บริการประจำเดือน",
      fileName: "sample-service-calendar.pdf",
      category: "ปฏิทิน",
      date: "2026-09-18",
      size: "198 KB",
      url: ""
    },
    {
      title: "แนวทางการส่งข้อมูลเพื่อเผยแพร่",
      fileName: "sample-publication-submission-guide.pdf",
      category: "แนวทางปฏิบัติ",
      date: "2026-09-15",
      size: "342 KB",
      url: ""
    }
  ];

  const createElement = (tagName, className, textContent) => {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  };

  const normalizeText = (value) => String(value ?? "").trim().toLocaleLowerCase("th-TH");

  const formatThaiDate = (date) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(parsedDate);
  };

  const getSafeUrl = (url) => {
    if (typeof url !== "string" || !url) {
      return null;
    }

    try {
      const parsedUrl = new URL(url, window.location.href);

      return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.href : null;
    } catch {
      return null;
    }
  };

  const renderItems = (container, items, createItem) => {
    if (!container || !Array.isArray(items) || typeof createItem !== "function") {
      return;
    }

    container.replaceChildren(...items.map(createItem));
  };

  const createNewsCard = (newsItem) => {
    const titleId = `${newsItem.id}-title`;
    const card = createElement("article", "news-card");
    const metadata = createElement("p", "news-card__meta");
    const category = createElement("span", "news-card__category", newsItem.category);
    const date = createElement("time", null, formatThaiDate(newsItem.date));
    const title = createElement("h3", null, newsItem.title);
    const summary = createElement("p", null, newsItem.summary);
    const link = createElement("a", "news-card__link", "อ่านต่อ ");
    const arrow = createElement("span", null, "→");

    if (newsItem.featured) {
      card.classList.add("news-card--featured");
    }

    date.dateTime = newsItem.date;
    title.id = titleId;
    link.href = getSafeUrl(newsItem.url) || "#contact";
    link.setAttribute("aria-labelledby", titleId);
    arrow.setAttribute("aria-hidden", "true");

    metadata.append(category, date);
    link.append(arrow);
    card.append(metadata, title, summary, link);

    return card;
  };

  const renderNewsCards = (newsList, items) => renderItems(newsList, items, createNewsCard);

  const createDocumentActions = (documentItem) => {
    const actions = createElement("div", "download-item__actions");
    const documentUrl = getSafeUrl(documentItem.url);

    if (!documentUrl) {
      const unavailableState = createElement(
        "span",
        "download-item__cta download-item__cta--unavailable",
        "ไฟล์ตัวอย่างยังไม่พร้อมเปิด/ดาวน์โหลด"
      );

      unavailableState.setAttribute("aria-disabled", "true");
      actions.append(unavailableState);
      return actions;
    }

    const openLink = createElement("a", "download-item__cta", "เปิดเอกสาร");
    const downloadLink = createElement("a", "download-item__cta", "ดาวน์โหลด");

    openLink.href = documentUrl;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.setAttribute("aria-label", `เปิดเอกสาร ${documentItem.title}`);

    downloadLink.href = documentUrl;
    downloadLink.download = documentItem.fileName;
    downloadLink.setAttribute("aria-label", `ดาวน์โหลด ${documentItem.title}`);

    actions.append(openLink, downloadLink);
    return actions;
  };

  const createDocumentCard = (documentItem) => {
    const card = createElement("article", "download-item");
    const type = createElement("span", "download-item__type", "PDF");
    const content = createElement("div", "download-item__content");
    const title = createElement("strong", null, documentItem.title);
    const metadata = createElement(
      "small",
      null,
      `PDF · ${documentItem.category} · ${formatThaiDate(documentItem.date)} · ${documentItem.size}`
    );
    const fileName = createElement("small", null, `ชื่อไฟล์ตัวอย่าง: ${documentItem.fileName}`);

    type.setAttribute("aria-hidden", "true");
    content.append(title, metadata, fileName);
    card.append(type, content, createDocumentActions(documentItem));

    return card;
  };

  const renderDocumentCards = (documentList, items) => renderItems(documentList, items, createDocumentCard);

  const filterNewsItems = (items, searchTerm, category) => {
    const normalizedSearchTerm = normalizeText(searchTerm);

    return items.filter((newsItem) => {
      const searchableContent = normalizeText(`${newsItem.title} ${newsItem.summary}`);
      const matchesSearch = !normalizedSearchTerm || searchableContent.includes(normalizedSearchTerm);
      const matchesCategory = !category || newsItem.category === category;

      return matchesSearch && matchesCategory;
    });
  };

  const populateCategoryFilter = (categoryFilter, items) => {
    if (!categoryFilter || !Array.isArray(items)) {
      return;
    }

    const allCategoriesOption = createElement("option", null, "ทุกหมวด");
    allCategoriesOption.value = "";

    const categoryOptions = [...new Set(items.map((newsItem) => newsItem.category))].map((category) => {
      const option = createElement("option", null, category);
      option.value = category;
      return option;
    });

    categoryFilter.replaceChildren(allCategoriesOption, ...categoryOptions);
  };

  const updateNewsStatus = (resultsCount, matchingItemsCount, emptyState) => {
    if (resultsCount) {
      resultsCount.textContent = `แสดงข่าว ${matchingItemsCount} รายการ`;
    }

    if (emptyState) {
      emptyState.hidden = matchingItemsCount !== 0;
    }
  };

  const setupNewsSearch = ({ list, controls, searchInput, categorySelect, resultsCount, emptyState }) => {
    const updateResults = () => {
      const matchingItems = filterNewsItems(
        newsItems,
        searchInput ? searchInput.value : "",
        categorySelect ? categorySelect.value : ""
      );

      renderNewsCards(list, matchingItems);
      updateNewsStatus(resultsCount, matchingItems.length, emptyState);
    };

    populateCategoryFilter(categorySelect, newsItems);

    if (controls) {
      controls.addEventListener("submit", (event) => event.preventDefault());
    }

    if (searchInput) {
      searchInput.addEventListener("input", updateResults);
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", updateResults);
    }

    updateResults();
  };

  const setupMenu = (menuButton, primaryNav) => {
    if (!menuButton || !primaryNav) {
      return;
    }

    const menuLinks = primaryNav.querySelectorAll("a");
    const desktopMediaQuery = window.matchMedia("(min-width: 48rem)");

    const setMenuState = (isOpen) => {
      primaryNav.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    };

    const closeMenu = (returnFocus = false) => {
      setMenuState(false);

      if (returnFocus) {
        menuButton.focus();
      }
    };

    menuButton.addEventListener("click", () => {
      setMenuState(!primaryNav.classList.contains("is-open"));
    });

    menuLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    desktopMediaQuery.addEventListener("change", (event) => {
      if (event.matches) {
        closeMenu();
      }
    });
  };

  const updateCurrentYear = (yearElement) => {
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear() + 543);
    }
  };

  const elements = {
    newsList: document.querySelector("[data-news-list]"),
    newsControls: document.querySelector("[data-news-controls]"),
    newsSearch: document.querySelector("#news-search"),
    newsCategory: document.querySelector("#news-category"),
    newsResultsCount: document.querySelector("#news-results-count"),
    newsEmptyState: document.querySelector("#news-empty-state"),
    documentList: document.querySelector("[data-document-list]"),
    menuButton: document.querySelector(".menu-button"),
    primaryNav: document.querySelector(".primary-nav"),
    yearElement: document.querySelector("#current-year")
  };

  setupNewsSearch({
    list: elements.newsList,
    controls: elements.newsControls,
    searchInput: elements.newsSearch,
    categorySelect: elements.newsCategory,
    resultsCount: elements.newsResultsCount,
    emptyState: elements.newsEmptyState
  });
  renderDocumentCards(elements.documentList, documentItems);
  setupMenu(elements.menuButton, elements.primaryNav);
  updateCurrentYear(elements.yearElement);
})();
