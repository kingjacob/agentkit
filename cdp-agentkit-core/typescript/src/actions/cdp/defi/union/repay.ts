import { Asset, Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { approve } from "../../utils";
import { UNION_ADDRESSES, MARKET_ABI } from "./constants";

const REPAY_PROMPT = `
This tool allows repaying USDC debt in the Union protocol.

It takes:
- amount: The amount of USDC to repay
- account: (Optional) The account to repay for

Examples:
- 1000 USDC
- 500.5 USDC for 0x123...
`;

export const UnionRepayInput = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .refine(val => new Decimal(val).greaterThan(0), "Amount must be greater than 0")
    .refine(val => new Decimal(val).lessThan(1000000), "Amount must be less than 1,000,000 USDC")
    .describe("The amount of USDC to repay"),
  account: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional()
    .describe("The account to repay for (optional)")
});
