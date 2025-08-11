import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if it doesn't exist
  const adminEmail = 'admin@hopelink.org';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash('Admin123!', 10);
    
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log(`Created admin user with email: ${adminEmail}`);
  } else {
    // Update existing user to admin if not already
    if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' },
      });
      console.log(`Updated user ${adminEmail} to admin role`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
  }

  // Create sample projects if none exist
  const projectCount = await prisma.project.count();
  
  if (projectCount === 0) {
    const sampleProjects = [
      {
        title: 'Clean Water Initiative',
        description: 'Providing clean drinking water to underserved communities in rural areas.',
        goal: 50000,
        currentFunding: 12500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE' as const,
      },
      {
        title: 'Education for All',
        description: 'Building schools and providing educational resources to children in need.',
        goal: 75000,
        currentFunding: 23000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-11-30'),
        status: 'ACTIVE' as const,
      },
      {
        title: 'Emergency Food Relief',
        description: 'Distributing food packages to families facing food insecurity.',
        goal: 25000,
        currentFunding: 18750,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        status: 'ACTIVE' as const,
      },
      {
        title: 'Medical Supply Drive',
        description: 'Collecting and distributing essential medical supplies to health clinics.',
        goal: 40000,
        currentFunding: 5200,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-30'),
        status: 'ACTIVE' as const,
      },
    ];

    for (const project of sampleProjects) {
      await prisma.project.create({
        data: project,
      });
    }
    
    console.log(`Created ${sampleProjects.length} sample projects`);
  } else {
    console.log(`${projectCount} projects already exist in database`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });