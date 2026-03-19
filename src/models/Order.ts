import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export type OrderStatus = "PENDENTE" | "CONFIRMADO" | "EM_PREPARACAO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";

export interface OrderAttributes {
    id: number;
    userId: string;
    addressId: string;
    status: OrderStatus;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    // User: User;
    // Address: Address;
    // OrderItems: OrderItem[];
    // Payment: Payment;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "status" | "createdAt" | "updatedAt"> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public userId!: string;
    public addressId!: string;
    public status!: OrderStatus;
    public total!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM("PENDENTE", "CONFIRMADO", "EM_PREPARACAO", "ENVIADO", "ENTREGUE", "CANCELADO"),
      allowNull: false,
      defaultValue: "PENDENTE"
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true
  }
);

