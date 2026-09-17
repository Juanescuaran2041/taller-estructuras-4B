import {Equipment} from ""

export class Node <T> {
	private value: T | null = null;
	private next: T | null = null;

	constructor (value:T ){
		this.value = value;
	}
}

export class Stack<Equipment>{
	top: Computer;
	size: number;

	push(value:Computer): boolean{
		const newNode = Node(value);
		
		newNode.next = this.top;
		this.top = newNode;
		
		return true;
		
	}

}