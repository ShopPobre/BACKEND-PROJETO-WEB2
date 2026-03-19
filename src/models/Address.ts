import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database'; 


export type AddressType = "CASA" | "TRABALHO" | "OUTRO";

export interface AddressAttributes {
    id: string,
    rua: string,
    numero: number,
    cep: string,
    cidade: string,
    estado: string,
    tipo: AddressType,
    userID: string
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
    public id!: string;
    public rua!: string;
    public numero!: number;
    public cep!: string;
    public cidade!: string;
    public estado!: string;
    public tipo!: AddressType;
    public userID!: string;
}

Address.init(
    {
        id: {
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true,
            allowNull: false,
        },
        rua: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.ENUM("CASA", "TRABALHO", "OUTRO"),
            allowNull: false,
        },
        userID : {
            type: DataTypes.UUID,
            allowNull: false,
        }

    },
    {
        sequelize, 
        tableName: 'addresses',
        timestamps: false, 
    }
);