import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ColdStorageTemperatureService } from '../modules/cold.storage.temperature/services/cold.storage.temperature.service';
import { ColdStorageTemperatureRepository } from '../modules/cold.storage.temperature/repositories/cold.storage.temperature.repository';
import { ColdStorageRepository } from '../modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorageTemperature } from '../modules/cold.storage.temperature/models/cold.storage.temperature.model';
import { ColdStorage } from '../modules/cold.storage/models/cold.storage.model';
import { ColdStorageTemperatureDTO } from '../modules/cold.storage.temperature/dto/cold.storage.temperature.dto';
import { ColdStorageTemperaturePatchDTO } from '../modules/cold.storage.temperature/dto/cold.storage.temperature.patch.dto';
import { ColdStorageType } from '../common/utils/types/cold.storage.type';
import { TemperatureAnomalyType } from '../modules/cold.storage.temperature/enums/temperature.anomaly.enum';
import { TemperatureCorrectiveActionType } from '../modules/cold.storage.temperature/enums/temperature.corrective.action.enum';
import { TemperatureStatus } from '../modules/cold.storage.temperature/enums/temperature.status.enum';
import { DateRangeFilter } from '../common/filters/date.range.filter';

describe('ColdStorageTemperatureService', () => {
  let service: ColdStorageTemperatureService;
  let temperatureRepository: ColdStorageTemperatureRepository;
  let coldStorageRepository: ColdStorageRepository;

  // Mock data
  const mockColdStorageId = '60f1b2b3b3b3b3b3b3b3b3b3';
  const mockTemperatureId = '60f1b2b3b3b3b3b3b3b3b3b4';

  const mockColdStorage = {
    _id: mockColdStorageId,
    name: 'Chambre froide test',
    type: ColdStorageType.POSITIVE_CHAMBER,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as ColdStorage;

  const mockTemperatureRecord = {
    temperature: 2.5,
    time: '09:00',
    anomaly: TemperatureAnomalyType.NONE,
    correctiveAction: undefined,
  };

  const mockColdStorageTemperature = {
    _id: mockTemperatureId,
    coldStorageId: new Types.ObjectId(mockColdStorageId),
    date: new Date('2024-03-20'),
    temperatureRecords: [mockTemperatureRecord],
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as ColdStorageTemperature;

  const mockTemperatureDTO: ColdStorageTemperatureDTO = {
    coldStorageId: mockColdStorageId,
    date: '2024-03-20',
    temperatureRecords: [
      {
        temperature: 2.5,
        time: '09:00',
      },
      {
        temperature: 3.0,
        time: '15:00',
      },
    ],
  };

  const mockTemperaturePatchDTO: ColdStorageTemperaturePatchDTO = {
    temperatureRecords: [
      {
        temperature: 2.8,
        time: '12:00',
      },
    ],
  };

  // Mock repositories
  const mockTemperatureRepository = {
    findAll: jest.fn(),
    findManyBy: jest.fn(),
    findOneById: jest.fn(),
    findOptionalBy: jest.fn(),
    insert: jest.fn(),
    updateOneBy: jest.fn(),
    deleteOneBy: jest.fn(),
  };

  const mockColdStorageRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColdStorageTemperatureService,
        {
          provide: ColdStorageTemperatureRepository,
          useValue: mockTemperatureRepository,
        },
        {
          provide: ColdStorageRepository,
          useValue: mockColdStorageRepository,
        },
      ],
    }).compile();

    service = module.get<ColdStorageTemperatureService>(
      ColdStorageTemperatureService,
    );
    temperatureRepository = module.get<ColdStorageTemperatureRepository>(
      ColdStorageTemperatureRepository,
    );
    coldStorageRepository = module.get<ColdStorageRepository>(
      ColdStorageRepository,
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllColdStorageTemperatures', () => {
    const mockFilter = new DateRangeFilter({ year: 2024, month: 3, day: 20 });

    it('devrait retourner toutes les températures avec succès', async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures = [
        {
          ...mockColdStorageTemperature,
          coldStorageId: mockColdStorage,
        } as unknown as ColdStorageTemperature,
      ];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getAllColdStorageTemperatures(mockFilter);

      // Assert
      expect(coldStorageRepository.findAll).toHaveBeenCalledTimes(1);
      expect(temperatureRepository.findManyBy).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.objectContaining({
            $gte: expect.any(Date),
            $lte: expect.any(Date),
          }),
        }),
        { populate: [{ path: 'coldStorageId' }] },
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('coldStorage');
    });

    it('devrait retourner un objet vide pour les cold storages sans températures', async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures: ColdStorageTemperature[] = [];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getAllColdStorageTemperatures(mockFilter);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: null,
        coldStorage: mockColdStorage,
        date: expect.any(Date),
        temperatureRecords: [],
      });
    });

    it('devrait gérer les erreurs lors de la récupération', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockColdStorageRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.getAllColdStorageTemperatures(mockFilter),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getColdStorageTemperatureById', () => {
    it('devrait retourner une température par son ID avec succès', async () => {
      // Arrange
      const mockTemperatureWithColdStorage = {
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      } as unknown as ColdStorageTemperature;

      mockTemperatureRepository.findOneById.mockResolvedValue(
        mockTemperatureWithColdStorage,
      );

      // Act
      const result =
        await service.getColdStorageTemperatureById(mockTemperatureId);

      // Assert
      expect(temperatureRepository.findOneById).toHaveBeenCalledWith(
        mockTemperatureId,
        { populate: [{ path: 'coldStorageId' }] },
      );
      expect(result).toHaveProperty('coldStorage', mockColdStorage);
      expect(result.coldStorageId).toBeUndefined();
    });

    it("devrait lancer NotFoundException si la température n'existe pas", async () => {
      // Arrange
      mockTemperatureRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getColdStorageTemperatureById(mockTemperatureId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getColdStorageTemperatureById(mockTemperatureId),
      ).rejects.toThrow('Temperature record not found');
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockTemperatureRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.getColdStorageTemperatureById(mockTemperatureId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("Validation du format de l'heure", () => {
    it("devrait valider les formats d'heure corrects", async () => {
      // Arrange
      const validTimes = ['00:00', '09:30', '14:45', '23:59'];
      const temperatureDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: validTimes.map((time) => ({
          temperature: 2.5,
          time,
        })),
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act & Assert
      await expect(
        service.createTemperatures([temperatureDTO]),
      ).resolves.toBeDefined();
    });

    it("devrait rejeter les formats d'heure invalides", async () => {
      // Arrange
      const invalidTimes = ['25:00', '12:60', '9:30', '14:5', 'abc', ''];

      for (const invalidTime of invalidTimes) {
        const temperatureDTO = {
          ...mockTemperatureDTO,
          temperatureRecords: [{ temperature: 2.5, time: invalidTime }],
        };

        mockColdStorageRepository.findOneById.mockResolvedValue(
          mockColdStorage,
        );

        // Act & Assert
        await expect(
          service.createTemperatures([temperatureDTO]),
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.createTemperatures([temperatureDTO]),
        ).rejects.toThrow(/format de l'heure/);
      }
    });
  });

  describe('Validation des températures', () => {
    it('devrait valider les températures normales sans anomalie', async () => {
      // Arrange
      const temperatureDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: [
          { temperature: 2.0, time: '09:00' }, // Dans la plage normale (0-4.5°C)
          { temperature: 4.0, time: '15:00' },
        ],
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      const result = await service.createTemperatures([temperatureDTO]);

      // Assert
      expect(result).toBeDefined();
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({
              anomaly: TemperatureAnomalyType.NONE,
              correctiveAction: undefined,
            }),
          ]),
        }),
      );
    });

    it('devrait détecter une température trop basse avec action corrective', async () => {
      // Arrange
      const temperatureDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: [
          {
            temperature: -5.0, // Trop basse pour une chambre positive (min 0°C)
            time: '09:00',
            correctiveAction:
              TemperatureCorrectiveActionType.TECHNICIAN_INTERVENTION,
          },
        ],
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      await service.createTemperatures([temperatureDTO]);

      // Assert
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({
              anomaly: TemperatureAnomalyType.TOO_LOW,
              correctiveAction:
                TemperatureCorrectiveActionType.TECHNICIAN_INTERVENTION,
            }),
          ]),
        }),
      );
    });

    it('devrait détecter une température trop haute avec action corrective', async () => {
      // Arrange
      const temperatureDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: [
          {
            temperature: 8.0, // Trop haute pour une chambre positive (max 4.5°C)
            time: '09:00',
            correctiveAction: TemperatureCorrectiveActionType.DOOR_CLOSED,
          },
        ],
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      await service.createTemperatures([temperatureDTO]);

      // Assert
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({
              anomaly: TemperatureAnomalyType.TOO_HIGH,
              correctiveAction: TemperatureCorrectiveActionType.DOOR_CLOSED,
            }),
          ]),
        }),
      );
    });

    it('devrait rejeter une température anormale sans action corrective', async () => {
      // Arrange
      const temperatureDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: [
          {
            temperature: 8.0, // Trop haute sans action corrective
            time: '09:00',
          },
        ],
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);

      // Act & Assert
      await expect(
        service.createTemperatures([temperatureDTO]),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createTemperatures([temperatureDTO]),
      ).rejects.toThrow(/action corrective est requise/);
    });

    it('devrait tester avec tous les types de cold storage', async () => {
      // Test avec chaque type de cold storage avec une température appropriée
      const typeTemperatures = {
        [ColdStorageType.POSITIVE_CHAMBER]: 2.0, // 0-4.5°C
        [ColdStorageType.NEGATIVE_CHAMBER]: -20.0, // -24 à -16°C
        [ColdStorageType.SHOWCASE]: 3.0, // 0-6.5°C
        [ColdStorageType.FRUITS_AND_VEGETABLES_CHAMBER]: 5.0, // 0-10°C
        [ColdStorageType.SENSITIVE_POSITIVE_CHAMBER]: 1.0, // 0-2°C
        [ColdStorageType.FINISHED_PRODUCTS_CHAMBER]: 2.0, // 0-3°C
        [ColdStorageType.MEAT_CARCASS_CHAMBER]: 4.0, // 0-7°C
        [ColdStorageType.DAIRY_PRODUCTS_CHAMBER]: 6.0, // 0-8°C
        [ColdStorageType.REFRIGERATED_ZONE]: 8.0, // < 12°C
      };

      for (const type of Object.values(ColdStorageType)) {
        const mockColdStorageWithType = {
          ...mockColdStorage,
          type,
        } as unknown as ColdStorage;
        const temperatureDTO = {
          ...mockTemperatureDTO,
          temperatureRecords: [
            { temperature: typeTemperatures[type], time: '09:00' },
          ],
        };

        mockColdStorageRepository.findOneById.mockResolvedValue(
          mockColdStorageWithType,
        );
        mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
        mockTemperatureRepository.insert.mockResolvedValue({
          _id: mockTemperatureId,
        });
        mockTemperatureRepository.findOneById.mockResolvedValue({
          ...mockColdStorageTemperature,
          coldStorageId: mockColdStorageWithType,
        });

        // Act
        const result = await service.createTemperatures([temperatureDTO]);

        // Assert
        expect(result).toBeDefined();
      }
    });

    it("devrait lancer NotFoundException si le cold storage n'existe pas", async () => {
      // Arrange
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.createTemperatures([mockTemperatureDTO]),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createTemperatures([mockTemperatureDTO]),
      ).rejects.toThrow(/ColdStorage .* not found/);
    });
  });

  describe('createTemperatures', () => {
    it('devrait créer de nouvelles températures avec succès', async () => {
      // Arrange
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      const result = await service.createTemperatures([mockTemperatureDTO]);

      // Assert
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          coldStorageId: expect.any(Types.ObjectId),
          date: expect.any(Date),
          temperatureRecords: expect.any(Array),
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('coldStorage');
    });

    it('devrait mettre à jour un relevé existant en ajoutant de nouveaux records', async () => {
      // Arrange
      const existingTemperature = {
        ...mockColdStorageTemperature,
        temperatureRecords: [
          {
            temperature: 2.0,
            time: '08:00',
            anomaly: TemperatureAnomalyType.NONE,
          },
        ],
      } as unknown as ColdStorageTemperature;

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(
        existingTemperature,
      );
      mockTemperatureRepository.updateOneBy.mockResolvedValue(true);
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...existingTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      await service.createTemperatures([mockTemperatureDTO]);

      // Assert
      expect(temperatureRepository.updateOneBy).toHaveBeenCalledWith(
        { _id: existingTemperature._id },
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({ time: '08:00' }), // Existing
            expect.objectContaining({ time: '09:00' }), // New
            expect.objectContaining({ time: '15:00' }), // New
          ]),
        }),
      );
    });

    it("devrait détecter les doublons d'heures", async () => {
      // Arrange
      const existingTemperature = {
        ...mockColdStorageTemperature,
        temperatureRecords: [
          {
            temperature: 2.0,
            time: '09:00',
            anomaly: TemperatureAnomalyType.NONE,
          },
        ],
      } as unknown as ColdStorageTemperature;

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(
        existingTemperature,
      );

      // Act & Assert
      await expect(
        service.createTemperatures([mockTemperatureDTO]),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createTemperatures([mockTemperatureDTO]),
      ).rejects.toThrow(/relevés de température existent déjà/);
    });

    it('devrait traiter plusieurs DTOs en une seule fois', async () => {
      // Arrange
      const multipleDTOs = [
        mockTemperatureDTO,
        {
          ...mockTemperatureDTO,
          date: '2024-03-21',
          temperatureRecords: [{ temperature: 3.0, time: '10:00' }],
        },
      ];

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: mockColdStorage,
      });

      // Act
      const result = await service.createTemperatures(multipleDTOs);

      // Assert
      expect(result).toHaveLength(2);
      expect(temperatureRepository.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateTemperature', () => {
    it('devrait mettre à jour une température avec succès', async () => {
      // Arrange
      mockTemperatureRepository.findOneById
        .mockResolvedValueOnce(mockColdStorageTemperature)
        .mockResolvedValueOnce({
          ...mockColdStorageTemperature,
          temperatureRecords: [
            ...mockColdStorageTemperature.temperatureRecords,
            mockTemperaturePatchDTO.temperatureRecords![0],
          ],
        });
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.updateOneBy.mockResolvedValue(true);

      // Act
      const result = await service.updateTemperature(
        mockTemperatureId,
        mockTemperaturePatchDTO,
      );

      // Assert
      expect(temperatureRepository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockTemperatureId },
        expect.objectContaining({
          temperatureRecords: expect.any(Array),
        }),
      );
      expect(result).toBeDefined();
    });

    it("devrait lancer NotFoundException si la température n'existe pas", async () => {
      // Arrange
      mockTemperatureRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow('Temperature entry not found');
    });

    it("devrait lancer NotFoundException si le cold storage lié n'existe pas", async () => {
      // Arrange
      mockTemperatureRepository.findOneById.mockResolvedValue(
        mockColdStorageTemperature,
      );
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow('Linked ColdStorage not found');
    });

    it('devrait mettre à jour seulement la date', async () => {
      // Arrange
      const dateOnlyUpdate: ColdStorageTemperaturePatchDTO = {
        date: '2024-03-21',
      };
      mockTemperatureRepository.findOneById
        .mockResolvedValueOnce(mockColdStorageTemperature)
        .mockResolvedValueOnce(mockColdStorageTemperature);
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.updateOneBy.mockResolvedValue(true);

      // Act
      await service.updateTemperature(mockTemperatureId, dateOnlyUpdate);

      // Assert
      expect(temperatureRepository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockTemperatureId },
        expect.objectContaining({
          date: expect.any(Date),
        }),
      );
    });

    it('devrait permettre de remplacer un relevé existant avec la même heure', async () => {
      // Arrange
      const existingTemperatureWithMultipleRecords = {
        ...mockColdStorageTemperature,
        temperatureRecords: [
          {
            temperature: 2.5,
            time: '09:00',
            anomaly: TemperatureAnomalyType.NONE,
          },
          {
            temperature: 3.0,
            time: '15:00',
            anomaly: TemperatureAnomalyType.NONE,
          },
        ],
      } as unknown as ColdStorageTemperature;

      const replacementUpdate: ColdStorageTemperaturePatchDTO = {
        temperatureRecords: [{ temperature: 3.5, time: '09:00' }], // Remplace l'heure existante 09:00
      };

      const updatedTemperature = {
        ...existingTemperatureWithMultipleRecords,
        temperatureRecords: [
          {
            temperature: 3.0,
            time: '15:00',
            anomaly: TemperatureAnomalyType.NONE,
          }, // Conservé
          {
            temperature: 3.5,
            time: '09:00',
            anomaly: TemperatureAnomalyType.NONE,
          }, // Remplacé et trié
        ],
      } as unknown as ColdStorageTemperature;

      mockTemperatureRepository.findOneById
        .mockResolvedValueOnce(existingTemperatureWithMultipleRecords)
        .mockResolvedValueOnce(updatedTemperature);
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.updateOneBy.mockResolvedValue(true);

      // Act
      const result = await service.updateTemperature(
        mockTemperatureId,
        replacementUpdate,
      );

      // Assert
      expect(temperatureRepository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockTemperatureId },
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({ time: '09:00', temperature: 3.5 }),
            expect.objectContaining({ time: '15:00', temperature: 3.0 }),
          ]),
        }),
      );
      expect(result).toEqual(updatedTemperature);
    });

    it('devrait lancer NotFoundException si la mise à jour échoue', async () => {
      // Arrange
      mockTemperatureRepository.findOneById.mockResolvedValue(
        mockColdStorageTemperature,
      );
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.updateOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateTemperature(mockTemperatureId, mockTemperaturePatchDTO),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteColdStorageTemperature', () => {
    it('devrait supprimer une température avec succès', async () => {
      // Arrange
      mockTemperatureRepository.deleteOneBy.mockResolvedValue(true);

      // Act
      await service.deleteColdStorageTemperature(mockTemperatureId);

      // Assert
      expect(temperatureRepository.deleteOneBy).toHaveBeenCalledWith({
        _id: new Types.ObjectId(mockTemperatureId),
      });
    });

    it("devrait lancer NotFoundException si la température n'existe pas", async () => {
      // Arrange
      mockTemperatureRepository.deleteOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.deleteColdStorageTemperature(mockTemperatureId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.deleteColdStorageTemperature(mockTemperatureId),
      ).rejects.toThrow('Temperature record not found');
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockTemperatureRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.deleteColdStorageTemperature(mockTemperatureId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getTemperatureStatusRange', () => {
    beforeEach(() => {
      // Mock Date.now() pour des tests prévisibles
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-20T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('devrait retourner le statut pour une plage de dates spécifique', async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures = [
        {
          ...mockColdStorageTemperature,
          date: new Date('2024-03-20'),
          temperatureRecords: [
            {
              temperature: 2.0,
              time: '09:00',
              anomaly: TemperatureAnomalyType.NONE,
            },
            {
              temperature: 3.0,
              time: '15:00',
              anomaly: TemperatureAnomalyType.NONE,
            },
          ],
        } as unknown as ColdStorageTemperature,
      ];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getTemperatureStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: '2024-03-20',
        status: TemperatureStatus.NORMAL,
        anomalyCount: 0,
        completedStoragesCount: 1,
        totalStoragesCount: 1,
      });
    });

    it("devrait retourner MISSING quand il n'y a pas assez de relevés", async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures = [
        {
          ...mockColdStorageTemperature,
          date: new Date('2024-03-20'),
          temperatureRecords: [
            {
              temperature: 2.0,
              time: '09:00',
              anomaly: TemperatureAnomalyType.NONE,
            },
          ], // Seulement 1 relevé (< 2)
        } as unknown as ColdStorageTemperature,
      ];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getTemperatureStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      expect(result[0].status).toBe(TemperatureStatus.MISSING);
      expect(result[0].completedStoragesCount).toBe(0);
    });

    it('devrait retourner WARNING avec une anomalie', async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures = [
        {
          ...mockColdStorageTemperature,
          date: new Date('2024-03-20'),
          temperatureRecords: [
            {
              temperature: 2.0,
              time: '09:00',
              anomaly: TemperatureAnomalyType.NONE,
            },
            {
              temperature: 8.0,
              time: '15:00',
              anomaly: TemperatureAnomalyType.TOO_HIGH,
            },
          ],
        } as unknown as ColdStorageTemperature,
      ];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getTemperatureStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      expect(result[0].status).toBe(TemperatureStatus.WARNING);
      expect(result[0].anomalyCount).toBe(1);
    });

    it('devrait retourner CRITICAL avec plusieurs anomalies', async () => {
      // Arrange
      const mockColdStorages = [mockColdStorage];
      const mockTemperatures = [
        {
          ...mockColdStorageTemperature,
          date: new Date('2024-03-20'),
          temperatureRecords: [
            {
              temperature: 8.0,
              time: '09:00',
              anomaly: TemperatureAnomalyType.TOO_HIGH,
            },
            {
              temperature: -1.0,
              time: '15:00',
              anomaly: TemperatureAnomalyType.TOO_LOW,
            },
          ],
        } as unknown as ColdStorageTemperature,
      ];

      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorages);
      mockTemperatureRepository.findManyBy.mockResolvedValue(mockTemperatures);

      // Act
      const result = await service.getTemperatureStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      expect(result[0].status).toBe(TemperatureStatus.CRITICAL);
      expect(result[0].anomalyCount).toBe(2);
    });

    it("devrait utiliser des dates par défaut si aucune n'est fournie", async () => {
      // Arrange
      mockColdStorageRepository.findAll.mockResolvedValue([]);
      mockTemperatureRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getTemperatureStatusRange();

      // Assert
      expect(temperatureRepository.findManyBy).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.objectContaining({
            $gte: expect.any(Date),
            $lte: expect.any(Date),
          }),
        }),
      );
      expect(result).toBeDefined();
    });

    it('devrait gérer une plage de plusieurs jours', async () => {
      // Arrange
      mockColdStorageRepository.findAll.mockResolvedValue([mockColdStorage]);
      mockTemperatureRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getTemperatureStatusRange(
        '2024-03-20',
        '2024-03-22',
      );

      // Assert
      expect(result).toHaveLength(3); // 3 jours
      expect(result.map((r) => r.date)).toEqual([
        '2024-03-20',
        '2024-03-21',
        '2024-03-22',
      ]);
    });

    it('devrait gérer les erreurs lors de la récupération du statut', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockColdStorageRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getTemperatureStatusRange()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Gestion des erreurs générales', () => {
    it('devrait gérer les erreurs inattendues', async () => {
      // Arrange
      const unexpectedError = new Error('Erreur inattendue');
      mockColdStorageRepository.findAll.mockRejectedValue(unexpectedError);

      // Act & Assert
      const filter = new DateRangeFilter({ year: 2024, month: 3, day: 20 });
      await expect(
        service.getAllColdStorageTemperatures(filter),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('devrait préserver les HttpExceptions existantes', async () => {
      // Arrange
      const httpException = new BadRequestException('Erreur HTTP existante');
      mockTemperatureRepository.findOneById.mockRejectedValue(httpException);

      // Act & Assert
      await expect(
        service.getColdStorageTemperatureById(mockTemperatureId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.getColdStorageTemperatureById(mockTemperatureId),
      ).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('Tests de performance et cas limites', () => {
    it('devrait gérer un grand nombre de relevés de température', async () => {
      // Arrange
      const largeTemperatureRecords = Array.from(
        { length: 24 },
        (_, index) => ({
          temperature: 2.5,
          time: `${index.toString().padStart(2, '0')}:00`,
        }),
      );

      const largeTempDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: largeTemperatureRecords,
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        temperatureRecords: largeTemperatureRecords,
        coldStorageId: mockColdStorage,
      });

      // Act
      const result = await service.createTemperatures([largeTempDTO]);

      // Assert
      expect(result).toBeDefined();
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining(
            largeTemperatureRecords.map((record) =>
              expect.objectContaining({
                temperature: record.temperature,
                time: record.time,
                anomaly: TemperatureAnomalyType.NONE,
              }),
            ),
          ),
        }),
      );
    });

    it('devrait gérer les températures extrêmes selon le type de stockage', async () => {
      // Test avec chambre négative
      const negativeChamber = {
        ...mockColdStorage,
        type: ColdStorageType.NEGATIVE_CHAMBER,
      } as unknown as ColdStorage;

      const extremeTempDTO = {
        ...mockTemperatureDTO,
        temperatureRecords: [
          { temperature: -20.0, time: '09:00' }, // Normal pour une chambre négative (-24 à -16°C)
        ],
      };

      mockColdStorageRepository.findOneById.mockResolvedValue(negativeChamber);
      mockTemperatureRepository.findOptionalBy.mockResolvedValue(null);
      mockTemperatureRepository.insert.mockResolvedValue({
        _id: mockTemperatureId,
      });
      mockTemperatureRepository.findOneById.mockResolvedValue({
        ...mockColdStorageTemperature,
        coldStorageId: negativeChamber,
      });

      // Act
      const result = await service.createTemperatures([extremeTempDTO]);

      // Assert
      expect(result).toBeDefined();
      expect(temperatureRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          temperatureRecords: expect.arrayContaining([
            expect.objectContaining({
              anomaly: TemperatureAnomalyType.NONE,
            }),
          ]),
        }),
      );
    });
  });
});
