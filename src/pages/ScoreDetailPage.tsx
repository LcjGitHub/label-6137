import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout, Typography, Button, Card, Tag, Space, Alert } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, BarChartOutlined, HistoryOutlined } from '@ant-design/icons';
import { getScoreById } from '@/services/scoreService';
import { difficultyLabelMap, difficultyColorMap } from '@/constants/score';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

/** 曲目详情预览页：只读展示曲目完整信息 */
export default function ScoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const score = id ? getScoreById(id) : undefined;

  useEffect(() => {
    if (score) {
      document.title = `${score.title} - 曲目详情`;
    }
    return () => {
      document.title = '简谱与五线谱对照练习';
    };
  }, [score]);

  if (!score) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content className="page-container">
          <Alert type="error" message="未找到该曲目" showIcon />
          <Button type="link" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
            返回曲目列表
          </Button>
        </Content>
      </Layout>
    );
  }

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
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          曲目详情
        </Title>
        <Link to="/statistics">
          <Button type="text" icon={<BarChartOutlined />}>学习统计</Button>
        </Link>
        <Link to="/history">
          <Button type="text" icon={<HistoryOutlined />}>练习历史</Button>
        </Link>
      </Header>
      <Content className="page-container">
        <div style={{ marginBottom: 16 }}>
          <Title level={3} style={{ margin: '0 0 8px' }}>
            {score.title}
          </Title>
          <Space size={8} wrap>
            <Tag color={difficultyColorMap[score.difficulty]}>
              {difficultyLabelMap[score.difficulty]}
            </Tag>
            {score.categories.map((cat) => (
              <Tag key={cat}>{cat}</Tag>
            ))}
          </Space>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="简谱">
            <div className="jianpu-display">{score.jianpuText}</div>
          </Card>

          <Card title="五线谱">
            <div className="staff-preview">
              <img src={score.staffSvgPath} alt={`${score.title} 五线谱`} />
            </div>
          </Card>

          <Card title="音高序列">
            <Text code style={{ fontSize: 16, letterSpacing: 2 }}>
              {score.noteArray.join(' ')}
            </Text>
          </Card>
        </Space>

        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 0',
            background: 'linear-gradient(to top, #f5f5f5 60%, transparent)',
            marginTop: 24,
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => navigate(`/practice/${score.id}`, { state: { fromDetail: true } })}
            style={{ width: '100%', height: 48, fontSize: 16 }}
          >
            开始练习
          </Button>
        </div>
      </Content>
    </Layout>
  );
}
