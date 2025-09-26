import LoadingButton from '@mui/lab/LoadingButton'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { toast } from 'react-toastify'
import { useCreateProject, type Project } from '~/lib/api/projects'
import { useCreateApiKey, type ApiKey } from '~/lib/api/api-keys'
import { useEffect, useState } from 'react'
import { Box, Step, StepLabel, StepContent, Button, Paper, Typography, Stepper } from '@mui/material'
import type { FeatureFlag } from '~/lib/api/flags'
import { useCreateFeatureFlag } from '~/lib/api/flags'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from '~/hooks/ui/useWindowSize'

interface CodeBlockProps {
  code: string
  language?: string
}

interface StepType {
  label: string
  description: string
  code?: {
    install: string
    usage: string
  }
  action?: () => Promise<Project | ApiKey | FeatureFlag>
  validation?: boolean
}

type StepKey = 'project' | 'apiKey' | 'flag'
const stepKeys: StepKey[] = ['project', 'apiKey', 'flag']

const generateProjectName = (): string => {
  const randomStr = Math.random().toString(36).substring(2, 6)
  return `demo-project-${randomStr}`
}

const generateFlagName = (): string => {
  const timestamp = Date.now().toString(36)
  return `flag-${timestamp}`
}

const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps): JSX.Element => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  const handleCopy = (): void => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <Button
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
            '&:hover': { color: 'primary.main' },
          }}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </CopyToClipboard>
      <pre style={{ borderRadius: 8, padding: 16, background: '#1a1a1a' }}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </Box>
  )
}

const Onboarding = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0)
  const [createdProject, setCreatedProject] = useState<Project | null>(null)
  const [createdApiKey, setCreatedApiKey] = useState<ApiKey | null>(null)
  const [createdFlag, setCreatedFlag] = useState<FeatureFlag | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const createProject = useCreateProject()
  const createApiKey = useCreateApiKey()
  const createFeatureFlag = useCreateFeatureFlag()

  const [stepsCompleted, setStepsCompleted] = useState({
    project: false,
    apiKey: false,
    flag: false,
  })

  const steps: StepType[] = [
    {
      label: 'Create a Project',
      // eslint-disable-next-line
      description: `First, create a project to organize your feature flags. We'll create a default project for you to get started.`,
      action: async (): Promise<Project> => {
        const project = await createProject.mutateAsync({
          name: generateProjectName(),
          description: 'Created during onboarding',
        })
        setCreatedProject(project)
        setStepsCompleted((prev) => ({ ...prev, project: true }))
        return project
      },
    },
    {
      label: 'Generate API Key',
      // eslint-disable-next-line
      description: "We'll generate an API key for your project that you'll use to connect your application.",
      action: async (): Promise<ApiKey> => {
        if (!createdProject) throw new Error('No project created')
        const apiKey = await createApiKey.mutateAsync({
          name: 'Default API Key',
          projectId: createdProject._id,
        })
        setCreatedApiKey(apiKey)
        setStepsCompleted((prev) => ({ ...prev, apiKey: true }))
        return apiKey
      },
      validation: stepsCompleted.project,
    },
    {
      label: 'Create Your First Feature Flag',
      // eslint-disable-next-line
      description: "Let's create your first feature flag to get you started. We'll create a simple toggle flag.",
      action: async (): Promise<FeatureFlag> => {
        if (!createdProject) throw new Error('No project created')
        const flag = await createFeatureFlag.mutateAsync({
          name: generateFlagName(),
          description: 'My first feature flag created during onboarding',
          environments: ['development'],
          projectId: createdProject._id,
        })
        setCreatedFlag(flag)
        setStepsCompleted((prev) => ({ ...prev, flag: true }))
        return flag
      },
      validation: stepsCompleted.apiKey,
    },
    {
      label: 'Implement the SDK',
      // eslint-disable-next-line
      description: "Now that everything is set up, here's how to implement the SDK in your application",
      code: {
        install: `npm install @flagpole/react  # for React
yarn add @flagpole/react    # or using yarn`,
        usage: `import { FeatureFlagProvider, useFeatureFlag } from "@flagpole/react"';

const App = () => {
 return (
  <FeatureFlagProvider apiKey={"${createdApiKey?.key || 'YOUR_API_KEY'}"}>
    <App />
  </FeatureFlagProvider>
 );
};

const ChildComponent = () => {
  const isEnabled = useFeatureFlag('${createdFlag?.name}');

  return (
    <>
      {isEnabled ? 'Its enabled' : 'Not enabled'}
    </>
  )
}
`,
      },
    },
  ]

  const handleNext = async (): Promise<void> => {
    const currentStep = steps[activeStep]
    const isLastStep = activeStep === steps.length - 1

    if (currentStep.action) {
      try {
        await currentStep.action()
        setActiveStep((prev) => prev + 1)
      } catch {
        toast.error('Failed to complete step')
        return
      }
    } else {
      setActiveStep((prev) => prev + 1)
    }

    // Show confetti only when moving to completion state
    if (isLastStep) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = (): void => {
    setActiveStep(0)
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {showConfetti && (
        <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} gravity={0.3} />
      )}
      <Typography variant="h3" gutterBottom>
        Create your first feature flag!
      </Typography>
      <Stepper activeStep={activeStep} orientation="vertical" connector={<></>}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={index === steps.length - 1 ? <Typography variant="caption">Last step</Typography> : null}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography sx={{ mb: 2 }}>{step.description}</Typography>
              {step.code && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Installation:
                  </Typography>
                  <CodeBlock code={step.code.install} language="bash" />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Usage:
                  </Typography>
                  <CodeBlock code={step.code.usage} />
                </>
              )}
              <Box sx={{ mb: 2 }}>
                <LoadingButton
                  loading={createProject.isPending || createApiKey.isPending}
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={activeStep > 0 && !stepsCompleted[stepKeys[activeStep - 1]]}
                >
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </LoadingButton>
                <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you're ready to use feature flags!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default Onboarding
