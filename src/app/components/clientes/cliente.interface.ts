import { Factura } from "src/app/facturas/models/factura";
import { Region } from "./region";

export class Cliente {
    nombre: string;
    apellido: string;
    email: string;
    region: Region;
    facturas : Factura[] = [];
    createAt ?: string;
    id ?: number;
    foto ?: string;
    
}