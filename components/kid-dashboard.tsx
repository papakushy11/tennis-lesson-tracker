'use client'

import { useState } from 'react'
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { LessonForm } from './lesson-form'
import type { Kid, Lesson } from '@/lib/tennis'

interface KidDashboardProps {
  kid: Kid
  onAddLesson: (kidId: string, type: 'missed' | 'makeup', lessonType: 'group' | 'private', date: string, notes?: string) => void
  onDeleteLesson: (kidId: string, lessonId: string) => void
  missedCount: number
  makeupCount: number
  balance: number
}

export function KidDashboard({
  kid,
  onAddLesson,
  onDeleteLesson,
  missedCount,
  makeupCount,
  balance,
}: KidDashboardProps) {
  const [showForm, setShowForm] = useState(false)
  const lessons = kid.lessons || []
  const recentLessons = lessons.slice(-5).reverse()

  return (
    <div className={`${kid.color} border-2 rounded-lg shadow-md overflow-hidden`}>
      <div className="bg-white p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{kid.name}'s Lessons</h2>
          <p className="text-sm text-gray-600">Track missed and makeup lessons</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{missedCount}</div>
            <div className="text-xs text-gray-600 mt-1">Missed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{makeupCount}</div>
            <div className="text-xs text-gray-600 mt-1">Makeup Done</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {balance > 0 ? `+${balance}` : balance === 0 ? '0' : Math.abs(balance)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Balance</div>
          </div>
        </div>

        {/* Alert if balance positive */}
        {balance > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">{balance} makeup lesson(s) owed</p>
              <p className="text-xs text-red-700 mt-1">
                {kid.name} has missed {balance} more lesson(s) than makeup(s) completed.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <LessonForm kid={kid} onAddLesson={onAddLesson} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Lesson'}
          </button>
        </div>

        {/* Recent Lessons */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </h3>
          {recentLessons.length > 0 ? (
            <div className="space-y-2">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {lesson.type === 'missed' ? (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {lesson.type === 'missed' ? 'Missed' : 'Makeup'}{' '}
                        <span className="text-gray-600 text-xs">({lesson.lessonType})</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(lesson.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      {lesson.notes && <p className="text-xs text-gray-600 mt-1 italic">"{lesson.notes}"</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteLesson(kid.id, lesson.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors text-sm font-medium ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No lessons recorded yet</p>
          )}
        </div>

        {/* View All Link */}
        {lessons.length > 5 && (
          <p className="text-xs text-blue-600 mt-3 text-center">
            +{lessons.length - 5} more in history
          </p>
        )}
      </div>
    </div>
  )
}
