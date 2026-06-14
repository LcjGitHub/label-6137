import { useState, useMemo } from 'react';
import { Layout, Typography, Button, Select, Tag, Empty, Space } from 'antd';
import { Link } from 'react-router-dom';
import { HistoryOutlined, SwapOutlined, BarChartOutlined } from '@ant-design/icons';
import { getDifficultyLevels, getAllCategories, filterScores } from '@/services/scoreService';
import type { DifficultyLevel } from '@/types/score';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

/** 难度等级对应的中文标签 */
export const difficultyLabelMap: Record<DifficultyLevel, string> = {
  beginner: '入门',
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

/** 难度等级对应的标签颜色 */
export const difficultyColorMap: Record<DifficultyLevel, string> = {
  beginner: 'green',
  easy: 'blue',
  medium: 'orange',
  hard: 'red',
};

/** 曲目列表页 */
export default function ScoreListPage() {
  const difficultyLevels = getDifficultyLevels();
  const allCategories = getAllCategories();

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredScores = useMemo(() => {
    return filterScores(
      selectedDifficulty,
      selectedCategories.length > 0 ? selectedCategories : undefined
    );
  }, [selectedDifficulty, selectedCategories]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedDifficulty(undefined);
    setSelectedCategories([]);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: '16px 0', color: '#1677ff' }}>
          简谱与五线谱对照练习
        </Title>
        <Space>
          <Link to="/random">
            <Button type="primary" icon={<SwapOutlined />}>随机练习</Button>
          </Link>
          <Link to="/statistics">
            <Button icon={<BarChartOutlined />}>学习统计</Button>
          </Link>
          <Link to="/history">
            <Button icon={<HistoryOutlined />}>练习历史</Button>
          </Link>
        </Space>
      </Header>
      <Content className="page-container">
        <Paragraph type="secondary">
          选择一首曲目进入练习，可隐藏简谱或五线谱后填写答案进行对照学习。
        </Paragraph>

        <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ whiteSpace: 'nowrap', color: '#666' }}>难度：</span>
              <Select
                placeholder="全部难度"
                style={{ width: 140 }}
                allowClear
                value={selectedDifficulty}
                onChange={(value) => setSelectedDifficulty(value)}
                options={difficultyLevels.map((level) => ({
                  label: difficultyLabelMap[level],
                  value: level,
                }))}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' }}>
              <span style={{ whiteSpace: 'nowrap', color: '#666' }}>分类：</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {allCategories.map((category) => (
                  <Tag
                    key={category}
                    color={selectedCategories.includes(category) ? 'blue' : 'default'}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Tag>
                ))}
              </div>
            </div>
            {(selectedDifficulty || selectedCategories.length > 0) && (
              <Button size="small" onClick={resetFilters}>
                重置筛选
              </Button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
          共找到 {filteredScores.length} 首曲目
        </div>

        {filteredScores.length > 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {filteredScores.map((score) => (
              <Link
                key={score.id}
                to={`/score/${score.id}`}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {score.title}
                  </Title>
                  <Tag color={difficultyColorMap[score.difficulty]}>
                    {difficultyLabelMap[score.difficulty]}
                  </Tag>
                </div>
                <Paragraph type="secondary" style={{ margin: '8px 0 0' }} ellipsis>
                  简谱预览：{score.jianpuText}
                </Paragraph>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {score.categories.map((cat) => (
                    <Tag
                      key={cat}
                      style={{ margin: 0, cursor: 'default' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {cat}
                    </Tag>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: 48, borderRadius: 8, textAlign: 'center' }}>
            <Empty description="没有找到匹配的曲目" />
            <Button type="primary" style={{ marginTop: 16 }} onClick={resetFilters}>
              重置筛选条件
            </Button>
          </div>
        )}
      </Content>
    </Layout>
  );
}
