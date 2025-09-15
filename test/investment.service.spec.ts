import { InvestmentService } from '@/domain/services/investment.service';
import { InvestmentRepository } from '@/domain/repositories/investment.repository';
import { CreateInvestmentDto } from '@/presentation/dto/create-investment.dto';
import { Investment, Status, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { InvestmentWithRelations } from '@/domain/types/investment-with-relations.type';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let mockRepository: jest.Mocked<InvestmentRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByPropertyId: jest.fn(),
      getUserInvestmentSummary: jest.fn(),
    };

    service = new InvestmentService(mockRepository);
  });

  const now = new Date();

  describe('create', () => {
    it('should create an investment and return it', async () => {
      const now = new Date();
      const ownerId = 'user-1';

      const dto: CreateInvestmentDto = {
        propertyId: 'property-1',
        amount: 100,
        avgPrice: 50.25,
      };

      const investment: Investment = {
        id: 'investment-1',
        ownerId,
        propertyId: dto.propertyId,
        amount: new Decimal(dto.amount),
        avgPrice: new Decimal(dto.avgPrice),
        createdAt: now,
      };

      mockRepository.create.mockResolvedValue(investment);

      const result = await service.create({ ...dto, ownerId });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.create).toHaveBeenCalledWith({ ...dto, ownerId });
      expect(result).toEqual(investment);
    });
  });

  describe('findAll', () => {
    it('should return all investments', async () => {
      const investments: InvestmentWithRelations[] = [
        {
          id: 'inv-1',
          ownerId: 'user-1',
          propertyId: 'property-1',
          amount: new Decimal(100),
          avgPrice: new Decimal(90),
          createdAt: now,
          owner: {
            id: 'user-1',
            email: 'user@example.com',
            passwordHash: 'hashed',
            role: Role.USER,
            status: Status.ACTIVE,
            createdAt: now,
            updatedAt: now,
          },
          property: {
            id: 'property-1',
            symbol: 'VSMT1',
            name: 'Propiedad demo',
            description: 'Descripción demo',
            status: Status.ACTIVE,
            navPrice: new Decimal(1000),
            createdAt: now,
            updatedAt: now,
          },
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

      const investments: InvestmentWithRelations[] = [
        {
          id: 'inv-2',
          ownerId: userId,
          propertyId: 'property-1',
          amount: new Decimal(200),
          avgPrice: new Decimal(85),
          createdAt: now,
          owner: {
            id: userId,
            email: 'user@example.com',
            passwordHash: 'hashed',
            role: Role.USER,
            status: Status.ACTIVE,
            createdAt: now,
            updatedAt: now,
          },
          property: {
            id: 'property-1',
            symbol: 'PROP1',
            name: 'Property One',
            description: 'Test Property',
            status: Status.ACTIVE,
            navPrice: new Decimal(100),
            createdAt: now,
            updatedAt: now,
          },
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

      const investments: InvestmentWithRelations[] = [
        {
          id: 'inv-3',
          ownerId: 'user-2',
          propertyId,
          amount: new Decimal(300),
          avgPrice: new Decimal(78.5),
          createdAt: now,
          owner: {
            id: 'user-2',
            email: 'user2@example.com',
            passwordHash: 'hashed',
            role: Role.USER,
            status: Status.ACTIVE,
            createdAt: now,
            updatedAt: now,
          },
          property: {
            id: propertyId,
            symbol: 'PROP2',
            name: 'Property Two',
            description: 'Test Property 2',
            status: Status.ACTIVE,
            navPrice: new Decimal(200),
            createdAt: now,
            updatedAt: now,
          },
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
