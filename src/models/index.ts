import { User } from "./User";
import { Address } from "./Address";

User.hasMany(Address, {
    foreignKey: "userID",
    as: "addresses"
});

Address.belongsTo(User, {
    foreignKey: "userID",
    as: "user"
});

export { User, Address };
