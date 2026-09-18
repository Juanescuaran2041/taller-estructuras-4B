export enum TypeEquipment {
	LAPTOP = "LAPTOP",
	KIT = "KIT",
	MULTIMETER = "MULTIMETER"
}

export enum StatusEquipment {
	IN_CART = "IN_CART",
	BORROWED = "BORROWED",
	IN_REVIEW = "IN_REVIEW",
	MAINTENANCE = "MAINTENANCE"
}

export class Equipment {
	code: string;
	type: TypeEquipment;
	status: StatusEquipment;
	borrowCount: number;

	currentStudent?: string | undefined;
	loanTime?: number | undefined;

	constructor(code: string, type: TypeEquipment, status: StatusEquipment = StatusEquipment.IN_CART, borrowCount: number = 0) {
		this.code = code;
		this.type = type;
		this.status = status;
		this.borrowCount = borrowCount;
	}
}
