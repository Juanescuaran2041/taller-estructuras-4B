export enum TypeEquipment {
	PORTATIL = "PORTATIL",
	KIT = "KIT",
	MULTIMETRO = MULTIMETRO

}

export class Request {
	private studentID: number
	private typeEquipment: TypeEquipment
	private hour: number

	constructor (studentID: number, typeEquipment: TypeEquipment, hour:number){
		this.studentID = studentID;
		this.typeEquipment = typeEquipment;
		this.hour = hour;
	}
}