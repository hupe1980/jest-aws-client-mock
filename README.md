# jest-aws-client-mock
> Jest mock for AWS SDK v3 Clients

# Installation
```bash
// with npm
npm install -D jest-google-maps-mock

// with yarn
yarn add -D jest-google-maps-mock
```

# How to use
```typescript
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { AwsClientMock, mockClient } from 'jest-google-maps-mock';

let snsMock: AwsClientMock<SNSClient>;

beforeEach(() => {
    snsMock = mockClient(SNSClient);
});

afterEach(() => {
    snsMock.mockReset();
});

test('mock sns client', async () => {
    expect.assertions(2);

    const snsClient = new SNSClient({});
    
    const command = new PublishCommand({
        Message: 'message',
        TopicArn: 'arn:aws:sns:us-east-1:111111111111:TestTopic',
    });

    snsMock.mockResolvedValue({
        MessageId: '123',
    });
    
    const result = await snsClient.send(command);

    expect(result).toEqual({ MessageId: '123' })
    expect(snsMock.mock.calls.length).toBe(1);
});
```

# License
MIT(License)