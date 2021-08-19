import { pascalCase } from 'case-anything';
import { existsSync, writeFileSync } from 'fs';

const content = `
import { execute } from '../src/functions/<type>/<name>/handler';
import { ApiGatewayEvent } from '../src/libs/Contracts/ApiGatewayEvent';
import { expect } from 'chai';
import * as faker from 'faker';

describe('Test Description', () => {
    it('422: ParameterError', async () => {
        const payload: ApiGatewayEvent = {
            body: '{}',
        };

        const response = await execute(payload);
        const body = JSON.parse(response.body);

        expect(response.statusCode).to.be.equal(422);
        expect(body).to.have.all.keys('code', 'message', 'errors');
        expect(body.code).to.be.equal(422);
        expect(body.errors).to.have.all.keys('username', 'password');
    });
    
    it('200: Success', async () => {
        const payload: ApiGatewayEvent = {
            body: JSON.stringify({
                // Input here the right payload
            }), 
        };

        const response = await execute(payload);
        const body = JSON.parse(response.body);
        
        expect(response.statusCode).to.be.equal(200);
        expect(body).to.have.all.keys('code', 'message', //other response keys);
        expect(body.code).to.be.equal(200);
    });
})
`;

export class UnitTestTemplate {
    private readonly className: string;

    constructor(name: string) {
        this.className = pascalCase(`${name.trim()}_test`);
    }

    generate(): void {
        if (existsSync(`./tests/${this.className}.ts`)) throw new Error('Unit Test already existed');

        writeFileSync(`./tests/${this.className}.ts`, content.trim());
    }
}
