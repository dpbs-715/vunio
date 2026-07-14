import { afterEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, reactive } from 'vue';
import { commonKeysMap } from '~/components/CreateComponent/src/defaultMap';
import { DataHandlerClass, type DataHandlerType } from '../dataHandlerClass';

describe('DataHandlerClass', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve ready state when loading options fails', async () => {
    const error = new Error('load failed');
    const api = vi.fn().mockRejectedValue(error) as any;
    api.__D__ = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const handler = new DataHandlerClass({ api });
    const readyPromise = handler.getReadyPromise();

    await handler.initOptions();

    await expect(readyPromise).resolves.toBeUndefined();
    expect(handler.loading.value).toBe(false);
    expect(handler.options.value).toEqual([{ label: '未知数据', value: 0 }]);
  });

  it('should update total when the response total is zero', async () => {
    const api = vi.fn().mockResolvedValue({
      [commonKeysMap.list]: [],
      [commonKeysMap.total]: 0,
    }) as any;
    api.__D__ = true;

    const handler = new DataHandlerClass({ api });
    handler.total = 10;

    await handler.initOptions();

    expect(handler.total).toBe(0);
  });

  it('should preserve appended options with falsy values', () => {
    const appendOptions = [
      { label: 'Zero', value: 0 },
      { label: 'Empty', value: '' },
      { label: 'False', value: false },
    ];
    const handler = new DataHandlerClass({ appendOptions });

    expect(handler.handleAppendOptions([])).toEqual([
      { label: 'Zero', value: 0, appendData: true },
      { label: 'Empty', value: '', appendData: true },
      { label: 'False', value: false, appendData: true },
    ]);
  });

  it('should react to structural changes in bound options', async () => {
    const props = reactive<DataHandlerType>({
      options: [{ label: 'One', value: 1 }],
    });
    const handler = new DataHandlerClass(props);
    const parseOptions = vi.spyOn(handler, 'parseOptions').mockImplementation(() => {});
    const scope = effectScope();

    scope.run(() => handler.watchState());
    props.options?.push({ label: 'Two', value: 2 });
    await nextTick();

    expect(parseOptions).toHaveBeenCalledWith([
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ]);
    scope.stop();
  });

  it('should react once to structural changes in appended options', async () => {
    const props = reactive<DataHandlerType>({
      options: [{ label: 'Base', value: 1 }],
      appendOptions: [{ label: 'Extra', value: 2 }],
    });
    const handler = new DataHandlerClass(props);
    const afterInit = vi.spyOn(handler, 'afterInit');

    handler.init();
    afterInit.mockClear();

    if (Array.isArray(props.appendOptions)) {
      props.appendOptions.push({ label: 'Extra 2', value: 3 });
    }
    await nextTick();

    expect(afterInit).toHaveBeenCalledTimes(1);
    expect(handler.options.value).toEqual([
      { label: 'Base', value: 1 },
      { label: 'Extra', value: 2, appendData: true },
      { label: 'Extra 2', value: 3, appendData: true },
    ]);

    afterInit.mockClear();
    props.appendOptions = [{ label: 'Replacement', value: 4 }];
    await nextTick();

    expect(afterInit).toHaveBeenCalledTimes(1);
    expect(handler.options.value).toEqual([
      { label: 'Base', value: 1 },
      { label: 'Replacement', value: 4, appendData: true },
    ]);
  });
});
