import { DataTypes, Model, Optional } from 'sequelize';
import sequelize  from '../config/database'; 

export interface UserAttributes {
  id: string,
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  telefone: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public passwordHash!: string; 
  public cpf!: string;
  public telefone!: string;


}

User.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, 
    tableName: 'users',
    timestamps: false, 
  }
);
