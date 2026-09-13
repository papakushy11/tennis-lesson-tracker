'use client'

import { useState, useEffect } from 'react'
import { KidDashboard } from './kid-dashboard'
import { VoiceInput } from './voice-input'
import { HistoryLog } from './history-log'
import type { Kid, Lesson } from '@/lib/tennis'

const STORAGE_KEY = 'tennis-tracker-data'

export function TennisTracker() {
  const [kids, setKids] = useState<Kid[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log'>('dashboard')
  const [mounted, setMounted] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setKids(JSON.parse(saved))
    } else {
      setKids([
        { id: 'kush', name: 'Kush', color: 'bg-blue-100 border-blue-300' },
        { id: 'tina', name: 'Tina', color: 'bg-pink-100 border-pink-300' },
      ])
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever kids data changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kids))
    }
  }, [kids, mounted])

  if (!mounted) {
    return <div className="text-center py-8">Loading...</div>
  }

  const addLesson = (kidId: string, type: 'missed' | 'makeup', lessonType: 'group' | 'private', date: string, notes?: string) => {
    setKids(
      kids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            lessons: [
              ...(kid.lessons || []),
              {
                id: Date.now().toString(),
                type,
                lessonType,
                date,
                notes,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        }
        return kid
      })
    )
  }

  const deleteLesson = (kidId: string, lessonId: string) => {
    setKids(
      kids.map((kid) => {
        if (kid.id === kidId) {
          return {
            ...kid,
            lessons: (kid.lessons || []).filter((l) => l.id !== lessonId),
          }
        }
        return kid
      })
    )
  }

  const getMissedCount = (kid: Kid) => {
    return (kid.lessons || []).filter((l) => l.type === 'missed').length
  }

  const getMakeupCount = (kid: Kid) => {
    return (kid.lessons || []).filter((l) => l.type === 'makeup').length
  }

  const getBalance = (kid: Kid) => {
    return getMissedCount(kid) - getMakeupCount(kid)
  }

  return (
    <div className="space-y-8">
      {/* Voice Input Section */}
      <VoiceInput kids={kids} onAddLesson={addLesson} />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'log'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History Log
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {kids.map((kid) => (
            <KidDashboard
              key={kid.id}
              kid={kid}
              onAddLesson={addLesson}
              onDeleteLesson={deleteLesson}
              missedCount={getMissedCount(kid)}
              makeupCount={getMakeupCount(kid)}
              balance={getBalance(kid)}
            />
          ))}
        </div>
      ) : (
        <HistoryLog kids={kids} onDeleteLesson={deleteLesson} />
      )}

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kids.map((kid) => (
            <div key={kid.id} className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{kid.name}</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Missed: </span>
                  <span className="font-bold text-red-600">{getMissedCount(kid)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Makeup Done: </span>
                  <span className="font-bold text-green-600">{getMakeupCount(kid)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Balance: </span>
                  <span className={`font-bold ${getBalance(kid) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {getBalance(kid) > 0 ? `+${getBalance(kid)}` : getBalance(kid)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
