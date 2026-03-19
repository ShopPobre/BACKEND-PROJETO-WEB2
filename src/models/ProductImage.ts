import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ProductImageAttributes {
  id: number;
  productId: number;
  objectKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImageCreationAttributes
  extends Optional<ProductImageAttributes, "id" | "sortOrder" | "createdAt" | "updatedAt"> {}

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: number;
  public productId!: number;
  public objectKey!: string;
  public originalName!: string;
  public mimeType!: string;
  public size!: number;
  public sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    objectKey: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: true,
  }
);
