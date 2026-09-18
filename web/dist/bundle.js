// src/Equipment.ts
var TypeEquipment = /* @__PURE__ */ ((TypeEquipment2) => {
  TypeEquipment2["LAPTOP"] = "LAPTOP";
  TypeEquipment2["KIT"] = "KIT";
  TypeEquipment2["MULTIMETER"] = "MULTIMETER";
  return TypeEquipment2;
})(TypeEquipment || {});
var StatusEquipment = /* @__PURE__ */ ((StatusEquipment2) => {
  StatusEquipment2["IN_CART"] = "IN_CART";
  StatusEquipment2["BORROWED"] = "BORROWED";
  StatusEquipment2["IN_REVIEW"] = "IN_REVIEW";
  StatusEquipment2["MAINTENANCE"] = "MAINTENANCE";
  return StatusEquipment2;
})(StatusEquipment || {});
var Equipment = class {
  code;
  type;
  status;
  borrowCount;
  currentStudent;
  loanTime;
  constructor(code, type, status = "IN_CART" /* IN_CART */, borrowCount = 0) {
    this.code = code;
    this.type = type;
    this.status = status;
    this.borrowCount = borrowCount;
  }
};

// src/structures/stack.ts
var StackNode = class {
  value;
  next = null;
  constructor(value) {
    this.value = value;
  }
};
var Stack = class {
  topNode = null;
  count = 0;
  push(value) {
    const newNode = new StackNode(value);
    newNode.next = this.topNode;
    this.topNode = newNode;
    this.count++;
  }
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    const removedValue = this.topNode.value;
    this.topNode = this.topNode.next;
    this.count--;
    return removedValue;
  }
  peek() {
    return this.isEmpty() ? null : this.topNode.value;
  }
  isEmpty() {
    return this.count === 0;
  }
  size() {
    return this.count;
  }
  toArray() {
    const elements = [];
    let current = this.topNode;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
};

// src/structures/queue.ts
var QueueNode = class {
  value;
  next = null;
  constructor(value) {
    this.value = value;
  }
};
var Queue = class {
  frontNode = null;
  rearNode = null;
  count = 0;
  enqueue(value) {
    const newNode = new QueueNode(value);
    if (this.isEmpty()) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else {
      this.rearNode.next = newNode;
      this.rearNode = newNode;
    }
    this.count++;
  }
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const removedValue = this.frontNode.value;
    this.frontNode = this.frontNode.next;
    this.count--;
    if (this.frontNode === null) {
      this.rearNode = null;
    }
    return removedValue;
  }
  peek() {
    return this.isEmpty() ? null : this.frontNode.value;
  }
  isEmpty() {
    return this.count === 0;
  }
  size() {
    return this.count;
  }
  toArray() {
    const elements = [];
    let current = this.frontNode;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
};

