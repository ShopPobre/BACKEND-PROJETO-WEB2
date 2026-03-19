import "../../config/env";
import sequelize from "../../config/database";
import { seedCategories } from "./seedData";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { ProductImage } from "../../models/ProductImage";
import { Inventory } from "../../models/Inventory";

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  const categoryIds: number[] = [];
  for (const c of seedCategories) {
    const category = await Category.findOne({ where: { name: c.name } });
    if (category) categoryIds.push(category.id);
  }

  if (categoryIds.length === 0) {
    console.log("ℹ️ Nenhuma categoria seed encontrada. Nada para resetar.");
    await sequelize.close();
    return;
  }

  const products = await Product.findAll({
    where: { categoryId: categoryIds },
    attributes: ["id"],
    raw: true,
  });

  const productIds = (products as any[]).map((p) => Number(p.id));
  if (productIds.length === 0) {
    console.log("ℹ️ Nenhum produto seed encontrado nessas categorias.");
    await sequelize.close();
    return;
  }

  await Inventory.destroy({ where: { productId: productIds } as any });
  await ProductImage.destroy({ where: { productId: productIds } as any });
  await Product.destroy({ where: { id: productIds } as any });

  console.log(`✅ Reset ALL seed feito. Produtos removidos: ${productIds.length}.`);
  await sequelize.close();
}

main().catch((err) => {
  console.error("❌ Falha ao resetar seed (ALL):", err);
  process.exit(1);
});

