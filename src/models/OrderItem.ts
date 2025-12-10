import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface OrderItemAttributes {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    createdAt?: Date;
    updatedAt?: Date;
    // Order: Order;
    // Product: Product;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "id" | "createdAt" | "updatedAt"> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public unitPrice!: number;
    public subtotal!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      validate: {
        isInt: true,
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
  },
  {
    sequelize,
    tableName: "order_items",
    timestamps: true
  }
);

