import { OTPFactory, OTPType } from './OTPFactory';
import * as faker from 'faker';

test('200 SUCCESS SMS OTP REQUEST', async () => {
    const request = {
        otp_type: OTPType.SMS,
        contact_info: '09*********', // change it to your number
    };

    const service = OTPFactory.getService(request);
    const response = await service.sendOTP(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});

test('200 SUCCESS EMAIL OTP REQUEST', async () => {
    const request = {
        otp_type: OTPType.EMAIL,
        contact_info: faker.internet.email(), // change it to your email
    };

    const service = OTPFactory.getService(request);
    const response = await service.sendOTP(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});

test('200 SUCCESS SMS OTP VERIFICATION', async () => {
    const request = {
        otp_type: OTPType.SMS,
        contact_info: '09*********', // change it to your number
        otp: '916033',
    };

    const service = OTPFactory.getService(request);
    const response = await service.verifyOTP(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});

test('200 SUCCESS EMAIL OTP VERIFICATION', async () => {
    const request = {
        otp_type: OTPType.EMAIL,
        contact_info: faker.internet.email(), // change it to your email
        otp: '890949',
    };

    const service = OTPFactory.getService(request);
    const response = await service.verifyOTP(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});
