import { User } from "./User";
import { Address } from "./Address";
import { Category } from "./Category";
import { Product } from "./Product";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";

// User relationships
User.hasMany(Address, {
    foreignKey: "userID",
    as: "addresses"
});

User.hasMany(Order, {
    foreignKey: "userId",
    as: "orders"
});

// Address relationships
Address.belongsTo(User, {
    foreignKey: "userID",
    as: "user"
});

Address.hasMany(Order, {
    foreignKey: "addressId",
    as: "orders"
});

// Order relationships
Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

Order.belongsTo(Address, {
    foreignKey: "addressId",
    as: "address"
});

Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "orderItems"
});

// OrderItem relationships
OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order"
});

OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product"
});

// Category relationships
Category.hasMany(Product, {
    foreignKey: "categoryId",
    as: "products"
});

// Product relationships
Product.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category"
});

Product.hasMany(OrderItem, {
    foreignKey: "productId",
    as: "orderItems"
});

export { User, Address, Category, Product, Order, OrderItem };
