import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach } from "node:test";
import { GithubWebhooksController } from './github.webhooks.controller';
import { GithubWebhooksService } from './github.webhooks.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { INestApplication } from '@nestjs/common';
import { WebhooksModule } from '../webhooks.module';
import * as request from 'supertest';

const moduleMocker = new ModuleMocker(global);

describe('GithubWebhooksController', () => {
    let app: INestApplication;
    let githubWebhooksService = {
        getRepositories: jest.fn(),
        getEvents: jest.fn(),
        create: jest.fn()
    }

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [WebhooksModule],
        })
            .overrideProvider(GithubWebhooksService)
            .useValue(githubWebhooksService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET webhooks/github/repositories`, () => {
        return request(app.getHttpServer())
            .get('/webhooks/github/repositories')
            .expect(200)
            .expect({
                data: githubWebhooksService.getRepositories(),
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
