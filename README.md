# jest-aws-client-mock
![Build](https://github.com/hupe1980/jest-aws-client-mock/workflows/build/badge.svg)
![Release](https://github.com/hupe1980/jest-aws-client-mock/workflows/release/badge.svg)

> Jest mock for AWS SDK v3 Clients

## Installation
```bash
// with npm
npm install -D jest-aws-client-mock

// with yarn
yarn add -D jest-aws-client-mock
```

## How to use
```typescript
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { mockClient } from 'jest-aws-client-mock';

const snsMock = mockClient(SNSClient);

beforeEach(() => {
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

  expect(snsMock).toHaveBeenCalledTimes(1);
  expect(result).toEqual({ MessageId: '123' })
});
```

## License
[MIT](LICENSE)