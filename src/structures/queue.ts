export class QueueNode<T> {
  public value: T;
  public next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private frontNode: QueueNode<T> | null = null;
  private rearNode: QueueNode<T> | null = null;
  private count: number = 0;


  public enqueue(value: T): void {
    const newNode = new QueueNode(value);
    if (this.isEmpty()) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else {
      this.rearNode!.next = newNode;
      this.rearNode = newNode;
    }
    this.count++;
  }

  public dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const removedValue = this.frontNode!.value;
    this.frontNode = this.frontNode!.next;
    this.count--;

    if (this.frontNode === null) {
      this.rearNode = null;
    }

    return removedValue;
  }


  public peek(): T | null {
    return this.isEmpty() ? null : this.frontNode!.value;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }


  public size(): number {
    return this.count;
  }


  public toArray(): T[] {
    const elements: T[] = [];
    let current = this.frontNode;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
}