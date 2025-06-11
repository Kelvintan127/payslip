import express from "express";
import cors from "cors";
import {authMiddleware} from "./src/middleware/authMiddleware.js";
import contextMiddleware from "./src/middleware/contextMiddleware.js";

import authRouter from "./src/routes/authRoute.js";
import attendanceRouter from "./src/routes/attendanceRoute.js";
import overtimeRouter from "./src/routes/overtimeRoute.js";
import reimburseRouter from "./src/routes/reimburseRoute.js";
import payrollRouter from "./src/routes/payrollRoute.js";
import payslipRouter from "./src/routes/payslipRoute.js";

const app = express();
app.use(cors());
app.use(express.json());


app.use("/auth", authRouter); //need to change to admin n employee

app.get("/", (req, res) => {
    res.send("Welcome to payslip API!");
});

app.use(authMiddleware);
app.use(contextMiddleware);

app.use("/attendance", attendanceRouter);
app.use("/overtime", overtimeRouter);
app.use("/reimburse", reimburseRouter);
app.use("/payroll", payrollRouter);
app.use("/payslip", payslipRouter);

export default app;