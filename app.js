/* Data */

let replies = [...defaultReplies];

const STORAGE_KEY = "savedReplies";

const defaultGreeting = "Hi there,";
let selectedReplyId = null;

/* DOM */

const replyList = document.querySelector(".reply-list");
const searchInput = document.querySelector(".search-input");

const formMode = document.querySelector(".form-mode");
const titleInput = document.querySelector('input[placeholder="Title"]');
const openingInput = document.querySelector('input[placeholder="Opening"]');
const empathyInput = document.querySelector('input[placeholder="Empathy"]');
const bodyTextarea = document.querySelector(".body-textarea");
const endingInput = document.querySelector('input[placeholder="Ending"]');
const activeCheckbox = document.querySelector(
  '.checkbox-row input[type="checkbox"]',
);
const saveButton = document.querySelector(".primary-button");
const newButton = document.querySelector(".new-button");
const importButton = document.querySelector(".import-button");
const exportButton = document.querySelector(".export-button");

const importFileInput = document.querySelector(".import-file-input");

const boldButton = document.querySelector(".bold-button");

/* FUNCTIONS  */

/* Storage */

function saveRepliesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(replies));
}

function loadRepliesFromStorage() {
  const savedReplies = localStorage.getItem(STORAGE_KEY);

  if (!savedReplies) return;

  try {
    replies = JSON.parse(savedReplies);
  } catch (error) {
    console.error("Failed to load saved replies:", error);
  }
}

/* Import / Export */

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function exportRepliesAsJson() {
  const json = JSON.stringify(replies, null, 2);

  downloadFile("saved_replies_backup.json", json, "application/json");
}

function importRepliesFromJson(file) {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const importedReplies = JSON.parse(reader.result);

      if (!Array.isArray(importedReplies)) {
        alert("Invalid JSON format. Expected an array of saved replies.");
        return;
      }

      const confirmed = confirm(
        "Importing this file will replace your current saved replies. Continue?",
      );

      if (!confirmed) return;

      replies = importedReplies;

      saveRepliesToStorage();
      renderReplies();
      clearForm();
    } catch (error) {
      console.error("Failed to import JSON:", error);
      alert("Failed to import JSON file.");
    }
  });

  reader.readAsText(file);
}

/* Helpers */

function createReplyId(title) {
  const baseId = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const initialId = baseId || `reply_${Date.now()}`;

  let uniqueId = initialId;
  let counter = 2;

  while (replies.some((reply) => reply.id === uniqueId)) {
    uniqueId = `${initialId}_${counter}`;
    counter += 1;
  }

  return uniqueId;
}

function buildFullReply(reply) {
  return [
    defaultGreeting,
    reply.opening,
    reply.empathy,
    reply.body,
    reply.ending,
  ]
    .filter(Boolean)
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

function getPreview(reply) {
  return reply.body.replace(/\s+/g, " ").trim();
}

function getSortedReplies(list, query = "") {
  return [...list].sort((a, b) => {
    if (a.is_active !== b.is_active) {
      return a.is_active ? -1 : 1;
    }

    const rankA = getSearchRank(a, query);
    const rankB = getSearchRank(b, query);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return a.title.localeCompare(b.title);
  });
}

function getSearchRank(reply, query) {
  if (!query) return 0;

  const normalizedQuery = query.toLowerCase();
  const title = reply.title.toLowerCase();

  if (title.startsWith(normalizedQuery)) return 1;
  if (title.includes(normalizedQuery)) return 2;

  const otherText = [reply.opening, reply.empathy, reply.body, reply.ending]
    .join(" ")
    .toLowerCase();

  if (otherText.includes(normalizedQuery)) return 3;

  return 4;
}

function wrapSelectedText(textarea, prefix, suffix) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const text = textarea.value;
  const selectedText = text.slice(start, end);

  if (!selectedText) return;

  textarea.value =
    text.slice(0, start) + prefix + selectedText + suffix + text.slice(end);

  textarea.focus();

  textarea.selectionStart = start + prefix.length;
  textarea.selectionEnd = end + prefix.length;
}

/* Form */

function clearForm() {
  formMode.textContent = "New saved reply";

  selectedReplyId = null;

  titleInput.value = "";
  openingInput.value = "";
  empathyInput.value = "";
  bodyTextarea.value = "";
  endingInput.value = "";
  activeCheckbox.checked = true;
}

