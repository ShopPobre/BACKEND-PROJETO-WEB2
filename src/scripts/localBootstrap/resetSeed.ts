import "../../config/env";
import sequelize from "../../config/database";
import { seedCategories } from "./seedData";
import { Product } from "../../models/Product";
import { ProductImage } from "../../models/ProductImage";
import { Inventory } from "../../models/Inventory";

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  const categoryNames = seedCategories.map((c) => c.name);
  const placeholders = categoryNames.map(() => "?").join(",");

  const sql = `
    SELECT DISTINCT pi.productId AS productId
    FROM product_images pi
    JOIN products p ON p.id = pi.productId
    JOIN categories c ON c.id = p.categoryId
    WHERE c.name IN (${placeholders})
      AND pi.objectKey LIKE 'seed/products/%'
  `;

  const [rows] = await sequelize.query(sql, { replacements: categoryNames });
  const productIds = (rows as any[]).map((r) => Number(r.productId));

  if (!productIds || productIds.length === 0) {
    console.log("ℹ️ Nenhum produto seed antigo encontrado (marker objectKey LIKE 'seed/products/%').");
    await sequelize.close();
    return;
  }

  await Inventory.destroy({ where: { productId: productIds } as any });
  await ProductImage.destroy({ where: { productId: productIds } as any });
  await Product.destroy({ where: { id: productIds } as any });

  console.log(`✅ Reset realizado. Produtos removidos: ${productIds.length}.`);
  await sequelize.close();
}

main().catch((err) => {
  console.error("❌ Falha ao resetar seed local:", err);
  process.exit(1);
});

