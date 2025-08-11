export interface PositionWithRelations {
  id: string;
  asset: string;
  type: 'Buy' | 'Sell'; // Используем типы из ваших Enum
  quantity: number;
  entry: number;
  current: number;
  pnl: number;
  status: 'Active' | 'Closed' | 'Liquidated'; // Используем типы из ваших Enum
  date: Date;
  userId: string;
  createdAt: Date;
  accountId: string;
  endDate: Date | null;
  startDate: Date;
  account: {
    id: string;
    mt5Id: string;
    isDemo: boolean;
    type: string;
    balance: number;
    freeMargin: number;
    currency: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    verificationStatus: VerificationStatus;
    walletId: string;
    wallet: {
      id: string;
      balance: number;
      currency: string;
      createdAt: Date;
      updatedAt: Date;
      withdrawn: number;
    };
    accounts: Array<{
      id: string;
      mt5Id: string;
      isDemo: boolean;
      type: string;
      balance: number;
      freeMargin: number;
      currency: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

enum VerificationStatus {
  UNVERIFIED, // не верифицировано
  VERIFIED, // верифицировано
  PENDING // в процессе верификации
}
