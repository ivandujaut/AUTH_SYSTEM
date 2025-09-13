import { PropertyService } from '@/domain/services/property.service';
import { PropertyRepository } from '@/domain/repositories/property.repository';
import { CreatePropertyDto } from '@/presentation/dto/create-property.dto';
import { Status } from '@prisma/client';
import { Property } from '@/domain/entities/property.entity';

describe('PropertyService', () => {
  let service: PropertyService;
  let mockRepository: jest.Mocked<PropertyRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };
    service = new PropertyService(mockRepository);
  });

  describe('create', () => {
    it('should create and return a property', async () => {
      const dto: CreatePropertyDto = {
        symbol: 'VLS-NEW',
        name: 'Torre Este',
        navPrice: 120,
      };

      const mockProperty = {
        id: 'some-id',
        symbol: 'SYMB',
        name: 'Prop',
        description: null,
        navPrice: 100,
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(mockProperty);

      const result = await service.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProperty);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      const properties: Property[] = [
        {
          id: 'property-1',
          symbol: 'VLS-RE1',
          name: 'Torre Norte',
          description: null,
          navPrice: 100,
          status: Status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'property-2',
          symbol: 'VLS-RE2',
          name: 'Parque Central',
          description: null,
          navPrice: 80.5,
          status: Status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(properties);

      const result = await service.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(properties);
    });
  });
});
