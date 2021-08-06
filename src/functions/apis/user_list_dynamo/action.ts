import { DynamoPaginationInfo } from '../../../repositories/DynamoRepository';
import { DynamoUserRepository } from '../../../repositories/DynamoUserRepository';

interface UserData {
    id: string;
    name: string;
    email: string;
    mobile: string;
}

interface Response {
    pagination: DynamoPaginationInfo;
    data: UserData[];
}

export class UserListDynamoAction {
    private dynamoUserRepository: DynamoUserRepository;

    constructor() {
        this.dynamoUserRepository = new DynamoUserRepository();
    }

    async execute(page_info: DynamoPaginationInfo): Promise<Response> {
        const response = await this.dynamoUserRepository.getPaginateList(page_info);
        return {
            pagination: {
                limit: response.limit,
                key: response.key,
                forward: response.forward,
            },
            data: response.data.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                };
            }),
        };
    }
}
