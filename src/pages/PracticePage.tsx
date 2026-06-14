import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  Card,
  Input,
  Layout,
  Radio,
  Space,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, BarChartOutlined, CheckOutlined, HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getScoreById } from '@/services/scoreService';
import { usePracticeStore } from '@/store/practiceStore';
import { useHistoryStore } from '@/store/historyStore';
import {
  checkJianpuAnswer,
  checkNoteArrayAnswer,
} from '@/utils/validation';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const formSchema = z.object({
  answer: z.string().min(1, '请填写答案'),
});

type FormValues = z.infer<typeof formSchema>;

const hideModeLabelMap: Record<'jianpu' | 'staff', string> = {
  jianpu: '隐藏简谱模式',
  staff: '隐藏五线谱模式',
};

/** 练习页：隐藏简谱或五线谱，填写后校验。支持从随机练习入口自动应用隐藏模式 */
export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const score = id ? getScoreById(id) : undefined;
  const fromDetail = (location.state as { fromDetail?: boolean })?.fromDetail ?? false;
  const {
    hideMode,
    isRandomMode,
    randomHideMode,
    setHideMode,
    clearRandomMode,
    reset,
  } = usePracticeStore();
  const addRecord = useHistoryStore((s) => s.addRecord);
  const [enteredFromRandom, setEnteredFromRandom] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { answer: '' },
  });

  useEffect(() => {
    if (isRandomMode && randomHideMode) {
      setEnteredFromRandom(true);
      setHideMode(randomHideMode);
      clearRandomMode();
    } else {
      setEnteredFromRandom(false);
      reset();
    }
    resetForm({ answer: '' });
    setFeedback(null);
  }, [id, isRandomMode, randomHideMode, setHideMode, clearRandomMode, reset, resetForm]);

  if (!score) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content className="page-container">
          <Alert type="error" message="未找到该曲目" showIcon />
          <Button type="link" onClick={() => navigate(fromDetail && id ? `/score/${id}` : '/')} style={{ marginTop: 16 }}>
            返回
          </Button>
        </Content>
      </Layout>
    );
  }

  const onSubmit = (values: FormValues) => {
    const isCorrect =
      hideMode === 'jianpu'
        ? checkJianpuAnswer(values.answer, score.jianpuText)
        : checkNoteArrayAnswer(values.answer, score.noteArray);

    addRecord({
      id: crypto.randomUUID(),
      scoreTitle: score.title,
      hideMode,
      correct: isCorrect,
      submittedAt: new Date().toLocaleString(),
    });

    setFeedback(
      isCorrect
        ? { type: 'success', message: '回答正确！' }
        : { type: 'error', message: '回答错误，请再试一次。' },
    );
  };

  const handleModeChange = (mode: 'jianpu' | 'staff') => {
    setHideMode(mode);
    resetForm({ answer: '' });
    setFeedback(null);
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
          onClick={() => navigate(fromDetail && id ? `/score/${id}` : '/')}
        >
          返回
        </Button>
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          {score.title}
        </Title>
        <Link to="/statistics">
          <Button type="text" icon={<BarChartOutlined />}>学习统计</Button>
        </Link>
        <Link to="/history">
          <Button type="text" icon={<HistoryOutlined />}>练习历史</Button>
        </Link>
      </Header>
      <Content className="page-container">
        <Card title="练习模式" style={{ marginBottom: 16 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {enteredFromRandom && (
              <Alert
                type="success"
                showIcon
                icon={<InfoCircleOutlined />}
                message={`随机练习：已自动应用「${hideModeLabelMap[hideMode]}」`}
              />
            )}
            <Radio.Group
              value={hideMode}
              onChange={(e) => handleModeChange(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="jianpu">隐藏简谱（看五线谱填简谱）</Radio.Button>
              <Radio.Button value="staff">隐藏五线谱（看简谱填音高）</Radio.Button>
            </Radio.Group>
          </Space>
        </Card>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="简谱">
            {hideMode === 'jianpu' ? (
              <div className="hidden-placeholder">简谱已隐藏，请根据五线谱填写</div>
            ) : (
              <div className="jianpu-display">{score.jianpuText}</div>
            )}
          </Card>

          <Card title="五线谱">
            {hideMode === 'staff' ? (
              <div className="hidden-placeholder">
                五线谱已隐藏，请根据简谱填写音高数组
              </div>
            ) : (
              <div className="staff-preview">
                <img src={score.staffSvgPath} alt={`${score.title} 五线谱`} />
              </div>
            )}
          </Card>

          <Card title="你的答案">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="answer"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder={
                      hideMode === 'jianpu'
                        ? '请输入简谱，如：1 1 5 5 6 6 5'
                        : '请输入音高数组，如：C4 G4 A4（空格或逗号分隔）'
                    }
                  />
                )}
              />
              {errors.answer && (
                <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                  {errors.answer.message}
                </Text>
              )}
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
                style={{ marginTop: 16 }}
              >
                提交校验
              </Button>
            </form>
          </Card>

          {feedback && (
            <Alert
              type={feedback.type}
              message={feedback.message}
              showIcon
            />
          )}
        </Space>
      </Content>
    </Layout>
  );
}
