export class UnionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnionError';
  }
}

export class InsufficientCreditError extends UnionError {
  constructor(available: string, requested: string) {
    super(`Insufficient credit: requested ${requested} but only ${available} available`);
    this.name = 'InsufficientCreditError';
  }
}

export class InsufficientStakeError extends UnionError {
  constructor(required: string, available: string) {
    super(`Insufficient stake: need ${required} but only have ${available} UNION tokens`);
    this.name = 'InsufficientStakeError';
  }
}

export class LockedStakeError extends UnionError {
  constructor(amount: string) {
    super(`Cannot unstake ${amount} UNION tokens as they are being used as collateral`);
    this.name = 'LockedStakeError';
  }
} 