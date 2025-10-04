import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing seed...');

  // Remove existing data
  await prisma.note.deleteMany();
  await prisma.patient.deleteMany();

  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        mrn: 'MRN001',
        firstName: 'María',
        lastName: 'García López',
        dob: new Date('1945-03-15'),
        createdAt: new Date(),
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN002',
        firstName: 'José',
        lastName: 'García López',
        dob: new Date('1938-07-22'),
        createdAt: new Date(),
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN003',
        firstName: 'Ana',
        lastName: 'García López',
        dob: new Date('1952-11-08'),
        createdAt: new Date(),
      },
    }),
  ]);

  console.log(`${patients.length} patients created`);
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {
        console.log('Seed finalized');
      })
      .catch((err) => {
        console.error('Error disconnecting Prisma:', err);
      });
  });
