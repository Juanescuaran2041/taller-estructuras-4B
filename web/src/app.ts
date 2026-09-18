import { SystemBorrows } from "../../src/structures/SystemBorrows.js";
import type { EquipmentSnapshot, DirectedLoanStep } from "../../src/structures/SystemBorrows.js";
import type { RequestLoan } from "../../src/structures/RequestLoan.js";
import { TypeEquipment, StatusEquipment } from "../../src/Equipment.js";
import { buildSampleInventory } from "./sampleData.js";

type TabName = "operations" | "carts" | "queues" | "inventory";

interface LogEntry {
  time: number;
  message: string;
  isError: boolean;
}

interface SearchResult {
  equipment: EquipmentSnapshot;
  cartPosition: number | null;
}

interface AppState {
  sys: SystemBorrows;
  currentTab: TabName;
  currentMinute: number;
  log: LogEntry[];
  lastError: string | null;
  animating: boolean;
  filterType: TypeEquipment | "ALL";
  filterStatus: StatusEquipment | "ALL";
  searchResult: SearchResult | null;
  searchError: string | null;
}

const state: AppState = {
  sys: new SystemBorrows(3, 2),
  currentTab: "operations",
  currentMinute: 0,
  log: [],
  lastError: null,
  animating: false,
  filterType: "ALL",
  filterStatus: "ALL",
  searchResult: null,
  searchError: null,
};

const TAB_LABELS: Record<TabName, string> = {
  operations: "Operations",
  carts: "Carts",
  queues: "Queues",
  inventory: "Inventory",
};

