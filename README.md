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
  expect.assertions(3);

  snsMock.mockResolvedValue({
      MessageId: '123',
  });

  const snsClient = new SNSClient({});

  const command = new PublishCommand({
      Message: 'message',
      TopicArn: 'arn:aws:sns:us-east-1:111111111111:TestTopic',
  });

  const result = await snsClient.send(command);

  expect(snsMock).toHaveBeenCalledTimes(1);
  expect(snsMock).toBeCalledWith(command);
  expect(result).toEqual({ MessageId: '123' })
});
```

### DynamoDBDocumentClient
```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'jest-aws-client-mock';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.mockReset();
});

test('dynamodbDocumentClient', async () => {
  expect.assertions(4);

  const output: Partial<GetCommandOutput> = {
    Item: {
      Id: '4711',
    },
  };

  ddbMock.mockResolvedValue(output);

  const command = new GetCommand({
    TableName: 'tableName',
    Key: {
      Id: '4711',
    },
  });

  const dynamodbClient = new DynamoDBClient({});

  const ddb = DynamoDBDocumentClient.from(dynamodbClient);

  const result = await ddb.send(command);

  expect(ddbMock.mock.calls.length).toBe(1);
  expect(ddbMock).toHaveBeenCalledTimes(1);
  expect(ddbMock).toHaveBeenNthCalledWith(1, command);
  expect(result).toEqual(output);
});
```

## License
[MIT](LICENSE)