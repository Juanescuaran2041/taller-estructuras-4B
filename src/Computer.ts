export enum

export class Computer {
	id: string
	hour:int 
	studentCode: string
	type: string
	borrows: int

	constructor(hour:int, studentCode:string, type:string, borrows:int){
		this.hour = hour
		this.studentCode = studentCode
		this.type = type
		this.borrows = borrows
	}
}