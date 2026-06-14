import { Layout, Typography, Table, Button, Modal, Empty } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '@/store/historyStore';
import type { PracticeRecord } from '@/types/score';
import type { ColumnsType } from 'antd/es/table';

const { Header, Content } = Layout;
const { Title } = Typography;

const HIDE_MODE_LABEL: Record<string, string> = {
  jianpu: '隐藏简谱',
  staff: '隐藏五线谱',
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

export default function HistoryPage() {
  const navigate = useNavigate();
  const { records, clearAll } = useHistoryStore();

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
        {records.length === 0 ? (
          <Empty description="暂无练习记录" />
        ) : (
          <>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleClear}
              >
                一键清空
              </Button>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={records}
              pagination={{ pageSize: 10 }}
              bordered
              size="middle"
            />
          </>
        )}
      </Content>
    </Layout>
  );
}
