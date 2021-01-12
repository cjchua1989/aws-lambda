import { Logger } from '../../../libs/Logger';

enum Effect {
    ALLOW = 'Allow',
    DENY = 'Deny',
}

interface Statement {
    Action: string;
    Effect: string;
    Resource: string;
}

interface PolicyDocument {
    Version: string;
    Statement: Statement[];
}

interface Policy {
    principalId: string;
    policyDocument: PolicyDocument;
}

const generatePolicy = (id: string, effect: Effect, resource: string): Policy => {
    return {
        principalId: id,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
};

interface Event {
    methodArn: string;
    authorizationToken: string;
}

interface Context {
    awsRequestId?: string;
}

export async function execute(event: Event, context?: Context): Promise<string | Policy> {
    const request_id = context !== undefined && context.awsRequestId ? context.awsRequestId : '';
    const resource = event.methodArn;

    try {
        if (typeof event.authorizationToken === 'undefined' || event.authorizationToken === '') {
            Logger.error('Authorization:403', { event, context });
            return generatePolicy(request_id, Effect.DENY, resource);
        }

        /* TODO: Add you code that will validate the header here */

        Logger.info('Authorization:200', { event, context });
        return generatePolicy(request_id, Effect.ALLOW, resource);
    } catch (error) {
        Logger.error('Authorization:401', { error, event, context });
        return 'Unauthorized';
    }
}
