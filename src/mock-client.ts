import type { Client, MetadataBearer, Command, SdkError } from '@aws-sdk/types';

/**
 * Mocks an aws sdk client.
 */
export const mockClient = <TInput extends object, TOutput extends MetadataBearer>(client: InstanceOrClassType<Client<TInput, TOutput, any>>) => {
  const instance = isInstance(client) ? client : client.prototype;

  const send = jest.spyOn(instance, 'send');

  return new AwsMock<TInput, TOutput>(send);
};

// eslint-disable-next-line max-len
export type AwsClientMock<TClient extends Client<any, any, any>> = TClient extends Client<infer TInput, infer TOutput, any> ? AwsMock<TInput, TOutput> : never;

export class AwsMock<TInput extends object, TOutput extends MetadataBearer> {
  _isMockFunction = true;

  private send: SpyInstance<TInput, TOutput>;

  constructor(send: SpyInstance<TInput, TOutput>) {
    this.send = send;
    this.send.mockImplementation(() => undefined); // default
  }

  /**
   * Does everything that `mockFn.mockClear()` does, and also removes any mocked return values or implementations.
   */
  public mockReset() {
    this.send.mockReset();
    return this;
  }

  /**
   * Does everything that `mockFn.mockReset()` does, and also restores the original (non-mocked) implementation.
   */
  public mockRestore() {
    this.send.mockRestore();
  }

  /**
   * Resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays.
   */
  public mockClear() {
    this.send.mockClear();
    return this;
  }

  public get mock() {
    return this.send.mock;
  }

  /**
   * Sets the name of the mock.
   */
  public mockName(name: string) {
    this.send.mockName(name);
    return this;
  }

  /**
   * Returns the mock name string set by calling mockFn.mockName(value).
   */
  public getMockName() {
    return this.send.getMockName();
  }

  /**
   * Simple sugar function for: mockFn.mockImplementation(() => Promise.resolve(value));
   */
  public mockResolvedValue(value: CommandOutput<TOutput>) {
    this.send.mockResolvedValue(value as any);
    return this;
  }

  /**
   * Simple sugar function for: mockFn.mockImplementationOnce(() => Promise.resolve(value));
   */
  public mockResolvedValueOnce(value: CommandOutput<TOutput>) {
    this.send.mockResolvedValueOnce(value as any);
    return this;
  }

  /**
   * Simple sugar function for: mockFn.mockImplementation(() => Promise.reject(value));
   */
  public mockRejectedValue(error: string | Error | SdkError) {
    if (typeof error === 'string') {
      error = new Error(error);
    }
    this.send.mockRejectedValue(error);
    return this;
  }

  /**
   * Simple sugar function for: mockFn.mockImplementationOnce(() => Promise.reject(value));
   */
  public mockRejectedValueOnce(error: string | Error | SdkError) {
    if (typeof error === 'string') {
      error = new Error(error);
    }
    this.send.mockRejectedValueOnce(error);
    return this;
  }

  /**
   * Accepts a function that should be used as the implementation of the mock. The mock itself will still record all calls that go into and instances that come from itself – the only difference is that the implementation will also be executed when the mock is called.
   */
  // eslint-disable-next-line max-len
  public mockImplementation(fn?: ((command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: Callback<TOutput>) => void | CommandOutput<TOutput>) | undefined) {
    this.send.mockImplementation(fn as any);
    return this;
  }

  /**
   * Accepts a function that will be used as an implementation of the mock for one call to the mocked function. Can be chained so that multiple function calls produce different results.
   */
  // eslint-disable-next-line max-len
  public mockImplementationOnce(fn: (command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: Callback<TOutput>) => void | CommandOutput<TOutput>) {
    this.send.mockImplementationOnce(fn as any);
    return this;
  }
}

// eslint-disable-next-line max-len
const isInstance = <TClient extends Client<any, any, any>>(client: InstanceOrClassType<TClient>): client is TClient => (client as TClient).send !== undefined;

type ClassType<T> = {
  prototype: T;
};

type InstanceOrClassType<T> = T | ClassType<T>;

type Callback<T> = (err: any, data?: T | undefined) => void

type CommandOutput<T> = Partial<T> | Promise<Partial<T>>;

// eslint-disable-next-line max-len
type SpyInstance<TInput extends object, TOutput extends MetadataBearer> = jest.SpyInstance<void | Promise<TOutput>, [command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: Callback<TOutput>]>
