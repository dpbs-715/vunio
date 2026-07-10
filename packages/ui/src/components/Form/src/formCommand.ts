import { deepClone, setByKeyOrPathReversibly } from '@vunio/utils';
import { COMMON_FORM_SET_FIELD_COMMAND, type CommonFormCommand } from './Form.types';

type FormData = Record<string, any>;
type FormDataGetter = () => FormData;
type CommandStatus = 'ready' | 'executed' | 'undone';

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

    this.rollback = setByKeyOrPathReversibly(this.getFormData(), this.field, this.nextValue);
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
