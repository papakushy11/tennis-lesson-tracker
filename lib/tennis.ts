export interface Lesson {
  id: string
  type: 'missed' | 'makeup'
  lessonType: 'group' | 'private'
  date: string
  notes?: string
  timestamp: string
}

export interface Kid {
  id: string
  name: string
  color: string
  lessons?: Lesson[]
}
