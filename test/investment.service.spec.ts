import { InvestmentService } from '@/domain/services/investment.service';
import { InvestmentRepository } from '@/domain/repositories/investment.repository';
import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { Investment } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let mockRepository: jest.Mocked<InvestmentRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByPropertyId: jest.fn(),
    };

    service = new InvestmentService(mockRepository);
  });

  const now = new Date();

  describe('create', () => {
    it('should create an investment and return it', async () => {
      const now = new Date();

      const dto: CreateInvestmentDto = {
        ownerId: 'user-1',
        propertyId: 'property-1',
        amount: 100,
        avgPrice: 50.25,
      };

      const investment: Investment = {
        id: 'investment-1',
        ownerId: dto.ownerId,
        propertyId: dto.propertyId,
        amount: new Decimal(dto.amount),
        avgPrice: new Decimal(dto.avgPrice),
        createdAt: now,
      };

      mockRepository.create.mockResolvedValue(investment);

      const result = await service.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(investment);
    });
  });

  describe('findAll', () => {
    it('should return all investments', async () => {
      const investments: Investment[] = [
        {
          id: 'inv-1',
          ownerId: 'user-1',
          propertyId: 'property-1',
          amount: new Decimal(100),
          avgPrice: new Decimal(90),
          createdAt: now,
        },
      ];

      mockRepository.findAll.mockResolvedValue(investments);

      const result = await service.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(investments);
    });
  });

  describe('findByUserId', () => {
    it('should return investments for a given user', async () => {
      const userId = 'user-1';

      const investments: Investment[] = [
        {
          id: 'inv-2',
          ownerId: userId,
          propertyId: 'property-1',
          amount: new Decimal(200),
          avgPrice: new Decimal(85),
          createdAt: now,
        },
      ];

      mockRepository.findByUserId.mockResolvedValue(investments);

      const result = await service.findByUserId(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(investments);
    });
  });

  describe('findByPropertyId', () => {
    it('should return investments for a given property', async () => {
      const propertyId = 'property-2';

      const investments: Investment[] = [
        {
          id: 'inv-3',
          ownerId: 'user-2',
          propertyId,
          amount: new Decimal(300),
          avgPrice: new Decimal(78.5),
          createdAt: now,
        },
      ];

      mockRepository.findByPropertyId.mockResolvedValue(investments);

      const result = await service.findByPropertyId(propertyId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findByPropertyId).toHaveBeenCalledWith(propertyId);
      expect(result).toEqual(investments);
    });
  });
});
