export class StackNode<T> {
  public value: T;
  public next: StackNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Stack<T> {
  private topNode: StackNode<T> | null = null;
  private count: number = 0;

 
  public push(value: T): void {
    const newNode = new StackNode(value);
    newNode.next = this.topNode;
    this.topNode = newNode;
    this.count++;
  }

  
  public pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const removedValue = this.topNode!.value;
    this.topNode = this.topNode!.next;
    this.count--;

    return removedValue;
  }


  public peek(): T | null {
    return this.isEmpty() ? null : this.topNode!.value;
  }

 
  public isEmpty(): boolean {
    return this.count === 0;
  }


  public size(): number {
    return this.count;
  }


  public toArray(): T[] {
    const elements: T[] = [];
    let current = this.topNode;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }
}