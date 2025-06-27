import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { Button, Input, Select, Typography, Row, Col } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Toast from 'components/Toast/Toast';
import { apiPost } from 'ajax/apiServices';
import { UrlAdminEditConversation } from 'ajax/apiUrls';
import AdminLayout from 'layouts/AdminLayout/AdminLayout';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface Question {
  question: string;
  response: string;
  next_step: number;
}

interface QuestionSet {
  step: number;
  questions: Question[];
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiGet } from 'ajax/apiServices';

const EditConversationPage: React.FC = () => {
  const location = useLocation();
  const conversationId = location.state?.conversation_id;

  useEffect(() => {
    if (conversationId !== -1) {
      apiGet(`${UrlAdminEditConversation}/${conversationId}`)
        .then((res: any) => {
          setIntro(res.introduction || '');
          setConversationTree(res.conversation_tree || []);
        })
        .catch(() => {
          Toast('Failed to fetch conversation data.', 'error');
        });
    }
  }, [conversationId]);
  const [intro, setIntro] = useState('');
  const [conversationTree, setConversationTree] = useState<QuestionSet[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addQuestionSet = () => {
    const newStep = conversationTree.length + 1;
    setConversationTree([...conversationTree, {
      step: newStep,
      questions: [{ question: '', response: '', next_step: 0 }]
    }]);
  };

  const deleteQuestionSet = (step: number) => {
    const filtered = conversationTree.filter(set => set.step !== step);
    setConversationTree(filtered);
  };

  const deleteQuestion = (step: number, index: number) => {
    setConversationTree(prev => prev.map(set => {
      if (set.step === step) {
        const updatedQuestions = set.questions.filter((_, i) => i !== index);
        return { ...set, questions: updatedQuestions };
      }
      return set;
    }));
  };

  const addQuestion = (step: number) => {
    setConversationTree(prev => prev.map(set => {
      if (set.step === step) {
        return { ...set, questions: [...set.questions, { question: '', response: '', next_step: 0 }] };
      }
      return set;
    }));
  };

  const updateQuestionField = (step: number, index: number, field: keyof Question, value: string | number) => {
    setConversationTree(prev => prev.map(set => {
      if (set.step === step) {
        const updatedQuestions = [...set.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        return { ...set, questions: updatedQuestions };
      }
      return set;
    }));
  };

  const exportJson = () => {
    const blob = new Blob([
      JSON.stringify({
        introduction: intro,
        conversation_tree: conversationTree
      }, null, 2)
    ], { type: 'application/json' });
    saveAs(blob, 'conversation_tree.json');
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);
        if (result.conversation_tree) {
          setConversationTree(result.conversation_tree);
        }
        if (result.introduction) {
          setIntro(result.introduction);
        }
      } catch (err) {
        console.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const saveToServer = async () => {
    const payload = new FormData();
    payload.append("conversation_tree", JSON.stringify(conversationTree));
    payload.append("introduction", intro);
    if (conversationId) {
      payload.append("id", conversationId);
    }
    try {
      apiPost(UrlAdminEditConversation, payload)
        .then((res: any) => {
          // console.log("res", res);
          if (res.status === "success") {
            Toast(res.message, "success");
          } else {
            Toast(res.message, "error");
          }
        })
        .catch(() => {
          Toast("Failed to save conversation tree.", "error");
        })
        .finally(() => {
          window.location.href = "/admin/conversation";
        });
    } catch (error) {
      Toast("Failed to save conversation tree.", "error");
    }
  };

  const cancelEditing = () => {
    setConversationTree([]);
    setIntro('');
    window.location.href = "/admin/conversation";
  };

  const availableSteps = conversationTree.map(set => set.step);

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <Row justify="end" align="middle" className="mb-4">
          
          <Col>
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={importJson}
            />
            <Button onClick={() => fileInputRef.current?.click()} icon={<UploadOutlined />} style={{ marginRight: 8 }}>Import</Button>
            <Button type="primary" onClick={exportJson}>Export</Button>
          </Col>
        </Row>

        <label>Introduction</label>
        <TextArea
          rows={4}
          placeholder="Enter introduction..."
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Button type="dashed" onClick={addQuestionSet} style={{ marginBottom: 20 }}>Add a step</Button>

        {conversationTree.map(set => (
          <div key={set.step} style={{ border: '1px solid #ddd', borderRadius: 4, padding: 20, marginBottom: 20, background: '#fafafa' }}>
            <Row justify="space-between" align="middle" className="mb-4">
              <Col><Title level={4}>Step {set.step}</Title></Col>
              <Col><Button danger icon={<DeleteOutlined />} onClick={() => deleteQuestionSet(set.step)} /></Col>
            </Row>

            {set.questions.map((q, idx) => (
              <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 15, marginBottom: 15, position: 'relative', background: '#fff' }}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ position: 'absolute', top: 5, right: 5 }}
                  onClick={() => deleteQuestion(set.step, idx)}
                />
                <label>Question</label>
                <Input
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => updateQuestionField(set.step, idx, 'question', e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <label>Response</label>
                <Input
                  placeholder="Enter response"
                  value={q.response}
                  onChange={(e) => updateQuestionField(set.step, idx, 'response', e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <label>Next Step</label>
                <Select
                  value={q.next_step}
                  onChange={(value) => updateQuestionField(set.step, idx, 'next_step', value)}
                  style={{ width: '100%' }}
                >
                  {availableSteps.filter(s => s !== set.step).map(s => (
                  <Option key={s} value={s}>Go to Step {s}</Option>
                ))}
                <Option key="end" value={0}>End</Option>
                </Select>
              </div>
            ))}

            <Button onClick={() => addQuestion(set.step)} type="default">Add a question</Button>
          </div>
        ))}

        <Row justify="end" gutter={16} style={{ marginTop: 30 }}>
          <Col>
            <Button onClick={cancelEditing}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={saveToServer}>Save</Button>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default EditConversationPage;
