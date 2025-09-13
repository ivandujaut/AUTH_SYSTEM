export class Property {
  constructor(
    public readonly id: string,
    public readonly symbol: string,
    public readonly name: string,
    public readonly navPrice: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly description: string | null = null,
  ) {}
}
