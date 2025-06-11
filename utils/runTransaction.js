import prisma from '../utils/prisma.js';

export async function runTransaction(fn) {
    return await prisma.$transaction(async (tx) => {
        return await fn(tx);
    });
}