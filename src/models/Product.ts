import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    categoryId: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    // Inventory: Inventory;
    // OrderItems: OrderItem[];
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, "id" | "isActive" | "createdAt" | "updatedAt"> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public price!: number;
    public categoryId!: number;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      validate: {
        isInt: true
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
    tableName: "products",
    timestamps: true
  }
);

