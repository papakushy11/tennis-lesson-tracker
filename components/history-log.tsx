'use client'

import { AlertCircle, CheckCircle, Calendar } from 'lucide-react'
import type { Kid } from '@/lib/types/tennis'

interface HistoryLogProps {
  kids: Kid[]
  onDeleteLesson: (kidId: string, lessonId: string) => void
}

export function HistoryLog({ kids, onDeleteLesson }: HistoryLogProps) {
  // Combine all lessons from all kids with kid info
  const allLessons = kids.flatMap((kid) =>
    (kid.lessons || []).map((lesson) => ({
      ...lesson,
      kidId: kid.id,
      kidName: kid.name,
    }))
  )

  // Sort by date descending (newest first)
  const sortedLessons = [...allLessons].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedLessons.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons recorded yet</h3>
        <p className="text-gray-600">Use the voice input or add lessons manually to get started.</p>
      </div>
    )
  }

  // Group by date
  const groupedByDate = sortedLessons.reduce(
    (acc, lesson) => {
      const dateStr = new Date(lesson.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(lesson)
      return acc
    },
    {} as Record<string, typeof allLessons>
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([dateStr, lessons]) => (
        <div key={dateStr} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{dateStr}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {lesson.type === 'missed' ? (
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {lesson.kidName}{' '}
                        <span className="font-normal text-gray-600">
                          {lesson.type === 'missed' ? 'missed' : 'completed'} a {lesson.lessonType} lesson
                        </span>
                      </p>
                      {lesson.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="text-gray-500">Notes:</span> {lesson.notes}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(lesson.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteLesson(lesson.kidId, lesson.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors font-medium ml-4 flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
