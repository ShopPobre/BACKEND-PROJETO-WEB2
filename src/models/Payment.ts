import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "APPROVED"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";

export type PaymentMethod = "CREDIT_CARD" | "PIX";

export interface PaymentAttributes {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gateway: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes
  extends Optional<
    PaymentAttributes,
    "id" | "status" | "transactionId" | "createdAt" | "updatedAt"
  > {}

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public orderId!: number;
  public amount!: number;
  public currency!: string;
  public method!: PaymentMethod;
  public status!: PaymentStatus;
  public transactionId?: string;
  public gateway!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "brl",
    },
    method: {
      type: DataTypes.ENUM("CREDIT_CARD", "PIX"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "PROCESSING",
        "APPROVED",
        "FAILED",
        "CANCELED",
        "REFUNDED"
      ),
      defaultValue: "PENDING",
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "stripe",
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
  }
);