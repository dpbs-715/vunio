import { deepClone, hasOwnKey, toPath, type PathKey } from '@vunio/utils';
import { toRaw } from 'vue';
import { COMMON_FORM_SET_FIELD_COMMAND, type CommonFormCommand } from './Form.types';

type FormData = Record<string, any>;
type FormDataGetter = () => FormData;
type CommandStatus = 'ready' | 'executed' | 'undone';

interface CreatedContainer {
  container: FormData | any[];
  key: PathKey;
  parent: FormData | any[];
  previousArrayLength?: number;
  previousExisted: boolean;
  previousValue: null | undefined;
}

function isArrayIndex(key: PropertyKey): boolean {
  if (typeof key === 'number') return Number.isInteger(key) && key >= 0;
  return typeof key === 'string' && /^(0|[1-9]\d*)$/.test(key);
}

function restoreArrayLength(target: any[], previousLength?: number) {
  if (previousLength === undefined || target.length <= previousLength) return;

  const hasLaterIndex = Reflect.ownKeys(target).some(
    (key) => isArrayIndex(key) && Number(key) >= previousLength,
  );

  if (!hasLaterIndex) {
    target.length = previousLength;
  }
}

function isEmptyContainer(target: FormData | any[]): boolean {
  return Reflect.ownKeys(target).every((key) => Array.isArray(target) && key === 'length');
}

function setFieldReversibly(target: FormData, field: string, value: unknown): () => void {
  if (hasOwnKey(target, field)) {
    const previousValue = deepClone(target[field]);
    target[field] = deepClone(value);

    return () => {
      target[field] = deepClone(previousValue);
    };
  }

  const keys = toPath(field);
  if (keys.length === 0) return () => {};

  const createdContainers: CreatedContainer[] = [];
  let current: FormData | any[] = target;

  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index];
    const nextKey = keys[index + 1];
    const currentValue = Reflect.get(current, key);

    if (currentValue == null) {
      const container = typeof nextKey === 'number' ? [] : {};
      const previousArrayLength = Array.isArray(current) ? current.length : undefined;
      const previousExisted = hasOwnKey(current, key);
      const previousValue = currentValue;

      Reflect.set(current, key, container);
      createdContainers.push({
        container,
        key,
        parent: current,
        previousArrayLength,
        previousExisted,
        previousValue,
      });
    }

    current = Reflect.get(current, key);
  }

  const leafKey = keys[keys.length - 1];
  if (leafKey === undefined) return () => {};

  const leafParent = current;
  const leafExisted = hasOwnKey(leafParent, leafKey);
  const previousValue = leafExisted ? deepClone(Reflect.get(leafParent, leafKey)) : undefined;
  const previousArrayLength = Array.isArray(leafParent) ? leafParent.length : undefined;

  Reflect.set(leafParent, leafKey, deepClone(value));

  let canRollback = true;

  return () => {
    if (!canRollback) return;
    canRollback = false;

    if (leafExisted) {
      Reflect.set(leafParent, leafKey, deepClone(previousValue));
    } else {
      Reflect.deleteProperty(leafParent, leafKey);
      if (Array.isArray(leafParent)) {
        restoreArrayLength(leafParent, previousArrayLength);
      }
    }

    for (let index = createdContainers.length - 1; index >= 0; index--) {
      const {
        container,
        key,
        parent,
        previousArrayLength: parentArrayLength,
        previousExisted,
        previousValue: parentValue,
      } = createdContainers[index];

      if (toRaw(Reflect.get(parent, key)) !== toRaw(container) || !isEmptyContainer(container)) {
        continue;
      }

      if (previousExisted) {
        Reflect.set(parent, key, parentValue);
      } else {
        Reflect.deleteProperty(parent, key);
      }

      if (!previousExisted && Array.isArray(parent)) {
        restoreArrayLength(parent, parentArrayLength);
      }
    }
  };
}

export class SetFormFieldCommand implements CommonFormCommand {
  readonly kind = COMMON_FORM_SET_FIELD_COMMAND;
  readonly createdAt = Date.now();
  updatedAt = this.createdAt;

  private nextValue: unknown;
  private rollback?: () => void;
  private status: CommandStatus = 'ready';

  constructor(
    private readonly getFormData: FormDataGetter,
    readonly field: string,
    value: unknown,
  ) {
    this.nextValue = deepClone(value);
  }

  execute = () => {
    if (this.status === 'executed') return;

    this.rollback = setFieldReversibly(this.getFormData(), this.field, this.nextValue);
    this.status = 'executed';
  };

  undo = () => {
    if (this.status !== 'executed' || !this.rollback) return;

    this.rollback();
    this.rollback = undefined;
    this.status = 'undone';
  };

  redo = () => {
    if (this.status !== 'undone') return;
    this.execute();
  };

  merge = (nextCommand: CommonFormCommand): boolean => {
    if (!(nextCommand instanceof SetFormFieldCommand)) return false;
    if (this.status !== 'executed' || nextCommand.status !== 'executed') return false;
    if (this.getFormData !== nextCommand.getFormData || this.field !== nextCommand.field) {
      return false;
    }

    this.nextValue = deepClone(nextCommand.nextValue);
    this.updatedAt = nextCommand.updatedAt;
    return true;
  };
}