function openEditForm(id) {
  const reply = replies.find((reply) => reply.id === id);

  if (!reply) return;

  formMode.textContent = "Edit saved reply";
  selectedReplyId = id;

  titleInput.value = reply.title;
  openingInput.value = reply.opening;
  empathyInput.value = reply.empathy;
  bodyTextarea.value = reply.body;
  endingInput.value = reply.ending;
  activeCheckbox.checked = reply.is_active;
}

/* CRUD Actions */

function createReply() {
  const title = titleInput.value.trim();

  if (!title) {
    alert("Title is required.");
    return;
  }

  const hasContent =
    openingInput.value.trim() ||
    empathyInput.value.trim() ||
    bodyTextarea.value.trim() ||
    endingInput.value.trim();

  if (!hasContent) {
    alert("Please add at least one reply text field.");
    return;
  }

  const newReply = {
    id: createReplyId(title),
    title,
    opening: openingInput.value.trim(),
    empathy: empathyInput.value.trim(),
    body: bodyTextarea.value.trim(),
    ending: endingInput.value.trim(),
    is_active: activeCheckbox.checked,
  };

  replies.push(newReply);

  saveRepliesToStorage();
  renderReplies();
  clearForm();
}

function saveReply() {
  if (!selectedReplyId) {
    createReply();
    return;
  }

  const title = titleInput.value.trim();

  if (!title) {
    alert("Title is required.");
    return;
  }

  const reply = replies.find((reply) => reply.id === selectedReplyId);

  if (!reply) return;

  reply.title = title;
  reply.opening = openingInput.value.trim();
  reply.empathy = empathyInput.value.trim();
  reply.body = bodyTextarea.value.trim();
  reply.ending = endingInput.value.trim();
  reply.is_active = activeCheckbox.checked;

  saveRepliesToStorage();
  renderReplies();
  clearForm();
}

function deleteReply(id) {
  const index = replies.findIndex((reply) => reply.id === id);

  if (index === -1) return;

  replies.splice(index, 1);

  saveRepliesToStorage();
  renderReplies();
}

/* Render */

function renderReplies() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredReplies = replies.filter((reply) => {
    const searchableText = [
      reply.title,
      reply.opening,
      reply.empathy,
      reply.body,
      reply.ending,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const sortedReplies = getSortedReplies(filteredReplies, query);

  replyList.innerHTML = "";

  if (sortedReplies.length === 0) {
    replyList.innerHTML = `<div class="empty-state">No saved replies found.</div>`;
    return;
  }

  sortedReplies.forEach((reply) => {
    const item = document.createElement("div");
    item.className = reply.is_active ? "reply-item" : "reply-item inactive";

    item.innerHTML = `
      <span class="delete-button" role="button" aria-label="Delete"></span>
      <span class="reply-title"></span>
      <span class="reply-preview"></span>
      <span class="edit-button" role="button" aria-label="Edit">✎</span>
    `;

    const titleElement = item.querySelector(".reply-title");
    const previewElement = item.querySelector(".reply-preview");
    const editButton = item.querySelector(".edit-button");
    const deleteButton = item.querySelector(".delete-button");

    titleElement.textContent = reply.title;
    previewElement.textContent = getPreview(reply);

    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditForm(reply.id);
    });

    if (!reply.is_active) {
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const confirmed = confirm("Delete this saved reply permanently?");
        if (!confirmed) return;

        deleteReply(reply.id);
      });
    }

    item.addEventListener("click", async () => {
      if (!reply.is_active) return;

      const fullReply = buildFullReply(reply);

      try {
        await navigator.clipboard.writeText(fullReply);

        const originalTitle = titleElement.textContent;

        titleElement.textContent = "Copied!";
        titleElement.classList.add("copied");
        item.classList.add("copied");

        setTimeout(() => {
          titleElement.textContent = originalTitle;
          titleElement.classList.remove("copied");
          item.classList.remove("copied");
        }, 1000);
      } catch (error) {
        console.error("Failed to copy reply:", error);
        alert("Failed to copy the saved reply.");
      }
    });

    replyList.appendChild(item);
  });
}

/* Listeners */

searchInput.addEventListener("input", renderReplies);
saveButton.addEventListener("click", saveReply);
newButton.addEventListener("click", clearForm);
exportButton.addEventListener("click", exportRepliesAsJson);

boldButton.addEventListener("click", () => {
  wrapSelectedText(bodyTextarea, "**", "**");
});

importButton.addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", () => {
  const file = importFileInput.files[0];

  if (!file) return;

  importRepliesFromJson(file);

  importFileInput.value = "";
});

loadRepliesFromStorage();
renderReplies();
