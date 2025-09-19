import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.task.count();
  if (count === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Primera tarea', description: 'Demo', status: 'pending' },
        { title: 'Completar informe', description: 'Cliente', status: 'completed' }
      ]
    });
    console.log('Seed done');
  } else {
    console.log('Seed skipped, tasks already exist.');
  }
}
main().then(()=>prisma.$disconnect());
