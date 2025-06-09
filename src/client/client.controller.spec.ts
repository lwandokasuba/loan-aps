/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

const createClient: CreateClientDto = {
  name: 'Lwando',
  national_id: '123456/12/1',
  phone_number: '0971234567',
};

describe('ClientController', () => {
  let controller: ClientController;

  const mockClientService = {
    create: jest.fn((dto: CreateClientDto) => {
      return {
        id: '1',
        createdDate: new Date(),
        updatedDate: new Date(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService],
    })
      .overrideProvider(ClientService)
      .useValue(mockClientService)
      .compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    expect(await controller.create(createClient)).toEqual({
      id: expect.any(String),
      ...createClient,
      createdDate: expect.any(Date),
      updatedDate: expect.any(Date),
    });
  });
});
