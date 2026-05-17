import { User } from "./User";
import { Directory } from "./directory";
import { TypeElement } from "./type-element";

export interface Password {
    id:number;
    nombrePsw: string;
    usuario: string;
    password: string;
    urlWebSite: string;
    description: string;
    favorite: boolean;
    user?:User;
    typeElement: TypeElement;
    directory: Directory;
}
