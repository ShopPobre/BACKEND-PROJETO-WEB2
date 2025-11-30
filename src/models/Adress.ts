import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface Adress {
    rua: string,
    numero: string,
    cidade: string,
    estado: string
}