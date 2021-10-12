import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { AwsClientMock, mockClient } from '../src/mock-client';

const command = new PublishCommand({
    Message: 'message',
    TopicArn: 'arn:aws:sns:us-east-1:111111111111:TestTopic',
});

let snsMock: AwsClientMock<SNSClient>;

beforeEach(() => {
    snsMock = mockClient(SNSClient);
});

afterEach(() => {
    snsMock.mockReset();
});

test('mock', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});

    await snsClient.send(command);
    await snsClient.send(command);

    expect(snsMock.mock.calls.length).toBe(2);
    expect(snsMock.send).toHaveBeenCalledTimes(2);
});

test('mockResolvedValue', async () => {
    expect.assertions(1);

    const snsClient = new SNSClient({});
    
    snsMock.mockResolvedValue({
        MessageId: '123',
    });
    
    const result = await snsClient.send(command);

    expect(result).toEqual({ MessageId: '123' })
});

test('mockResolvedValue', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});

    snsMock.mockResolvedValueOnce({
        MessageId: '123',
    });

    snsMock.mockResolvedValueOnce({
        MessageId: '456',
    });

    const result1 = await snsClient.send(command);
    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' })
    expect(result2).toEqual({ MessageId: '456' })
});

test('mockRejectedValue', async () => {
    expect.assertions(1);

    const snsClient = new SNSClient({});

    snsMock.mockRejectedValue(new Error('MockError'));

    const throws = async () => await snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError');
});

test('mockRejectedValueOnce', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});

    snsMock.mockRejectedValueOnce(new Error('MockError1'));
    snsMock.mockRejectedValueOnce(new Error('MockError2'));

    const throws = async () => await snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError1');
    await expect(throws()).rejects.toThrow('MockError2');
});

test('mockImplementation', async () => {
    expect.assertions(1);

    const snsClient = new SNSClient({});

    snsMock.mockImplementation((_command) => Promise.resolve({
        MessageId: '123',
    }));

    const result = await snsClient.send(command);

    expect(result).toEqual({ MessageId: '123' })
});

test('mockImplementationOnce', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});

    snsMock.mockImplementationOnce((_command) => Promise.resolve({
        MessageId: '123',
    }));

    snsMock.mockImplementationOnce((_command) => Promise.resolve({
        MessageId: '456',
    }));

    const result1 = await snsClient.send(command);
    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' })
    expect(result2).toEqual({ MessageId: '456' })
});

test('default implementation', async () => {
    expect.assertions(1);

    const snsClient = new SNSClient({});

    const result = await snsClient.send(command);

    expect(result).toBeUndefined();
});

test('mockReset', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});

    snsMock.mockResolvedValue({
        MessageId: '123',
    });

    const result1 = await snsClient.send(command);

    snsMock.mockReset();

    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' })
    expect(result2).toBeUndefined();
});

test('mockClear', async () => {
    expect.assertions(4);

    const snsClient = new SNSClient({});

    await snsClient.send(command);

    expect(snsMock.mock.calls.length).toBe(1);
    expect(snsMock.send).toHaveBeenCalledTimes(1);

    snsMock.mockClear();

    expect(snsMock.mock.calls.length).toBe(0);
    expect(snsMock.send).toHaveBeenCalledTimes(0);
});
