class ReimburseRepository {
    async submitReimburse(data, tx) {
        const reimburse = await tx.reimbursement.create({
            data
        });
        return reimburse;
    }

}

export default new ReimburseRepository();