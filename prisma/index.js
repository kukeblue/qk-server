"use strict";
exports.__esModule = true;
var PrismaClient = require("@prisma/client").PrismaClient;
var prisma = new PrismaClient();
exports["default"] = prisma;
// await prisma.$disconnect()
// // A `main` function so that you can use async/await
// async function main() {
//     const allUsers = await prisma.game_account.findMany({
//
//     })
//     // use `console.dir` to print nested objects
//     console.dir(allUsers, { depth: null })
// }
//
// main()
//     .catch(e => {
//         throw e
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })
