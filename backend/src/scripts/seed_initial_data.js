require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: "super@srms.gov.np",
      password: "superadmin123",
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
    {
      email: "admin.kathmandu@edu.np",
      password: "districtadmin123",
      name: "District Admin",
      role: "DISTRICT_ADMIN",
    },
    {
      email: "principal@sunrise.edu.np",
      password: "schooladmin123",
      name: "School Admin",
      role: "SCHOOL_ADMIN",
    },
    {
      email: "gurung@sunrise.edu.np",
      password: "teacher123",
      name: "Teacher",
      role: "TEACHER",
    },
    {
      email: "student@srms.edu.np",
      password: "student123",
      name: "Student",
      role: "STUDENT",
    },
    {
      email: "parent@srms.edu.np",
      password: "parent123",
      name: "Parent",
      role: "PARENT",
    },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.users.upsert({
      where: { email: u.email },
      update: {
        password: hashed,
        name: u.name,
        role: u.role,
        isActive: true,
      },
      create: {
        email: u.email,
        password: hashed,
        name: u.name,
        role: u.role,
        isActive: true,
        updatedAt: new Date(),
      },
    });
    console.log("Seeded/updated user:", u.email);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });