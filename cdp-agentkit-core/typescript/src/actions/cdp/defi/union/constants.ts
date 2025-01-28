export const UNION_ADDRESSES_BY_NETWORK = {
  'base-mainnet': {
    UNION_TOKEN: "0x6C5c8E297D698d33d9843DE5Aa38775C64939DB6",
    USER_MANAGER: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
    MARKET: "0x9FaF7E4Dc0d7C7C8D0DC7C2657c7436326e4E879",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  },

};

export const USER_MANAGER_ABI = [
  // View Functions
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getStakerBalance",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getTotalLockedStake",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "staker", type: "address" }],
    name: "getVouchingAmount",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "borrower", type: "address" }],
    name: "getCreditLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "staker", type: "address" },
      { internalType: "address", name: "borrower", type: "address" }
    ],
    name: "getTrust",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function"
  },
  // State Changing Functions
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint96", name: "amount", type: "uint96" }
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint96", name: "amount", type: "uint96" }
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "uint96", name: "amount", type: "uint96" }
    ],
    name: "updateTrust",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "borrower", type: "address" }],
    name: "cancelVouch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "freeze",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const MARKET_ABI = [
  // View Functions
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getBorrowed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBorrowed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxBorrow",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getEffectiveBorrowed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  // State Changing Functions
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "repay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "repayBorrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  }
]; 