import { Equipment, TypeEquipment, StatusEquipment } from "../Equipment.js";
import type { RequestLoan } from "./RequestLoan.js";
import { Stack } from "./stack.js";
import { Queue } from "./queue.js";
import { LinkedList } from "../Inventory.js";

export class SystemBorrows {
  private inventory: LinkedList<Equipment>;

  private cartLaptop: Stack<Equipment>;
  private cartKit: Stack<Equipment>;
  private cartMultimeter: Stack<Equipment>;

  private waitQueueLaptop: Queue<RequestLoan>;
  private waitQueueKit: Queue<RequestLoan>;
  private waitQueueMultimeter: Queue<RequestLoan>;

  private reviewQueue: Queue<Equipment>;

  private pendingStorageQueueLaptop: Queue<Equipment>;
  private pendingStorageQueueKit: Queue<Equipment>;
  private pendingStorageQueueMultimeter: Queue<Equipment>;

  private readonly maxCapacityK: number;
  private readonly maxHoursH: number;

  private totalMovesDirectedLoan: number = 0;
  private countDirectedLoans: number = 0;
  private countImmediateLoans: number = 0;
  private countQueuedLoans: number = 0;

  constructor(maxCapacityK: number = 5, maxHoursH: number = 24) {
    this.maxCapacityK = maxCapacityK;
    this.maxHoursH = maxHoursH;

    this.inventory = new LinkedList<Equipment>();

    this.cartLaptop = new Stack<Equipment>();
    this.cartKit = new Stack<Equipment>();
    this.cartMultimeter = new Stack<Equipment>();

    this.waitQueueLaptop = new Queue<RequestLoan>();
    this.waitQueueKit = new Queue<RequestLoan>();
    this.waitQueueMultimeter = new Queue<RequestLoan>();

    this.reviewQueue = new Queue<Equipment>();

    this.pendingStorageQueueLaptop = new Queue<Equipment>();
    this.pendingStorageQueueKit = new Queue<Equipment>();
    this.pendingStorageQueueMultimeter = new Queue<Equipment>();
  }

  private getCart(type: TypeEquipment): Stack<Equipment> {
    switch (type) {
      case TypeEquipment.LAPTOP: return this.cartLaptop;
      case TypeEquipment.KIT: return this.cartKit;
      case TypeEquipment.MULTIMETER: return this.cartMultimeter;
    }
  }

  private getWaitQueue(type: TypeEquipment): Queue<RequestLoan> {
    switch (type) {
      case TypeEquipment.LAPTOP: return this.waitQueueLaptop;
      case TypeEquipment.KIT: return this.waitQueueKit;
      case TypeEquipment.MULTIMETER: return this.waitQueueMultimeter;
    }
  }

  private getPendingQueue(type: TypeEquipment): Queue<Equipment> {
    switch (type) {
      case TypeEquipment.LAPTOP: return this.pendingStorageQueueLaptop;
      case TypeEquipment.KIT: return this.pendingStorageQueueKit;
      case TypeEquipment.MULTIMETER: return this.pendingStorageQueueMultimeter;
    }
  }

  public loadInventory(data: Equipment[]): void {
    for (const item of data) {
      this.inventory.add(item);
      const cart = this.getCart(item.type);
      if (cart.size() < this.maxCapacityK) {
        item.status = StatusEquipment.IN_CART;
        cart.push(item);
      } else {
        item.status = StatusEquipment.IN_CART;
        this.getPendingQueue(item.type).enqueue(item);
      }
    }
  }

