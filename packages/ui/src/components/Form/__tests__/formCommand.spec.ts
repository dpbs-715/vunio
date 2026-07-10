import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { SetFormFieldCommand } from '../src/formCommand';

describe('SetFormFieldCommand', () => {
  it('should execute, undo, and redo an existing field write', () => {
    const formData = { name: 'before' };
    const command = new SetFormFieldCommand(() => formData, 'name', 'after');

    command.execute();
    expect(formData.name).toBe('after');

    command.undo();
    expect(formData.name).toBe('before');

    command.redo();
    expect(formData.name).toBe('after');
  });

  it('should remove nested containers created by the command when undone', () => {
    const formData = reactive<Record<string, any>>({});
    const command = new SetFormFieldCommand(() => formData, 'users[0].name', 'Alice');

    command.execute();
    expect(formData).toEqual({
      users: [{ name: 'Alice' }],
    });

    command.undo();
    expect(formData).toEqual({});

    command.redo();
    expect(formData).toEqual({
      users: [{ name: 'Alice' }],
    });
  });

  it('should restore the length of an existing array when undone', () => {
    const formData: Record<string, any> = { users: [] };
    const command = new SetFormFieldCommand(() => formData, 'users[0].name', 'Alice');

    command.execute();
    expect(formData.users).toEqual([{ name: 'Alice' }]);

    command.undo();
    expect(formData.users).toEqual([]);
    expect(formData.users).toHaveLength(0);
  });

  it.each([null, undefined])(
    'should restore an existing nullish parent value when undone: %s',
    (previousValue) => {
      const formData: Record<string, any> = { profile: previousValue };
      const command = new SetFormFieldCommand(() => formData, 'profile.name', 'Ada');

      command.execute();
      expect(formData.profile).toEqual({ name: 'Ada' });

      command.undo();
      expect(Object.prototype.hasOwnProperty.call(formData, 'profile')).toBe(true);
      expect(formData.profile).toBe(previousValue);
    },
  );

  it('should preserve dotted flat-key semantics', () => {
    const formData: Record<string, any> = {
      'style.color': 'red',
    };
    const command = new SetFormFieldCommand(() => formData, 'style.color', 'blue');

    command.execute();
    expect(formData['style.color']).toBe('blue');
    expect(formData.style).toBeUndefined();

    command.undo();
    expect(formData['style.color']).toBe('red');
    expect(formData.style).toBeUndefined();
  });

  it('should merge executed writes for the same target and field', () => {
    const formData = { name: 'initial' };
    const getFormData = () => formData;
    const firstCommand = new SetFormFieldCommand(getFormData, 'name', 'A');
    const secondCommand = new SetFormFieldCommand(getFormData, 'name', 'AB');

    firstCommand.execute();
    secondCommand.execute();

    expect(firstCommand.merge(secondCommand)).toBe(true);
    expect(formData.name).toBe('AB');

    firstCommand.undo();
    expect(formData.name).toBe('initial');

    firstCommand.redo();
    expect(formData.name).toBe('AB');
  });

  it('should not merge commands for different fields', () => {
    const formData = { firstName: '', lastName: '' };
    const getFormData = () => formData;
    const firstNameCommand = new SetFormFieldCommand(getFormData, 'firstName', 'Ada');
    const lastNameCommand = new SetFormFieldCommand(getFormData, 'lastName', 'Lovelace');

    firstNameCommand.execute();
    lastNameCommand.execute();

    expect(firstNameCommand.merge(lastNameCommand)).toBe(false);
  });
});
