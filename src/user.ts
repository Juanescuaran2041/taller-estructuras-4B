export enum TypeUser{
	STUDENT = "STUDENT",
	TEACHER = "TEACHER"
}

export class User {
	private id: string 
	private typeUser: TypeUser

	constructor (id:string, typeUser:TypeUser){
		this.id = id
		this.typeUser = typeUser
	}


	setType(type: UserType){
		this.typeUser = type;
	}

}