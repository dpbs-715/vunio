import { cloneByStrategy, setByKeyOrPathReversibly, type CloneStrategy } from '@vunio/utils';
import { COMMON_FORM_SET_FIELD_COMMAND, type CommonFormCommand } from './Form.types';

type FormData = Record<string, any>;
type FormDataGetter = () => FormData;
type CommandStatus = 'ready' | 'executed' | 'undone';

export interface SetFormFieldCommandOptions {
  clone?: CloneStrategy;
}

export class SetFormFieldCommand implements CommonFormCommand {
  readonly kind = COMMON_FORM_SET_FIELD_COMMAND;
  readonly createdAt = Date.now();
  updatedAt = this.createdAt;
  readonly clone: CloneStrategy;

  private nextValue: unknown;
  private rollback?: () => void;
  private status: CommandStatus = 'ready';

  constructor(
    private readonly getFormData: FormDataGetter,
    readonly field: string,
    value: unknown,
    options: SetFormFieldCommandOptions = {},
  ) {
    this.clone = options.clone ?? 'deep';
    this.nextValue = cloneByStrategy(value, this.clone);
  }

  execute = () => {
    if (this.status === 'executed') return;

    this.rollback = setByKeyOrPathReversibly(this.getFormData(), this.field, this.nextValue, {
      clone: this.clone,
    });
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
    if (this.clone !== nextCommand.clone) return false;

    this.nextValue = cloneByStrategy(nextCommand.nextValue, this.clone);
    this.updatedAt = nextCommand.updatedAt;
    return true;
  };
}
