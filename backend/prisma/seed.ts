// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '../src/generated/prisma/client';

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });
// console.log(process.env.DATABASE_URL);
// const prisma = new PrismaClient({
//   adapter: adapter,
// });

// async function main() {
//   const electronics = await prisma.category.upsert({
//     where: { name: 'electronics' },
//     update: {},
//     create: {
//       name: 'electronics',
//       slug: 'electronics',
//       products: {
//         create: [
//           {
//             title: 'Samsung QLED 43',
//             description: 'QE43Q7FAAUXUA',
//             price: '16999',
//             stock: 10,
//             images: ['https://link1.com', 'https://link2.com'],
//           },
//           {
//             title: 'Lenovo IdeaPad Slim 3',
//             description: `6ARP10 (83K8005FRA) Luna Grey / 16" IPS WUXGA / AMD Ryzen 5 7535HS / RAM 24 GB / SSD 512 GB`,
//             price: '23999',
//             stock: 20,
//             images: ['https://link3.com', 'https://link4.com'],
//           },
//           {
//             title: 'Samsung Galaxy Flip 7',
//             description: `12/512GB Jet Black (SM-F766BZKHSEK)`,
//             price: '23999',
//             stock: 100,
//             images: ['https://link5.com', 'https://link6.com'],
//           },
//         ],
//       },
//     },
//   });

//   const sports = await prisma.category.upsert({
//     where: { name: 'sports' },
//     update: {},
//     create: {
//       name: 'sports',
//       slug: 'sports',
//       products: {
//         create: [
//           {
//             title: 'Bicycle',
//             description: `Crossride "Bullet 2.0" MTB 26" 15" 2024`,
//             price: '7126',
//             stock: 5,
//             images: ['https://link7.com', 'https://link8.com'],
//           },
//           {
//             title: 'Electric scooter',
//             description: `Xiaomi Mi Electric Scooter 4 Ultra Black (910900)`,
//             price: '30999',
//             stock: 11,
//             images: ['https://link8.com', 'https://link9.com'],
//           },
//           {
//             title: 'Monowheel',
//             description: `KingSong S22 Pro+ 2025 Black [143787]`,
//             price: '899',
//             stock: 4,
//             images: ['https://link10.com', 'https://link11.com'],
//           },
//         ],
//       },
//     },
//   });

//   const Household = await prisma.category.upsert({
//     where: { name: 'household appliances' },
//     update: {},
//     create: {
//       name: 'household appliances',
//       slug: 'household-appliances',
//       products: {
//         create: [
//           {
//             title: 'washing machine',
//             description: `Whirlpool WRBSB 6228 B UA`,
//             price: '13999',
//             stock: 50,
//             images: ['https://link12.com', 'https://link13.com'],
//           },
//           {
//             title: 'dishwasher',
//             description: `BOSCH SMV2IVX00K`,
//             price: '21999',
//             stock: 11,
//             images: ['https://link13.com', 'https://link14.com'],
//           },
//           {
//             title: 'refrigerator',
//             description: `Samsung RB38C676EB1/UA`,
//             price: '29499',
//             stock: 10000,
//             images: ['https://link16.com', 'https://link17.com'],
//           },
//         ],
//       },
//     },
//   });
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
