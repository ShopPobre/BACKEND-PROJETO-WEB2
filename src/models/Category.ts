import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CategoryAttributes {
    id: number;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    // Products: Products[];
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id" | "isActive" | "createdAt" | "updatedAt">{}


export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: true
  }
);
