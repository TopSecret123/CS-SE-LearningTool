/* ═══════════════════════════════════════════════════════════════
   STUDY TOOL — app.js
   Architecture:
   - State object = single source of truth
   - Render functions = pure (take data, return HTML string)
   - Mount functions = attach event listeners after render
   - addModule(data) = public API to register new modules
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── MODULE REGISTRY ──────────────────────────────────────────────────────────
// All modules register here. Call addModule(MODULE_DATA) from each data file.
const MODULES = {};

function addModule(moduleData) {
  MODULES[moduleData.id] = moduleData;
}

// ─── APPLICATION STATE ────────────────────────────────────────────────────────
const state = {
  activeModule: null,
  activeTab: 'overview',
  theme: localStorage.getItem('st-theme') || 'dark-mono',
  font:  localStorage.getItem('st-font')  || 'sora',
  toolbarOpen: false,
};

// ─── THEME & FONT ─────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'dark-mono',  label: 'Dark Mono'  },
  { id: 'dark-ocean', label: 'Dark Ocean' },
  { id: 'light-paper',label: 'Paper'      },
  { id: 'light-mint', label: 'Mint'       },
];

const FONTS = [
  { id: 'sora',        label: 'Sora'        },
  { id: 'inter',       label: 'Inter'       },
  { id: 'merriweather',label: 'Merriweather'},
];

function applyTheme(themeId) {
  state.theme = themeId;
  document.documentElement.dataset.theme = themeId;
  localStorage.setItem('st-theme', themeId);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === themeId);
  });
}

function applyFont(fontId) {
  state.font = fontId;
  document.documentElement.dataset.font = fontId;
  localStorage.setItem('st-font', fontId);
  document.querySelectorAll('.font-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.font === fontId);
  });
}

// ─── TOOLBAR ──────────────────────────────────────────────────────────────────
function renderToolbar() {
  return `
    <nav class="toolbar" id="toolbar">
      <button class="toolbar-toggle" id="toolbar-toggle" onclick="toggleToolbar()">
        ⚙ Appearance <span class="chevron">▼</span>
      </button>
      <div class="toolbar-panel" id="toolbar-panel">
        <div class="toolbar-row">
          <span class="toolbar-label">Theme</span>
          ${THEMES.map(t => `
            <button class="theme-btn${state.theme === t.id ? ' active' : ''}"
              data-theme="${t.id}"
              onclick="applyTheme('${t.id}')">
              ${t.label}
            </button>
          `).join('')}
        </div>
        <div class="toolbar-row">
          <span class="toolbar-label">Font</span>
          ${FONTS.map(f => `
            <button class="font-btn${state.font === f.id ? ' active' : ''}"
              data-font="${f.id}"
              onclick="applyFont('${f.id}')">
              ${f.label}
            </button>
          `).join('')}
        </div>
      </div>
    </nav>`;
}

function toggleToolbar() {
  state.toolbarOpen = !state.toolbarOpen;
  const panel  = document.getElementById('toolbar-panel');
  const toggle = document.getElementById('toolbar-toggle');
  panel.classList.toggle('open', state.toolbarOpen);
  toggle.classList.toggle('open', state.toolbarOpen);
}

// ─── MODULE NAV ───────────────────────────────────────────────────────────────
function renderModuleNav() {
  const ids = Object.keys(MODULES);
  if (ids.length === 0) return '';
  return `
    <div class="module-nav">
      ${ids.map(id => {
        const m = MODULES[id];
        return `<button class="module-nav-btn${state.activeModule === id ? ' active' : ''}"
          onclick="selectModule('${id}')">
          Week ${m.week}: ${m.title}
        </button>`;
      }).join('')}
    </div>`;
}

function selectModule(moduleId) {
  state.activeModule = moduleId;
  state.activeTab = 'overview';
  renderApp();
}

// ─── TAB BAR ──────────────────────────────────────────────────────────────────
function renderTabBar() {
  const tabs = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'topic1',      label: 'Topic 1'     },
    { id: 'topic2',      label: 'Topic 2'     },
    { id: 'assessments', label: 'Assessments' },
    { id: 'quiz',        label: 'Quiz'        },
  ];
  return `
    <div class="tab-bar" role="tablist">
      ${tabs.map(t => `
        <button class="tab-btn${state.activeTab === t.id ? ' active' : ''}"
          role="tab"
          onclick="switchTab('${t.id}')">
          ${t.label}
        </button>
      `).join('')}
    </div>`;
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().toLowerCase().replace(/\s/g,'') === tabId ||
      b.getAttribute('onclick').includes(`'${tabId}'`));
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${tabId}`);
  if (panel) panel.classList.add('active');
}

// ═══════════════════════════════════════════════════════════════
// RENDER: OVERVIEW PANEL (TCP/IP layers)
// ═══════════════════════════════════════════════════════════════
function renderOverviewPanel(mod) {
  const layersHtml = mod.tcpipLayers.map(layer => `
    <div class="layer-row l${layer.number}" onclick="toggleLayer(${layer.number})">
      <span class="layer-num">${layer.number}</span>
      <span class="layer-name">${layer.name}</span>
      <span class="layer-proto">${layer.protocols}</span>
    </div>
    <div class="layer-detail" id="layer-detail-${layer.number}">
      ${layer.detail.moduleRelevance ? '<span class="layer-module-badge">★ This module</span>' : ''}
      <h3>${layer.name} Layer</h3>
      <p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:0.5rem">${layer.detail.role}</p>
      <ul class="bullet-list">
        ${layer.detail.examples.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return `
    <div id="panel-overview" class="panel${state.activeTab === 'overview' ? ' active' : ''}">
      <p class="section-heading">TCP/IP 5-layer model — click a layer to expand</p>
      <div class="layers-stack">${layersHtml}</div>
      <div class="note-box">Layers 3 (Network) and 4 (Transport) are the focus of this module. Layers 1–2 were covered in previous modules.</div>

      <div class="notes-label" style="margin-top:1.25rem">
        📝 My notes — overview
      </div>
      ${renderNotesArea('overview-notes', mod.id)}
    </div>`;
}

function toggleLayer(num) {
  const detail = document.getElementById(`layer-detail-${num}`);
  detail.classList.toggle('visible');
}

// ═══════════════════════════════════════════════════════════════
// RENDER: SECTION CONTENT (shared between topic panels)
// ═══════════════════════════════════════════════════════════════
function renderContent(c, sectionId, moduleId) {
  let html = '';

  // IPv4 address diagram
  if (c.diagram && c.diagram.parts) {
    html += `<div class="diagram-box">
      <div class="diagram-label">${c.diagram.label}</div>
      <div class="ip-addr-demo">
        ${c.diagram.parts.map((p, i) => `
          <span class="octet ${p.type}">${p.value}</span>
          ${i < c.diagram.parts.length - 1 ? '<span class="dot">.</span>' : ''}
        `).join('')}
        <span class="ip-suffix">${c.diagram.suffix}</span>
      </div>
      <div class="ip-legend">
        ${c.diagram.legend.map(l => `
          <div class="ip-legend-item">
            <div class="ip-legend-dot ${l.type}"></div>
            <span style="font-size:0.73rem;color:var(--text-muted)">${l.label}</span>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  // IPv6 diagram
  if (c.diagram && c.diagram.ipv6Example) {
    html += `<div class="diagram-box">
      <div class="diagram-label">${c.diagram.label}</div>
      <div class="ipv6-display">${c.diagram.ipv6Example}</div>
      <div class="ipv6-note">${c.diagram.ipv6Note}</div>
    </div>`;
  }

  // Highlight block
  if (c.highlight) {
    html += `<div class="highlight-block ${c.highlight.accent}">
      <h4>${c.highlight.heading}</h4>
      <p>${c.highlight.body}</p>
    </div>`;
  }

  // Flow diagram
  if (c.flow) {
    const mainRow = c.flow.steps.map(s => {
      if (!s.type) return `<span class="flow-arrow">${s.label}</span>`;
      return `<div class="flow-box ${s.type}">
        ${s.label}
        ${s.sub ? `<span class="flow-sub">${s.sub}</span>` : ''}
      </div>`;
    }).join('');

    let extraRows = '';
    if (c.flow.extraRows) {
      extraRows = c.flow.extraRows.map(row => `
        <div class="flow-row" style="margin-top:5px">
          ${row.map(s => {
            if (!s.type) return `<span class="flow-arrow">${s.label}</span>`;
            return `<div class="flow-box ${s.type}">${s.label}</div>`;
          }).join('')}
        </div>`).join('');
    }

    html += `<div class="diagram-box">
      <div class="diagram-label">${c.flow.label}</div>
      <div class="flow-row">${mainRow}</div>
      ${extraRows}
    </div>`;
  }

  // Concept cards
  if (c.cards) {
    html += `<div class="concept-grid">
      ${c.cards.map(card => `
        <div class="concept-card accent-${card.accent}">
          <div class="cc-label">${card.label}</div>
          <div class="cc-val">${card.body}</div>
        </div>
      `).join('')}
    </div>`;
  }

  // Compare
  if (c.compare) {
    html += `<div class="compare-row">
      ${c.compare.map(cell => `
        <div class="compare-cell ${cell.side}">
          <h4>${cell.heading}</h4>
          <p>${cell.body}</p>
        </div>
      `).join('')}
    </div>`;
  }

  // Table
  if (c.table) {
    html += `<table class="data-table">
      <thead><tr>${c.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${c.table.rows.map(row => `
          <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('')}
      </tbody>
    </table>`;
  }

  // Bullet list
  if (c.bullets) {
    html += `<ul class="bullet-list">
      ${c.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>`;
  }

  // Tags
  if (c.tags) {
    html += `<div class="tag-row">
      ${c.tags.map(t => `<span class="tag ${t.type === 'default' ? '' : t.type}">${t.label}</span>`).join('')}
    </div>`;
  }

  // Note
  if (c.note) {
    html += `<div class="note-box">${c.note}</div>`;
  }

  // Per-section notes
  html += `
    <div class="notes-label">📝 My notes</div>
    ${renderNotesArea(sectionId + '-notes', moduleId)}
  `;

  return html;
}

// ═══════════════════════════════════════════════════════════════
// RENDER: TOPIC PANEL
// ═══════════════════════════════════════════════════════════════
function renderTopicPanel(topic, panelId, mod) {
  const isActive = state.activeTab === panelId;
  return `
    <div id="panel-${panelId}" class="panel${isActive ? ' active' : ''}">
      <div class="section-list">
        ${topic.sections.map(s => `
          <div class="acc-item" id="acc-${s.id}">
            <button class="acc-trigger" onclick="toggleAcc('${s.id}')">
              <span class="acc-num">${s.number}</span>
              <span class="acc-title">${s.title}</span>
              <span class="acc-meta">${s.duration}</span>
              <span class="acc-chevron">▼</span>
            </button>
            <div class="acc-body">
              ${renderContent(s.content, s.id, mod.id)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function toggleAcc(sectionId) {
  const el = document.getElementById(`acc-${sectionId}`);
  el.classList.toggle('open');
}

// ═══════════════════════════════════════════════════════════════
// RENDER: ASSESSMENTS PANEL
// ═══════════════════════════════════════════════════════════════
function renderAssessmentsPanel(mod) {
  const isActive = state.activeTab === 'assessments';

  // Build a lookup: sectionId → section title
  const sectionLookup = {};
  mod.topics.forEach(topic => {
    topic.sections.forEach(s => {
      sectionLookup[s.id] = s.title;
    });
  });

  return `
    <div id="panel-assessments" class="panel${isActive ? ' active' : ''}">
      ${mod.assessments.map(a => `
        <div class="assess-card">
          <div class="assess-header">
            <span class="assess-title">${a.title}</span>
            <span class="assess-badge">${a.weight}</span>
            <span class="assess-due">Due: ${a.due}</span>
          </div>
          <p class="assess-desc">${a.description}</p>

          <div class="assess-section-label">Linked content</div>
          <div class="linked-topics">
            ${a.linkedTopics.map(tid => `
              <span class="topic-chip" title="Click to jump to this section"
                onclick="jumpToSection('${tid}')">
                ${sectionLookup[tid] || tid}
              </span>
            `).join('')}
          </div>

          ${a.labs ? `
            <div class="assess-section-label">Labs</div>
            <ul class="bullet-list" style="margin-bottom:0.65rem">
              ${a.labs.map(l => `<li><strong>${l.title}</strong> — ${l.desc}</li>`).join('')}
            </ul>
          ` : ''}

          <div class="assess-section-label">Exam tips</div>
          <ul class="bullet-list">
            ${a.tips.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      `).join('')}

      <div class="notes-label" style="margin-top:1rem">📝 Assessment notes</div>
      ${renderNotesArea('assessment-notes', mod.id)}
    </div>`;
}

function jumpToSection(sectionId) {
  // Determine which topic contains this section
  const mod = MODULES[state.activeModule];
  for (let i = 0; i < mod.topics.length; i++) {
    const found = mod.topics[i].sections.find(s => s.id === sectionId);
    if (found) {
      const tabId = `topic${i + 1}`;
      state.activeTab = tabId;
      renderApp();
      // Open the accordion after render
      setTimeout(() => {
        const el = document.getElementById(`acc-${sectionId}`);
        if (el) {
          el.classList.add('open');
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDER: QUIZ PANEL
// ═══════════════════════════════════════════════════════════════
function renderQuizPanel(mod) {
  const isActive = state.activeTab === 'quiz';

  // Build section title lookup for linked topics display
  const sectionLookup = {};
  mod.topics.forEach(topic => {
    topic.sections.forEach(s => { sectionLookup[s.id] = s.title; });
  });

  const letters = ['A', 'B', 'C', 'D'];

  return `
    <div id="panel-quiz" class="panel${isActive ? ' active' : ''}">
      <p class="section-heading" style="margin-bottom:1rem">Check your understanding — click an answer</p>
      ${mod.quiz.map((q, qi) => `
        <div class="quiz-card" id="qcard-${qi}">
          <div class="quiz-q">${qi + 1}. ${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, oi) => `
              <button class="quiz-opt"
                onclick="answerQuiz('${mod.id}', ${qi}, ${oi})"
                id="qopt-${qi}-${oi}">
                <span class="opt-letter">${letters[oi]}</span>
                ${opt}
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="qfb-${qi}"></div>
          <button class="quiz-reset" id="qreset-${qi}" onclick="resetQuiz(${qi}, ${q.options.length})">
            Try again
          </button>
          <div class="quiz-linked" id="qlinked-${qi}" style="display:none">
            Related: ${q.linkedTopics.map(tid =>
              `<span class="topic-chip" onclick="jumpToSection('${tid}')" style="margin-left:4px">${sectionLookup[tid]}</span>`
            ).join('')}
          </div>
        </div>
      `).join('')}
    </div>`;
}

function answerQuiz(moduleId, questionIndex, chosenIndex) {
  const mod = MODULES[moduleId];
  const q = mod.quiz[questionIndex];
  const opts = document.querySelectorAll(`#qcard-${questionIndex} .quiz-opt`);
  const correct = q.answer;

  opts.forEach((opt, i) => {
    opt.disabled = true;
    if (i === correct)       opt.classList.add('correct');
    else if (i === chosenIndex) opt.classList.add('wrong');
    else                     opt.classList.add('neutral');
  });

  const fb     = document.getElementById(`qfb-${questionIndex}`);
  const reset  = document.getElementById(`qreset-${questionIndex}`);
  const linked = document.getElementById(`qlinked-${questionIndex}`);

  fb.classList.add('show');
  reset.classList.add('show');
  linked.style.display = 'block';

  if (chosenIndex === correct) {
    fb.textContent = '✓ Correct. ' + q.explanation;
    fb.classList.add('ok');
  } else {
    const letters = ['A','B','C','D'];
    fb.textContent = `✗ The answer is ${letters[correct]}. ${q.explanation}`;
    fb.classList.add('no');
  }
}

function resetQuiz(questionIndex, numOptions) {
  for (let i = 0; i < numOptions; i++) {
    const opt = document.getElementById(`qopt-${questionIndex}-${i}`);
    if (opt) {
      opt.disabled = false;
      opt.classList.remove('correct', 'wrong', 'neutral');
    }
  }
  const fb    = document.getElementById(`qfb-${questionIndex}`);
  const reset = document.getElementById(`qreset-${questionIndex}`);
  const linked = document.getElementById(`qlinked-${questionIndex}`);
  fb.classList.remove('show', 'ok', 'no');
  fb.textContent = '';
  reset.classList.remove('show');
  if (linked) linked.style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════
// NOTES (localStorage)
// ═══════════════════════════════════════════════════════════════
function renderNotesArea(key, moduleId) {
  const storageKey = `st-notes-${moduleId}-${key}`;
  const saved = localStorage.getItem(storageKey) || '';
  return `
    <textarea class="notes-area"
      placeholder="Write your own notes or reword concepts here..."
      id="notes-${key}"
      oninput="saveNote('${storageKey}', '${key}')"
    >${saved}</textarea>
    <div class="notes-saved-indicator" id="saved-${key}">Saved</div>
  `;
}

let saveTimers = {};
function saveNote(storageKey, indicatorKey) {
  const el = document.getElementById(`notes-${indicatorKey}`);
  if (!el) return;
  clearTimeout(saveTimers[indicatorKey]);
  saveTimers[indicatorKey] = setTimeout(() => {
    localStorage.setItem(storageKey, el.value);
    const indicator = document.getElementById(`saved-${indicatorKey}`);
    if (indicator) {
      indicator.classList.add('show');
      setTimeout(() => indicator.classList.remove('show'), 1500);
    }
  }, 600);
}

// ═══════════════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════════════
function renderApp() {
  const root = document.getElementById('app-root');
  const mod  = MODULES[state.activeModule];

  if (!mod) {
    root.innerHTML = '<p style="color:var(--text-muted);padding:2rem 0">No module selected.</p>';
    return;
  }

  const html = `
    ${renderModuleNav()}
    ${renderTabBar()}
    ${renderOverviewPanel(mod)}
    ${renderTopicPanel(mod.topics[0], 'topic1', mod)}
    ${renderTopicPanel(mod.topics[1], 'topic2', mod)}
    ${renderAssessmentsPanel(mod)}
    ${renderQuizPanel(mod)}
  `;

  root.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme & font immediately
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.font  = state.font;

  // Render toolbar (static, lives outside app-root)
  document.getElementById('toolbar-root').innerHTML = renderToolbar();

  // Select first available module by default
  const moduleIds = Object.keys(MODULES);
  if (moduleIds.length > 0) {
    state.activeModule = moduleIds[0];
  }

  renderApp();
});
