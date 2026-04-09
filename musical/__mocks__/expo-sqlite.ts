export const openDatabaseSync = jest.fn().mockReturnValue({
  getFirstAsync: jest.fn().mockResolvedValue(null),
  getAllAsync: jest.fn().mockResolvedValue([]),
  runAsync: jest.fn().mockResolvedValue({}),
  withTransactionAsync: jest.fn((fn: () => Promise<void>) => fn()),
});
