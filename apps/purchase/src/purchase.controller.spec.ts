import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

describe('PurchaseController', () => {
  let purchaseController: PurchaseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [PurchaseService],
    }).compile();

    purchaseController = app.get<PurchaseController>(PurchaseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(purchaseController.getHello()).toBe('Hello World!');
    });
  });
});
