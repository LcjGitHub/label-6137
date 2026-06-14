import { useEffect, useMemo } from 'react';
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  List,
  Empty,
  Button,
  Tag,
} from 'antd';
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHistoryStore } from '@/store/historyStore';
import { calculateStatistics } from '@/utils/statistics';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

/**
 * 学习统计看板页面。
 *
 * 功能：
 * - 从练习历史 store 中读取记录并计算统计数据
 * - 顶部展示总练习次数、答对次数、整体正确率三张彩色指标卡片
 * - 下方展示按练习次数排序的曲目练习排行列表
 * - 无练习记录时展示引导文案与「去练习」跳转按钮
 */
export default function StatisticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { records, refresh } = useHistoryStore();

  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  const statistics = useMemo(() => calculateStatistics(records), [records]);

  const hasRecords = records.length > 0;

  /** 顶部指标卡片配置，包含 aria-label 以支持辅助技术读取 */
  const statCards = [
    {
      title: '总练习次数',
      value: statistics.totalPracticeCount,
      icon: <FireOutlined style={{ color: '#fa8c16', fontSize: 24 }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
    },
    {
      title: '答对次数',
      value: statistics.correctCount,
      icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    {
      title: '整体正确率',
      value: `${statistics.accuracy}%`,
      icon: <BarChartOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff',
    },
  ];

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
          学习统计看板
        </Title>
      </Header>
      <Content className="page-container">
        {!hasRecords ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    暂无练习记录
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">
                      开始练习曲目，这里将展示你的学习统计数据
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    style={{ marginTop: 24 }}
                    onClick={() => navigate('/')}
                  >
                    去练习
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {statCards.map((card, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card
                    role="region"
                    aria-label={`${card.title}：${card.value}`}
                    style={{
                      background: card.color,
                      borderColor: card.borderColor,
                      borderRadius: 8,
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <Text
                          type="secondary"
                          aria-hidden="true"
                          style={{ display: 'block', marginBottom: 8 }}
                        >
                          {card.title}
                        </Text>
                        <Title
                          level={2}
                          aria-label={`${card.title}为${card.value}`}
                          style={{ margin: 0 }}
                        >
                          {card.value}
                        </Title>
                      </div>
                      <span aria-hidden="true">{card.icon}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <TrophyOutlined style={{ color: '#faad14' }} />
                  <span>曲目练习排行</span>
                </div>
              }
              bordered
              style={{ borderRadius: 8 }}
            >
              <List
                dataSource={statistics.scoreRankings}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.scoreTitle}
                    style={{
                      padding: '12px 0',
                      borderBottom:
                        index < statistics.scoreRankings.length - 1
                          ? '1px solid #f0f0f0'
                          : 'none',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          aria-label={`第${index + 1}名`}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background:
                              index === 0
                                ? '#faad14'
                                : index === 1
                                ? '#bfbfbf'
                                : index === 2
                                ? '#d46b08'
                                : '#f0f0f0',
                            color:
                              index < 3 ? '#fff' : 'rgba(0, 0, 0, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 14,
                          }}
                        >
                          {index + 1}
                        </div>
                      }
                      title={
                        <Text strong style={{ fontSize: 15 }}>
                          {item.scoreTitle}
                        </Text>
                      }
                      description={
                        <div style={{ marginTop: 4 }}>
                          <Tag color="blue">练习 {item.practiceCount} 次</Tag>
                          <Tag color="green">
                            答对 {item.correctCount} 次
                          </Tag>
                          <Tag color="orange">正确率 {item.accuracy}%</Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </Content>
    </Layout>
  );
}
