const sectionButtons = [...document.querySelectorAll(".procedimientos-section-toggle")];
const procedureItems = [...document.querySelectorAll(".procedimiento-item")];
const searchInput = document.querySelector("#procedimientos-search-input");
const clearSearchButton = document.querySelector(".procedimientos-search-clear");
const searchStatus = document.querySelector(".procedimientos-search-status");

function normalizeText(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function setSectionExpanded(button, shouldExpand) {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    const indicator = button.querySelector(".toggle-indicator");

    button.setAttribute("aria-expanded", String(shouldExpand));
    target.hidden = !shouldExpand;
    indicator.textContent = shouldExpand ? "-" : "+";
}

function setProcedureExpanded(button, detail, shouldExpand) {
    button.setAttribute("aria-expanded", String(shouldExpand));
    detail.hidden = !shouldExpand;
    button.querySelector(".toggle-indicator").textContent = shouldExpand ? "-" : "+";
}

sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        setSectionExpanded(button, !isExpanded);
    });
});

procedureItems.forEach((item, index) => {
    const heading = item.querySelector("h3");
    const detail = item.querySelector("p");
    const detailId = `procedimiento-detalle-${index + 1}`;
    const procedureName = heading.textContent.trim();
    const procedureDescription = detail.textContent.trim();
    const button = document.createElement("button");

    item.dataset.searchText = normalizeText(`${procedureName} ${procedureDescription}`);
    button.className = "procedimiento-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", detailId);
    button.innerHTML = `<span>${procedureName}</span><span class="toggle-indicator" aria-hidden="true">+</span>`;

    heading.textContent = "";
    heading.appendChild(button);
    detail.id = detailId;
    detail.classList.add("procedimiento-detail");
    detail.hidden = true;

    button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        setProcedureExpanded(button, detail, !isExpanded);
    });
});

function filterProcedures() {
    const query = normalizeText(searchInput.value.trim());
    let matchCount = 0;

    procedureItems.forEach((item) => {
        const matches = !query || item.dataset.searchText.includes(query);
        const detail = item.querySelector(".procedimiento-detail");
        const button = item.querySelector(".procedimiento-toggle");

        item.hidden = !matches;
        item.classList.toggle("is-search-match", Boolean(query && matches));
        setProcedureExpanded(button, detail, Boolean(query && matches));

        if (matches && query) {
            matchCount += 1;
        }
    });

    sectionButtons.forEach((button) => {
        const target = document.getElementById(button.getAttribute("aria-controls"));
        const hasVisibleProcedure = [...target.querySelectorAll(".procedimiento-item")]
            .some((item) => !item.hidden);

        setSectionExpanded(button, query ? hasVisibleProcedure : false);
    });

    if (!query) {
        searchStatus.textContent = "";
        return;
    }

    searchStatus.textContent = matchCount === 1
        ? "1 procedimiento encontrado."
        : `${matchCount} procedimientos encontrados.`;
}

if (searchInput) {
    searchInput.addEventListener("input", filterProcedures);
}

if (clearSearchButton) {
    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        filterProcedures();
        searchInput.focus();
    });
}
