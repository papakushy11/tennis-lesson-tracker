'use client'

import { useState } from 'react'
import type { Kid } from '@/lib/types/tennis'

interface LessonFormProps {
  kid: Kid
  onAddLesson: (kidId: string, type: 'missed' | 'makeup', lessonType: 'group' | 'private', date: string, notes?: string) => void
  onCancel: () => void
}

export function LessonForm({ kid, onAddLesson, onCancel }: LessonFormProps) {
  const [type, setType] = useState<'missed' | 'makeup'>('missed')
  const [lessonType, setLessonType] = useState<'group' | 'private'>('group')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddLesson(kid.id, type, lessonType, date, notes || undefined)
    setNotes('')
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="missed"
                checked={type === 'missed'}
                onChange={(e) => setType(e.target.value as 'missed' | 'makeup')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Missed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="makeup"
                checked={type === 'makeup'}
                onChange={(e) => setType(e.target.value as 'missed' | 'makeup')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Makeup</span>
            </label>
          </div>
        </div>

        {/* Class Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="group"
                checked={lessonType === 'group'}
                onChange={(e) => setLessonType(e.target.value as 'group' | 'private')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Group</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="private"
                checked={lessonType === 'private'}
                onChange={(e) => setLessonType(e.target.value as 'group' | 'private')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Private</span>
            </label>
          </div>
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., sick, vacation, schedule conflict"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
