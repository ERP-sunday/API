import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OilCheckService } from '../modules/oil.check/services/oil.check.service';
import { OilCheckRepository } from '../modules/oil.check/repositories/oil.check.repository';
import { FryerRepository } from '../modules/fryer/repositories/fryer.repository';
import {
  OilCheck,
  OilTestMethod,
  OilActionToDoType,
  OilCorrectiveActionType,
} from '../modules/oil.check/models/oil.check.model';
import { OilCheckDTO } from '../modules/oil.check/dto/oil.check.dto';
import { OilCheckPatchDTO } from '../modules/oil.check/dto/oil.check.patch.dto';
import { OilStatus } from '../modules/oil.check/enums/oil.status.enum';
import { DateRangeFilter } from '../common/filters/date.range.filter';
import { Fryer } from '../modules/fryer/models/fryer.model';

describe('OilCheckService', () => {
  let service: OilCheckService;
  let oilCheckRepository: OilCheckRepository;
  let fryerRepository: FryerRepository;

  // Mock data
  const mockFryerId = new Types.ObjectId('60f1b2b3b3b3b3b3b3b3b3b3');
  const mockOilCheckId = new Types.ObjectId('60f1b2b3b3b3b3b3b3b3b3b4');

  const mockFryer = {
    _id: mockFryerId,
    name: 'Friteuse Test',
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as Fryer;

  const mockOilCheck = {
    _id: mockOilCheckId,
    fryer: mockFryer,
    date: new Date('2024-03-20T00:00:00.000Z'),
    testMethod: OilTestMethod.DIGITAL_TESTER,
    actionToDo: OilActionToDoType.REUSED,
    correctiveAction: OilCorrectiveActionType.NO_ACTION,
    polarPercentage: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as OilCheck;

  const mockFryerArray = [
    mockFryer,
    {
      _id: new Types.ObjectId('60f1b2b3b3b3b3b3b3b3b3b5'),
      name: 'Friteuse Principale',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    } as unknown as Fryer,
  ];

  const mockOilCheckDTO: OilCheckDTO = {
    fryerId: mockFryerId.toString(),
    testMethod: OilTestMethod.DIGITAL_TESTER,
    date: '2024-03-20',
    actionToDo: OilActionToDoType.REUSED,
    correctiveAction: OilCorrectiveActionType.NO_ACTION,
    polarPercentage: 20,
  };

  const mockOilCheckPatchDTO: OilCheckPatchDTO = {
    testMethod: OilTestMethod.TEST_STRIP,
    actionToDo: OilActionToDoType.FILTERED_AND_REUSED,
    correctiveAction: OilCorrectiveActionType.CHANGE_OIL,
    date: '2024-03-21',
    fryerId: mockFryerId.toString(),
  };

  const mockDateRangeFilter = new DateRangeFilter({
    year: 2024,
    month: 3,
    day: 20,
  });

  // Mock repositories
  const mockOilCheckRepository = {
    findManyBy: jest.fn(),
    findOneById: jest.fn(),
    insert: jest.fn(),
    updateOneBy: jest.fn(),
    deleteOneBy: jest.fn(),
  };

  const mockFryerRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OilCheckService,
        {
          provide: OilCheckRepository,
          useValue: mockOilCheckRepository,
        },
        {
          provide: FryerRepository,
          useValue: mockFryerRepository,
        },
      ],
    }).compile();

    service = module.get<OilCheckService>(OilCheckService);
    oilCheckRepository = module.get<OilCheckRepository>(OilCheckRepository);
    fryerRepository = module.get<FryerRepository>(FryerRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllOilChecks', () => {
    it("devrait retourner tous les contrôles d'huile avec succès", async () => {
      // Arrange
      const mockOilChecks = [mockOilCheck];
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue(mockOilChecks);

      // Act
      const result = await service.getAllOilChecks(mockDateRangeFilter);

      // Assert
      expect(fryerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(oilCheckRepository.findManyBy).toHaveBeenCalledTimes(1);
      expect(oilCheckRepository.findManyBy).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.objectContaining({
            $gte: expect.any(Date),
            $lte: expect.any(Date),
          }),
        }),
        expect.objectContaining({
          populate: [{ path: 'fryer' }],
        }),
      );
      expect(result).toHaveLength(2); // Un avec contrôle, un sans
      expect(result[0].fryer).toEqual(mockFryer);
    });

    it('devrait retourner des objets par défaut pour les friteuses sans contrôle', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getAllOilChecks(mockDateRangeFilter);

      // Assert
      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item._id).toBeNull();
        expect(item.testMethod).toBe(OilTestMethod.NO_TEST);
        expect(item.actionToDo).toBe(OilActionToDoType.NO_ACTION);
        expect(item.correctiveAction).toBe(OilCorrectiveActionType.NO_ACTION);
        expect(item.polarPercentage).toBeNull();
      });
    });

    it('devrait construire correctement le filtre de date UTC', async () => {
      // Arrange
      const filter = new DateRangeFilter({ year: 2024, month: 3, day: 15 });
      mockFryerRepository.findAll.mockResolvedValue([]);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      await service.getAllOilChecks(filter);

      // Assert
      const expectedStartDate = new Date(Date.UTC(2024, 2, 15)); // month - 1
      const expectedEndDate = new Date(Date.UTC(2024, 2, 15, 23, 59, 59, 999));

      expect(oilCheckRepository.findManyBy).toHaveBeenCalledWith(
        {
          date: {
            $gte: expectedStartDate,
            $lte: expectedEndDate,
          },
        },
        expect.any(Object),
      );
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockFryerRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.getAllOilChecks(mockDateRangeFilter),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOilCheckById', () => {
    it("devrait retourner un contrôle d'huile par son ID avec succès", async () => {
      // Arrange
      mockOilCheckRepository.findOneById.mockResolvedValue(mockOilCheck);

      // Act
      const result = await service.getOilCheckById(mockOilCheckId.toString());

      // Assert
      expect(oilCheckRepository.findOneById).toHaveBeenCalledWith(
        mockOilCheckId.toString(),
        {
          populate: [{ path: 'fryer' }],
        },
      );
      expect(result).toEqual(mockOilCheck);
    });

    it("devrait lancer NotFoundException si le contrôle n'existe pas", async () => {
      // Arrange
      mockOilCheckRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow(`OilCheck ${mockOilCheckId.toString()} not found`);
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockOilCheckRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createOilCheck', () => {
    it("devrait créer un contrôle d'huile avec succès", async () => {
      // Arrange
      const mockInsertResult = { _id: mockOilCheckId };
      mockOilCheckRepository.insert.mockResolvedValue(mockInsertResult);
      mockOilCheckRepository.findOneById.mockResolvedValue(mockOilCheck);

      // Act
      const result = await service.createOilCheck(mockOilCheckDTO);

      // Assert
      expect(oilCheckRepository.insert).toHaveBeenCalledWith({
        fryer: new Types.ObjectId(mockOilCheckDTO.fryerId),
        testMethod: mockOilCheckDTO.testMethod,
        actionToDo: mockOilCheckDTO.actionToDo,
        correctiveAction: mockOilCheckDTO.correctiveAction,
        date: new Date(mockOilCheckDTO.date),
        polarPercentage: mockOilCheckDTO.polarPercentage,
      });
      expect(oilCheckRepository.findOneById).toHaveBeenCalledWith(
        mockOilCheckId.toString(),
        {
          populate: [{ path: 'fryer' }],
        },
      );
      expect(result).toEqual(mockOilCheck);
    });

    it('devrait créer un contrôle sans pourcentage polaire (TEST_STRIP)', async () => {
      // Arrange
      const dtoWithoutPolar: OilCheckDTO = {
        ...mockOilCheckDTO,
        testMethod: OilTestMethod.TEST_STRIP,
        polarPercentage: null,
      };
      const mockInsertResult = { _id: mockOilCheckId };
      mockOilCheckRepository.insert.mockResolvedValue(mockInsertResult);
      mockOilCheckRepository.findOneById.mockResolvedValue(mockOilCheck);

      // Act
      const result = await service.createOilCheck(dtoWithoutPolar);

      // Assert
      expect(oilCheckRepository.insert).toHaveBeenCalledWith({
        fryer: new Types.ObjectId(dtoWithoutPolar.fryerId),
        testMethod: dtoWithoutPolar.testMethod,
        actionToDo: dtoWithoutPolar.actionToDo,
        correctiveAction: dtoWithoutPolar.correctiveAction,
        date: new Date(dtoWithoutPolar.date),
        polarPercentage: null,
      });
      expect(result).toEqual(mockOilCheck);
    });

    it('devrait gérer les erreurs de validation lors de la création', async () => {
      // Arrange
      const validationError = {
        name: 'ValidationError',
        message: 'Données invalides',
      };
      mockOilCheckRepository.insert.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.createOilCheck(mockOilCheckDTO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait gérer les erreurs de duplication', async () => {
      // Arrange
      const duplicateError = { code: 11000, message: 'Duplicate key error' };
      mockOilCheckRepository.insert.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(service.createOilCheck(mockOilCheckDTO)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateOilCheck', () => {
    it("devrait mettre à jour un contrôle d'huile avec succès", async () => {
      // Arrange
      const updatedOilCheck = {
        ...mockOilCheck,
        testMethod: mockOilCheckPatchDTO.testMethod,
        actionToDo: mockOilCheckPatchDTO.actionToDo,
        correctiveAction: mockOilCheckPatchDTO.correctiveAction,
      };

      mockOilCheckRepository.updateOneBy.mockResolvedValue(true);
      mockOilCheckRepository.findOneById.mockResolvedValue(updatedOilCheck);

      // Act
      const result = await service.updateOilCheck(
        mockOilCheckId.toString(),
        mockOilCheckPatchDTO,
      );

      // Assert
      expect(oilCheckRepository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockOilCheckId.toString() },
        {
          ...mockOilCheckPatchDTO,
          date: new Date(mockOilCheckPatchDTO.date),
          fryer: new Types.ObjectId(mockOilCheckPatchDTO.fryerId),
        },
      );
      expect(result).toEqual(updatedOilCheck);
    });

    it("devrait lancer NotFoundException si le contrôle à mettre à jour n'existe pas", async () => {
      // Arrange
      mockOilCheckRepository.updateOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateOilCheck(mockOilCheckId.toString(), mockOilCheckPatchDTO),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateOilCheck(mockOilCheckId.toString(), mockOilCheckPatchDTO),
      ).rejects.toThrow(`OilCheck ${mockOilCheckId.toString()} not found`);
    });

    it('devrait gérer les erreurs de validation lors de la mise à jour', async () => {
      // Arrange
      const validationError = {
        name: 'ValidationError',
        message: 'Données invalides',
      };
      mockOilCheckRepository.updateOneBy.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        service.updateOilCheck(mockOilCheckId.toString(), mockOilCheckPatchDTO),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOilCheck', () => {
    it("devrait supprimer un contrôle d'huile avec succès", async () => {
      // Arrange
      mockOilCheckRepository.deleteOneBy.mockResolvedValue(true);

      // Act
      await service.deleteOilCheck(mockOilCheckId.toString());

      // Assert
      expect(oilCheckRepository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockOilCheckId.toString(),
      });
      expect(oilCheckRepository.deleteOneBy).toHaveBeenCalledTimes(1);
    });

    it("devrait lancer NotFoundException si le contrôle à supprimer n'existe pas", async () => {
      // Arrange
      mockOilCheckRepository.deleteOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.deleteOilCheck(mockOilCheckId.toString()),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.deleteOilCheck(mockOilCheckId.toString()),
      ).rejects.toThrow(`OilCheck ${mockOilCheckId.toString()} not found`);
    });

    it('devrait gérer les erreurs de repository lors de la suppression', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockOilCheckRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        service.deleteOilCheck(mockOilCheckId.toString()),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOilStatusRange', () => {
    const mockOilChecksWithAnomalies = [
      {
        _id: mockOilCheckId,
        date: new Date('2024-03-20T00:00:00.000Z'),
        testMethod: OilTestMethod.DIGITAL_TESTER,
        polarPercentage: 30, // > 24% = anomalie
        correctiveAction: OilCorrectiveActionType.NO_ACTION,
      },
      {
        _id: new Types.ObjectId(),
        date: new Date('2024-03-20T00:00:00.000Z'),
        testMethod: OilTestMethod.DIGITAL_TESTER,
        polarPercentage: 20,
        correctiveAction: OilCorrectiveActionType.CHANGE_OIL, // anomalie
      },
    ];

    it("devrait retourner le statut de l'huile pour une plage de dates", async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-22',
      );

      // Assert
      expect(fryerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(oilCheckRepository.findManyBy).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.objectContaining({
            $gte: expect.any(Date),
            $lte: expect.any(Date),
          }),
        }),
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('anomalyCount');
      expect(result[0]).toHaveProperty('completedFryersCount');
      expect(result[0]).toHaveProperty('totalFryersCount');
    });

    it('devrait détecter les anomalies critiques (multiple anomalies)', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue(
        mockOilChecksWithAnomalies,
      );

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      const statusForDate = result.find((item) => item.date === '2024-03-20');
      expect(statusForDate?.status).toBe(OilStatus.CRITICAL);
      expect(statusForDate?.anomalyCount).toBe(2);
    });

    it("devrait détecter les anomalies d'avertissement (une anomalie)", async () => {
      // Arrange
      const oneAnomalyCheck = [mockOilChecksWithAnomalies[0]]; // Seulement une anomalie
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue(oneAnomalyCheck);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      const statusForDate = result.find((item) => item.date === '2024-03-20');
      expect(statusForDate?.status).toBe(OilStatus.WARNING);
      expect(statusForDate?.anomalyCount).toBe(1);
    });

    it('devrait détecter le statut normal (aucune anomalie, tous contrôles effectués)', async () => {
      // Arrange
      const normalChecks = [
        {
          _id: mockOilCheckId,
          date: new Date('2024-03-20T00:00:00.000Z'),
          testMethod: OilTestMethod.DIGITAL_TESTER,
          polarPercentage: 20, // < 24% = normal
          correctiveAction: OilCorrectiveActionType.NO_ACTION,
        },
        {
          _id: new Types.ObjectId(),
          date: new Date('2024-03-20T00:00:00.000Z'),
          testMethod: OilTestMethod.TEST_STRIP,
          polarPercentage: null,
          correctiveAction: OilCorrectiveActionType.NO_ACTION,
        },
      ];
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue(normalChecks);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      const statusForDate = result.find((item) => item.date === '2024-03-20');
      expect(statusForDate?.status).toBe(OilStatus.NORMAL);
      expect(statusForDate?.anomalyCount).toBe(0);
      expect(statusForDate?.completedFryersCount).toBe(2);
    });

    it("devrait utiliser des dates par défaut si aucune date n'est fournie (mois en cours)", async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getOilStatusRange();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      // Devrait avoir au moins les jours du mois en cours
    });

    it("devrait utiliser la date de fin jusqu'à aujourd'hui si seulement startDate est fournie", async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getOilStatusRange('2024-03-01');

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('devrait utiliser un mois avant endDate si seulement endDate est fournie', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getOilStatusRange(undefined, '2024-03-31');

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('devrait trier les résultats par date', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([]);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-22',
      );

      // Assert
      for (let i = 1; i < result.length; i++) {
        expect(new Date(result[i].date)).toBeInstanceOf(Date);
        expect(
          result[i].date.localeCompare(result[i - 1].date),
        ).toBeGreaterThanOrEqual(0);
      }
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockFryerRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getOilStatusRange()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Gestion des erreurs générales', () => {
    it('devrait gérer les erreurs inattendues', async () => {
      // Arrange
      const unexpectedError = new Error('Erreur inattendue');
      mockOilCheckRepository.findManyBy.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(
        service.getAllOilChecks(mockDateRangeFilter),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('devrait préserver les HttpExceptions existantes', async () => {
      // Arrange
      const httpException = new BadRequestException('Erreur HTTP existante');
      mockOilCheckRepository.findOneById.mockRejectedValue(httpException);

      // Act & Assert
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('Intégration avec BaseService', () => {
    it("devrait utiliser assertFound pour vérifier l'existence des entités", async () => {
      // Arrange
      mockOilCheckRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getOilCheckById(mockOilCheckId.toString()),
      ).rejects.toThrow(NotFoundException);
    });

    it('devrait utiliser handleError pour gérer les exceptions', async () => {
      // Arrange
      const error = new Error('Test error');
      mockOilCheckRepository.findManyBy.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.getAllOilChecks(mockDateRangeFilter),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Tests de performance et cas limites', () => {
    it("devrait gérer un grand nombre de contrôles d'huile", async () => {
      // Arrange
      const largeOilCheckArray = Array.from({ length: 1000 }, (_, index) => ({
        ...mockOilCheck,
        _id: new Types.ObjectId(),
        date: new Date(`2024-03-${(index % 30) + 1}`),
      }));
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue(largeOilCheckArray);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-01',
        '2024-03-31',
      );

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(fryerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(oilCheckRepository.findManyBy).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les pourcentages polaires limites (exactement 24%)', async () => {
      // Arrange
      const limitCheck = {
        ...mockOilCheck,
        testMethod: OilTestMethod.DIGITAL_TESTER,
        polarPercentage: 24, // Exactement à la limite
        correctiveAction: OilCorrectiveActionType.NO_ACTION,
      };
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([limitCheck]);

      // Act
      const result = await service.getOilStatusRange(
        '2024-03-20',
        '2024-03-20',
      );

      // Assert
      const statusForDate = result.find((item) => item.date === '2024-03-20');
      expect(statusForDate?.anomalyCount).toBe(0); // 24% n'est pas > 24%
    });

    it('devrait gérer les opérations simultanées', async () => {
      // Arrange
      const operations = [
        () => service.getAllOilChecks(mockDateRangeFilter),
        () => service.getOilCheckById(mockOilCheckId.toString()),
        () => service.createOilCheck(mockOilCheckDTO),
      ];

      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockOilCheckRepository.findManyBy.mockResolvedValue([mockOilCheck]);
      mockOilCheckRepository.findOneById.mockResolvedValue(mockOilCheck);
      mockOilCheckRepository.insert.mockResolvedValue({ _id: mockOilCheckId });

      // Act
      const results = await Promise.all(operations.map((op) => op()));

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0]).toHaveLength(2); // getAllOilChecks
      expect(results[1]).toEqual(mockOilCheck); // getOilCheckById
      expect(results[2]).toEqual(mockOilCheck); // createOilCheck
    });
  });
});
