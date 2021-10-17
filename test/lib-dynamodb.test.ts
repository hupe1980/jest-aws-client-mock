import { DynamoDBClient, GetItemCommand, GetItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { mockClient } from '../src/mock-client';

describe('mockClient - lib-dynamodb', () => {
  const tableName = 'tableName';

  test('dynamodbClient', async () => {
    expect.assertions(4);

    const output: Partial<GetItemCommandOutput> = {
      Item: {
        Id: {
          S: '4711',
        },
      },
    };

    const dynamodbMock = mockClient(DynamoDBClient);

    dynamodbMock.mockResolvedValue(output);

    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        Id: {
          S: '4711',
        },
      },
    });

    const dynamodbClient = new DynamoDBClient({});

    const result = await dynamodbClient.send(command);

    expect(dynamodbMock.mock.calls.length).toBe(1);
    expect(dynamodbMock).toHaveBeenCalledTimes(1);
    expect(dynamodbMock).toHaveBeenNthCalledWith(1, command);
    expect(result).toEqual(output);
  });

  test('dynamodbDocumentClient', async () => {
    expect.assertions(4);

    const output: Partial<GetCommandOutput> = {
      Item: {
        Id: '4711',
      },
    };

    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.mockResolvedValue(output);

    const command = new GetCommand({
      TableName: tableName,
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
});