// src/Inventory.ts
var ListNode = class {
  value;
  next = null;
  constructor(value) {
    this.value = value;
  }
};
var LinkedList = class {
  head = null;
  count = 0;
  add(value) {
    const newNode = new ListNode(value);
    if (this.head === null) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.count++;
  }
  remove(predicate) {
    if (this.head === null) return false;
    if (predicate(this.head.value)) {
      this.head = this.head.next;
      this.count--;
      return true;
    }
    let current = this.head;
    while (current.next !== null && !predicate(current.next.value)) {
      current = current.next;
    }
    if (current.next !== null) {
      current.next = current.next.next;
      this.count--;
      return true;
    }
    return false;
  }
  find(predicate) {
    let current = this.head;
    while (current !== null) {
      if (predicate(current.value)) {
        return current.value;
      }
      current = current.next;
    }
    return null;
  }
  toArray() {
    const elements = [];
    let current = this.head;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
  size() {
    return this.count;
  }
  isEmpty() {
    return this.count === 0;
  }
};

// src/structures/SystemBorrows.ts
var SystemBorrows = class {
  inventory;
  cartLaptop;
  cartKit;
  cartMultimeter;
  waitQueueLaptop;
  waitQueueKit;
  waitQueueMultimeter;
  reviewQueue;
  pendingStorageQueueLaptop;
  pendingStorageQueueKit;
  pendingStorageQueueMultimeter;
  maxCapacityK;
  maxHoursH;
  totalMovesDirectedLoan = 0;
  countDirectedLoans = 0;
  countImmediateLoans = 0;
  countQueuedLoans = 0;
  constructor(maxCapacityK = 5, maxHoursH = 24) {
    this.maxCapacityK = maxCapacityK;
    this.maxHoursH = maxHoursH;
    this.inventory = new LinkedList();
    this.cartLaptop = new Stack();
    this.cartKit = new Stack();
    this.cartMultimeter = new Stack();
    this.waitQueueLaptop = new Queue();
    this.waitQueueKit = new Queue();
    this.waitQueueMultimeter = new Queue();
    this.reviewQueue = new Queue();
    this.pendingStorageQueueLaptop = new Queue();
    this.pendingStorageQueueKit = new Queue();
    this.pendingStorageQueueMultimeter = new Queue();
  }
  getCapacity() {
    return this.maxCapacityK;
  }
  getCart(type) {
    switch (type) {
      case "LAPTOP" /* LAPTOP */:
        return this.cartLaptop;
      case "KIT" /* KIT */:
        return this.cartKit;
      case "MULTIMETER" /* MULTIMETER */:
        return this.cartMultimeter;
    }
  }
  getWaitQueue(type) {
    switch (type) {
      case "LAPTOP" /* LAPTOP */:
        return this.waitQueueLaptop;
      case "KIT" /* KIT */:
        return this.waitQueueKit;
      case "MULTIMETER" /* MULTIMETER */:
        return this.waitQueueMultimeter;
    }
  }
  getPendingQueue(type) {
    switch (type) {
      case "LAPTOP" /* LAPTOP */:
        return this.pendingStorageQueueLaptop;
      case "KIT" /* KIT */:
        return this.pendingStorageQueueKit;
      case "MULTIMETER" /* MULTIMETER */:
        return this.pendingStorageQueueMultimeter;
    }
  }
  loadInventory(data) {
    for (const item of data) {
      this.inventory.add(item);
      const cart = this.getCart(item.type);
      if (cart.size() < this.maxCapacityK) {
        item.status = "IN_CART" /* IN_CART */;
        cart.push(item);
      } else {
        item.status = "IN_CART" /* IN_CART */;
        this.getPendingQueue(item.type).enqueue(item);
      }
    }
  }
  request(student, type, time) {
    const studentHasType = this.inventory.toArray().some(
      (e) => e.type === type && e.currentStudent === student && e.status === "BORROWED" /* BORROWED */
    );
    if (studentHasType) {
      throw new Error("R1: Student already has an equipment of this type.");
    }
    const waitQueue = this.getWaitQueue(type);
    const alreadyQueued = waitQueue.toArray().some((req) => req.student === student);
    if (alreadyQueued) {
      throw new Error("R1: Student is already in the wait queue for this type.");
    }
    const maxMinutes = this.maxHoursH * 60;
    const studentInDefault = this.inventory.toArray().some(
      (e) => e.currentStudent === student && e.status === "BORROWED" /* BORROWED */ && time - (e.loanTime ?? time) > maxMinutes
    );
    if (studentInDefault) {
      throw new Error("R6: Student is in default and cannot request equipment.");
    }
    const cart = this.getCart(type);
    if (!cart.isEmpty()) {
      this.countImmediateLoans++;
      return this.lend(type, student, time);
    } else {
      this.countQueuedLoans++;
      waitQueue.enqueue({ student, type, time });
      return `No equipment available. Student queued for ${type}.`;
    }
  }
  lend(type, student, time) {
    const cart = this.getCart(type);
    if (cart.isEmpty()) {
      throw new Error("R2: Cart is empty.");
    }
    const equipment = cart.pop();
    equipment.status = "BORROWED" /* BORROWED */;
    equipment.currentStudent = student;
    equipment.loanTime = time;
    this.restockFromPendingQueue(type);
    return `Equipment ${equipment.code} lent to ${student}.`;
  }
  directedLoan(code, student, time) {
    const target = this.inventory.find((e) => e.code === code);
    if (!target) throw new Error("Equipment not found.");
    if (target.status !== "IN_CART" /* IN_CART */) throw new Error("Equipment is not in the cart.");
    const cart = this.getCart(target.type);
    const aux = new Stack();
    const steps = [];
    let moves = 0;
    let found = null;
    while (!cart.isEmpty()) {
      const top = cart.pop();
      if (top.code === code) {
        found = top;
        moves++;
        steps.push({ action: "found", code: top.code });
        break;
      }
      aux.push(top);
      moves++;
      steps.push({ action: "out", code: top.code });
    }
    if (!found) {
      while (!aux.isEmpty()) {
        cart.push(aux.pop());
      }
      throw new Error("Equipment was not present in the cart stack.");
    }
    while (!aux.isEmpty()) {
      const item = aux.pop();
      cart.push(item);
      moves++;
      steps.push({ action: "in", code: item.code });
    }
    found.status = "BORROWED" /* BORROWED */;
    found.currentStudent = student;
    found.loanTime = time;
    this.countDirectedLoans++;
    this.totalMovesDirectedLoan += moves;
    this.restockFromPendingQueue(target.type);
    return { equipment: this.toSnapshot(found), moves, steps };
  }
  restockFromPendingQueue(type) {
    const cart = this.getCart(type);
    const pending = this.getPendingQueue(type);
    if (!pending.isEmpty() && cart.size() < this.maxCapacityK) {
      const equipment = pending.dequeue();
      equipment.status = "IN_CART" /* IN_CART */;
      cart.push(equipment);
      this.attendWaitlist(type);
    }
  }
  returnEquipment(code, returnTime) {
    const equipment = this.inventory.find((e) => e.code === code);
    if (!equipment || equipment.status !== "BORROWED" /* BORROWED */) {
      throw new Error("Equipment is not registered as borrowed.");
    }
    const duration = returnTime - (equipment.loanTime ?? returnTime);
    const overdue = duration > this.maxHoursH * 60;
    equipment.status = "IN_REVIEW" /* IN_REVIEW */;
    equipment.currentStudent = void 0;
    this.reviewQueue.enqueue(equipment);
    return `Equipment ${code} sent for review.` + (overdue ? " Note: the loan was overdue." : "");
  }
  review(damaged) {
    if (this.reviewQueue.isEmpty()) {
      throw new Error("No equipment pending in the review queue.");
    }
    const equipment = this.reviewQueue.dequeue();
    equipment.borrowCount++;
    if (damaged) {
      equipment.status = "MAINTENANCE" /* MAINTENANCE */;
      return `Equipment ${equipment.code} sent to MAINTENANCE (Damaged).`;
    }
    if (equipment.borrowCount >= 5) {
      equipment.status = "MAINTENANCE" /* MAINTENANCE */;
      return `Equipment ${equipment.code} sent to MAINTENANCE (Preventive, rule R8).`;
    }
    const cart = this.getCart(equipment.type);
    if (cart.size() < this.maxCapacityK) {
      equipment.status = "IN_CART" /* IN_CART */;
      cart.push(equipment);
      this.attendWaitlist(equipment.type);
      return `Equipment ${equipment.code} returned to the cart successfully.`;
    } else {
      equipment.status = "IN_CART" /* IN_CART */;
      this.getPendingQueue(equipment.type).enqueue(equipment);
      return `Cart full. Equipment ${equipment.code} placed in the pending storage queue.`;
    }
  }
  attendWaitlist(type) {
    const waitQueue = this.getWaitQueue(type);
    const cart = this.getCart(type);
    if (!waitQueue.isEmpty() && !cart.isEmpty()) {
      const nextRequest = waitQueue.dequeue();
      this.lend(type, nextRequest.student, nextRequest.time);
    }
  }
  addEquipment(code, type) {
    if (this.inventory.find((e) => e.code === code)) {
      throw new Error("Equipment code already exists in the inventory.");
    }
    const equipment = new Equipment(code, type);
    this.inventory.add(equipment);
    const cart = this.getCart(type);
    if (cart.size() < this.maxCapacityK) {
      equipment.status = "IN_CART" /* IN_CART */;
      cart.push(equipment);
    } else {
      this.getPendingQueue(type).enqueue(equipment);
    }
    return this.toSnapshot(equipment);
  }
  removeEquipment(code) {
    const target = this.inventory.find((e) => e.code === code);
    if (!target) throw new Error("Equipment not found.");
    if (target.status === "IN_CART" /* IN_CART */) {
      const cart = this.getCart(target.type);
      const aux = new Stack();
      let found = false;
      while (!cart.isEmpty()) {
        const top = cart.pop();
        if (top.code === code) {
          found = true;
          break;
        }
        aux.push(top);
      }
      while (!aux.isEmpty()) {
        cart.push(aux.pop());
      }
      if (!found) {
        found = this.removeFromPendingQueue(target.type, code);
      }
      if (!found) throw new Error("Equipment was not present in the cart or the pending storage queue.");
    } else if (target.status !== "MAINTENANCE" /* MAINTENANCE */) {
      throw new Error("Only equipment in the cart or under maintenance can be decommissioned.");
    }
    this.inventory.remove((e) => e.code === code);
  }
  removeFromPendingQueue(type, code) {
    const pending = this.getPendingQueue(type);
    const rest = new Queue();
    let found = false;
    while (!pending.isEmpty()) {
      const item = pending.dequeue();
      if (item.code === code) {
        found = true;
      } else {
        rest.enqueue(item);
      }
    }
    while (!rest.isEmpty()) {
      pending.enqueue(rest.dequeue());
    }
    return found;
  }
  toSnapshot(equipment) {
    return {
      code: equipment.code,
      type: equipment.type,
      status: equipment.status,
      borrowCount: equipment.borrowCount,
      currentStudent: equipment.currentStudent,
      loanTime: equipment.loanTime
    };
  }
  getInventoryView() {
    return this.inventory.toArray().map((e) => this.toSnapshot(e));
  }
  getCartView(type) {
    return this.getCart(type).toArray().map((e) => this.toSnapshot(e));
  }
  getWaitQueueView(type) {
    return this.getWaitQueue(type).toArray().map((req) => ({ ...req }));
  }
  getReviewQueueView() {
    return this.reviewQueue.toArray().map((e) => this.toSnapshot(e));
  }
  getPendingStorageView(type) {
    return this.getPendingQueue(type).toArray().map((e) => this.toSnapshot(e));
  }
  find(code) {
    const equipment = this.inventory.find((e) => e.code === code);
    if (!equipment) throw new Error("Equipment not found.");
    if (equipment.status !== "IN_CART" /* IN_CART */) {
      return { equipment: this.toSnapshot(equipment), cartPosition: null };
    }
    const cart = this.getCart(equipment.type);
    const tempArray = cart.toArray();
    const pos = tempArray.findIndex((e) => e.code === code);
    return {
      equipment: this.toSnapshot(equipment),
      cartPosition: pos !== -1 ? pos + 1 : null
    };
  }
  report() {
    const all = this.inventory.toArray();
    return {
      equipmentByStatus: {
        inCart: all.filter((e) => e.status === "IN_CART" /* IN_CART */).length,
        borrowed: all.filter((e) => e.status === "BORROWED" /* BORROWED */).length,
        inReview: all.filter((e) => e.status === "IN_REVIEW" /* IN_REVIEW */).length,
        maintenance: all.filter((e) => e.status === "MAINTENANCE" /* MAINTENANCE */).length
      },
      cartOccupancy: {
        laptop: `${this.cartLaptop.size()}/${this.maxCapacityK}`,
        kit: `${this.cartKit.size()}/${this.maxCapacityK}`,
        multimeter: `${this.cartMultimeter.size()}/${this.maxCapacityK}`
      },
      waitQueues: {
        laptop: this.waitQueueLaptop.size(),
        kit: this.waitQueueKit.size(),
        multimeter: this.waitQueueMultimeter.size()
      },
      pendingStorage: {
        laptop: this.pendingStorageQueueLaptop.size(),
        kit: this.pendingStorageQueueKit.size(),
        multimeter: this.pendingStorageQueueMultimeter.size()
      },
      requests: {
        immediate: this.countImmediateLoans,
        queued: this.countQueuedLoans
      },
      directedLoans: {
        total: this.countDirectedLoans,
        totalMoves: this.totalMovesDirectedLoan
      },
      preventiveMaintenanceR8: all.filter((e) => e.borrowCount >= 5).length
    };
  }
};

// web/src/sampleData.ts
function buildSampleInventory() {
  const codes = [
    ["LAPTOP-01", "LAPTOP" /* LAPTOP */],
    ["LAPTOP-02", "LAPTOP" /* LAPTOP */],
    ["LAPTOP-03", "LAPTOP" /* LAPTOP */],
    ["LAPTOP-04", "LAPTOP" /* LAPTOP */],
    ["LAPTOP-05", "LAPTOP" /* LAPTOP */],
    ["KIT-01", "KIT" /* KIT */],
    ["KIT-02", "KIT" /* KIT */],
    ["KIT-03", "KIT" /* KIT */],
    ["KIT-04", "KIT" /* KIT */],
    ["MULT-01", "MULTIMETER" /* MULTIMETER */],
    ["MULT-02", "MULTIMETER" /* MULTIMETER */],
    ["MULT-03", "MULTIMETER" /* MULTIMETER */]
  ];
  return codes.map(([code, type]) => new Equipment(code, type));
}

// web/src/app.ts
var state = {
  sys: new SystemBorrows(3, 2),
  currentTab: "operations",
  currentMinute: 0,
  log: [],
  lastError: null,
  animating: false,
  filterType: "ALL",
  filterStatus: "ALL",
  searchResult: null,
  searchError: null
};
var TAB_LABELS = {
  operations: "Operations",
  carts: "Carts",
  queues: "Queues",
  inventory: "Inventory"
};
var TYPE_LABELS = {
  ["LAPTOP" /* LAPTOP */]: "Laptop",
  ["KIT" /* KIT */]: "Kit",
  ["MULTIMETER" /* MULTIMETER */]: "Multimeter"
};
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function logEvent(message, isError) {
  state.log.unshift({ time: state.currentMinute, message, isError });
  if (state.log.length > 200) state.log.length = 200;
}
function runAction(fn) {
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
function typeOptions(selectedValue) {
  return Object.values(TypeEquipment).map((t) => `<option value="${t}" ${t === selectedValue ? "selected" : ""}>${TYPE_LABELS[t]}</option>`).join("");
}
function renderTabs() {
  const el = document.getElementById("tabs");
  el.innerHTML = Object.keys(TAB_LABELS).map((tab) => `<button class="tab-btn ${tab === state.currentTab ? "active" : ""}" data-action="switch-tab" data-tab="${tab}">${TAB_LABELS[tab]}</button>`).join("");
}
function renderErrorBanner() {
  const el = document.getElementById("error-banner");
  if (!state.lastError) {
    el.classList.add("hidden");
    el.innerHTML = "";
    return;
  }
  el.classList.remove("hidden");
  el.textContent = state.lastError;
}
function renderSidebar() {
  const el = document.getElementById("sidebar");
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
        ${state.log.map((entry) => `<li class="${entry.isError ? "error" : ""}">[t=${entry.time}] ${escapeHtml(entry.message)}</li>`).join("") || "<li>No operations yet.</li>"}
      </ul>
    </div>
  `;
}
function cartClass(items, capacity) {
  if (items.length === 0) return "empty";
  if (items.length >= capacity) return "full";
  return "";
}
function renderCartBox(title, type, capacity) {
  const items = state.sys.getCartView(type);
  const slots = items.map((eq, index) => `<div class="cart-slot ${index === 0 ? "top" : ""}">${escapeHtml(eq.code)}${index === 0 ? " (TOP)" : ""}</div>`).join("");
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
function renderCartsScreen() {
  const capacity = state.sys.getCapacity();
  return `
    <h2 class="section-title">Carts (stacks)</h2>
    <div class="carts-grid">
      ${renderCartBox("Laptop cart", "LAPTOP" /* LAPTOP */, capacity)}
      ${renderCartBox("Kit cart", "KIT" /* KIT */, capacity)}
      ${renderCartBox("Multimeter cart", "MULTIMETER" /* MULTIMETER */, capacity)}
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
function renderQueueBox(title, front, items) {
  const slots = items.map((label, index) => `<div class="queue-slot ${index === 0 ? "front" : ""}">${escapeHtml(label)}</div>`).join("");
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
function renderQueuesScreen() {
  const waitLabel = (r) => `${r.student} (t=${r.time})`;
  const eqLabel = (e) => e.code;
  return `
    <h2 class="section-title">Wait queues (per equipment type)</h2>
    ${renderQueueBox("Laptop wait queue", "FRONT", state.sys.getWaitQueueView("LAPTOP" /* LAPTOP */).map(waitLabel))}
    ${renderQueueBox("Kit wait queue", "FRONT", state.sys.getWaitQueueView("KIT" /* KIT */).map(waitLabel))}
    ${renderQueueBox("Multimeter wait queue", "FRONT", state.sys.getWaitQueueView("MULTIMETER" /* MULTIMETER */).map(waitLabel))}

    <h2 class="section-title">Review queue</h2>
    ${renderQueueBox("Pending review", "FRONT", state.sys.getReviewQueueView().map(eqLabel))}

    <h2 class="section-title">Pending storage queues (cart full, R7)</h2>
    ${renderQueueBox("Laptop pending storage", "FRONT", state.sys.getPendingStorageView("LAPTOP" /* LAPTOP */).map(eqLabel))}
    ${renderQueueBox("Kit pending storage", "FRONT", state.sys.getPendingStorageView("KIT" /* KIT */).map(eqLabel))}
    ${renderQueueBox("Multimeter pending storage", "FRONT", state.sys.getPendingStorageView("MULTIMETER" /* MULTIMETER */).map(eqLabel))}
  `;
}
function renderOperationsScreen() {
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
function statusOptions(selectedValue) {
  return Object.values(StatusEquipment).map((s) => `<option value="${s}" ${s === selectedValue ? "selected" : ""}>${s}</option>`).join("");
}
function renderSearchResult() {
  if (state.searchError) {
    return `<p class="search-result error">${escapeHtml(state.searchError)}</p>`;
  }
  if (!state.searchResult) {
    return "";
  }
  const { equipment, cartPosition } = state.searchResult;
  const positionText = cartPosition !== null ? `Position in cart (from the top): ${cartPosition}` : "Not currently in a cart.";
  return `
    <p class="search-result">
      <strong>${escapeHtml(equipment.code)}</strong> \u2014 ${TYPE_LABELS[equipment.type]} \u2014
      <span class="badge ${equipment.status}">${equipment.status}</span> \u2014 ${positionText}
    </p>
  `;
}
function renderInventoryScreen() {
  const items = state.sys.getInventoryView().filter((eq) => {
    const typeOk = state.filterType === "ALL" || eq.type === state.filterType;
    const statusOk = state.filterStatus === "ALL" || eq.status === state.filterStatus;
    return typeOk && statusOk;
  });
  const rows = items.map((eq) => `
      <tr>
        <td>${escapeHtml(eq.code)}</td>
        <td>${TYPE_LABELS[eq.type]}</td>
        <td><span class="badge ${eq.status}">${eq.status}</span></td>
        <td>${eq.borrowCount}</td>
        <td>${eq.currentStudent ? escapeHtml(eq.currentStudent) : "-"}</td>
        <td>
          <button data-action="remove-equipment" data-code="${escapeHtml(eq.code)}" class="danger" ${eq.status === "IN_CART" /* IN_CART */ || eq.status === "MAINTENANCE" /* MAINTENANCE */ ? "" : "disabled"}>Decommission</button>
        </td>
      </tr>
    `).join("");
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
          <select name="type"><option value="ALL" ${state.filterType === "ALL" ? "selected" : ""}>All</option>${typeOptions(state.filterType === "ALL" ? void 0 : state.filterType)}</select>
        </div>
        <div class="form-row">
          <label>Status</label>
          <select name="status"><option value="ALL" ${state.filterStatus === "ALL" ? "selected" : ""}>All</option>${statusOptions(state.filterStatus === "ALL" ? void 0 : state.filterStatus)}</select>
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
function renderScreen() {
  const el = document.getElementById("screen");
  switch (state.currentTab) {
    case "operations":
      el.innerHTML = renderOperationsScreen();
      break;
    case "carts":
      el.innerHTML = renderCartsScreen();
      break;
    case "queues":
      el.innerHTML = renderQueuesScreen();
      break;
    case "inventory":
      el.innerHTML = renderInventoryScreen();
      break;
  }
}
function render() {
  renderErrorBanner();
  renderTabs();
  renderSidebar();
  if (!state.animating) {
    renderScreen();
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function slotHtml(code) {
  return `<div class="cart-slot">${escapeHtml(code)}</div>`;
}
function renderDirectedLoanColumns(mainStack, auxStack, statusLine) {
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
async function animateDirectedLoan(code, student) {
  const view = document.getElementById("directed-loan-view");
  if (!view) return;
  let before;
  try {
    const located = state.sys.find(code);
    before = state.sys.getCartView(located.equipment.type);
  } catch (err) {
    runAction(() => {
      throw err instanceof Error ? err : new Error(String(err));
    });
    return;
  }
  let result;
  try {
    result = state.sys.directedLoan(code, student, state.currentMinute);
  } catch (err) {
    runAction(() => {
      throw err instanceof Error ? err : new Error(String(err));
    });
    return;
  }
  state.animating = true;
  render();
  const main = before.map((e) => e.code);
  const aux = [];
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
function getFormValue(form, name) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
    return field.value.trim();
  }
  return "";
}
function wireEvents() {
  document.getElementById("input-time").addEventListener("input", (ev) => {
    const value = Number(ev.target.value);
    state.currentMinute = Number.isFinite(value) ? value : 0;
  });
  document.body.addEventListener("click", (ev) => {
    const target = ev.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset["action"];
    if (action === "switch-tab") {
      state.currentTab = target.dataset["tab"];
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
      const code = target.dataset["code"];
      runAction(() => {
        state.sys.removeEquipment(code);
        return `Equipment ${code} removed from the inventory.`;
      });
      return;
    }
  });
  document.body.addEventListener("submit", (ev) => {
    const form = ev.target;
    const action = form.dataset["action"];
    if (!action) return;
    ev.preventDefault();
    if (action === "submit-request") {
      const student = getFormValue(form, "student");
      const type = getFormValue(form, "type");
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
      const type = getFormValue(form, "type");
      runAction(() => {
        const before = state.sys.getWaitQueueView(type).length;
        state.sys.attendWaitlist(type);
        const after = state.sys.getWaitQueueView(type).length;
        return before === after ? `No student waiting for ${TYPE_LABELS[type]}, or the cart is empty.` : `Wait queue for ${TYPE_LABELS[type]} attended.`;
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
      state.filterType = type === "ALL" ? "ALL" : type;
      state.filterStatus = status === "ALL" ? "ALL" : status;
      render();
      return;
    }
    if (action === "submit-add-equipment") {
      const code = getFormValue(form, "code");
      const type = getFormValue(form, "type");
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
function initApp() {
  wireEvents();
  render();
}

// web/src/main.ts
initApp();
