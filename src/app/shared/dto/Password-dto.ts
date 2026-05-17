export interface PasswordDto {
    nombrePsw: string;
    usuario: string;
    password: string;
    urlWebSite: string;
    description: string;
    isFavorite: boolean;
    idUser?: number; 
    idTypeElement:number | null;
    idDirectory: number | null;
}
