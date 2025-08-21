import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ColdStorageService } from '../modules/cold.storage/services/cold.storage.service';
import { ColdStorageRepository } from '../modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorage } from '../modules/cold.storage/models/cold.storage.model';
import { ColdStorageDTO } from '../modules/cold.storage/dto/cold.storage.dto';
import { ColdStoragePatchDTO } from '../modules/cold.storage/dto/cold.storage.patch.dto';
import { ColdStorageType } from '../common/utils/types/cold.storage.type';

describe('ColdStorageService', () => {
  let service: ColdStorageService;
  let repository: ColdStorageRepository;

  // Mock data
  const mockColdStorageId = '60f1b2b3b3b3b3b3b3b3b3b3';
  const mockColdStorage = {
    _id: mockColdStorageId,
    name: 'Chambre froide test',
    type: ColdStorageType.POSITIVE_CHAMBER,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as ColdStorage;

  const mockColdStorageArray = [
    mockColdStorage,
    {
      _id: '60f1b2b3b3b3b3b3b3b3b3b4',
      name: 'Chambre froide négative',
      type: ColdStorageType.NEGATIVE_CHAMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    } as unknown as ColdStorage,
  ];

  const mockColdStorageDTO: ColdStorageDTO = {
    name: 'Nouvelle chambre froide',
    type: ColdStorageType.SHOWCASE,
  };

  const mockColdStoragePatchDTO: ColdStoragePatchDTO = {
    name: 'Chambre froide modifiée',
  };

  // Mock repository
  const mockColdStorageRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    insert: jest.fn(),
    updateOneBy: jest.fn(),
    deleteOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColdStorageService,
        {
          provide: ColdStorageRepository,
          useValue: mockColdStorageRepository,
        },
      ],
    }).compile();

    service = module.get<ColdStorageService>(ColdStorageService);
    repository = module.get<ColdStorageRepository>(ColdStorageRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllColdStorages', () => {
    it('devrait retourner tous les cold storages avec succès', async () => {
      // Arrange
      mockColdStorageRepository.findAll.mockResolvedValue(mockColdStorageArray);

      // Act
      const result = await service.getAllColdStorages();

      // Assert
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockColdStorageArray);
      expect(result).toHaveLength(2);
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockColdStorageRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getAllColdStorages()).rejects.toThrow(InternalServerErrorException);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait retourner un tableau vide si aucun cold storage n\'existe', async () => {
      // Arrange
      mockColdStorageRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.getAllColdStorages();

      // Assert
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getColdStorageById', () => {
    it('devrait retourner un cold storage par son ID avec succès', async () => {
      // Arrange
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);

      // Act
      const result = await service.getColdStorageById(mockColdStorageId);

      // Assert
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
      expect(repository.findOneById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockColdStorage);
    });

    it('devrait lancer NotFoundException si le cold storage n\'existe pas', async () => {
      // Arrange
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getColdStorageById(mockColdStorageId)).rejects.toThrow(NotFoundException);
      await expect(service.getColdStorageById(mockColdStorageId)).rejects.toThrow(`Cold storage ${mockColdStorageId} not found`);
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockColdStorageRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getColdStorageById(mockColdStorageId)).rejects.toThrow(InternalServerErrorException);
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
    });

    it('devrait gérer les ID invalides', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const mockError = new BadRequestException('Invalid ObjectId format');
      mockColdStorageRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getColdStorageById(invalidId)).rejects.toThrow(BadRequestException);
      expect(repository.findOneById).toHaveBeenCalledWith(invalidId);
    });
  });

  describe('createColdStorage', () => {
    it('devrait créer un cold storage avec succès', async () => {
      // Arrange
      const mockInsertResult = { _id: mockColdStorageId };
      mockColdStorageRepository.insert.mockResolvedValue(mockInsertResult);
      mockColdStorageRepository.findOneById.mockResolvedValue(mockColdStorage);

      // Act
      const result = await service.createColdStorage(mockColdStorageDTO);

      // Assert
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockColdStorageDTO.name,
        type: mockColdStorageDTO.type,
      });
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
      expect(result).toEqual(mockColdStorage);
    });

    it('devrait gérer les erreurs de validation lors de la création', async () => {
      // Arrange
      const validationError = { name: 'ValidationError', message: 'Données invalides' };
      mockColdStorageRepository.insert.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.createColdStorage(mockColdStorageDTO)).rejects.toThrow(BadRequestException);
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockColdStorageDTO.name,
        type: mockColdStorageDTO.type,
      });
    });

    it('devrait gérer les erreurs de duplication (nom unique)', async () => {
      // Arrange
      const duplicateError = { code: 11000, message: 'Duplicate key error' };
      mockColdStorageRepository.insert.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(service.createColdStorage(mockColdStorageDTO)).rejects.toThrow(ConflictException);
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockColdStorageDTO.name,
        type: mockColdStorageDTO.type,
      });
    });

    it('devrait créer un cold storage avec tous les types disponibles', async () => {
      // Test avec chaque type de cold storage
      const types = Object.values(ColdStorageType);
      
      for (const type of types) {
        // Arrange
        const dtoWithType = { ...mockColdStorageDTO, type };
        const mockInsertResult = { _id: mockColdStorageId };
        const mockStorageWithType = { ...mockColdStorage, type } as unknown as ColdStorage;
        
        mockColdStorageRepository.insert.mockResolvedValue(mockInsertResult);
        mockColdStorageRepository.findOneById.mockResolvedValue(mockStorageWithType);

        // Act
        const result = await service.createColdStorage(dtoWithType);

        // Assert
        expect(repository.insert).toHaveBeenCalledWith({
          name: dtoWithType.name,
          type,
        });
        expect(result.type).toBe(type);
      }
    });

    it('devrait gérer les erreurs lors de la récupération après création', async () => {
      // Arrange
      const mockInsertResult = { _id: mockColdStorageId };
      mockColdStorageRepository.insert.mockResolvedValue(mockInsertResult);
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createColdStorage(mockColdStorageDTO)).rejects.toThrow(NotFoundException);
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockColdStorageDTO.name,
        type: mockColdStorageDTO.type,
      });
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
    });
  });

  describe('updateColdStorage', () => {
    it('devrait mettre à jour un cold storage avec succès', async () => {
      // Arrange
      mockColdStorageRepository.updateOneBy.mockResolvedValue(true);
      const updatedColdStorage = { ...mockColdStorage, ...mockColdStoragePatchDTO } as unknown as ColdStorage;
      mockColdStorageRepository.findOneById.mockResolvedValue(updatedColdStorage);

      // Act
      const result = await service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO);

      // Assert
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        mockColdStoragePatchDTO,
      );
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
      expect(result).toEqual(updatedColdStorage);
    });

    it('devrait lancer NotFoundException si le cold storage à mettre à jour n\'existe pas', async () => {
      // Arrange
      mockColdStorageRepository.updateOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO),
      ).rejects.toThrow(`Cold storage ${mockColdStorageId} not found`);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        mockColdStoragePatchDTO,
      );
    });

    it('devrait mettre à jour seulement le nom', async () => {
      // Arrange
      const nameOnlyUpdate: ColdStoragePatchDTO = { name: 'Nouveau nom seulement' };
      mockColdStorageRepository.updateOneBy.mockResolvedValue(true);
      const updatedColdStorage = { ...mockColdStorage, name: nameOnlyUpdate.name } as unknown as ColdStorage;
      mockColdStorageRepository.findOneById.mockResolvedValue(updatedColdStorage);

      // Act
      const result = await service.updateColdStorage(mockColdStorageId, nameOnlyUpdate);

      // Assert
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        nameOnlyUpdate,
      );
      expect(result.name).toBe(nameOnlyUpdate.name);
    });

    it('devrait mettre à jour seulement le type', async () => {
      // Arrange
      const typeOnlyUpdate: ColdStoragePatchDTO = { type: ColdStorageType.NEGATIVE_CHAMBER };
      mockColdStorageRepository.updateOneBy.mockResolvedValue(true);
      const updatedColdStorage = { ...mockColdStorage, type: typeOnlyUpdate.type } as unknown as ColdStorage;
      mockColdStorageRepository.findOneById.mockResolvedValue(updatedColdStorage);

      // Act
      const result = await service.updateColdStorage(mockColdStorageId, typeOnlyUpdate);

      // Assert
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        typeOnlyUpdate,
      );
      expect(result.type).toBe(typeOnlyUpdate.type);
    });

    it('devrait gérer les erreurs de validation lors de la mise à jour', async () => {
      // Arrange
      const validationError = { name: 'ValidationError', message: 'Données invalides' };
      mockColdStorageRepository.updateOneBy.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO),
      ).rejects.toThrow(BadRequestException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        mockColdStoragePatchDTO,
      );
    });

    it('devrait gérer les erreurs de duplication lors de la mise à jour', async () => {
      // Arrange
      const duplicateError = { code: 11000, message: 'Duplicate key error' };
      mockColdStorageRepository.updateOneBy.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(
        service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO),
      ).rejects.toThrow(ConflictException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        mockColdStoragePatchDTO,
      );
    });

    it('devrait gérer les erreurs lors de la récupération après mise à jour', async () => {
      // Arrange
      mockColdStorageRepository.updateOneBy.mockResolvedValue(true);
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateColdStorage(mockColdStorageId, mockColdStoragePatchDTO),
      ).rejects.toThrow(NotFoundException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockColdStorageId },
        mockColdStoragePatchDTO,
      );
      expect(repository.findOneById).toHaveBeenCalledWith(mockColdStorageId);
    });
  });

  describe('deleteColdStorage', () => {
    it('devrait supprimer un cold storage avec succès', async () => {
      // Arrange
      mockColdStorageRepository.deleteOneBy.mockResolvedValue(true);

      // Act
      await service.deleteColdStorage(mockColdStorageId);

      // Assert
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockColdStorageId,
      });
      expect(repository.deleteOneBy).toHaveBeenCalledTimes(1);
    });

    it('devrait lancer NotFoundException si le cold storage à supprimer n\'existe pas', async () => {
      // Arrange
      mockColdStorageRepository.deleteOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.deleteColdStorage(mockColdStorageId)).rejects.toThrow(NotFoundException);
      await expect(service.deleteColdStorage(mockColdStorageId)).rejects.toThrow(`Cold storage ${mockColdStorageId} not found`);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockColdStorageId,
      });
    });

    it('devrait gérer les erreurs de repository lors de la suppression', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockColdStorageRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.deleteColdStorage(mockColdStorageId)).rejects.toThrow(InternalServerErrorException);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockColdStorageId,
      });
    });

    it('devrait gérer les ID invalides lors de la suppression', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const mockError = new BadRequestException('Invalid ObjectId format');
      mockColdStorageRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.deleteColdStorage(invalidId)).rejects.toThrow(BadRequestException);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: invalidId,
      });
    });
  });

  describe('Gestion des erreurs générales', () => {
    it('devrait gérer les erreurs inattendues', async () => {
      // Arrange
      const unexpectedError = new Error('Erreur inattendue');
      mockColdStorageRepository.findAll.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(service.getAllColdStorages()).rejects.toThrow(InternalServerErrorException);
    });

    it('devrait préserver les HttpExceptions existantes', async () => {
      // Arrange
      const httpException = new BadRequestException('Erreur HTTP existante');
      mockColdStorageRepository.findAll.mockRejectedValue(httpException);

      // Act & Assert
      await expect(service.getAllColdStorages()).rejects.toThrow(BadRequestException);
      await expect(service.getAllColdStorages()).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('Intégration avec BaseService', () => {
    it('devrait utiliser assertFound pour vérifier l\'existence des entités', async () => {
      // Arrange
      mockColdStorageRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getColdStorageById(mockColdStorageId)).rejects.toThrow(NotFoundException);
    });

    it('devrait utiliser handleError pour gérer les exceptions', async () => {
      // Arrange
      const error = new Error('Test error');
      mockColdStorageRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getAllColdStorages()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Tests de performance et limites', () => {
    it('devrait gérer un grand nombre de cold storages', async () => {
      // Arrange
      const largeColdStorageArray = Array.from({ length: 1000 }, (_, index) => ({
        ...mockColdStorage,
        _id: `60f1b2b3b3b3b3b3b3b3b3${index.toString().padStart(3, '0')}`,
        name: `Cold Storage ${index}`,
      }));
      mockColdStorageRepository.findAll.mockResolvedValue(largeColdStorageArray);

      // Act
      const result = await service.getAllColdStorages();

      // Assert
      expect(result).toHaveLength(1000);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les noms de cold storage très longs', async () => {
      // Arrange
      const longNameDTO: ColdStorageDTO = {
        name: 'x'.repeat(50), // Limite maximale selon le DTO
        type: ColdStorageType.POSITIVE_CHAMBER,
      };
      const mockInsertResult = { _id: mockColdStorageId };
      const mockStorageWithLongName = { ...mockColdStorage, name: longNameDTO.name } as unknown as ColdStorage;
      
      mockColdStorageRepository.insert.mockResolvedValue(mockInsertResult);
      mockColdStorageRepository.findOneById.mockResolvedValue(mockStorageWithLongName);

      // Act
      const result = await service.createColdStorage(longNameDTO);

      // Assert
      expect(result.name).toBe(longNameDTO.name);
      expect(result.name).toHaveLength(50);
    });
  });
});
