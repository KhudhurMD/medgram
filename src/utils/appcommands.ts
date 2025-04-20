class AppObserver {
  _commandObservers: { command: AppCommand<unknown>; observer: ObserverFn<any> }[] = [];
  _commands: AppCommand<unknown>[] = [];

  subscribe<TCommand extends AppCommand<unknown>>(command: TCommand, observer: ObserverFn<AppCommandPayloadT<TCommand>>) {
    this._commandObservers.push({ command, observer });
  }

  unsubscribe<TCommand extends AppCommand<unknown>>(command: TCommand, observer: ObserverFn<AppCommandPayloadT<TCommand>>) {
    this._commandObservers = this._commandObservers.filter((item) => item.command !== command && item.observer !== observer);
  }

  static createCommand<T>(type: string) {
    return {
      type: type,
    } as AppCommand<T>;
  }

  dispatch<TCommand extends AppCommand<unknown>>(command: TCommand, data: AppCommandPayloadT<TCommand>) {
    this._commandObservers.forEach((item) => {
      if (item.command == undefined) return;
      if (command == undefined) return;
      if (item.command.type == command.type) {
        item.observer(data);
      }
    });
  }
}

// Type App Command where payload type is generic
interface AppCommand<TPayload> {
  type: string;
}

type AppCommandPayloadT<TCommand extends AppCommand<unknown>> = TCommand extends AppCommand<infer TPayload> ? TPayload : never;

interface ObserverFn<T> {
  (data: T): boolean;
}

export const appObserver = new AppObserver();
export const createAppCommand = AppObserver.createCommand;

export const NODE_CLICK_COMMAND = createAppCommand<{ nodeId: string }>('NODE_CLICK_COMMAND');
export const NODE_ADD_CHILD_COMMAND = createAppCommand<{ nodeId: string }>('NODE_ADD_CHILD_COMMAND');
export const NODE_ADD_SIBLING_COMMAND = createAppCommand<{ nodeId: string }>('NODE_ADD_SIBLING_COMMAND');
export const NODE_SET_CONTENT_COMMAND = createAppCommand<{ nodeId: string; content: string | null }>('NODE_SET_CONTENT_COMMAND');
export const NODE_SET_SELECTION_COMMAND = createAppCommand<{ nodeId: string }>('NODE_SET_SELECTION_COMMAND');
