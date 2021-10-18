import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { mockClient } from '../src/mock-client';

describe('mockClient - classtype', () => {
  const snsMock = mockClient(SNSClient);

  const command = new PublishCommand({
    Message: 'message',
    TopicArn: 'arn:aws:sns:us-east-1:111111111111:TestTopic',
  });

  beforeEach(() => {
    snsMock.mockReset();
  });

  test('mock', async () => {
    expect.assertions(4);

    const snsClient = new SNSClient({});

    await snsClient.send(command);
    await snsClient.send(command);

    expect(snsMock.mock.calls.length).toBe(2);
    expect(snsMock).toHaveBeenCalledTimes(2);
    expect(snsMock).toHaveBeenNthCalledWith(1, command);
    expect(snsMock).toHaveBeenNthCalledWith(2, command);
  });

  test('mockResolvedValue', async () => {
    expect.assertions(3);

    snsMock.mockResolvedValue({
      MessageId: '123',
    });

    const snsClient = new SNSClient({});

    const result = await snsClient.send(command);

    expect(snsMock).toHaveBeenCalledTimes(1);
    expect(snsMock).toBeCalledWith(command);
    expect(result).toEqual({ MessageId: '123' });
  });

  test('mockResolvedValue', async () => {
    expect.assertions(2);

    snsMock.mockResolvedValueOnce({
      MessageId: '123',
    });

    snsMock.mockResolvedValueOnce({
      MessageId: '456',
    });

    const snsClient = new SNSClient({});

    const result1 = await snsClient.send(command);
    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' });
    expect(result2).toEqual({ MessageId: '456' });
  });

  test('mockRejectedValue - string', async () => {
    expect.assertions(1);

    snsMock.mockRejectedValue('MockError');

    const snsClient = new SNSClient({});

    const throws = async () => snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError');
  });

  test('mockRejectedValue - Error', async () => {
    expect.assertions(1);

    snsMock.mockRejectedValue(new Error('MockError'));

    const snsClient = new SNSClient({});

    const throws = async () => snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError');
  });

  test('mockRejectedValueOnce - string', async () => {
    expect.assertions(2);

    snsMock.mockRejectedValueOnce('MockError1');
    snsMock.mockRejectedValueOnce('MockError2');

    const snsClient = new SNSClient({});

    const throws = async () => snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError1');
    await expect(throws()).rejects.toThrow('MockError2');
  });

  test('mockRejectedValueOnce - Error', async () => {
    expect.assertions(2);

    snsMock.mockRejectedValueOnce(new Error('MockError1'));
    snsMock.mockRejectedValueOnce(new Error('MockError2'));

    const snsClient = new SNSClient({});

    const throws = async () => snsClient.send(command);

    await expect(throws()).rejects.toThrow('MockError1');
    await expect(throws()).rejects.toThrow('MockError2');
  });

  test('mockImplementation', async () => {
    expect.assertions(1);

    snsMock.mockImplementation((_command) => Promise.resolve({
      MessageId: '123',
    }));

    const snsClient = new SNSClient({});

    const result = await snsClient.send(command);

    expect(result).toEqual({ MessageId: '123' });
  });

  test('mockImplementationOnce', async () => {
    expect.assertions(2);

    snsMock.mockImplementationOnce((_command) => Promise.resolve({
      MessageId: '123',
    }));

    snsMock.mockImplementationOnce((_command) => Promise.resolve({
      MessageId: '456',
    }));

    const snsClient = new SNSClient({});

    const result1 = await snsClient.send(command);
    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' });
    expect(result2).toEqual({ MessageId: '456' });
  });

  test('mockImplementationOnce - chained', async () => {
    expect.assertions(2);

    snsMock.mockImplementationOnce((_command) => Promise.resolve({
      MessageId: '123',
    })).mockImplementationOnce((_command) => Promise.resolve({
      MessageId: '456',
    }));

    const snsClient = new SNSClient({});

    const result1 = await snsClient.send(command);
    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' });
    expect(result2).toEqual({ MessageId: '456' });
  });

  test('default implementation', async () => {
    expect.assertions(1);

    const snsClient = new SNSClient({});

    const result = await snsClient.send(command);

    expect(result).toBeUndefined();
  });

  test('mockReset', async () => {
    expect.assertions(2);

    snsMock.mockResolvedValue({
      MessageId: '123',
    });

    const snsClient = new SNSClient({});

    const result1 = await snsClient.send(command);

    snsMock.mockReset();

    const result2 = await snsClient.send(command);

    expect(result1).toEqual({ MessageId: '123' });
    expect(result2).toBeUndefined();
  });

  test('mockClear', async () => {
    expect.assertions(4);

    const snsClient = new SNSClient({});

    await snsClient.send(command);

    expect(snsMock.mock.calls.length).toBe(1);
    expect(snsMock).toHaveBeenCalledTimes(1);

    snsMock.mockClear();

    expect(snsMock.mock.calls.length).toBe(0);
    expect(snsMock).toHaveBeenCalledTimes(0);
  });

  test('mockName', () => {
    const mockName = 'mockName';

    snsMock.mockName(mockName);

    expect(snsMock.getMockName()).toBe(mockName);
  });
});

describe('mockClient - restore', () => {
  test('mockRestore', () => {
    const snsClient = new SNSClient({});

    const snsMock = mockClient(snsClient);

    expect(jest.isMockFunction(snsClient.send)).toBe(true);

    snsMock.mockRestore();

    expect(jest.isMockFunction(snsClient.send)).toBe(false);
  });
});

describe('mockClient - instance', () => {
  test('mock', async () => {
    expect.assertions(4);

    const snsClient = new SNSClient({});

    const snsMock = mockClient(snsClient);

    const command = new PublishCommand({
      Message: 'message',
      TopicArn: 'arn:aws:sns:us-east-1:111111111111:TestTopic',
    });

    await snsClient.send(command);
    await snsClient.send(command);

    expect(snsMock.mock.calls.length).toBe(2);
    expect(snsMock).toHaveBeenCalledTimes(2);
    expect(snsMock).toHaveBeenNthCalledWith(1, command);
    expect(snsMock).toHaveBeenNthCalledWith(2, command);
  });
});
