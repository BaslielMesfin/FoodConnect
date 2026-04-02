import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: "baslielamare@gmail.com" }
  });
  console.log("USER RECORD:");
  console.log(JSON.stringify(user, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
