import { useEffect, useMemo } from 'react';
import { Layout, Typography, Table, Button, Modal, Empty, Tabs } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '@/store/historyStore';
import type { DateRange } from '@/services/historyService';
import type { PracticeRecord } from '@/types/score';
import type { ColumnsType } from 'antd/es/table';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const HIDE_MODE_LABEL: Record<string, string> = {
  jianpu: '隐藏简谱',
  staff: '隐藏五线谱',
};

const DATE_RANGE_LABEL: Record<DateRange, string> = {
  today: '今天',
  week: '最近七天',
  all: '全部',
};

const columns: ColumnsType<PracticeRecord> = [
  {
    title: '曲目标题',
    dataIndex: 'scoreTitle',
    key: 'scoreTitle',
  },
  {
    title: '隐藏模式',
    dataIndex: 'hideMode',
    key: 'hideMode',
    width: 140,
    render: (mode: string) => HIDE_MODE_LABEL[mode] ?? mode,
  },
  {
    title: '结果',
    dataIndex: 'correct',
    key: 'correct',
    width: 100,
    render: (correct: boolean) =>
      correct ? (
        <span style={{ color: '#52c41a' }}>正确</span>
      ) : (
        <span style={{ color: '#ff4d4f' }}>错误</span>
      ),
  },
  {
    title: '提交时间',
    dataIndex: 'submittedAt',
    key: 'submittedAt',
    width: 200,
  },
];

/** 练习历史记录页：展示练习记录，支持按时间范围筛选、一键清空 */
export default function HistoryPage() {
  const navigate = useNavigate();
  const {
    filteredRecords,
    allRecords,
    dateRange,
    setDateRange,
    clearAll,
    refresh,
  } = useHistoryStore();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const tabItems = useMemo(
    () => [
      { key: 'today', label: DATE_RANGE_LABEL.today },
      { key: 'week', label: DATE_RANGE_LABEL.week },
      { key: 'all', label: DATE_RANGE_LABEL.all },
    ],
    []
  );

  const handleTabChange = (key: string) => {
    setDateRange(key as DateRange);
  };

  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空全部练习历史记录吗？此操作不可撤销。',
      okText: '确认清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: clearAll,
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
        >
          返回
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          练习历史记录
        </Title>
      </Header>
      <Content className="page-container">
        <Tabs
          activeKey={dateRange}
          items={tabItems}
          onChange={handleTabChange}
          style={{ marginBottom: 16 }}
        />
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary">
            当前筛选「{DATE_RANGE_LABEL[dateRange]}」共{' '}
            <Text strong style={{ color: '#1890ff' }}>
              {filteredRecords.length}
            </Text>{' '}
            条记录
            {dateRange !== 'all' && (
              <span style={{ marginLeft: 8 }}>
                （总计 {allRecords.length} 条）
              </span>
            )}
          </Text>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={allRecords.length === 0}
          >
            一键清空
          </Button>
        </div>
        {filteredRecords.length === 0 ? (
          <Empty
            description={
              allRecords.length === 0
                ? '暂无练习记录'
                : `${DATE_RANGE_LABEL[dateRange]}暂无练习记录`
            }
          />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredRecords}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
          />
        )}
      </Content>
    </Layout>
  );
}
