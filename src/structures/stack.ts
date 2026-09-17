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

  /**
   * Apila un elemento en el tope del carro - O(1)
   */
  public push(value: T): void {
    const newNode = new StackNode(value);
    newNode.next = this.topNode;
    this.topNode = newNode;
    this.count++;
  }

  /**
   * Desapila y retorna el elemento del tope - O(1)
   */
  public pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const removedValue = this.topNode!.value;
    this.topNode = this.topNode!.next;
    this.count--;

    return removedValue;
  }

  /**
   * Inspecciona el elemento del tope sin desapilarlo - O(1)
   */
  public peek(): T | null {
    return this.isEmpty() ? null : this.topNode!.value;
  }

  /**
   * Verifica si la pila está vacía - O(1)
   */
  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Cantidad de elementos apilados - O(1)
   */
  public size(): number {
    return this.count;
  }

  /**
   * Retorna una copia de los elementos ordenados desde el Tope hacia el Fondo.
   * Util para renderizar el carro en la UI sin desapilar (RFE-01 / RFE-03).
   */
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