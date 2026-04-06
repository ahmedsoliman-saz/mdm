import { useState } from 'react'
import { Typography, Steps, Radio, Descriptions, Tag, Button, Space, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { spareParts } from '../../data/spareParts'

const { Title, Text } = Typography

export default function MergeOperations() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [survivor, setSurvivor] = useState<'A' | 'B'>('A')
  const [splitMode, setSplitMode] = useState(false)

  const record = spareParts.find(sp => sp.id === id)
  const recordB = spareParts.find(sp => sp.id === 'SP-001002')

  if (!record) {
    return <div style={{ padding: 24 }}><Text>Record not found</Text></div>
  }

  const fields = recordB ? [
    { label: 'Part Number', a: record.partNumber, b: recordB.partNumber },
    { label: 'Description', a: record.description, b: recordB.description },
    { label: 'Category', a: record.category, b: recordB.category },
    { label: 'Manufacturer', a: record.manufacturer, b: recordB.manufacturer },
    { label: 'UoM', a: record.unitOfMeasure, b: recordB.unitOfMeasure },
    { label: 'Lead Time', a: `${record.leadTimeDays}d`, b: `${recordB.leadTimeDays}d` },
    { label: 'Unit Cost', a: `$${record.unitCostUsd}`, b: `$${recordB.unitCostUsd}` },
  ] : []

  if (splitMode) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={4}>Split Operation</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Select contributing instances to split into separate golden records.
        </Text>
        <Space direction="vertical" style={{ width: '100%', gap: 24 }}>
          <div>
            <Text strong>Resulting Record A: {record.partNumber}</Text>
            <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
              {fields.map(f => (
                <Descriptions.Item key={f.label} label={f.label}>{f.a}</Descriptions.Item>
              ))}
            </Descriptions>
          </div>
          {recordB && (
            <div>
              <Text strong>Resulting Record B: {recordB.partNumber}</Text>
              <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
                {fields.map(f => (
                  <Descriptions.Item key={f.label} label={f.label}>{f.b}</Descriptions.Item>
                ))}
              </Descriptions>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => { message.success('Split submitted for approval'); navigate(-1) }}>
              Submit for Approval
            </Button>
          </div>
        </Space>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Merge Operation — {record.partNumber}</Title>
        <Button onClick={() => setSplitMode(true)}>Switch to Split</Button>
      </div>

      <Steps
        current={currentStep}
        items={[
          { title: 'Select Survivor' },
          { title: 'Survivorship Preview' },
          { title: 'Submit' },
        ]}
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <div>
          <Text style={{ display: 'block', marginBottom: 16 }}>Select the surviving record for the merge:</Text>
          <Radio.Group value={survivor} onChange={e => setSurvivor(e.target.value)}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="A">
                <Space>
                  <Tag color="blue">A</Tag>
                  <Text strong>{record.partNumber}</Text>
                  <Text type="secondary">{record.description}</Text>
                </Space>
              </Radio>
              {recordB && (
                <Radio value="B">
                  <Space>
                    <Tag color="purple">B</Tag>
                    <Text strong>{recordB.partNumber}</Text>
                    <Text type="secondary">{recordB.description}</Text>
                  </Space>
                </Radio>
              )}
            </Space>
          </Radio.Group>
          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={() => setCurrentStep(1)}>Next</Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <Title level={5}>Projected Merged Golden Record</Title>
          <Descriptions bordered size="small" column={1}>
            {fields.map(f => (
              <Descriptions.Item key={f.label} label={f.label}>
                <Space>
                  <Text>{survivor === 'A' ? f.a : f.b}</Text>
                  <Tag style={{ fontSize: 10 }}>
                    {f.a === f.b ? 'Consistent' : `Record ${survivor} priority`}
                  </Tag>
                </Space>
              </Descriptions.Item>
            ))}
          </Descriptions>
          <div style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button type="primary" onClick={() => setCurrentStep(2)}>Next</Button>
            </Space>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div style={{ textAlign: 'center' }}>
          <Title level={5}>Ready to Submit</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            The merge will create a new golden record with {survivor === 'A' ? record.partNumber : recordB?.partNumber} as the survivor.
          </Text>
          <Space>
            <Button onClick={() => setCurrentStep(1)}>Back</Button>
            <Button type="primary" onClick={() => { message.success('Merge submitted for approval'); navigate(-1) }}>
              Submit for Approval
            </Button>
          </Space>
        </div>
      )}
    </div>
  )
}
