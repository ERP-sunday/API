import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FryerService } from '../modules/fryer/services/fryer.service';
import { FryerRepository } from '../modules/fryer/repositories/fryer.repository';
import { Fryer } from '../modules/fryer/models/fryer.model';
import { FryerDTO } from '../modules/fryer/dto/fryer.dto';

describe('FryerService', () => {
  let service: FryerService;
  let repository: FryerRepository;

  // Mock data
  const mockFryerId = '60f1b2b3b3b3b3b3b3b3b3b3';
  const mockFryer = {
    _id: mockFryerId,
    name: 'Friteuse Test',
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  } as unknown as Fryer;

  const mockFryerArray = [
    mockFryer,
    {
      _id: '60f1b2b3b3b3b3b3b3b3b3b4',
      name: 'Friteuse Principale',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    } as unknown as Fryer,
  ];

  const mockFryerDTO: FryerDTO = {
    name: 'Nouvelle Friteuse',
  };

  // Mock repository
  const mockFryerRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    insert: jest.fn(),
    updateOneBy: jest.fn(),
    deleteOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FryerService,
        {
          provide: FryerRepository,
          useValue: mockFryerRepository,
        },
      ],
    }).compile();

    service = module.get<FryerService>(FryerService);
    repository = module.get<FryerRepository>(FryerRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllFryers', () => {
    it('devrait retourner toutes les friteuses avec succès', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);

      // Act
      const result = await service.getAllFryers();

      // Assert
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFryerArray);
      expect(result).toHaveLength(2);
    });

    it('devrait retourner un tableau vide si aucune friteuse n\'existe', async () => {
      // Arrange
      mockFryerRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.getAllFryers();

      // Assert
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockFryerRepository.findAll.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getAllFryers()).rejects.toThrow(InternalServerErrorException);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs HTTP existantes', async () => {
      // Arrange
      const httpError = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.findAll.mockRejectedValue(httpError);

      // Act & Assert
      await expect(service.getAllFryers()).rejects.toThrow(BadRequestException);
      await expect(service.getAllFryers()).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('getFryerById', () => {
    it('devrait retourner une friteuse par son ID avec succès', async () => {
      // Arrange
      mockFryerRepository.findOneById.mockResolvedValue(mockFryer);

      // Act
      const result = await service.getFryerById(mockFryerId);

      // Assert
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
      expect(repository.findOneById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFryer);
    });

    it('devrait lancer NotFoundException si la friteuse n\'existe pas', async () => {
      // Arrange
      mockFryerRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow(NotFoundException);
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow(`Fryer ${mockFryerId} not found`);
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
    });

    it('devrait gérer les erreurs de repository', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockFryerRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow(InternalServerErrorException);
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
    });

    it('devrait gérer les ID invalides', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const mockError = new BadRequestException('Invalid ObjectId format');
      mockFryerRepository.findOneById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getFryerById(invalidId)).rejects.toThrow(BadRequestException);
      expect(repository.findOneById).toHaveBeenCalledWith(invalidId);
    });

    it('devrait gérer les erreurs HTTP existantes', async () => {
      // Arrange
      const httpError = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.findOneById.mockRejectedValue(httpError);

      // Act & Assert
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow(BadRequestException);
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('createFryer', () => {
    it('devrait créer une friteuse avec succès', async () => {
      // Arrange
      const mockInsertResult = { _id: mockFryerId };
      mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
      mockFryerRepository.findOneById.mockResolvedValue(mockFryer);

      // Act
      const result = await service.createFryer(mockFryerDTO);

      // Assert
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockFryerDTO.name,
      });
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
      expect(result).toEqual(mockFryer);
    });

    it('devrait gérer les erreurs de validation lors de la création', async () => {
      // Arrange
      const validationError = { name: 'ValidationError', message: 'Données invalides' };
      mockFryerRepository.insert.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.createFryer(mockFryerDTO)).rejects.toThrow(BadRequestException);
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockFryerDTO.name,
      });
    });

    it('devrait gérer les erreurs de duplication (nom unique)', async () => {
      // Arrange
      const duplicateError = { code: 11000, message: 'Duplicate key error' };
      mockFryerRepository.insert.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(service.createFryer(mockFryerDTO)).rejects.toThrow(ConflictException);
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockFryerDTO.name,
      });
    });

    it('devrait créer une friteuse avec un nom à la limite maximale', async () => {
      // Arrange
      const longNameDTO: FryerDTO = {
        name: 'x'.repeat(50), // Limite maximale selon le DTO
      };
      const mockInsertResult = { _id: mockFryerId };
      const mockFryerWithLongName = { ...mockFryer, name: longNameDTO.name } as unknown as Fryer;
      
      mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
      mockFryerRepository.findOneById.mockResolvedValue(mockFryerWithLongName);

      // Act
      const result = await service.createFryer(longNameDTO);

      // Assert
      expect(repository.insert).toHaveBeenCalledWith({
        name: longNameDTO.name,
      });
      expect(result.name).toBe(longNameDTO.name);
      expect(result.name).toHaveLength(50);
    });

    it('devrait gérer les erreurs lors de la récupération après création', async () => {
      // Arrange
      const mockInsertResult = { _id: mockFryerId };
      mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
      mockFryerRepository.findOneById.mockResolvedValue(null);

      // Act
      const result = await service.createFryer(mockFryerDTO);

      // Assert
      expect(repository.insert).toHaveBeenCalledWith({
        name: mockFryerDTO.name,
      });
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
      expect(result).toBeNull(); // Le service retourne null si findOneById retourne null
    });

    it('devrait créer plusieurs friteuses avec des noms différents', async () => {
      // Arrange
      const fryerNames = ['Friteuse 1', 'Friteuse 2', 'Friteuse Principale', 'Friteuse Secondaire'];
      
      for (const name of fryerNames) {
        const dto = { name };
        const mockInsertResult = { _id: mockFryerId };
        const mockCreatedFryer = { ...mockFryer, name } as unknown as Fryer;
        
        mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
        mockFryerRepository.findOneById.mockResolvedValue(mockCreatedFryer);

        // Act
        const result = await service.createFryer(dto);

        // Assert
        expect(result.name).toBe(name);
      }
    });

    it('devrait gérer les erreurs HTTP existantes lors de la création', async () => {
      // Arrange
      const httpError = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.insert.mockRejectedValue(httpError);

      // Act & Assert
      await expect(service.createFryer(mockFryerDTO)).rejects.toThrow(BadRequestException);
      await expect(service.createFryer(mockFryerDTO)).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('updateFryer', () => {
    it('devrait mettre à jour une friteuse avec succès', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Modifiée' };
      const updatedFryer = { ...mockFryer, name: updateDTO.name } as unknown as Fryer;
      
      mockFryerRepository.updateOneBy.mockResolvedValue(true);
      mockFryerRepository.findOneById.mockResolvedValue(updatedFryer);

      // Act
      const result = await service.updateFryer(mockFryerId, updateDTO);

      // Assert
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockFryerId },
        updateDTO,
      );
      expect(repository.findOneById).toHaveBeenCalledWith(mockFryerId);
      expect(result).toEqual(updatedFryer);
      expect(result.name).toBe(updateDTO.name);
    });

    it('devrait lancer NotFoundException si la friteuse à mettre à jour n\'existe pas', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Modifiée' };
      mockFryerRepository.updateOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(NotFoundException);
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(`Fryer ${mockFryerId} not found`);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockFryerId },
        updateDTO,
      );
    });

    it('devrait gérer les erreurs de validation lors de la mise à jour', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Modifiée' };
      const validationError = { name: 'ValidationError', message: 'Données invalides' };
      mockFryerRepository.updateOneBy.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(BadRequestException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockFryerId },
        updateDTO,
      );
    });

    it('devrait gérer les erreurs de duplication lors de la mise à jour', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Existante' };
      const duplicateError = { code: 11000, message: 'Duplicate key error' };
      mockFryerRepository.updateOneBy.mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(ConflictException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockFryerId },
        updateDTO,
      );
    });

    it('devrait mettre à jour avec un nom très long', async () => {
      // Arrange
      const longNameDTO: FryerDTO = { name: 'x'.repeat(50) };
      const updatedFryer = { ...mockFryer, name: longNameDTO.name } as unknown as Fryer;
      
      mockFryerRepository.updateOneBy.mockResolvedValue(true);
      mockFryerRepository.findOneById.mockResolvedValue(updatedFryer);

      // Act
      const result = await service.updateFryer(mockFryerId, longNameDTO);

      // Assert
      expect(result.name).toBe(longNameDTO.name);
      expect(result.name).toHaveLength(50);
    });

    it('devrait gérer les erreurs lors de la récupération après mise à jour', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Modifiée' };
      mockFryerRepository.updateOneBy.mockResolvedValue(true);
      mockFryerRepository.findOneById.mockRejectedValue(new Error('Erreur de récupération'));

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(InternalServerErrorException);
      expect(repository.updateOneBy).toHaveBeenCalledWith(
        { _id: mockFryerId },
        updateDTO,
      );
    });

    it('devrait gérer les erreurs HTTP existantes lors de la mise à jour', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Friteuse Modifiée' };
      const httpError = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.updateOneBy.mockRejectedValue(httpError);

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(BadRequestException);
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow('Erreur HTTP existante');
    });
  });

  describe('deleteFryer', () => {
    it('devrait supprimer une friteuse avec succès', async () => {
      // Arrange
      mockFryerRepository.deleteOneBy.mockResolvedValue(true);

      // Act
      await service.deleteFryer(mockFryerId);

      // Assert
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockFryerId,
      });
      expect(repository.deleteOneBy).toHaveBeenCalledTimes(1);
    });

    it('devrait lancer NotFoundException si la friteuse à supprimer n\'existe pas', async () => {
      // Arrange
      mockFryerRepository.deleteOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow(NotFoundException);
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow(`Fryer ${mockFryerId} not found`);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockFryerId,
      });
    });

    it('devrait gérer les erreurs de repository lors de la suppression', async () => {
      // Arrange
      const mockError = new Error('Erreur de base de données');
      mockFryerRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow(InternalServerErrorException);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: mockFryerId,
      });
    });

    it('devrait gérer les ID invalides lors de la suppression', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const mockError = new BadRequestException('Invalid ObjectId format');
      mockFryerRepository.deleteOneBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.deleteFryer(invalidId)).rejects.toThrow(BadRequestException);
      expect(repository.deleteOneBy).toHaveBeenCalledWith({
        _id: invalidId,
      });
    });

    it('devrait gérer les erreurs HTTP existantes lors de la suppression', async () => {
      // Arrange
      const httpError = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.deleteOneBy.mockRejectedValue(httpError);

      // Act & Assert
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow(BadRequestException);
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow('Erreur HTTP existante');
    });

    it('devrait supprimer plusieurs friteuses successivement', async () => {
      // Arrange
      const fryerIds = ['id1', 'id2', 'id3'];
      mockFryerRepository.deleteOneBy.mockResolvedValue(true);

      // Act & Assert
      for (const id of fryerIds) {
        await service.deleteFryer(id);
        expect(repository.deleteOneBy).toHaveBeenCalledWith({ _id: id });
      }
      expect(repository.deleteOneBy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Gestion des erreurs générales', () => {
    it('devrait gérer les erreurs inattendues', async () => {
      // Arrange
      const unexpectedError = new Error('Erreur inattendue');
      mockFryerRepository.findAll.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(service.getAllFryers()).rejects.toThrow(InternalServerErrorException);
    });

    it('devrait préserver les HttpExceptions existantes', async () => {
      // Arrange
      const httpException = new BadRequestException('Erreur HTTP existante');
      mockFryerRepository.findAll.mockRejectedValue(httpException);

      // Act & Assert
      await expect(service.getAllFryers()).rejects.toThrow(BadRequestException);
      await expect(service.getAllFryers()).rejects.toThrow('Erreur HTTP existante');
    });

    it('devrait gérer les erreurs de conflit (11000)', async () => {
      // Arrange
      const conflictError = { code: 11000, message: 'Duplicate entry' };
      mockFryerRepository.insert.mockRejectedValue(conflictError);

      // Act & Assert
      await expect(service.createFryer(mockFryerDTO)).rejects.toThrow(ConflictException);
    });
  });

  describe('Intégration avec BaseService', () => {
    it('devrait utiliser assertFound pour vérifier l\'existence des entités', async () => {
      // Arrange
      mockFryerRepository.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getFryerById(mockFryerId)).rejects.toThrow(NotFoundException);
    });

    it('devrait utiliser handleError pour gérer les exceptions', async () => {
      // Arrange
      const error = new Error('Test error');
      mockFryerRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getAllFryers()).rejects.toThrow(InternalServerErrorException);
    });

    it('devrait utiliser assertFound dans updateFryer', async () => {
      // Arrange
      const updateDTO: FryerDTO = { name: 'Test' };
      mockFryerRepository.updateOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.updateFryer(mockFryerId, updateDTO)).rejects.toThrow(NotFoundException);
    });

    it('devrait utiliser assertFound dans deleteFryer', async () => {
      // Arrange
      mockFryerRepository.deleteOneBy.mockResolvedValue(false);

      // Act & Assert
      await expect(service.deleteFryer(mockFryerId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Tests de performance et cas limites', () => {
    it('devrait gérer un grand nombre de friteuses', async () => {
      // Arrange
      const largeFryerArray = Array.from({ length: 1000 }, (_, index) => ({
        ...mockFryer,
        _id: `60f1b2b3b3b3b3b3b3b3b3${index.toString().padStart(3, '0')}`,
        name: `Friteuse ${index}`,
      }));
      mockFryerRepository.findAll.mockResolvedValue(largeFryerArray);

      // Act
      const result = await service.getAllFryers();

      // Assert
      expect(result).toHaveLength(1000);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les noms avec des caractères spéciaux', async () => {
      // Arrange
      const specialCharsDTO: FryerDTO = {
        name: 'Friteuse été & automne (spéciale) - N°1',
      };
      const mockInsertResult = { _id: mockFryerId };
      const mockFryerWithSpecialName = { ...mockFryer, name: specialCharsDTO.name } as unknown as Fryer;
      
      mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
      mockFryerRepository.findOneById.mockResolvedValue(mockFryerWithSpecialName);

      // Act
      const result = await service.createFryer(specialCharsDTO);

      // Assert
      expect(result.name).toBe(specialCharsDTO.name);
    });

    it('devrait gérer les opérations simultanées', async () => {
      // Arrange
      const operations = [
        () => service.getAllFryers(),
        () => service.getFryerById(mockFryerId),
        () => service.createFryer(mockFryerDTO),
      ];

      mockFryerRepository.findAll.mockResolvedValue(mockFryerArray);
      mockFryerRepository.findOneById.mockResolvedValue(mockFryer);
      mockFryerRepository.insert.mockResolvedValue({ _id: mockFryerId });

      // Act
      const results = await Promise.all(operations.map(op => op()));

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(mockFryerArray);
      expect(results[1]).toEqual(mockFryer);
      expect(results[2]).toEqual(mockFryer);
    });

    it('devrait gérer les noms courts et longs', async () => {
      // Arrange
      const testCases = [
        { name: 'A' }, // Nom très court
        { name: 'Friteuse Standard' }, // Nom normal
        { name: 'x'.repeat(50) }, // Nom à la limite
      ];

      for (const dto of testCases) {
        const mockInsertResult = { _id: mockFryerId };
        const mockCreatedFryer = { ...mockFryer, name: dto.name } as unknown as Fryer;
        
        mockFryerRepository.insert.mockResolvedValue(mockInsertResult);
        mockFryerRepository.findOneById.mockResolvedValue(mockCreatedFryer);

        // Act
        const result = await service.createFryer(dto);

        // Assert
        expect(result.name).toBe(dto.name);
      }
    });
  });
});
