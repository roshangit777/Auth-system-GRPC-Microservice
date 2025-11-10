import { Test, TestingModule } from "@nestjs/testing";
import { LoginHistoryModuleController } from "./login-history.module.controller";
import { LoginHistoryModuleService } from "./login-history.module.service";

describe("LoginHistoryModuleController", () => {
  let LoginHistoryModuleController: LoginHistoryModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoginHistoryModuleController],
      providers: [LoginHistoryModuleService],
    }).compile();

    LoginHistoryModuleController = app.get<LoginHistoryModuleController>(
      LoginHistoryModuleController
    );
  });

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(LoginHistoryModuleController.getHello()).toBe("Hello World!");
    });
  });
});
