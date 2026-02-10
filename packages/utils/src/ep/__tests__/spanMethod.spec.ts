import { describe, expect, it, beforeEach } from 'vitest';
import { ref } from 'vue';
import { spanMethodBuilder, SpanMethodProps } from '../spanMethod';

describe('spanMethodBuilder', () => {
  // 辅助函数：创建 SpanMethodProps
  const createProps = (
    row: any,
    column: { property: string },
    rowIndex: number,
    columnIndex: number,
  ): SpanMethodProps => ({
    row,
    column,
    rowIndex,
    columnIndex,
  });

  describe('基础功能', () => {
    it('应该抛出错误：未设置 data', () => {
      expect(() => {
        spanMethodBuilder().mergeRows(['province']).build();
      }).toThrow('[spanMethodBuilder] data is required. Please call withData() first.');
    });

    it('应该返回默认值：没有配置任何合并规则', () => {
      const data = [{ name: 'test' }];
      const spanMethod = spanMethodBuilder().withData(data).build();

      const result = spanMethod(createProps(data[0], { property: 'name' }, 0, 0));
      expect(result).toEqual({ rowspan: 1, colspan: 1 });
    });

    it('应该返回默认值：空数据数组', () => {
      const data: any[] = [];
      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province']).build();

      const result = spanMethod(createProps({}, { property: 'province' }, 0, 0));
      expect(result).toEqual({ rowspan: 1, colspan: 1 });
    });
  });

  describe('行合并 - 单组', () => {
    let data: any[];

    beforeEach(() => {
      data = [
        { province: '浙江', city: '杭州', area: '西湖区' },
        { province: '浙江', city: '杭州', area: '滨江区' },
        { province: '浙江', city: '宁波', area: '鄞州区' },
        { province: '江苏', city: '南京', area: '玄武区' },
      ];
    });

    it('应该合并单列相同值', () => {
      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province']).build();

      // 浙江第一行：rowspan=3
      expect(spanMethod(createProps(data[0], { property: 'province' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });

      // 浙江第二行：rowspan=0 (被合并)
      expect(spanMethod(createProps(data[1], { property: 'province' }, 1, 0))).toEqual({
        rowspan: 0,
        colspan: 0,
      });

      // 浙江第三行：rowspan=0 (被合并)
      expect(spanMethod(createProps(data[2], { property: 'province' }, 2, 0))).toEqual({
        rowspan: 0,
        colspan: 0,
      });

      // 江苏：rowspan=1 (不合并)
      expect(spanMethod(createProps(data[3], { property: 'province' }, 3, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该合并多列联动（有依赖关系）', () => {
      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province', 'city']).build();

      // province 列 - 浙江第一行：rowspan=3
      expect(spanMethod(createProps(data[0], { property: 'province' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });

      // city 列 - 杭州第一行：rowspan=2 (浙江内部的杭州)
      expect(spanMethod(createProps(data[0], { property: 'city' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });

      // city 列 - 杭州第二行：rowspan=0 (被合并)
      expect(spanMethod(createProps(data[1], { property: 'city' }, 1, 0))).toEqual({
        rowspan: 0,
        colspan: 0,
      });

      // city 列 - 宁波：rowspan=1 (浙江内部的宁波)
      expect(spanMethod(createProps(data[2], { property: 'city' }, 2, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该不合并不在配置中的列', () => {
      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province']).build();

      // area 列不在合并配置中
      expect(spanMethod(createProps(data[0], { property: 'area' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });
  });

  describe('行合并 - 多组独立', () => {
    it('应该支持多组独立的行合并（无依赖关系）', () => {
      const data = [
        { province: '浙江', city: '杭州', status: 'A', category: 'X' },
        { province: '浙江', city: '杭州', status: 'A', category: 'X' },
        { province: '浙江', city: '宁波', status: 'A', category: 'Y' },
        { province: '江苏', city: '南京', status: 'B', category: 'Y' },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeRows(['province', 'city']) // 第1组：省市联动
        .mergeRows(['status']) // 第2组：状态独立合并
        .mergeRows(['category']) // 第3组：分类独立合并
        .build();

      // province 列 - 浙江：rowspan=3
      expect(spanMethod(createProps(data[0], { property: 'province' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });

      // status 列 - A：rowspan=3（独立于省市）
      expect(spanMethod(createProps(data[0], { property: 'status' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });

      // category 列 - X：rowspan=2（独立于省市和状态）
      expect(spanMethod(createProps(data[0], { property: 'category' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });

      // category 列 - Y：rowspan=2
      expect(spanMethod(createProps(data[2], { property: 'category' }, 2, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
    });
  });

  describe('列合并', () => {
    let data: any[];

    beforeEach(() => {
      data = [
        { name: '表头', q1: '第一季度', q2: '第二季度', q3: '第三季度', q4: '第四季度' },
        { name: '数据1', q1: 100, q2: 200, q3: 300, q4: 400 },
        { name: '数据2', q1: 150, q2: 250, q3: 350, q4: 450 },
      ];
    });

    it('应该合并指定行的列（索引数组）', () => {
      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({
          rows: [0], // 第一行
          groups: [['q1', 'q2', 'q3', 'q4']],
        })
        .build();

      // 第一行 q1：colspan=4
      expect(spanMethod(createProps(data[0], { property: 'q1' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 4,
      });

      // 第一行 q2：colspan=0 (被合并)
      expect(spanMethod(createProps(data[0], { property: 'q2' }, 0, 1))).toEqual({
        rowspan: 0,
        colspan: 0,
      });

      // 第二行 q1：不合并
      expect(spanMethod(createProps(data[1], { property: 'q1' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该合并多组列', () => {
      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({
          rows: [0],
          groups: [
            ['q1', 'q2'], // 第一组
            ['q3', 'q4'], // 第二组
          ],
        })
        .build();

      // q1：colspan=2
      expect(spanMethod(createProps(data[0], { property: 'q1' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });

      // q3：colspan=2
      expect(spanMethod(createProps(data[0], { property: 'q3' }, 0, 2))).toEqual({
        rowspan: 1,
        colspan: 2,
      });
    });

    it('应该支持条件判断函数', () => {
      const dataWithType = [
        { type: 'header', name: '标题', a: 'A', b: 'B' },
        { type: 'data', name: '数据', a: 1, b: 2 },
        { type: 'summary', name: '小计', a: 100, b: 200 },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(dataWithType)
        .mergeCols({
          rows: (idx, row) => row.type === 'header',
          groups: [['name', 'a', 'b']],
        })
        .mergeCols({
          rows: (idx, row) => row.type === 'summary',
          groups: [['a', 'b']],
        })
        .build();

      // header 行 name：colspan=3
      expect(spanMethod(createProps(dataWithType[0], { property: 'name' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 3,
      });

      // data 行不合并
      expect(spanMethod(createProps(dataWithType[1], { property: 'a' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });

      // summary 行 a：colspan=2
      expect(spanMethod(createProps(dataWithType[2], { property: 'a' }, 2, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });
    });

    it('应该支持 boolean 类型的 rows 参数', () => {
      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({
          rows: true, // 所有行
          groups: [['q1', 'q2']],
        })
        .build();

      // 所有行的 q1 都应该被合并
      expect(spanMethod(createProps(data[0], { property: 'q1' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });

      expect(spanMethod(createProps(data[1], { property: 'q1' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });
    });

    it('应该忽略只有一个列的合并组', () => {
      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({
          rows: [0],
          groups: [['q1']], // 只有一列，应该被忽略
        })
        .build();

      expect(spanMethod(createProps(data[0], { property: 'q1' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });
  });

  describe('行合并 + 列合并', () => {
    it('应该同时支持行合并和列合并', () => {
      const data = [
        { name: '表头', q1: 'Q1', q2: 'Q2' },
        { name: '浙江', q1: 100, q2: 200 },
        { name: '浙江', q1: 150, q2: 250 },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeRows(['name']) // 行合并
        .mergeCols({ rows: [0], groups: [['q1', 'q2']] }) // 列合并
        .build();

      // 表头行 q1：colspan=2（列合并优先）
      expect(spanMethod(createProps(data[0], { property: 'q1' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });

      // name 列 - 浙江：rowspan=2（行合并）
      expect(spanMethod(createProps(data[1], { property: 'name' }, 1, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });

      // 普通单元格
      expect(spanMethod(createProps(data[1], { property: 'q1' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });
  });

  describe('响应式数据支持', () => {
    it('应该支持 ref 响应式数据', () => {
      const data = ref([
        { province: '浙江', city: '杭州' },
        { province: '浙江', city: '杭州' },
      ]);

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province']).build();

      // 初始数据：rowspan=2
      expect(spanMethod(createProps(data.value[0], { property: 'province' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
    });
  });

  describe('缓存机制', () => {
    it('应该使用自定义 cacheKey 控制缓存', () => {
      const data = [
        { province: '浙江', city: '杭州' },
        { province: '浙江', city: '杭州' },
      ];
      const cacheKey = ref(0);

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .withCacheKey(cacheKey)
        .mergeRows(['province'])
        .build();

      // 第一次调用
      const result1 = spanMethod(createProps(data[0], { property: 'province' }, 0, 0));
      expect(result1).toEqual({ rowspan: 2, colspan: 1 });

      // 修改数据但不更新 cacheKey，应该使用缓存
      data.push({ province: '江苏', city: '南京' });

      const result2 = spanMethod(createProps(data[0], { property: 'province' }, 0, 0));
      expect(result2).toEqual({ rowspan: 2, colspan: 1 }); // 还是旧的缓存结果

      // 更新 cacheKey，应该重新计算
      cacheKey.value++;

      const result3 = spanMethod(createProps(data[0], { property: 'province' }, 0, 0));
      expect(result3).toEqual({ rowspan: 2, colspan: 1 }); // 重新计算后的结果
    });

    it('应该支持禁用缓存', () => {
      const data = [
        { province: '浙江', city: '杭州' },
        { province: '浙江', city: '杭州' },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .noCache()
        .mergeRows(['province'])
        .build();

      // 每次调用都应该重新计算（无缓存）
      const result1 = spanMethod(createProps(data[0], { property: 'province' }, 0, 0));
      expect(result1).toEqual({ rowspan: 2, colspan: 1 });

      // 修改数据后立即生效
      data.push({ province: '江苏', city: '南京' });

      const result2 = spanMethod(createProps(data[0], { property: 'province' }, 0, 0));
      expect(result2).toEqual({ rowspan: 2, colspan: 1 }); // 重新计算
    });

    it('列合并应该支持自动缓存失效（智能模式）', () => {
      const data = [
        { name: 'Header', q1: 'Q1', q2: 'Q2' },
        { name: 'Data', q1: 1, q2: 2 },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({ rows: [0], groups: [['q1', 'q2']] })
        .build();

      // 第一次调用
      const result1 = spanMethod(createProps(data[0], { property: 'q1' }, 0, 0));
      expect(result1).toEqual({ rowspan: 1, colspan: 2 });
    });
  });

  describe('边界情况', () => {
    it('应该处理空的列名数组', () => {
      const data = [{ name: 'test' }];
      const spanMethod = spanMethodBuilder().withData(data).mergeRows([]).build();

      expect(spanMethod(createProps(data[0], { property: 'name' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该处理不存在的列名', () => {
      const data = [
        { province: '浙江', city: '杭州' },
        { province: '浙江', city: '杭州' },
      ];

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['nonexistent']).build();

      // 不存在的列也应该尝试合并（值都是 undefined）
      expect(spanMethod(createProps(data[0], { property: 'nonexistent' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
    });

    it('应该处理 column.property 为 undefined 的情况', () => {
      const data = [
        { province: '浙江', city: '杭州' },
        { province: '浙江', city: '杭州' },
      ];

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['province']).build();

      // 操作列等没有 property 的列应该返回默认值
      expect(spanMethod(createProps(data[0], { property: undefined } as any, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该处理所有值都不同的情况', () => {
      const data = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['name']).build();

      // 所有行都不合并
      expect(spanMethod(createProps(data[0], { property: 'name' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[1], { property: 'name' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[2], { property: 'name' }, 2, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该处理所有值都相同的情况', () => {
      const data = [{ name: 'A' }, { name: 'A' }, { name: 'A' }];

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['name']).build();

      // 所有行合并成一个
      expect(spanMethod(createProps(data[0], { property: 'name' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[1], { property: 'name' }, 1, 0))).toEqual({
        rowspan: 0,
        colspan: 0,
      });
      expect(spanMethod(createProps(data[2], { property: 'name' }, 2, 0))).toEqual({
        rowspan: 0,
        colspan: 0,
      });
    });

    it('应该处理 null 和 undefined 值', () => {
      const data = [{ value: null }, { value: null }, { value: undefined }, { value: undefined }];

      const spanMethod = spanMethodBuilder().withData(data).mergeRows(['value']).build();

      // null 值应该合并
      expect(spanMethod(createProps(data[0], { property: 'value' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });

      // undefined 值应该合并
      expect(spanMethod(createProps(data[2], { property: 'value' }, 2, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
    });
  });

  describe('复杂场景', () => {
    it('应该处理复杂的多级合并', () => {
      const data = [
        { province: '浙江', city: '杭州', district: '西湖区', street: '文一路' },
        { province: '浙江', city: '杭州', district: '西湖区', street: '文二路' },
        { province: '浙江', city: '杭州', district: '滨江区', street: '江南大道' },
        { province: '浙江', city: '宁波', district: '鄞州区', street: '中山路' },
        { province: '江苏', city: '南京', district: '玄武区', street: '中山路' },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeRows(['province', 'city', 'district'])
        .build();

      // 浙江省：rowspan=4
      expect(spanMethod(createProps(data[0], { property: 'province' }, 0, 0))).toEqual({
        rowspan: 4,
        colspan: 1,
      });

      // 浙江-杭州：rowspan=3
      expect(spanMethod(createProps(data[0], { property: 'city' }, 0, 0))).toEqual({
        rowspan: 3,
        colspan: 1,
      });

      // 浙江-杭州-西湖区：rowspan=2
      expect(spanMethod(createProps(data[0], { property: 'district' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });

      // 浙江-杭州-滨江区：rowspan=1
      expect(spanMethod(createProps(data[2], { property: 'district' }, 2, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });

      // 浙江-宁波：rowspan=1
      expect(spanMethod(createProps(data[3], { property: 'city' }, 3, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
    });

    it('应该支持动态函数返回合并组', () => {
      const data = [
        { type: 'A', a: 1, b: 2, c: 3 },
        { type: 'B', a: 4, b: 5, c: 6 },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeCols({
          rows: [0, 1],
          groups: (rowIndex, row) => {
            if (row.type === 'A') {
              return [['a', 'b']]; // A 类型合并 a-b
            }
            return [['b', 'c']]; // B 类型合并 b-c
          },
        })
        .build();

      // A 类型：a-b 合并
      expect(spanMethod(createProps(data[0], { property: 'a' }, 0, 0))).toEqual({
        rowspan: 1,
        colspan: 2,
      });
      expect(spanMethod(createProps(data[0], { property: 'c' }, 0, 2))).toEqual({
        rowspan: 1,
        colspan: 1,
      });

      // B 类型：b-c 合并
      expect(spanMethod(createProps(data[1], { property: 'a' }, 1, 0))).toEqual({
        rowspan: 1,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[1], { property: 'b' }, 1, 1))).toEqual({
        rowspan: 1,
        colspan: 2,
      });
    });
  });

  describe('链式调用顺序', () => {
    it('应该支持任意顺序的链式调用', () => {
      const data = [{ name: 'test' }];

      // 顺序1
      const spanMethod1 = spanMethodBuilder().withData(data).noCache().mergeRows(['name']).build();

      // 顺序2
      const spanMethod2 = spanMethodBuilder().mergeRows(['name']).noCache().withData(data).build();

      expect(spanMethod1).toBeDefined();
      expect(spanMethod2).toBeDefined();
    });

    it('应该支持多次调用相同方法', () => {
      const data = [
        { a: 'A', b: 'B', c: 'C' },
        { a: 'A', b: 'B', c: 'C' },
      ];

      const spanMethod = spanMethodBuilder()
        .withData(data)
        .mergeRows(['a'])
        .mergeRows(['b'])
        .mergeRows(['c'])
        .build();

      // 所有列都应该独立合并
      expect(spanMethod(createProps(data[0], { property: 'a' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[0], { property: 'b' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
      expect(spanMethod(createProps(data[0], { property: 'c' }, 0, 0))).toEqual({
        rowspan: 2,
        colspan: 1,
      });
    });
  });
});
