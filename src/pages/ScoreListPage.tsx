import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getAllScores } from '@/services/scoreService';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

/** 曲目列表页 */
export default function ScoreListPage() {
  const scores = getAllScores();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0', color: '#1677ff' }}>
          简谱与五线谱对照练习
        </Title>
      </Header>
      <Content className="page-container">
        <Paragraph type="secondary">
          选择一首曲目进入练习，可隐藏简谱或五线谱后填写答案进行对照学习。
        </Paragraph>
        <div style={{ display: 'grid', gap: 12 }}>
          {scores.map((score) => (
            <Link
              key={score.id}
              to={`/practice/${score.id}`}
              style={{
                display: 'block',
                padding: '16px 20px',
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                color: 'inherit',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                {score.title}
              </Title>
              <Paragraph type="secondary" style={{ margin: '8px 0 0' }} ellipsis>
                简谱预览：{score.jianpuText}
              </Paragraph>
            </Link>
          ))}
        </div>
      </Content>
    </Layout>
  );
}
