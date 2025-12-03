import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface InventoryAttributes {
    id: number;
    productId: number;
    quantity: number;
    minQuantity: number;
    maxQuantity?: number | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    // Product: Product;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id" | "minQuantity" | "maxQuantity" | "isActive" | "createdAt" | "updatedAt"> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    public id!: number;
    public productId!: number;
    public quantity!: number;
    public minQuantity!: number;
    public maxQuantity!: number | null;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'products',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    maxQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: true,
        min: 0
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
    tableName: "inventories",
    timestamps: true
  }
);

