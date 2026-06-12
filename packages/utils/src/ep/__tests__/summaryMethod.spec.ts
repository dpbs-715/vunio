import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { summaryMethodBuilder, SummaryMethodProps } from '../summaryMethod';
import { spanMethodBuilder } from '../spanMethod';

describe('summaryMethodBuilder', () => {
  // 辅助函数：构造 summary-method 入参。columns 用 property 对齐字段。
  const createProps = (properties: (string | undefined)[], data: any[]): SummaryMethodProps => ({
    columns: properties.map((property) => ({ property })),
    data,
  });

  const rows = [
    { name: 'A', qty: 10, price: 2, rate: 1.5 },
    { name: 'B', qty: 20, price: 4, rate: 2.5 },
    { name: 'C', qty: 30, price: 6, rate: 3.5 },
  ];

  describe('基础聚合', () => {
    it('sum：对指定列求和并按默认精度格式化', () => {
      const method = summaryMethodBuilder().label('合计').sum(['qty', 'price']).build();
      const result = method(createProps([undefined, 'qty', 'price'], rows));
      expect(result).toEqual(['合计', '60.00', '12.00']);
    });

    it('avg：对指定列求平均值', () => {
      const method = summaryMethodBuilder().avg('rate').build();
      const result = method(createProps(['rate'], rows));
      expect(result).toEqual(['2.50']);
    });

    it('count：统计非空单元格数量', () => {
      const data = [{ name: 'A' }, { name: '' }, { name: 'C' }, { name: null }];
      const method = summaryMethodBuilder().count('name').build();
      const result = method(createProps(['name'], data));
      expect(result).toEqual(['2']);
    });
  });

  describe('自定义聚合', () => {
    it('aggregate：使用自定义聚合函数返回数值并格式化', () => {
      const method = summaryMethodBuilder()
        .aggregate('qty', (values) => Math.max(...values))
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['30.00']);
    });

    it('custom：返回 string 时原样输出', () => {
      const method = summaryMethodBuilder()
        .custom('qty', (_values, dataRows) => `${dataRows.length} 行`)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['3 行']);
    });

    it('custom：返回 number 时走数值格式化', () => {
      const method = summaryMethodBuilder()
        .custom('qty', () => 5)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['5.00']);
    });
  });

  describe('summableFrom 列配置驱动', () => {
    const columns = [
      { field: 'name', label: '名称' },
      { field: 'qty', label: '数量', summable: true },
      { field: 'price', label: '单价', summable: true },
      { field: 'rate', label: '比率', summable: false },
    ];

    it('静态数组：仅收集 summable:true 的列求和', () => {
      const method = summaryMethodBuilder().label('合计').summableFrom(columns).build();
      const result = method(createProps([undefined, 'qty', 'price', 'rate'], rows));
      expect(result).toEqual(['合计', '60.00', '12.00', '']);
    });

    it('ref 源：从 ref 读取列配置', () => {
      const columnsRef = ref(columns);
      const method = summaryMethodBuilder().summableFrom(columnsRef).build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['60.00', '12.00']);
    });

    it('getter 源：从 getter 实时读取列配置', () => {
      const method = summaryMethodBuilder()
        .summableFrom(() => columns)
        .build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['60.00', '12.00']);
    });

    it('显式规则优先于 summableFrom 推导的求和', () => {
      const method = summaryMethodBuilder()
        .summableFrom(columns)
        .avg('qty') // qty 显式改为平均值，覆盖 summable 求和
        .build();
      const result = method(createProps(['qty', 'price'], rows));
      expect(result).toEqual(['20.00', '12.00']);
    });

    it('分组列：递归收集 columnChildren 中的 summable 叶子列', () => {
      const grouped = [
        { field: 'name', label: '名称' },
        {
          field: 'group',
          label: '数量组',
          columnChildren: [
            { field: 'qty', label: '数量', summable: true },
            { field: 'price', label: '单价', summable: true },
          ],
        },
      ];
      const method = summaryMethodBuilder().label('合计').summableFrom(grouped).build();
      // el-table 只对叶子列（qty/price）调用 summary，分组父列无 property
      const result = method(createProps([undefined, 'qty', 'price'], rows));
      expect(result).toEqual(['合计', '60.00', '12.00']);
    });
  });

  describe('mergedFrom 行合并去重', () => {
    // orderAmount 跨行合并（A 跨 2 行、B 跨 3 行），itemQty 逐行
    const mergedData = [
      { orderNo: 'A', orderAmount: 1000, itemQty: 3 },
      { orderNo: 'A', orderAmount: 1000, itemQty: 5 },
      { orderNo: 'B', orderAmount: 800, itemQty: 2 },
      { orderNo: 'B', orderAmount: 800, itemQty: 4 },
      { orderNo: 'B', orderAmount: 800, itemQty: 1 },
    ];

    it('被合并列按合并区域去重，未合并列逐行求和', () => {
      const span = spanMethodBuilder().withData(mergedData).mergeRows(['orderNo', 'orderAmount']);
      const method = summaryMethodBuilder()
        .label('合计')
        .mergedFrom(span.rowMergeSource())
        .sum(['orderAmount', 'itemQty'])
        .build();
      const result = method(createProps([undefined, 'orderAmount', 'itemQty'], mergedData));
      // orderAmount 去重：1000 + 800 = 1800（而非逐行 4400）；itemQty 逐行：15
      expect(result).toEqual(['合计', '1800.00', '15.00']);
    });

    it('未声明合并来源时退化为逐行求和', () => {
      const method = summaryMethodBuilder().sum('orderAmount').build();
      const result = method(createProps(['orderAmount'], mergedData));
      expect(result).toEqual(['4400.00']);
    });

    it('动态 mergeRows：未参与合并的行集合保持不变', () => {
      // 仅当 orderNo 为 A 时合并 orderAmount，B 的三行不去重
      const span = spanMethodBuilder()
        .withData(mergedData)
        .mergeRows((_idx, row) => (row.orderNo === 'A' ? ['orderNo', 'orderAmount'] : []));
      const method = summaryMethodBuilder()
        .mergedFrom(span.rowMergeSource())
        .sum('orderAmount')
        .build();
      const result = method(createProps(['orderAmount'], mergedData));
      // A 去重为 1000，B 三行逐行 800*3=2400 → 3400
      expect(result).toEqual(['3400.00']);
    });
  });

  describe('格式化', () => {
    it('precision：自定义小数位数', () => {
      const method = summaryMethodBuilder().sum('qty').precision(0).build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['60']);
    });

    it('formatter：优先级高于 precision', () => {
      const method = summaryMethodBuilder()
        .sum('qty')
        .precision(2)
        .formatter((value) => `¥${value}`)
        .build();
      const result = method(createProps(['qty'], rows));
      expect(result).toEqual(['¥60']);
    });
  });

  describe('占位与边界', () => {
    it('emptyText：无规则且非 label 列输出占位文本', () => {
      const method = summaryMethodBuilder().label('合计').sum('qty').emptyText('-').build();
      const result = method(createProps([undefined, 'qty', 'name'], rows));
      expect(result).toEqual(['合计', '60.00', '-']);
    });

    it('空数据：聚合列返回 emptyText', () => {
      const method = summaryMethodBuilder().label('合计').sum('qty').emptyText('-').build();
      const result = method(createProps([undefined, 'qty'], []));
      expect(result).toEqual(['合计', '-']);
    });

    it('空数据：count 列返回 0（计数为 0 是合法汇总值，不走 emptyText）', () => {
      const method = summaryMethodBuilder().count('name').emptyText('-').build();
      const result = method(createProps(['name'], []));
      expect(result).toEqual(['0']);
    });

    it('非有限值被过滤，不参与求和', () => {
      const data = [{ qty: 10 }, { qty: 'abc' }, { qty: null }, { qty: 5 }];
      const method = summaryMethodBuilder().sum('qty').build();
      const result = method(createProps(['qty'], data));
      expect(result).toEqual(['15.00']);
    });

    it('空值（null / 空字符串）不被强转为 0，不参与平均值计算', () => {
      const data = [{ rate: 10 }, { rate: null }, { rate: '' }];
      const method = summaryMethodBuilder().avg('rate').build();
      const result = method(createProps(['rate'], data));
      // 仅有效值 10 参与，平均值为 10 而非 (10+0+0)/3
      expect(result).toEqual(['10.00']);
    });

    it('全部为空值时聚合列返回 emptyText', () => {
      const data = [{ qty: null }, { qty: '' }, { qty: undefined }];
      const method = summaryMethodBuilder().sum('qty').emptyText('-').build();
      const result = method(createProps(['qty'], data));
      expect(result).toEqual(['-']);
    });

    it('emptyAsZero：空值计为 0 并计入平均值分母', () => {
      const data = [{ rate: 100 }, { rate: null }];
      const method = summaryMethodBuilder().avg('rate').emptyAsZero().build();
      const result = method(createProps(['rate'], data));
      // 空值计为 0：(100 + 0) / 2 = 50
      expect(result).toEqual(['50.00']);
    });

    it('emptyAsZero 下非数值（如 abc）仍被排除', () => {
      const data = [{ rate: 100 }, { rate: null }, { rate: 'abc' }];
      const method = summaryMethodBuilder().avg('rate').emptyAsZero().build();
      const result = method(createProps(['rate'], data));
      // 'abc' 排除，null 计为 0：(100 + 0) / 2 = 50
      expect(result).toEqual(['50.00']);
    });

    it('label：默认落在第 0 列', () => {
      const method = summaryMethodBuilder().label('合计').build();
      const result = method(createProps([undefined, undefined], rows));
      expect(result).toEqual(['合计', '']);
    });

    it('label：可指定 columnIndex', () => {
      const method = summaryMethodBuilder().label('合计', 1).build();
      const result = method(createProps([undefined, undefined], rows));
      expect(result).toEqual(['', '合计']);
    });
  });
});
