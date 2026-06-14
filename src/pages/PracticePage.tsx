import { useEffect, useRef, useState } from 'react';
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
import { ArrowLeftOutlined, BarChartOutlined, BulbOutlined, CheckOutlined, HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getScoreById } from '@/services/scoreService';
import { usePracticeStore } from '@/store/practiceStore';
import { useHistoryStore } from '@/store/historyStore';
import {
  checkJianpuAnswer,
  checkNoteArrayAnswer,
  getJianpuHint,
  getNoteHint,
  type ValidationResult,
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
    setHideMode,
    markHintUsed,
    isHintUsed,
  } = usePracticeStore();
  const addRecord = useHistoryStore((s) => s.addRecord);
  const [enteredFromRandom, setEnteredFromRandom] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    description?: string;
  } | null>(null);
  const [hintContent, setHintContent] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { answer: '' },
  });

  const initializedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!id || initializedRef.current[id]) return;
    initializedRef.current[id] = true;

    const state = usePracticeStore.getState();
    if (state.isRandomMode && state.randomHideMode) {
      setEnteredFromRandom(true);
      state.applyHideMode(state.randomHideMode);
      state.clearRandomMode();
    } else {
      setEnteredFromRandom(false);
      state.resetKeepHints();
    }
    resetForm({ answer: '' });
    setFeedback(null);
    if (score && state.isHintUsed(id)) {
      const currentHideMode = usePracticeStore.getState().hideMode;
      const hint =
        currentHideMode === 'jianpu'
          ? getJianpuHint(score.jianpuText)
          : getNoteHint(score.noteArray);
      setHintContent(hint);
    } else {
      setHintContent(null);
    }
  }, [id, score, resetForm]);

  useEffect(() => {
    if (!id || !score) return;
    const store = usePracticeStore.getState();
    if (store.isHintUsed(id)) {
      const hint =
        hideMode === 'jianpu'
          ? getJianpuHint(score.jianpuText)
          : getNoteHint(score.noteArray);
      setHintContent(hint);
    }
  }, [id, score, hideMode, isHintUsed]);

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
    const result: ValidationResult =
      hideMode === 'jianpu'
        ? checkJianpuAnswer(values.answer, score.jianpuText)
        : checkNoteArrayAnswer(values.answer, score.noteArray);

    addRecord({
      id: crypto.randomUUID(),
      scoreTitle: score.title,
      hideMode,
      correct: result.correct,
      submittedAt: new Date().toLocaleString(),
    });

    if (result.correct) {
      setFeedback({ type: 'success', message: '回答正确！' });
    } else {
      const position = result.mismatchIndex + 1;
      const isJianpuMode = hideMode === 'jianpu';
      const unitLabel = isJianpuMode ? '个音符' : '个音高';
      let description = '';

      if (result.hasContentMismatch) {
        description = `第 ${position}${unitLabel}不正确`;
      } else if (isJianpuMode && result.jianpuSegmentIndex !== -1) {
        description = `简谱第 ${result.jianpuSegmentIndex + 1} 段不匹配`;
      } else if (!result.lengthMatch) {
        description = `共 ${result.expectedCount}${unitLabel}，你输入了 ${result.userCount}${unitLabel}`;
      } else {
        description = `第 ${position}${unitLabel}不正确`;
      }

      setFeedback({
        type: 'error',
        message: '回答错误，请再试一次。',
        description,
      });
    }
  };

  const handleHintClick = () => {
    if (!id || isHintUsed(id)) return;

    const hint =
      hideMode === 'jianpu'
        ? getJianpuHint(score.jianpuText)
        : getNoteHint(score.noteArray);

    setHintContent(hint);
    markHintUsed(id);
  };

  const handleModeChange = (mode: 'jianpu' | 'staff') => {
    setHideMode(mode);
    resetForm({ answer: '' });
    setFeedback(null);
    if (id && isHintUsed(id) && score) {
      const hint =
        mode === 'jianpu'
          ? getJianpuHint(score.jianpuText)
          : getNoteHint(score.noteArray);
      setHintContent(hint);
    }
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
              {hintContent && (
                <Alert
                  type="info"
                  showIcon
                  icon={<BulbOutlined />}
                  message={`提示：${hintContent}`}
                  style={{ marginTop: 16 }}
                />
              )}
              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                >
                  提交校验
                </Button>
                <Button
                  icon={<BulbOutlined />}
                  onClick={handleHintClick}
                  disabled={id ? isHintUsed(id) : false}
                >
                  {id && isHintUsed(id) ? '已使用提示' : '查看提示'}
                </Button>
              </Space>
            </form>
          </Card>

          {feedback && (
            <Alert
              type={feedback.type}
              message={feedback.message}
              description={feedback.description}
              showIcon
            />
          )}
        </Space>
      </Content>
    </Layout>
  );
}
