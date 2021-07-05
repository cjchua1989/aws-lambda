import { Connection } from 'typeorm';
import { PaginationInfo } from '../../../repositories/RdsRepository';
import { UserRepository } from '../../../repositories/UserRepository';

interface Pagination {
    max_page: number;
    current_page: number;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    mobile: string;
}

interface Response {
    pagination: Pagination;
    data: UserData[];
}

export class UserListAction {
    private userRepository: UserRepository;

    constructor(connection: Connection) {
        this.userRepository = connection.getCustomRepository(UserRepository);
    }

    async execute(page_info: PaginationInfo): Promise<Response> {
        const response = await this.userRepository.getPaginatedList(page_info);
        return {
            pagination: {
                max_page: response.max_page,
                current_page: response.current_page,
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