  public request(student: string, type: TypeEquipment, time: number): string {
    const studentHasType = this.inventory.toArray().some(
      e => e.type === type && e.currentStudent === student && e.status === StatusEquipment.BORROWED
    );
    if (studentHasType) {
      throw new Error("R1: Student already has an equipment of this type.");
    }

    const waitQueue = this.getWaitQueue(type);
    const alreadyQueued = waitQueue.toArray().some(req => req.student === student);
    if (alreadyQueued) {
      throw new Error("R1: Student is already in the wait queue for this type.");
    }

    const maxMinutes = this.maxHoursH * 60;
    const studentInDefault = this.inventory.toArray().some(
      e => e.currentStudent === student &&
           e.status === StatusEquipment.BORROWED &&
           (time - (e.loanTime ?? time)) > maxMinutes
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

  public lend(type: TypeEquipment, student: string, time: number): string {
    const cart = this.getCart(type);
    if (cart.isEmpty()) {
      throw new Error("R2: Cart is empty.");
    }
    const equipment = cart.pop()!;
    equipment.status = StatusEquipment.BORROWED;
    equipment.currentStudent = student;
    equipment.loanTime = time;

    this.restockFromPendingQueue(type);

    return `Equipment ${equipment.code} lent to ${student}.`;
  }

  public directedLoan(code: string, student: string, time: number): { equipment: Equipment; moves: number } {
    const target = this.inventory.find(e => e.code === code);
    if (!target) throw new Error("Equipment not found.");
    if (target.status !== StatusEquipment.IN_CART) throw new Error("Equipment is not in the cart.");

    const cart = this.getCart(target.type);
    const aux = new Stack<Equipment>();
    let moves = 0;
    let found: Equipment | null = null;

    while (!cart.isEmpty()) {
      const top = cart.pop()!;
      if (top.code === code) {
        found = top;
        moves++;
        break;
      }
      aux.push(top);
      moves++;
    }

    if (!found) {
      while (!aux.isEmpty()) {
        cart.push(aux.pop()!);
      }
      throw new Error("Equipment was not present in the cart stack.");
    }

    while (!aux.isEmpty()) {
      cart.push(aux.pop()!);
      moves++;
    }

    found.status = StatusEquipment.BORROWED;
    found.currentStudent = student;
    found.loanTime = time;

    this.countDirectedLoans++;
    this.totalMovesDirectedLoan += moves;

    this.restockFromPendingQueue(target.type);

    return { equipment: found, moves };
  }

  private restockFromPendingQueue(type: TypeEquipment): void {
    const cart = this.getCart(type);
    const pending = this.getPendingQueue(type);
    if (!pending.isEmpty() && cart.size() < this.maxCapacityK) {
      const equipment = pending.dequeue()!;
      equipment.status = StatusEquipment.IN_CART;
      cart.push(equipment);
      this.attendWaitlist(type);
    }
  }

  public returnEquipment(code: string, returnTime: number): string {
    const equipment = this.inventory.find(e => e.code === code);
    if (!equipment || equipment.status !== StatusEquipment.BORROWED) {
      throw new Error("Equipment is not registered as borrowed.");
    }

    const duration = returnTime - (equipment.loanTime ?? returnTime);
    const overdue = duration > this.maxHoursH * 60;

    equipment.status = StatusEquipment.IN_REVIEW;
    equipment.currentStudent = undefined;
    this.reviewQueue.enqueue(equipment);

    return `Equipment ${code} sent for review.` + (overdue ? " Note: the loan was overdue." : "");
  }

  public review(damaged: boolean): string {
    if (this.reviewQueue.isEmpty()) {
      throw new Error("No equipment pending in the review queue.");
    }

    const equipment = this.reviewQueue.dequeue()!;
    equipment.borrowCount++;

    if (damaged) {
      equipment.status = StatusEquipment.MAINTENANCE;
      return `Equipment ${equipment.code} sent to MAINTENANCE (Damaged).`;
    }

    if (equipment.borrowCount >= 5) {
      equipment.status = StatusEquipment.MAINTENANCE;
      return `Equipment ${equipment.code} sent to MAINTENANCE (Preventive, rule R8).`;
    }

    const cart = this.getCart(equipment.type);
    if (cart.size() < this.maxCapacityK) {
      equipment.status = StatusEquipment.IN_CART;
      cart.push(equipment);
      this.attendWaitlist(equipment.type);
      return `Equipment ${equipment.code} returned to the cart successfully.`;
    } else {
      equipment.status = StatusEquipment.IN_CART;
      this.getPendingQueue(equipment.type).enqueue(equipment);
      return `Cart full. Equipment ${equipment.code} placed in the pending storage queue.`;
    }
  }

  public attendWaitlist(type: TypeEquipment): void {
    const waitQueue = this.getWaitQueue(type);
    const cart = this.getCart(type);

    if (!waitQueue.isEmpty() && !cart.isEmpty()) {
      const nextRequest = waitQueue.dequeue()!;
      this.lend(type, nextRequest.student, nextRequest.time);
    }
  }

  public find(code: string): { equipment: Equipment; cartPosition: number | null } {
    const equipment = this.inventory.find(e => e.code === code);
    if (!equipment) throw new Error("Equipment not found.");

    if (equipment.status !== StatusEquipment.IN_CART) {
      return { equipment, cartPosition: null };
    }

    const cart = this.getCart(equipment.type);
    const tempArray = cart.toArray();
    const pos = tempArray.findIndex(e => e.code === code);

    return {
      equipment,
      cartPosition: pos !== -1 ? pos + 1 : null
    };
  }

  public report() {
    const all = this.inventory.toArray();
    return {
      equipmentByStatus: {
        inCart: all.filter(e => e.status === StatusEquipment.IN_CART).length,
        borrowed: all.filter(e => e.status === StatusEquipment.BORROWED).length,
        inReview: all.filter(e => e.status === StatusEquipment.IN_REVIEW).length,
        maintenance: all.filter(e => e.status === StatusEquipment.MAINTENANCE).length,
      },
      cartOccupancy: {
        laptop: `${this.cartLaptop.size()}/${this.maxCapacityK}`,
        kit: `${this.cartKit.size()}/${this.maxCapacityK}`,
        multimeter: `${this.cartMultimeter.size()}/${this.maxCapacityK}`,
      },
      waitQueues: {
        laptop: this.waitQueueLaptop.size(),
        kit: this.waitQueueKit.size(),
        multimeter: this.waitQueueMultimeter.size(),
      },
      pendingStorage: {
        laptop: this.pendingStorageQueueLaptop.size(),
        kit: this.pendingStorageQueueKit.size(),
        multimeter: this.pendingStorageQueueMultimeter.size(),
      },
      requests: {
        immediate: this.countImmediateLoans,
        queued: this.countQueuedLoans,
      },
      directedLoans: {
        total: this.countDirectedLoans,
        totalMoves: this.totalMovesDirectedLoan,
      },
      preventiveMaintenanceR8: all.filter(e => e.borrowCount >= 5).length
    };
  }
}
