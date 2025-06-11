import {it, jest} from "@jest/globals";
import reimburseController from "../../../src/controllers/reimburseController.js";
import reimburseService from "../../../src/services/reimburseService.js";

jest.mock("../../../src/services/reimburseService.js");
describe("reimburseController", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        reimburseService.submitReimburse = jest.fn();
        jest.clearAllMocks();
    })
    describe("submitReimburse", () => {
        it("should return a 400 status code if any of the required fields are missing", async () => {
            const req = {
                body: {
                    amount: null,
                    description: "test",
                    reimburseDate: "2021-01-01",
                },
                context: {
                    user: {
                        id: 1,
                        ipAddress: "IP_ADDRESS"
                    }
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            reimburseService.submitReimburse = jest.fn().mockResolvedValue({
                success: true,
                status: 200,
                message: "Reimburse submitted successfully",
                data: null,
            })

            const next = jest.fn()
            await reimburseController.submitReimburse(req, res, next)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "All fields are required",
            })
        });
        it("should return a 200 status code if all the required fields are present", async () => {
            const req = {
                body: {
                    amount: 100,
                    description: "test",
                    reimburseDate: "2021-01-01",
                    reimburseType: "test",
                    reimburseStatus: "test",
                },
                context: {
                    user: {
                        id: 1,
                        ipAddress: "IP_ADDRESS"
                    }
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            reimburseService.submitReimburse = jest.fn().mockResolvedValue({
                success: true,
                status: 200,
                message: "Reimburse submitted successfully",
                data: null,
            })
            const next = jest.fn()
            await reimburseController.submitReimburse(req, res, next)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: "Reimburse submitted successfully",
                data: null,
            })  
        });
        it("should return a 500 status code if an error occurs", async () => {
            const req = {
                body: {
                    amount: 100,
                    description: "test",
                    reimburseDate: "2021-01-01",
                    reimburseType: "test",
                    reimburseStatus: "test",
                },
                context: {
                    user: {
                        id: 1,
                        ipAddress: "IP_ADDRESS"
                    }
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            reimburseService.submitReimburse = jest.fn().mockRejectedValue(new Error("Error"))
            const next = jest.fn()
            await reimburseController.submitReimburse(req, res, next)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 500,
                message: "Error",
            })
        })
    })
})