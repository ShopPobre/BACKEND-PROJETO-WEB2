import { User } from "../models/User";
import { BcryptService } from "../services/hashing/BcryptService";

export async function ensureAdminExists() {
  if (!process.env.ADMIN_PASSWORD) {
    console.warn("⚠️ ADMIN_PASSWORD não definido. Admin não será criado.");
    return;
  }

  const adminExists = await User.findOne({
    where: { role: "ADMIN" },
  });

  if (adminExists) {
    console.log("✅ Admin já existe.");
    return;
  }

  const hashingService = new BcryptService();
  const passwordHash = await hashingService.hash(process.env.ADMIN_PASSWORD);

  await User.create({
    name: "Administrador",
    email: process.env.ADMIN_EMAIL || "admin@admin.com",
    passwordHash,
    cpf: "00000000000",
    telefone: "000000000",
    role: "ADMIN",
  });

  console.log("🚀 Admin criado com sucesso!");
}