const TYPE_LABELS: Record<TypeEquipment, string> = {
  [TypeEquipment.LAPTOP]: "Laptop",
  [TypeEquipment.KIT]: "Kit",
  [TypeEquipment.MULTIMETER]: "Multimeter",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function logEvent(message: string, isError: boolean): void {
  state.log.unshift({ time: state.currentMinute, message, isError });
  if (state.log.length > 200) state.log.length = 200;
}

function runAction(fn: () => string | void): void {
  try {
    const result = fn();
    state.lastError = null;
    logEvent(typeof result === "string" ? result : "Operation completed.", false);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    state.lastError = message;
    logEvent(message, true);
  }
  render();
}

function typeOptions(selectedValue?: string): string {
  return Object.values(TypeEquipment)
    .map(t => `<option value="${t}" ${t === selectedValue ? "selected" : ""}>${TYPE_LABELS[t]}</option>`)
    .join("");
}

function renderTabs(): void {
  const el = document.getElementById("tabs")!;
  el.innerHTML = (Object.keys(TAB_LABELS) as TabName[])
    .map(tab => `<button class="tab-btn ${tab === state.currentTab ? "active" : ""}" data-action="switch-tab" data-tab="${tab}">${TAB_LABELS[tab]}</button>`)
    .join("");
}

function renderErrorBanner(): void {
  const el = document.getElementById("error-banner")!;
  if (!state.lastError) {
    el.classList.add("hidden");
    el.innerHTML = "";
    return;
  }
  el.classList.remove("hidden");
  el.textContent = state.lastError;
}

function renderSidebar(): void {
  const el = document.getElementById("sidebar")!;
  const report = state.sys.report();

  el.innerHTML = `
    <div class="panel">
      <h2>Metrics</h2>
      <h3>Equipment by status</h3>
      <div class="metrics-grid">
        <span class="metric-label">In cart</span><span>${report.equipmentByStatus.inCart}</span>
        <span class="metric-label">Borrowed</span><span>${report.equipmentByStatus.borrowed}</span>
        <span class="metric-label">In review</span><span>${report.equipmentByStatus.inReview}</span>
        <span class="metric-label">Maintenance</span><span>${report.equipmentByStatus.maintenance}</span>
      </div>
      <h3>Cart occupancy</h3>
      <div class="metrics-grid">
        <span class="metric-label">Laptop</span><span>${report.cartOccupancy.laptop}</span>
        <span class="metric-label">Kit</span><span>${report.cartOccupancy.kit}</span>
        <span class="metric-label">Multimeter</span><span>${report.cartOccupancy.multimeter}</span>
      </div>
      <h3>Wait queues</h3>
      <div class="metrics-grid">
        <span class="metric-label">Laptop</span><span>${report.waitQueues.laptop}</span>
        <span class="metric-label">Kit</span><span>${report.waitQueues.kit}</span>
        <span class="metric-label">Multimeter</span><span>${report.waitQueues.multimeter}</span>
      </div>
      <h3>Pending storage</h3>
      <div class="metrics-grid">
        <span class="metric-label">Laptop</span><span>${report.pendingStorage.laptop}</span>
        <span class="metric-label">Kit</span><span>${report.pendingStorage.kit}</span>
        <span class="metric-label">Multimeter</span><span>${report.pendingStorage.multimeter}</span>
      </div>
      <h3>Requests</h3>
      <div class="metrics-grid">
        <span class="metric-label">Immediate</span><span>${report.requests.immediate}</span>
        <span class="metric-label">Queued</span><span>${report.requests.queued}</span>
      </div>
      <h3>Directed loans</h3>
      <div class="metrics-grid">
        <span class="metric-label">Total</span><span>${report.directedLoans.total}</span>
        <span class="metric-label">Total moves</span><span>${report.directedLoans.totalMoves}</span>
      </div>
      <h3>Preventive maintenance (R8)</h3>
      <div class="metrics-grid">
        <span class="metric-label">Equipment &gt;= 5 loans</span><span>${report.preventiveMaintenanceR8}</span>
      </div>
    </div>
    <div class="panel">
      <h2>Log</h2>
      <ul class="log-list">
        ${state.log.map(entry => `<li class="${entry.isError ? "error" : ""}">[t=${entry.time}] ${escapeHtml(entry.message)}</li>`).join("") || "<li>No operations yet.</li>"}
      </ul>
    </div>
  `;
}

function cartClass(items: EquipmentSnapshot[], capacity: number): string {
  if (items.length === 0) return "empty";
  if (items.length >= capacity) return "full";
  return "";
}

function renderCartBox(title: string, type: TypeEquipment, capacity: number): string {
  const items = state.sys.getCartView(type);
  const slots = items
    .map((eq, index) => `<div class="cart-slot ${index === 0 ? "top" : ""}">${escapeHtml(eq.code)}${index === 0 ? " (TOP)" : ""}</div>`)
    .join("");

  return `
    <div class="cart-box ${cartClass(items, capacity)}">
      <div class="cart-header">
        <span>${title}</span>
        <span>${items.length}/${capacity}${items.length === 0 ? " EMPTY" : ""}${items.length >= capacity ? " FULL" : ""}</span>
      </div>
      <div class="cart-body">
        ${slots || `<div class="cart-empty-label">Cart is empty</div>`}
      </div>
    </div>
  `;
}

function renderCartsScreen(): string {
  const capacity = state.sys.getCapacity();
  return `
    <h2 class="section-title">Carts (stacks)</h2>
    <div class="carts-grid">
      ${renderCartBox("Laptop cart", TypeEquipment.LAPTOP, capacity)}
      ${renderCartBox("Kit cart", TypeEquipment.KIT, capacity)}
      ${renderCartBox("Multimeter cart", TypeEquipment.MULTIMETER, capacity)}
    </div>

    <div class="panel" style="margin-top:16px;">
      <h2>Directed loan (R4)</h2>
      <form data-action="submit-directed-loan">
        <div class="form-row">
          <label>Equipment code</label>
          <input name="code" required>
        </div>
        <div class="form-row">
          <label>Requested by</label>
          <input name="student" required>
        </div>
        <div class="form-row">
          <button type="submit">Run directed loan</button>
        </div>
      </form>
      <div id="directed-loan-view"></div>
    </div>
  `;
}

function renderQueueBox(title: string, front: string, items: string[]): string {
  const slots = items
    .map((label, index) => `<div class="queue-slot ${index === 0 ? "front" : ""}">${escapeHtml(label)}</div>`)
    .join("");

  return `
    <div class="queue-box">
      <div class="cart-header">
        <span>${title}</span>
        <span>${items.length} waiting</span>
      </div>
      <div class="queue-labels">
        <span>${front}</span>
        <span>END</span>
      </div>
      <div class="queue-row">
        ${slots || `<div class="queue-empty-label">Queue is empty</div>`}
      </div>
    </div>
  `;
}

function renderQueuesScreen(): string {
  const waitLabel = (r: RequestLoan) => `${r.student} (t=${r.time})`;
  const eqLabel = (e: EquipmentSnapshot) => e.code;

  return `
    <h2 class="section-title">Wait queues (per equipment type)</h2>
    ${renderQueueBox("Laptop wait queue", "FRONT", state.sys.getWaitQueueView(TypeEquipment.LAPTOP).map(waitLabel))}
    ${renderQueueBox("Kit wait queue", "FRONT", state.sys.getWaitQueueView(TypeEquipment.KIT).map(waitLabel))}
    ${renderQueueBox("Multimeter wait queue", "FRONT", state.sys.getWaitQueueView(TypeEquipment.MULTIMETER).map(waitLabel))}

    <h2 class="section-title">Review queue</h2>
    ${renderQueueBox("Pending review", "FRONT", state.sys.getReviewQueueView().map(eqLabel))}

    <h2 class="section-title">Pending storage queues (cart full, R7)</h2>
    ${renderQueueBox("Laptop pending storage", "FRONT", state.sys.getPendingStorageView(TypeEquipment.LAPTOP).map(eqLabel))}
    ${renderQueueBox("Kit pending storage", "FRONT", state.sys.getPendingStorageView(TypeEquipment.KIT).map(eqLabel))}
    ${renderQueueBox("Multimeter pending storage", "FRONT", state.sys.getPendingStorageView(TypeEquipment.MULTIMETER).map(eqLabel))}
  `;
}

function renderOperationsScreen(): string {
  return `
    <h2 class="section-title">Operations</h2>

    <div class="panel">
      <h2>Request equipment (R1, R3, R6)</h2>
      <form data-action="submit-request">
        <div class="form-row">
          <label>Student</label>
          <input name="student" required>
        </div>
        <div class="form-row">
          <label>Type</label>
          <select name="type">${typeOptions()}</select>
        </div>
        <div class="form-row">
          <button type="submit">Request</button>
        </div>
      </form>
    </div>

    <div class="panel">
      <h2>Return equipment (R5, R6)</h2>
      <form data-action="submit-return">
        <div class="form-row">
          <label>Equipment code</label>
          <input name="code" required>
        </div>
        <div class="form-row">
          <button type="submit">Return</button>
        </div>
      </form>
    </div>

    <div class="panel">
      <h2>Review next returned equipment (R5, R7, R8)</h2>
      <div class="form-row">
        <button data-action="review" data-damaged="false">Review (OK)</button>
        <button data-action="review" data-damaged="true" class="danger">Review (Damaged)</button>
      </div>
    </div>

    <div class="panel">
      <h2>Attend wait queue manually (R3)</h2>
      <form data-action="submit-attend">
        <div class="form-row">
          <label>Type</label>
          <select name="type">${typeOptions()}</select>
        </div>
        <div class="form-row">
          <button type="submit" class="secondary">Attend</button>
        </div>
      </form>
    </div>
  `;
}

function statusOptions(selectedValue?: string): string {
  return Object.values(StatusEquipment)
    .map(s => `<option value="${s}" ${s === selectedValue ? "selected" : ""}>${s}</option>`)
    .join("");
}

function renderSearchResult(): string {
  if (state.searchError) {
    return `<p class="search-result error">${escapeHtml(state.searchError)}</p>`;
  }
  if (!state.searchResult) {
    return "";
  }
  const { equipment, cartPosition } = state.searchResult;
  const positionText = cartPosition !== null
    ? `Position in cart (from the top): ${cartPosition}`
    : "Not currently in a cart.";
  return `
    <p class="search-result">
      <strong>${escapeHtml(equipment.code)}</strong> — ${TYPE_LABELS[equipment.type]} —
      <span class="badge ${equipment.status}">${equipment.status}</span> — ${positionText}
    </p>
  `;
}

function renderInventoryScreen(): string {
  const items = state.sys.getInventoryView().filter(eq => {
    const typeOk = state.filterType === "ALL" || eq.type === state.filterType;
    const statusOk = state.filterStatus === "ALL" || eq.status === state.filterStatus;
    return typeOk && statusOk;
  });

  const rows = items
    .map(eq => `
      <tr>
        <td>${escapeHtml(eq.code)}</td>
        <td>${TYPE_LABELS[eq.type]}</td>
        <td><span class="badge ${eq.status}">${eq.status}</span></td>
        <td>${eq.borrowCount}</td>
        <td>${eq.currentStudent ? escapeHtml(eq.currentStudent) : "-"}</td>
        <td>
          <button data-action="remove-equipment" data-code="${escapeHtml(eq.code)}" class="danger" ${eq.status === StatusEquipment.IN_CART || eq.status === StatusEquipment.MAINTENANCE ? "" : "disabled"}>Decommission</button>
        </td>
      </tr>
    `)
    .join("");

  return `
    <h2 class="section-title">Inventory (linked list)</h2>

    <div class="panel">
      <h2>Search equipment (RF-08)</h2>
      <form data-action="submit-search">
        <div class="form-row">
          <label>Code</label>
          <input name="code" required>
        </div>
        <div class="form-row">
          <button type="submit">Search</button>
        </div>
      </form>
      ${renderSearchResult()}
    </div>

    <div class="panel">
      <h2>Register new equipment</h2>
      <form data-action="submit-add-equipment">
        <div class="form-row">
          <label>Code</label>
          <input name="code" required>
        </div>
        <div class="form-row">
          <label>Type</label>
          <select name="type">${typeOptions()}</select>
        </div>
        <div class="form-row">
          <button type="submit">Add</button>
        </div>
      </form>
    </div>

    <div class="panel">
      <h2>Filter inventory</h2>
      <form data-action="submit-filter">
        <div class="form-row">
          <label>Type</label>
          <select name="type"><option value="ALL" ${state.filterType === "ALL" ? "selected" : ""}>All</option>${typeOptions(state.filterType === "ALL" ? undefined : state.filterType)}</select>
        </div>
        <div class="form-row">
          <label>Status</label>
          <select name="status"><option value="ALL" ${state.filterStatus === "ALL" ? "selected" : ""}>All</option>${statusOptions(state.filterStatus === "ALL" ? undefined : state.filterStatus)}</select>
        </div>
        <div class="form-row">
          <button type="submit" class="secondary">Apply filter</button>
        </div>
      </form>
    </div>

    <div class="panel">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Status</th>
            <th>Loans</th>
            <th>Current student</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="6">Inventory is empty. Load the sample data or register equipment.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function renderScreen(): void {
  const el = document.getElementById("screen")!;
  switch (state.currentTab) {
    case "operations": el.innerHTML = renderOperationsScreen(); break;
    case "carts": el.innerHTML = renderCartsScreen(); break;
    case "queues": el.innerHTML = renderQueuesScreen(); break;
    case "inventory": el.innerHTML = renderInventoryScreen(); break;
  }
}

function render(): void {
  renderErrorBanner();
  renderTabs();
  renderSidebar();
  if (!state.animating) {
    renderScreen();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slotHtml(code: string): string {
  return `<div class="cart-slot">${escapeHtml(code)}</div>`;
}

function renderDirectedLoanColumns(mainStack: string[], auxStack: string[], statusLine: string): string {
  return `
    <p>${escapeHtml(statusLine)}</p>
    <div class="directed-loan-columns">
      <div class="cart-box">
        <div class="cart-header"><span>Main cart</span><span>${mainStack.length}</span></div>
        <div class="cart-body">${mainStack.map(slotHtml).join("") || `<div class="cart-empty-label">Empty</div>`}</div>
      </div>
      <div class="cart-box">
        <div class="cart-header"><span>Auxiliary cart</span><span>${auxStack.length}</span></div>
        <div class="cart-body">${auxStack.map(slotHtml).join("") || `<div class="cart-empty-label">Empty</div>`}</div>
      </div>
    </div>
  `;
}

async function animateDirectedLoan(code: string, student: string): Promise<void> {
  const view = document.getElementById("directed-loan-view");
  if (!view) return;

  let before: EquipmentSnapshot[];
  try {
    const located = state.sys.find(code);
    before = state.sys.getCartView(located.equipment.type);
  } catch (err) {
    runAction(() => { throw err instanceof Error ? err : new Error(String(err)); });
    return;
  }

  let result: { equipment: EquipmentSnapshot; moves: number; steps: DirectedLoanStep[] };
  try {
    result = state.sys.directedLoan(code, student, state.currentMinute);
  } catch (err) {
    runAction(() => { throw err instanceof Error ? err : new Error(String(err)); });
    return;
  }

  state.animating = true;
  render();

  const main = before.map(e => e.code);
  const aux: string[] = [];

  view.innerHTML = renderDirectedLoanColumns(main, aux, "Starting directed loan...");
  await sleep(350);

  for (const step of result.steps) {
    if (step.action === "out") {
      main.shift();
      aux.unshift(step.code);
      view.innerHTML = renderDirectedLoanColumns(main, aux, `Moving ${step.code} to the auxiliary cart.`);
    } else if (step.action === "found") {
      main.shift();
      view.innerHTML = renderDirectedLoanColumns(main, aux, `Found ${step.code}. Handing it to ${student}.`);
    } else {
      aux.shift();
      main.unshift(step.code);
      view.innerHTML = renderDirectedLoanColumns(main, aux, `Restoring ${step.code} to the main cart.`);
    }
    await sleep(450);
  }

  view.innerHTML = renderDirectedLoanColumns(main, aux, `Done. Equipment ${result.equipment.code} lent to ${student} in ${result.moves} moves.`);
  logEvent(`Directed loan: equipment ${result.equipment.code} lent to ${student} in ${result.moves} moves.`, false);

  state.animating = false;
  render();
}

function getFormValue(form: HTMLFormElement, name: string): string {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
    return field.value.trim();
  }
  return "";
}

function wireEvents(): void {
  document.getElementById("input-time")!.addEventListener("input", ev => {
    const value = Number((ev.target as HTMLInputElement).value);
    state.currentMinute = Number.isFinite(value) ? value : 0;
  });

  document.body.addEventListener("click", ev => {
    const target = (ev.target as HTMLElement).closest("[data-action]") as HTMLElement | null;
    if (!target) return;

    const action = target.dataset["action"];

    if (action === "switch-tab") {
      state.currentTab = target.dataset["tab"] as TabName;
      render();
      return;
    }

    if (action === "load-sample") {
      runAction(() => {
        state.sys.loadInventory(buildSampleInventory());
        return "Sample dataset loaded into the inventory.";
      });
      return;
    }

    if (action === "review") {
      const damaged = target.dataset["damaged"] === "true";
      runAction(() => state.sys.review(damaged));
      return;
    }

    if (action === "remove-equipment") {
      const code = target.dataset["code"]!;
      runAction(() => {
        state.sys.removeEquipment(code);
        return `Equipment ${code} removed from the inventory.`;
      });
      return;
    }
  });

  document.body.addEventListener("submit", ev => {
    const form = ev.target as HTMLFormElement;
    const action = form.dataset["action"];
    if (!action) return;
    ev.preventDefault();

    if (action === "submit-request") {
      const student = getFormValue(form, "student");
      const type = getFormValue(form, "type") as TypeEquipment;
      runAction(() => state.sys.request(student, type, state.currentMinute));
      form.reset();
      return;
    }

    if (action === "submit-return") {
      const code = getFormValue(form, "code");
      runAction(() => state.sys.returnEquipment(code, state.currentMinute));
      form.reset();
      return;
    }

    if (action === "submit-attend") {
      const type = getFormValue(form, "type") as TypeEquipment;
      runAction(() => {
        const before = state.sys.getWaitQueueView(type).length;
        state.sys.attendWaitlist(type);
        const after = state.sys.getWaitQueueView(type).length;
        return before === after
          ? `No student waiting for ${TYPE_LABELS[type]}, or the cart is empty.`
          : `Wait queue for ${TYPE_LABELS[type]} attended.`;
      });
      return;
    }

    if (action === "submit-search") {
      const code = getFormValue(form, "code");
      try {
        state.searchResult = state.sys.find(code);
        state.searchError = null;
      } catch (err) {
        state.searchResult = null;
        state.searchError = err instanceof Error ? err.message : String(err);
      }
      render();
      return;
    }

    if (action === "submit-filter") {
      const type = getFormValue(form, "type");
      const status = getFormValue(form, "status");
      state.filterType = type === "ALL" ? "ALL" : (type as TypeEquipment);
      state.filterStatus = status === "ALL" ? "ALL" : (status as StatusEquipment);
      render();
      return;
    }

    if (action === "submit-add-equipment") {
      const code = getFormValue(form, "code");
      const type = getFormValue(form, "type") as TypeEquipment;
      runAction(() => {
        state.sys.addEquipment(code, type);
        return `Equipment ${code} registered in the inventory.`;
      });
      form.reset();
      return;
    }

    if (action === "submit-directed-loan") {
      const code = getFormValue(form, "code");
      const student = getFormValue(form, "student");
      void animateDirectedLoan(code, student);
      return;
    }
  });
}

export function initApp(): void {
  wireEvents();
  render();
}
