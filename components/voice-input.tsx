'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send } from 'lucide-react'
import type { Kid } from '@/lib/tennis'

interface VoiceInputProps {
  kids: Kid[]
  onAddLesson: (kidId: string, type: 'missed' | 'makeup', lessonType: 'group' | 'private', date: string, notes?: string) => void
}

export function VoiceInput({ kids, onAddLesson }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' }>()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setFeedback({ message: 'Listening...', type: 'info' })
      }

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcript + ' ')
          } else {
            interim += transcript
          }
        }
        if (interim) {
          setFeedback({ message: interim, type: 'info' })
        }
      }

      recognition.onerror = (event: any) => {
        setFeedback({ message: `Error: ${event.error}`, type: 'error' })
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setFeedback({
        message: 'Voice recognition not supported in your browser. Use Chrome, Edge, or Safari.',
        type: 'error',
      })
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const parseVoiceCommand = (text: string): { success: boolean; message?: string; kidId?: string; kidName?: string; type?: 'missed' | 'makeup'; lessonType?: 'group' | 'private'; date?: string; notes?: string } => {
    const lowerText = text.toLowerCase()

    // Find which kid
    let kidId = null
    let kidName = ''
    if (lowerText.includes('kush')) {
      kidId = 'kush'
      kidName = 'Kush'
    } else if (lowerText.includes('tina')) {
      kidId = 'tina'
      kidName = 'Tina'
    }

    if (!kidId) {
      return { success: false, message: 'Say the child name: "Kush" or "Tina"' }
    }

    // Determine type
    const isMissed = lowerText.includes('miss') || lowerText.includes('absent')
    const isMakeup = lowerText.includes('makeup') || lowerText.includes('make up')

    if (!isMissed && !isMakeup) {
      return { success: false, message: 'Say "missed" or "makeup"' }
    }

    // Determine lesson type
    const isPrivate = lowerText.includes('private')
    const isGroup = lowerText.includes('group')
    const lessonType = isPrivate ? 'private' : isGroup ? 'group' : null

    if (!lessonType) {
      return { success: false, message: 'Say "group" or "private" lesson' }
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    return {
      success: true,
      kidId,
      kidName,
      type: isMissed ? 'missed' : 'makeup',
      lessonType,
      date: today,
      notes: text,
    }
  }

  const handleSubmit = () => {
    if (!transcript.trim()) {
      setFeedback({ message: 'Please say something first', type: 'error' })
      return
    }

    const result = parseVoiceCommand(transcript)

    if (!result.success) {
      setFeedback({ message: result.message || 'Invalid command', type: 'error' })
      return
    }

    onAddLesson(
      result.kidId!,
      result.type as 'missed' | 'makeup',
      result.lessonType as 'group' | 'private',
      result.date!,
      result.notes
    )

    setTranscript('')
    setFeedback({
      message: `✓ Logged ${result.type} ${result.lessonType} lesson for ${result.kidName}`,
      type: 'success',
    })

    setTimeout(() => setFeedback(undefined), 3000)
  }

  const handleClear = () => {
    setTranscript('')
    setFeedback(undefined)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Mic className="w-6 h-6 text-blue-600" />
        Voice Input
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Say something like: <em>"Kush missed a private lesson"</em> or <em>"Tina did a makeup group class"</em>
      </p>

      <div className="space-y-4">
        {/* Transcript Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-24">
          {transcript ? (
            <p className="text-gray-900">{transcript}</p>
          ) : (
            <p className="text-gray-400 italic">Your speech will appear here...</p>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : feedback.type === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            Submit
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
