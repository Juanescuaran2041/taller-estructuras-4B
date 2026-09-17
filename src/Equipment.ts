
export enum TypeEquipment {
	PORTATIL = "PORTATIL",
	KIT = "KIT",
	MULTIMETRO = MULTIMETRO

}

export enum EquipmentState{
	EN_CARRO = "EN_CARRO",
	EN_REVISION = "EN_REVISION",
	MANTENIMIENTO = "MANTENIMIENTO"
}

export class Equipment {
	id: string
	type: TypeEquipment
	state: EquipmentState
	borrows: number

	constructor (tpye:TypeEquipment, state:EquipmentState, borrows:number){
		this.type = type;
		this.state = state;
		this.borrows = borrows;
	}
}

