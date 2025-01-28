import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";

import { CdpAction } from "../../cdp_action";
import { UNION_ADDRESSES, USER_MANAGER_ABI } from "./constants";

const SETUP_PROMPT = `
This tool allows registering an address as a member in the Union protocol.

It takes:
- account: The Ethereum address to register as a member (optional, defaults to sender)

Examples:
- Register yourself: Leave account empty
- Register another address: account: "0x1234...5678"
`;

export const UnionSetupInput = z
  .object({
    account: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional()
      .describe("The address to register as a member (defaults to sender)")
  })
  .describe("Input schema for Union member registration");

export async function setupUnion(
  wallet: Wallet,
  args: z.infer<typeof UnionSetupInput>
): Promise<string> {
  try {
    const memberAddress = args.account || await wallet.getAddress();
    
    const invocation = await wallet.invokeContract({
      contractAddress: UNION_ADDRESSES.USER_MANAGER,
      method: "registerMember",
      abi: USER_MANAGER_ABI,
      args: {
        account: memberAddress
      }
    });

    const result = await invocation.wait();

    return `Successfully registered ${memberAddress} as Union member with transaction hash: ${result.getTransactionHash()} and transaction link: ${result.getTransactionLink()}`;
  } catch (error) {
    return `Error registering member: ${error}`;
  }
}

export class UnionSetupAction implements CdpAction<typeof UnionSetupInput> {
  public name = "union_setup";
  public description = SETUP_PROMPT;
  public argsSchema = UnionSetupInput;
  public func = setupUnion;
}

