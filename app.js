const sections = [
  {
    title: "Planning",
    icon: "◇",
    color: "#e8b15c",
    tasks: [
      "Confirm launch goals and success metrics",
      "Lock the project timeline and owners",
      "Review risks and contingency plan",
      "Share the final launch brief",
    ],
  },
  {
    title: "Content",
    icon: "✦",
    color: "#b7c9a8",
    tasks: [
      "Finalize launch announcement copy",
      "Approve website and product messaging",
      "Prepare social and email assets",
      "Proofread all customer-facing content",
    ],
  },
  {
    title: "Approvals",
    icon: "✓",
    color: "#a9c4c6",
    tasks: [
      "Complete legal and compliance review",
      "Get executive stakeholder sign-off",
      "Confirm support team readiness",
      "Record final go / no-go decision",
    ],
  },
  {
    title: "Launch day",
    icon: "↗",
    color: "#d7b6aa",
    tasks: [
      "Run pre-launch health checks",
      "Publish all scheduled content",
      "Monitor product and support channels",
      "Share the first performance update",
    ],
  },
];

const storageKey = "team-launch-checklist";
const checklist = document.querySelector("#checklist");
const template = document.querySelector("#section-template");
const completeCount = document.querySelector("#complete-count");
const totalCount = document.querySelector("#total-count");
const progressPercent = document.querySelector("#progress-percent");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const resetButton = document.querySelector("#reset-button");

function loadProgress() {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey)) || []);
  } catch {
    return new Set();
  }
}

let completed = loadProgress();

function taskId(sectionIndex, taskIndex) {
  return `${sectionIndex}-${taskIndex}`;
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify([...completed]));
}

function updateProgress() {
  const total = sections.reduce((sum, section) => sum + section.tasks.length, 0);
  const done = completed.size;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  completeCount.textContent = done;
  totalCount.textContent = total;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));

  document.querySelectorAll(".checklist-section").forEach((section, sectionIndex) => {
    const sectionDone = sections[sectionIndex].tasks.filter((_, taskIndex) =>
      completed.has(taskId(sectionIndex, taskIndex))
    ).length;
    section.querySelector(".section-status").textContent =
      `${sectionDone} of ${sections[sectionIndex].tasks.length} complete`;
  });
}

function renderChecklist() {
  sections.forEach((section, sectionIndex) => {
    const fragment = template.content.cloneNode(true);
    const article = fragment.querySelector(".checklist-section");
    const icon = fragment.querySelector(".section-icon");
    const heading = fragment.querySelector("h2");
    const list = fragment.querySelector(".task-list");

    article.style.setProperty("--accent", section.color);
    icon.textContent = section.icon;
    heading.textContent = section.title;

    section.tasks.forEach((task, taskIndex) => {
      const id = taskId(sectionIndex, taskIndex);
      const item = document.createElement("li");
      item.className = "task-item";

      const label = document.createElement("label");
      const input = document.createElement("input");
      const visualCheckbox = document.createElement("span");
      const taskLabel = document.createElement("span");

      input.type = "checkbox";
      input.checked = completed.has(id);
      input.setAttribute("aria-label", task);
      visualCheckbox.className = "checkbox";
      visualCheckbox.setAttribute("aria-hidden", "true");
      taskLabel.className = "task-label";
      taskLabel.textContent = task;

      input.addEventListener("change", () => {
        if (input.checked) completed.add(id);
        else completed.delete(id);
        saveProgress();
        updateProgress();
      });

      label.append(input, visualCheckbox, taskLabel);
      item.append(label);
      list.append(item);
    });

    checklist.append(fragment);
  });

  updateProgress();
}

resetButton.addEventListener("click", () => {
  completed = new Set();
  document.querySelectorAll(".task-item input").forEach((input) => {
    input.checked = false;
  });
  saveProgress();
  updateProgress();
});

renderChecklist();
