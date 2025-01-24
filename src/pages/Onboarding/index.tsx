import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface StepType {
  label: string
  description: string
  code?: {
    install: string
    usage: string
  }
}

const steps: StepType[] = [
  {
    label: 'Create a Project',

    // eslint-disable-next-line
    description: `First, create a project to organize your feature flags. Each project represents a different application or service in your ecosystem.`,
  },
  {
    label: 'Generate API Key',
    // eslint-disable-next-line
    description: `Generate and securely store an API key for your project. You'll need this to connect your application.`,
  },
  {
    label: 'Implement the SDK',
    description: 'Install and configure our SDK in your application:',
    code: {
      install: `npm install @flagpole/react  # for React
yarn add @flagpole/react    # or using yarn`,
      usage: `import { useFlagpole } from '@flagpole/react';

const App = () => {
  const { isEnabled } = useFlagpole('my-feature-flag');
  
  return (
    <div>
      {isEnabled ? (
        <NewFeature />
      ) : (
        <OldFeature />
      )}
    </div>
  );
};`,
    },
  },
]

interface CodeBlockProps {
  code: string
  language?: string
}

const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps): JSX.Element => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
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
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = (): void => {
    setActiveStep(0)
  }

  return (
    <Box sx={{ '&&': { mr: 'auto' } }}>
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
                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
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
          <Typography>All steps completed - you&apos;re ready to use feature flags!</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default Onboarding
