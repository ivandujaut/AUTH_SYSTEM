import { PlacementRepository } from '@/domain/repositories/placement.repository';
import { PlacementService } from '@/domain/services/placement.service';
import { CreatePlacementDto } from '@/presentation/dto/create-placement.dto';
import { Placement } from '@prisma/client';

describe('PlacementService', () => {
  let service: PlacementService;
  let mockRepository: jest.Mocked<PlacementRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    service = new PlacementService(mockRepository);
  });

  describe('create', () => {
    it('should create a placement and return it', async () => {
      const dto: CreatePlacementDto = {
        propertyId: 'property-123',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const mockPlacement = {
        id: 'placement-456',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Placement;

      mockRepository.create.mockResolvedValue(mockPlacement);

      const result = await service.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockPlacement);
    });
  });

  describe('findAll', () => {
    it('should return an array of placements', async () => {
      const placements: Placement[] = [
        {
          id: 'placement-1',
          propertyId: 'property-1',
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'placement-2',
          propertyId: 'property-2',
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(placements);

      const result = await service.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(placements);
    });
  });
});
