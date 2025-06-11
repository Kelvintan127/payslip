import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";

const saltRounds = 10;

async function main() {
    console.log("Seeding...");

    const adminPassword = await bcrypt.hash("adminPassword", saltRounds);

    const admin = await prisma.admin.create({
        data: {
            name: "Admin",
            username: "Admin1",
            password: adminPassword,
            createdBy: 0,
            updatedBy: 0
        }
    })

    console.log("Admin created,", admin.username);
    
    for (let i = 0; i < 100; i++) {
        const plainPassword = faker.internet.password();
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        await prisma.employee.create({
            data: {
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                password: hashedPassword,
                salary: faker.number.int({ min: 1000, max: 10000 }),
                createdBy: admin.id,
                updatedBy: admin.id
            }
        })
    }
    
    const employee = await prisma.employee.create({
        data: {
            name: "employee",
            username: "employee",
            password: adminPassword,
            salary: 10000,
            createdBy: admin.id,
            updatedBy: admin.id
        }
    })
    
    console.log("Employee created,", employee.username);
    console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

