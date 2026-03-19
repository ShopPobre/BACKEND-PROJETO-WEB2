import "../../config/env";
import sequelize from "../../config/database";
import { runInitMinio } from "./initMinio";
import { runSeedLocal } from "./seedProducts";

async function main() {
  await sequelize.authenticate();
  await sequelize.sync();

  await runInitMinio({ closeConnection: false });
  await runSeedLocal({ closeConnection: false });

  await sequelize.close();
}

main().catch((err) => {
  console.error("❌ Falha no setup local:", err);
  process.exit(1);
});

