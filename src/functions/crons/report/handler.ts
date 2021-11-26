import { Databases } from '../../../libs/Mysql';
import { RESPONSE, THROW_ERROR } from '../../../libs/Response';
import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

import { Responses } from './responses';
import { ReportAction } from './action';

export async function execute(): Promise<HttpResponse> {
    try {
        const connection = await Databases.getConnection();
        const action = new ReportAction(connection);
        await action.execute();

        return RESPONSE(Responses.STATUS_200);
    } catch (error) {
        return THROW_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}
