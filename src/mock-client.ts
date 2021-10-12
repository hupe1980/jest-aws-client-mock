import type { Client, MetadataBearer, Command } from '@aws-sdk/types';

export const mockClient = <TInput extends object, TOutput extends MetadataBearer>(client: InstanceOrClassType<Client<TInput, TOutput, any>>) => {
    const instance = isInstance(client) ? client : client.prototype;

    const send = jest.spyOn(instance, 'send').mockImplementation(jest.fn())

    return new AwsMock<TInput, TOutput>(send);
};

export type AwsClientMock<TClient extends Client<any, any, any>> =
    TClient extends Client<infer TInput, infer TOutput, any> ? AwsMock<TInput, TOutput> : never;

export class AwsMock<TInput extends object, TOutput extends MetadataBearer> {
    constructor(public send: jest.SpyInstance<void | Promise<TOutput>, [command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: ((err: any, data?: TOutput | undefined) => void) | undefined]>) {}

    public mockReset() {
        this.send.mockReset();
        return this;
    }

    public mockRestore() {
        this.send.mockRestore();
    }

    public mockClear() {
        this.send.mockClear();
        return this;
    }

    public get mock() {
        return this.send.mock;
    }

    public mockResolvedValue(value: CommandOutput<TOutput>) {
        this.send.mockResolvedValue(value as any);
        return this;
    }

    public mockResolvedValueOnce(value: CommandOutput<TOutput>) {
        this.send.mockResolvedValueOnce(value as any);
        return this;
    }

    public mockRejectedValue(error: string | Error | AwsError) {
        if (typeof error === 'string') {
            error = new Error(error);
        }
        this.send.mockRejectedValue(error);
        return this;
    }

    public mockRejectedValueOnce(error: string | Error | AwsError) {
        if (typeof error === 'string') {
            error = new Error(error);
        }
        this.send.mockRejectedValueOnce(error);
        return this;
    }

    public mockImplementation(fn?: ((command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: ((err: any, data?: TOutput | undefined) => void) | undefined) => void | CommandOutput<TOutput>) | undefined) {
        this.send.mockImplementation(fn as any);
        return this;
    }

    public mockImplementationOnce(fn: (command: Command<TInput, TInput, TOutput, TOutput, any>, options?: any, cb?: ((err: any, data?: TOutput | undefined) => void) | undefined) => void | CommandOutput<TOutput>) {
        this.send.mockImplementationOnce(fn as any);
        return this;
    }
}

export interface AwsError extends Partial<Error>, Partial<MetadataBearer> {
    Type?: string;
    Code?: string;
    $fault?: 'client' | 'server';
    $service?: string;
}

const isInstance = <TClient extends Client<any, any, any>>(client: InstanceOrClassType<TClient>): client is TClient => (client as TClient).send !== undefined;

type ClassType<T> = {
    prototype: T;
};

type InstanceOrClassType<T> = T | ClassType<T>;

type CommandOutput<T> = Partial<T> | Promise<Partial<T>>;