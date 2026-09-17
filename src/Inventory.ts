export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private count: number = 0;

 
  public add(value: T): void {
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

 
  public remove(predicate: (value: T) => boolean): boolean {
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

 
  public find(predicate: (value: T) => boolean): T | null {
    let current = this.head;
    while (current !== null) {
      if (predicate(current.value)) {
        return current.value;
      }
      current = current.next;
    }
    return null;
  }

 
  public toArray(): T[] {
    const elements: T[] = [];
    let current = this.head;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }


  public size(): number {
    return this.count;
  }


  public isEmpty(): boolean {
    return this.count === 0;
  }
}