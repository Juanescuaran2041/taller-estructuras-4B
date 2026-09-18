import { TypeEquipment } from "../Equipment.js";

export interface RequestLoan {
	student: string;
	type: TypeEquipment;
	time: number;
}
