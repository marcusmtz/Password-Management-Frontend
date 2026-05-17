import { User } from "./User";

export interface Directory {
    id: number | null;
    name: string;
    urlPic?: string;
    user?: Partial<User>; 
}
