import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Card,
  Layout,
  Space,
  Tag,
  Typography,
  Result,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  HistoryOutlined,
  BulbOutlined,
  SwapOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { generateRandomPractice, type RandomPracticeResult } from '@/services/randomService';
import { usePracticeStore } from '@/store/practiceStore';
import { difficultyLabelMap, difficultyColorMap } from '@/pages/ScoreListPage';
import type { HideMode } from '@/types/score';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

/** 练习隐藏模式对应的展示信息 */
const hideModeLabelMap: Record<HideMode, { title: string; desc: string; icon: string }> = {
  jianpu: {
    title: '隐藏简谱',
    desc: '看五线谱填简谱',
    icon: '📝',
  },
  staff: {
    title: '隐藏五线谱',
    desc: '看简谱填音高',
    icon: '🎵',
  },
};

/** 随机练习入口页：随机抽曲并决定练习模式，确认后进入练习流程 */
export default function RandomPracticePage() {
  const navigate = useNavigate();
  const setRandomMode = usePracticeStore((s) => s.setRandomMode);
  const [result, setResult] = useState<RandomPracticeResult | null>(null);

  const handleGenerate = useCallback(() => {
    const randomResult = generateRandomPractice();
    setResult(randomResult);
  }, []);

  const handleStart = useCallback(() => {
    if (!result) return;
    setRandomMode(result.hideMode);
    navigate(`/practice/${result.score.id}`);
  }, [result, navigate, setRandomMode]);

  const modeInfo = result ? hideModeLabelMap[result.hideMode] : null;

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
          随机练习
        </Title>
        <Link to="/history">
          <Button type="text" icon={<HistoryOutlined />}>练习历史</Button>
        </Link>
      </Header>
      <Content className="page-container">
        <Card
          style={{
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            marginBottom: 20,
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎲</div>
            <Title level={3} style={{ color: '#fff', margin: '0 0 8px' }}>
              随机练习挑战
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              从全部曲目中随机抽取一首，并随机决定隐藏简谱或五线谱
            </Paragraph>
          </div>
        </Card>

        {!result && (
          <Result
            icon={<BulbOutlined style={{ color: '#667eea' }} />}
            title="准备好了吗？"
            subTitle="点击下方按钮，开始你的随机练习挑战"
            extra={
              <Button
                type="primary"
                size="large"
                icon={<SwapOutlined />}
                onClick={handleGenerate}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 48,
                  paddingLeft: 32,
                  paddingRight: 32,
                  fontSize: 16,
                }}
              >
                随机抽取
              </Button>
            }
          />
        )}

        {result && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card
              title={
                <Space>
                  <AudioOutlined style={{ color: '#1677ff' }} />
                  <span>抽中曲目</span>
                </Space>
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {result.score.title}
                </Title>
                <Space>
                  <Tag color={difficultyColorMap[result.score.difficulty]}>
                    {difficultyLabelMap[result.score.difficulty]}
                  </Tag>
                  {result.score.categories.map((cat) => (
                    <Tag key={cat}>{cat}</Tag>
                  ))}
                </Space>
              </div>
            </Card>

            <Card
              title={
                <Space>
                  <span>{modeInfo?.icon}</span>
                  <span>练习模式</span>
                </Space>
              }
              style={{
                borderColor: result.hideMode === 'jianpu' ? '#1677ff' : '#52c41a',
                borderWidth: 2,
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 0',
                }}
              >
                <Title
                  level={2}
                  style={{
                    margin: '0 0 8px',
                    color: result.hideMode === 'jianpu' ? '#1677ff' : '#52c41a',
                  }}
                >
                  {modeInfo?.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {modeInfo?.desc}
                </Text>
              </div>
            </Card>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={handleGenerate}
                style={{ height: 48, paddingLeft: 24, paddingRight: 24 }}
              >
                换一首
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStart}
                style={{
                  height: 48,
                  paddingLeft: 32,
                  paddingRight: 32,
                  fontSize: 16,
                }}
              >
                开始练习
              </Button>
            </div>
          </Space>
        )}
      </Content>
    </Layout>
  );
}
